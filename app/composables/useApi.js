export const useApi = () => {
  // useNuxtApp() 可以取得整個 Nuxt 應用程式的實例
  // 裡面存放了所有 plugin 用 provide 注入進來的東西
  //
  // $apiFetch 的來源：plugins/api.js 的最後幾行：
  //   return {
  //     provide: { apiFetch }   ← key 叫 apiFetch
  //   }
  //
  // Nuxt 規則：provide 的 key 取出來時會自動加上 $ 前綴
  // 所以 apiFetch → $apiFetch
  //
  // $apiFetch 是一個已經掛好「請求/回應攔截器」的 fetch 實例(自己封裝的)，
  // 呼叫它就等於呼叫原本 axiosHandle.js 裡的 apiMethods()
  const { $apiFetch } = useNuxtApp()

  const GET = (url, query) => $apiFetch(url, { method: 'GET', query })

  const POST = (url, body) => $apiFetch(url, { method: 'POST', body })

  const PUT = (url, body) => $apiFetch(url, { method: 'PUT', body })

  const DELETE = (url, body) => $apiFetch(url, { method: 'DELETE', body })

  return { GET, POST, PUT, DELETE }
}
