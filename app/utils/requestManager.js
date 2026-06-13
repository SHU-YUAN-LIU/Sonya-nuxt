// 管理進行中的請求，防止重複發送（例如使用者連擊）
export const requestManager = {
  activeRequests: new Map(),

  // 根據 method + url + params 產生唯一識別字串
  createKey(method, url, params) {
    return [method, url, JSON.stringify(params)].join(':')
  },

  isSameRequest(key) {
    return this.activeRequests.has(key)
  },

  add(key) {
    // 2 秒後自動清除，避免網路問題導致請求卡住
    const autoRemoveTimer = setTimeout(() => {
      this.activeRequests.delete(key)
    }, 2000)
    this.activeRequests.set(key, autoRemoveTimer)
  },

  remove(key) {
    if (this.activeRequests.has(key)) {
      clearTimeout(this.activeRequests.get(key))
      this.activeRequests.delete(key)
    }
  }
}
