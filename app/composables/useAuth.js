// 統一封裝驗證邏輯的 Composable (使用外觀模式 Facade Pattern)
//
// 💡 為什麼要多包這一層，而不直接在頁面使用 useUserStore()？
// 1. 語意清晰：useAuth() 專注於「身分驗證」(登入/登出)，比直接用 Store 更具描述性。
// 2. 解耦 (Decoupling)：未來若想將登入邏輯改用其他方式（例如 Nuxt useState, Firebase, 或 Auth0），
//    我們只需要修改這個檔案，而不需要去改動所有使用到登入狀態的 Vue 頁面。
// 3. Nuxt 3 會自動掃描 composables/ 目錄，因此在頁面中可以直接使用 useAuth()，不需手動 import。
export const useAuth = () => useUserStore()

