import { requestManager } from '~/utils/requestManager'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // $fetch.create() — 建立一個帶有攔截器的 fetch 實例（等同 axios.create()）
  // 這裡傳入的是「實例設定」，不是每次呼叫的參數：
  //   baseURL     : 所有請求的共用前綴，實際呼叫時的 url 會自動拼上去
  //   onRequest   : 發出請求前觸發（等同 axios request interceptor）
  //   onResponse  : 收到成功回應後觸發（等同 axios response interceptor 第一個函式）
  //   onResponseError : 收到失敗回應後觸發（等同 axios response interceptor 第二個函式）
  //
  // 實際呼叫 $apiFetch 時（見 composables/useApi.js），帶入的是「每次請求的參數」：
  //   $apiFetch(url, { method, params, body, headers })
  //     url     : 路徑，e.g. '/api/todos'
  //     method  : HTTP 動詞，e.g. 'GET' / 'POST'
  //     query   : GET query string，e.g. { page: 1 } → ?page=1（舊版叫 params，已 deprecated）
  //     body    : POST/PUT 的 request body（ofetch 會自動 JSON.stringify）
  //     headers : 額外 headers（通常由 onRequest 攔截器統一帶 token，不需手動傳）
  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,

    // ==========================================
    // 請求攔截器（對應原本 axios.interceptors.request.use）
    // ==========================================
    async onRequest({ options }) {
      // 1. 重複請求防護
      const method = options.method ?? 'GET'
      const url = options.baseURL
      const requestKey = requestManager.createKey(method, url, options.params)

      if (requestManager.isSameRequest(requestKey)) {
        throw new Error('重複請求，已略過')
      }
      requestManager.add(requestKey)
      // 將 key 存到 options 中，供回應攔截器移除
      options._requestKey = requestKey

      // 2. 帶入 Authorization token
      // 💡 注意：useUserStore() 必須在 hook 函式內部呼叫（延遲初始化）。
      // 若放在最頂層呼叫，會導致 Pinia Store 在 pinia-persistedstate 插件註冊完畢前就被建立，
      // 進而導致持久化儲存（Cookie/LocalStorage）讀取失效。
      const userStore = useUserStore()
      const token = userStore.token
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `bearer ${token}`
        }
      }
    },

    // ==========================================
    // 成功回應攔截器（對應 axios.interceptors.response.use 第一個函式）
    // ==========================================
    onResponse({ options, response }) {
      // 移除進行中的請求紀錄
      const requestKey = options._requestKey
      if (requestKey) requestManager.remove(requestKey)

      // 後端自定義狀態碼不為 0 時視為錯誤
      const statusCode = response._data?.status?.statusCode
      if (response.status === 200 && statusCode !== undefined && statusCode !== 0) {
        throw new Error(`API 回應異常，statusCode: ${statusCode}`)
      }
    },

    // ==========================================
    // 失敗回應攔截器（對應 axios.interceptors.response.use 第二個函式）
    // ==========================================
    onResponseError({ options, response }) {
      // 移除進行中的請求紀錄
      const requestKey = options._requestKey
      if (requestKey) requestManager.remove(requestKey)

      // 無網路連線
      if (import.meta.client && !window.navigator.onLine) {
        ElMessage.error('網路連線中斷，請檢查網路')
        return
      }

      const status = response?.status
      const serverMessage = response?._data?.status?.statusMessage

      // 401 — token 過期，導回登入頁
      // 登入 endpoint 本身的 401 代表帳密錯誤，讓頁面的 catch 自行顯示錯誤訊息
      if (status === 401) {
        if (response.url?.includes('/api/auth/login')) return
        ElMessage.error('登入已過期，請重新登入')
        const userStore = useUserStore()
        userStore.logout()
        return
      }

      // 其他 HTTP 錯誤
      ElMessage.error(serverMessage ?? `請求失敗（${status}）`)
    }
  })

  // 將 apiFetch 注入全域，各 composable 可用 useNuxtApp().$apiFetch 呼叫
  return {
    provide: { apiFetch }
  }
})
