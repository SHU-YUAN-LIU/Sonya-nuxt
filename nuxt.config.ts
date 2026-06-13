// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 設定相容性日期，鎖定 Nuxt 的行為模式以確保版本升級時的穩定性
  compatibilityDate: '2024-11-01',

  // 啟用 Nuxt 開發工具 (瀏覽器下方的浮動控制面板)
  devtools: { enabled: true },

  // 未來版本相容性設定，提前採用 Nuxt 4 的行為模式 (如新的目錄結構)
  future: {
    compatibilityVersion: 4,
  },

  // 載入 Nuxt 模組
  modules: [
    '@unocss/nuxt',       // 整合 UnoCSS (原子化 CSS 引擎)
    '@element-plus/nuxt', // 整合 Element Plus UI 元件庫
    '@vueuse/nuxt',       // 整合 VueUse (常用的 Composition API 工具集)
    '@pinia/nuxt',        // 整合 Pinia 狀態管理
  ],

  // 定義全域使用的 CSS 檔案
  css: ['@/styles/main.scss'],

  // UnoCSS 模組設定
  unocss: {
    preflight: true, // 啟用樣式預處理 (包含基礎的 CSS 重置)
  },

  // Element Plus 模組設定
  elementPlus: {
    importStyle: 'scss', // 使用 SCSS 格式匯入樣式，方便自定義主題
  },

  // 自動匯入 composables 子資料夾
  // 自動匯入 composables 所有子資料夾
  // ** 萬用字元：掃描 composables/ 下所有層級的子資料夾
  imports: {
    dirs: ['composables/**']
  },

  // 允許 ngrok 網域通過 Vite 的 Host 驗證（Vite 7 預設只允許 localhost，外部服務如綠界透過 ngrok 進來會被擋）
  vite: {
    server: {
      allowedHosts: [new URL(process.env.NGROK_URL || 'http://localhost').hostname]
    }
  },

  // 環境變數（public 表示前後端都能存取）
  runtimeConfig: {
    // 這些是 private 變數（只有後端 api 可以讀取，前端讀不到，非常安全）
    ecpayMerchantId: process.env.ECPAY_MERCHANT_ID || '2000132',
    ecpayHashKey: process.env.ECPAY_HASH_KEY || '5294y06JbISpM5x9',
    ecpayHashIv: process.env.ECPAY_HASH_IV || 'v77hoKGq4kWxNNIS',
    ecpayPaymentUrl: process.env.ECPAY_PAYMENTURL || 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
    ngrokUrl: process.env.NGROK_URL || '',
    public: {
      // 💡 設為空字串，表示在開發階段使用相對路徑，瀏覽器會自動對應當下的 Port (3000 或 3001)
      apiBaseUrl: ''
    }
  }
})
