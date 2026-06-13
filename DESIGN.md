# SkillsMP (Agent Skills Marketplace) UI Design System & Specifications

本文件彙整並分析了 [skillsmp.com](https://skillsmp.com/) 的 UI 設計風格、色彩系統、字型配置與核心元件樣式，提供給專案作為設計與開發的參考依據。

---

## 1. 設計風格與定位 (Design Theme)

SkillsMP 採用了 **極客/開發者導向 (Developer-Centric / Geek Aesthetic)** 的現代極簡主義風格。其核心設計語彙結合了以下特點：
- **終端機與代碼美學 (Terminal & Code Aesthetic)**：使用 `>` 提示符號、代碼塊、JSDoc 格式註解、模擬視窗控制按鈕 (`● ● ●`) 等元素。
- **Markdown 語意渲染**：標題保留了 Markdown 語意前綴（如 `> Heading`, `## Heading`, `# Heading`）。
- **網格背景與毛玻璃 (Grid & Glassmorphism)**：使用細微的網格背景與透明磨砂玻璃質感導覽列。
- **磚土/橘褐主色調 (Terracotta / Warm Clay)**：主色調不是常見的亮橘色或純藍色，而是帶有一點泥土感、溫暖的橘褐色，給人專業且具質感的印象。

---

## 2. 顏色系統 (Color Palette)

SkillsMP 支援完整的 **淺色 (Light Mode)** 與 **深色 (Dark Mode)** 模式，透過 CSS 變數定義核心語意色彩：

### 2.1 CSS 變數定義 (CSS Variables)

| 語意變數 | 淺色模式 (Light) | 深色模式 (Dark) | 說明 |
| :--- | :--- | :--- | :--- |
| `--background` | `#ffffff` | `#0a0a0a` | 網頁底色 |
| `--foreground` | `#111827` | `#ededed` | 主要文字顏色 |
| `--primary` | `#cc7a60` (Terracotta) | `#d99178` (Light Terracotta) | 主要品牌/強調色 |
| `--primary-foreground` | `#ffffff` | `#0a0a0a` | 主要按鈕內文字色 |
| `--secondary` | `#f9fafb` | `#1a1a1a` | 次要背景/卡片背景 |
| `--secondary-foreground`| `#111827` | `#ededed` | 次要文字顏色 |
| `--muted` | `#f3f4f6` | `#262626` | 靜態/淡化背景 |
| `--muted-foreground` | `#5b6370` | `#a3a3a3` | 輔助文字/註解文字色 |
| `--accent` | `#f59e0b` (Amber) | `#f59e0b` (Amber) | 強調/輔助色 (如代碼數字) |
| `--accent-foreground` | `#451a03` | `#0a0a0a` | 強調色背景文字 |
| `--border` | `#8b929e` | `#606068` | 邊框與分割線顏色 |
| `--radius` | `.625rem` (10px) | `.625rem` (10px) | 卡片/按鈕圓角半徑 |

---

## 3. 字型系統 (Typography)

網頁使用雙字型系統，將**程式碼/標題**與**閱讀內文**分開：

1. **標題與代碼字型 (Heading & Code Font)**
   - **字型**：`"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
   - **套用位置**：所有標題 (`h1` 到 `h4`)、代碼區塊、提示符號。
   - **特色**：使用等寬字型，呈現極客與專業代碼質感。

2. **內文字型 (Body Font)**
   - **字型**：`system-ui, -apple-system, sans-serif`
   - **套用位置**：常見問答內文、說明描述、按鈕標籤等。

---

## 4. 關鍵設計元素與樣式實作 (Key Design Elements)

### 4.1 背景微網格 (Background Grid Overlay)
SkillsMP 的背景並非純色，而是覆蓋了一層極細的網格紋理：
- **實作方式**：使用固定定位 (`fixed`) 的獨立 `div`，並設為穿透滑鼠事件 (`pointer-events-none`)。
- **UnoCSS / CSS 寫法**：
  ```css
  .grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.015; /* 淺色模式極淡 */
    background-image: 
      linear-gradient(to right, rgb(17, 24, 39) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(17, 24, 39) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  
  /* 深色模式調高一點點不透明度 */
  .dark .grid-bg {
    opacity: 0.03;
  }
  ```

### 4.2 終端機模擬視窗卡片 (Terminal Window Card)
網頁右側的圖表與部分區塊包裝成 IDE/代碼視窗的外觀：
- **頂部控制欄**：包含左側紅、黃、綠的三色小圓點 (`● ● ●`)，以及中間的檔案名稱（例如 `trend-analytics.tsx` 或 `skills.marketplace`）。
- **外框樣式**：超細邊框 (`1px border`)，搭配圓角與淡陰影。
- **UnoCSS / CSS 寫法**：
  ```html
  <div class="border border-border rounded-[--radius] bg-card overflow-hidden">
    <!-- Window Header -->
    <div class="flex items-center px-4 py-2 border-b border-border bg-muted/50 font-mono text-xs text-muted-foreground">
      <div class="flex space-x-1.5 mr-4">
        <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
        <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
        <span class="w-3 h-3 rounded-full bg-[#27c93f]"></span>
      </div>
      <div>trend-analytics.tsx</div>
    </div>
    <!-- Window Content -->
    <div class="p-6">
      <!-- 內容或圖表 -->
    </div>
  </div>
  ```

### 4.3 代碼區塊與文字游標 (Code Blocks & Cursor)
在 Hero Section 的文字中，有打字機般的垂直游標：
- **打字機游標 (`|`)**：在標題末尾加上閃爍或靜態的橘褐色垂直槓，如 `> Agent Skills Marketplace|`。
- **代碼卡片**：
  - 用變數宣告呈現數據：`const skills = 1,526,088 ;`
  - 使用註解語法做說明：
    ```javascript
    /**
     * Search by keyword, filter by occupation, sort by
     * popularity...
     */
    ```

### 4.4 導覽列與按鈕 (Header & Buttons)
- **導覽列**：固定在頂部 (`fixed top-0`)，有半透明背景與背景模糊效果：`bg-background/80 backdrop-blur-sm border-b border-border`。
- **按鈕**：
  - 以輪廓按鈕 (Outline Button) 為主，四角圓角大約 `rounded-lg`。
  - Hover 時有淡色背景填充，或邊框色微調。

---

## 5. 本地專案整合建議 (Integration for this Nuxt project)

若要在本 Nuxt 專案中引入 SkillsMP 的 UI 風格，建議在 `uno.config.ts` 中擴充以下主題設定：

```typescript
// uno.config.ts 整合範例
import { defineConfig } from 'unocss'

export default defineConfig({
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
      }
    },
    fontFamily: {
      mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
      sans: 'system-ui, -apple-system, sans-serif'
    }
  }
})
```
