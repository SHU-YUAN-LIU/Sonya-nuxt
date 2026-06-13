# Agent Context & Project Guide

本文件旨在為所有引進此專案的 AI 代理工具（如 Gemini, Claude, Copilot 等）提供背景上下文與協作指引，以確保生成的程式碼與回覆風格符合開發者的預期。

---

## 1. 專案背景與學習目的 (Project Background)

- **定位**：這是開發者用來熟悉並實踐 **Nuxt 3/4 (Nuxt 4 目錄結構)**、**Vue 3 Composition API** 以及 **後端 API 整合與串接** 的自主練習專案。
- **目標**：透過實作「數據總覽」、「筆記本」、「儀表板」等功能，熟悉全端（Fullstack Nuxt）開發流程與 API 狀態管理。

---

## 2. 協作與引導風格建議 (Agent Instruction)

當開發者向您提問或要求調整程式碼時，請遵守以下原則：
- **教學導向 (Educational Approach)**：請不要只給出修改後的程式碼。請簡要說明為什麼這麼寫、用到了哪些 Nuxt 特性（例如 `useFetch` 的快取機制、`computed` 的響應式更新、Nuxt 4 的自動匯入規範等），協助開發者在練習中學習。
- **逐步引導**：如果更動範圍較大，請拆解成清晰的步驟引導開發者理解。
- **代碼簡潔性**：注重 Vue 3 Best Practices，優先使用 `<script setup>` 語法糖與 Composables，保持元件的乾淨與 Layout-agnostic。

---

## 3. 技術棧與設計規範 (Tech Stack & Design Spec)

- **前端框架**：Nuxt 4 (開啟 `future: { compatibilityVersion: 4 }`，因此採用 `app/` 目錄結構)
- **樣式引擎**：**UnoCSS** (原子化 CSS) 與 **Sass/SCSS**
- **UI 元件庫**：**Element Plus**
- **設計風格 (SkillsMP Theme)**：
  - 專案採用仿終端機的「極客代碼風格（Developer-Centric）」。
  - 主要品牌色（Primary）為磚土橘褐色（Terracotta 橘，淺色 `#cc7a60` / 深色 `#d99178`）。
  - 背景覆蓋有輕微的 `32px 32px` 網格線 (`linear-gradient`)。
  - 所有標題、程式碼區塊與數據面板，優先採用 `JetBrains Mono` 等寬字型。
  - 樣式配置請參考專案根目錄的 [DESIGN.md](file:///Users/sonyaliu/Desktop/Sonya-nuxt/DESIGN.md)。

---

## 4. 表單驗證規範 (Form Validation Guidelines)

- **統一管理**：所有 Element Plus 表單欄位（如 Email、密碼、姓名等）的驗證規則，必須統一放置於 [rules.js](file:///Users/sonyaliu/Desktop/Sonya-nuxt/app/utils/rules.js) 中維護。
- **簡化元件 JS**：在 Vue 元件中，**避免**重複為每個表單寫 local 的 `const xxxRules = { ... }` 驗證物件。
- **自動對應綁定**：直接在 `<el-form>` 綁定 `:rules="rules"`（匯入全域的 rules 物件），並在 `<el-form-item>` 使用與 `rules` 物件同名的 `prop` 屬性（例如 `prop="email"`、`prop="password"`），讓 Element Plus 自動進行規則抓取與對應。這樣能保持 Template 與 Script 最精簡、最乾淨的程式碼結構。

---

## 5. UI 開發與元件重用規範 (UI Development Rules)

為了防止寫出重複的程式碼與造成樣式排版衝突，AI 代理在開發或修改任何 UI 頁面（`app/pages/**/*.vue`）前，**必須嚴格遵守以下檢查流程**：

1. **先確認全域 Layout**：
   - 務必先閱讀並檢查 [default.vue](file:///Users/sonyaliu/Desktop/Sonya-nuxt/app/layouts/default.vue) 或其他 Layout 的結構。
   - 檢查 Layout 是否已經套用了諸如「背景網格（`grid-bg`）」、「全螢幕 Flex 置中」、「外距/內距（Padding/Margin）」等全域樣式。
   - **嚴禁**在子頁面中重複撰寫與 Layout 衝突的 `min-h-screen`、`w-screen`、網格背景及全頁 Flex 置中。若需要局部置中，高度計算必須扣除 Header（如 `h-[calc(100vh-100px)]`）以防撐開頁面產生滾動軸。

2. **優先重用現有元件（不重寫輪子）**：
   - 在撰寫任何仿終端機樣式、視窗裝飾、標題或佈局前，**必須**先搜索 `app/components/` 下的現有元件（如 `TerminalCard.vue`）。
   - **嚴禁**在子頁面中自行使用原始 HTML/CSS 刻出類似的紅黃綠三色控制鈕等終端機視窗。必須直接使用現有元件，並以 `slot` 或 `props` 進行客製化。

3. **元件樣式獨立性 (Layout-Agnostic)**：
   - 所有自定義元件的寬高與外距，應由外部容器（如父層的 `class`）來控制，元件內部保持無外距（`margin-0`）以求最大的重複使用性。

---

## 6. API 呼叫規範 (API Call Pattern)

**所有對後端的 API 呼叫，必須先封裝在 `app/composables/api/` 目錄下的 Composable 中，再由頁面（`pages/`）或元件（`components/`）引用呼叫。嚴禁在頁面或元件中直接撰寫裸露的 `$fetch` 或 `useFetch`。**

### 目錄結構

```
app/
  composables/
    api/
      payment.js   ← 付款相關 API
      user.js      ← 使用者相關 API
      ...          ← 依功能模組分檔
```

### 封裝規則

每個 composable 以功能模組命名，統一匯出一個函式（`useXxxApi`），內部以物件方式回傳各個 API 方法：

```js
// app/composables/api/payment.js
export const usePaymentApi = () => {
  return {
    getPaymentSession: (data) => $fetch('/api/payment/checkout', { method: 'POST', body: data }),
  }
}
```

### 在頁面/元件中使用

```js
// ✅ 正確：透過 composable 呼叫
const { getPaymentSession } = usePaymentApi()
const res = await getPaymentSession({ itemName, totalAmount })

// ❌ 錯誤：直接在元件內寫裸露的 $fetch
const res = await $fetch('/api/payment/checkout', { method: 'POST', body: { itemName, totalAmount } })
```

### 設計優點

- **單一修改點**：API 路徑、headers、錯誤處理邏輯只需在 composable 中改一次。
- **可讀性**：呼叫端只需關心「要做什麼」，不需關心「怎麼打 API」。
- **可測試性**：composable 可獨立 mock，方便單元測試。
