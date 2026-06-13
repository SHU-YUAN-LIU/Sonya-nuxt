// middleware/ 資料夾：存放路由守衛，每次切換頁面前會先執行，用來做權限驗證、登入檢查等
// 檔名加上 .global → Nuxt 自動套用到所有頁面，不需要在每個頁面寫 definePageMeta({ middleware: 'auth' })
export default defineNuxtRouteMiddleware((to) => {
  // import.meta.server：SSR 在 server 端執行時跳過，localStorage 只有瀏覽器才有
  if (import.meta.server) return

  // 登入頁不需要驗證，否則會無限跳轉
  if (to.path === '/login') return

  const userStore = useUserStore()

  // 未登入就導回登入頁
  if (!userStore.isLoggedIn) {
    return navigateTo('/login')
  }
})
