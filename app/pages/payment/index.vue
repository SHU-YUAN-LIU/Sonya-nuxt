<template>
  <div class="p-6 max-w-3xl mx-auto space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold font-mono text-foreground flex items-center gap-2">
        <span class="text-brand-light dark:text-brand-dark font-bold">></span>
        ~/ecpay-checkout-center<span class="animate-pulse text-brand-light dark:text-brand-dark">|</span>
      </h1>
      <p class="text-sm font-mono text-muted-foreground mt-1">/** 綠界測試環境付款串接練習 */</p>
    </div>

    <!-- Main Payment Card -->
    <TerminalCard title="order-session.json" header-class="bg-muted/50" body-class="space-y-6 font-mono">
      <!-- Package Details -->
      <div class="space-y-4">
        <div class="text-xs text-muted-foreground">/** 確認您的付款資訊 */</div>

        <div class="border border-brand-light dark:border-brand-dark bg-brand-light/5 dark:bg-brand-dark/5 rounded-[--radius] p-4">
          <div class="font-bold text-sm text-foreground">Order Item</div>
          <div class="text-xs text-muted-foreground mt-1">{{ checkoutForm.itemName }}</div>
          <div class="text-base font-bold text-brand-light dark:text-brand-dark mt-3">NT$ {{ checkoutForm.totalAmount }}</div>
        </div>
      </div>

      <!-- Checkout Info JSON Preview -->
      <div
        class="border border-border rounded-lg bg-black/5 dark:bg-black/40 p-4 text-xs space-y-2 select-none overflow-x-auto">
        <div class="text-emerald-500">// payload to server</div>
        <pre
          class="text-muted-foreground">{\n  "itemName": "{{ checkoutForm.itemName }}",\n  "totalAmount": {{ checkoutForm.totalAmount }},\n  "choosePayment": "Credit"\n}</pre>
      </div>

      <!-- Checkout Trigger Button -->
      <div class="flex justify-end pt-2">
        <button @click="handlePay" :disabled="loading"
          class="px-6 py-2.5 rounded-lg border border-[#cc7a60] dark:border-[#d99178] text-white bg-[#cc7a60] dark:bg-[#d99178] font-mono cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2">
          <span v-if="loading" class="i-carbon-progress-bar-round animate-spin text-lg"></span>
          <span v-else class="i-carbon-purchase text-lg"></span>
          執行綠界模擬付款 (Redirect)
        </button>
      </div>
    </TerminalCard>

    <!-- Test Credentials Info Card -->
    <TerminalCard title="ecpay-test-credentials.json" header-class="bg-muted/50" body-class="space-y-4 font-mono text-xs">
      <div class="text-xs text-muted-foreground">/** 綠界測試環境信用卡資訊 (可點擊複製) */</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="flex items-center justify-between border border-border rounded-lg p-3 bg-black/5 dark:bg-black/40">
          <div>
            <div class="text-[10px] text-muted-foreground">測試卡號 (Card Number)</div>
            <div class="font-bold text-foreground text-sm tracking-wider">4311-9522-2222-2222</div>
          </div>
          <button @click="copyText('4311952222222222', '卡號已複製')" class="p-1.5 hover:text-brand-light dark:hover:text-brand-dark transition-colors cursor-pointer border border-border rounded bg-muted/20" title="複製卡號">
            <span class="i-carbon-copy text-sm flex"></span>
          </button>
        </div>
        <div class="flex items-center justify-between border border-border rounded-lg p-3 bg-black/5 dark:bg-black/40">
          <div>
            <div class="text-[10px] text-muted-foreground">有效年月 (Expiry)</div>
            <div class="font-bold text-foreground text-sm tracking-wider">輸入大於今日之日期 (如 1230)</div>
          </div>
          <button @click="copyText('1230', '有效年月已複製 (12/30)')" class="p-1.5 hover:text-brand-light dark:hover:text-brand-dark transition-colors cursor-pointer border border-border rounded bg-muted/20" title="複製有效年月">
            <span class="i-carbon-copy text-sm flex"></span>
          </button>
        </div>
        <div class="flex items-center justify-between border border-border rounded-lg p-3 bg-black/5 dark:bg-black/40">
          <div>
            <div class="text-[10px] text-muted-foreground">安全碼 (CVV)</div>
            <div class="font-bold text-foreground text-sm tracking-wider">222</div>
          </div>
          <button @click="copyText('222', '安全碼已複製')" class="p-1.5 hover:text-brand-light dark:hover:text-brand-dark transition-colors cursor-pointer border border-border rounded bg-muted/20" title="複製安全碼">
            <span class="i-carbon-copy text-sm flex"></span>
          </button>
        </div>
      </div>
    </TerminalCard>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const route = useRoute()
const { getPaymentSession } = usePaymentApi()

const loading = ref(false)

const checkoutForm = reactive({
  itemName: route.query.itemName || 'AI 寵物組合包',
  totalAmount: Number(route.query.totalAmount) || 0
})

// 複製文字 Helper
const copyText = (text, message = '已複製') => {
  navigator.clipboard.writeText(text)
  ElMessage.success(message)
}

const ecPayParams = ref(null)
const paymentUrl = ref(null)
//付款
const handlePay = async () => {
  loading.value = true
  try {
    // 【前端步驟一】呼叫後端 API，取得綠界所需參數ff
    const { data } = await getPaymentSession(checkoutForm)
    console.log('綠界所需參數', data);


    // 【前端步驟二】驗證 API 回傳狀態，並解構取出 paymentUrl (綠界網址) 與 params (綠界參數)
    // 提示：判斷回傳的 status.statusCode === 0。成功時取出資料，失敗則跳出 ElMessage 錯誤提示
    if (!data) {
      ElMessage.error('取得金流參數失敗')
      return
    }
    ecPayParams.value = data.params
    paymentUrl.value = data.paymentUrl


    // 【前端步驟三】使用 JavaScript 動態在網頁中建立一個 <form> 表單元素
    // 提示：使用 document.createElement('form')，將 method 設為 'POST'，action 設為 paymentUrl

    //建立form元素
    const form = document.createElement('form')
    form.method = 'POST'//HTML form standard properties: used to specify the form submission method
    form.action = paymentUrl.value//HTML form standard properties: set the submission URL (API endpoint)


    // 【前端步驟四】將綠界參數 params 轉換為多個隱藏的 <input type="hidden"> 欄位
    // 提示：使用 Object.keys(params).forEach 遍歷參數，對每個參數動態建立 input 欄位，設定 type='hidden', name=key, value=params[key]，並 appendChild 到表單內

    //建立input隱藏欄位



    Object.keys(ecPayParams.value).forEach((key) => {
      const input = document.createElement('input')//Within the loop, create a dedicated input for each key
      input.type = 'hidden',//HTML input standard properties: hidden field, will not be displayed on the page
        input.name = key,
        input.value = ecPayParams.value[key]

      // 將這個建立好的 input 塞入 form 中
      form.appendChild(input)

    })

    // 4. 最後，將 form 塞入 body 並送出


    // 【前端步驟五】將form塞入body並送出
    // 提示：使用 document.body.appendChild(form) 接著呼叫 form.submit()，這會讓瀏覽器直接跳轉到綠界付款頁面
    document.body.appendChild(form)
    form.submit()

  } catch (error) {
    ElMessage.error(error.message || '結帳發生錯誤')
  } finally {
    loading.value = false
  }
}
</script>
