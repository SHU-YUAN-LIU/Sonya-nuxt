import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // 捷徑 (Shortcuts): 將多個原子化 class 組合在一起，像寫一般 CSS class 一樣使用
  shortcuts: [
    ['btn', 'px-4 py-1.5 rounded-lg border border-[#8b929e] dark:border-[#606068] text-foreground bg-transparent font-mono cursor-pointer hover:bg-muted/50 transition-colors disabled:cursor-default disabled:opacity-50'],
    ['btn-primary', 'px-4 py-1.5 rounded-lg border border-[#cc7a60] dark:border-[#d99178] text-white bg-[#cc7a60] dark:bg-[#d99178] font-mono cursor-pointer hover:opacity-90 transition-opacity disabled:cursor-default disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-brand'],
    // 自定義的 Premium 樣式
    ['premium-gradient', 'bg-gradient-to-br from-[#cc7a60] via-[#c57f66] to-[#0a0a0a]'],
    ['glass-card', 'backdrop-blur-md bg-white/80 dark:bg-[#111]/80 border border-[#8b929e] dark:border-[#606068] rounded-xl p-6 shadow-md'],
    // 終端機卡片
    ['terminal-card', 'border border-[#8b929e] dark:border-[#606068] rounded-xl bg-white dark:bg-[#111] overflow-hidden shadow-sm'],
  ],

  theme: {
    colors: {
      brand: {
        light: '#cc7a60',
        dark: '#d99178',
        DEFAULT: '#cc7a60'
      },
      appBg: {
        light: '#ffffff',
        dark: '#0a0a0a'
      },
      appBorder: {
        light: '#8b929e',
        dark: '#606068'
      },
      // 確保 UnoCSS 能正確解析基於 CSS 變數的語意 Class
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      muted: 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
      border: 'var(--border)'
    }
  },

  // 預設集 (Presets): 擴充 UnoCSS 的功能
  presets: [
    presetUno(),        // 預設的原子化預設集 (包含 Tailwind/Windi CSS 相容規則)
    presetAttributify(), // 啟用屬性化模式 (可以在 HTML 標籤上直接寫屬性，例如 <div border="2">)
    presetIcons({       // 啟用圖示支援
      scale: 1.2,       // 圖示縮放比例
      warn: true,       // 找不到圖示時顯示警告
    }),
    presetTypography(), // 啟用排版預設集 (用於文章等長文字內容的樣式)
    presetWebFonts({    // 啟用網路字體
      fonts: {
        sans: 'Inter:400,500,700',      // 無襯線字體
        mono: 'JetBrains Mono:400,500,600,700', // 等寬字體 (用於程式碼)
        premium: 'Outfit:300,400,600,700', // 自定義的進階設計字體
      },
    }),
  ],

  // 轉換器 (Transformers): 增強語法支援
  transformers: [
    transformerDirectives(),   // 支援 CSS 指令，例如在 <style> 中使用 @apply
    transformerVariantGroup(), // 支援變體群組寫法，例如 hover:(bg-red-500 text-white)
  ],
})
