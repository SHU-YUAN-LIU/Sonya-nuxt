<template>
    <!-- 💡 外層加上 Flex 置中容器，並用 calc 扣除 Header 高度 (48px) 與 main 的 padding (48px)，以防長度撐開產生滾動軸 -->
    <div class="h-[calc(100vh-100px)] w-full flex items-center justify-center">
        <TerminalCard
            title="payment-success.json"
            header-class="bg-muted/50"
            body-class="space-y-4 md:space-y-6 font-mono"
            class="w-full max-w-lg shadow-2xl mx-auto"
        >
            <!-- 成功狀態標題 -->
            <div class="space-y-2">
                <div class="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                    <span class="i-carbon-checkmark-filled text-lg"></span>
                    <span>SUCCESSFULLY COMPILED & PAID</span>
                </div>
                <h1 class="text-xl md:text-2xl font-bold text-foreground flex items-center">
                    <span class="text-brand-light dark:text-brand-dark mr-2">></span>
                    付款成功!
                    <span class="animate-pulse text-brand-light dark:text-brand-dark ml-1">|</span>
                </h1>
            </div>

            <!-- JSDoc 格式註解 (DESIGN.md 4.3) -->
            <div class="text-xs text-muted-foreground leading-relaxed select-none overflow-x-auto">
                <pre class="font-mono m-0 p-0">
            /**
            * @typedef {Object} PaymentReceipt
            * @property {string} status - 交易狀態 (SUCCESS)
            * @property {string} message - 綠界模擬付款成功，感謝您的購買
            * @property {number} timestamp - {{ timestamp }}
            */
            </pre>
            </div>

            <!-- 模擬收據資料區 (JSON Preview) -->
            <div
                class="border border-border rounded-lg bg-black/5 dark:bg-black/40 p-4 text-xs space-y-1.5 select-none overflow-x-auto text-muted-foreground">
                <div><span class="text-brand-light dark:text-brand-dark">const</span> receipt = {</div>
                <div class="pl-4">merchant: <span class="text-emerald-500">"ECPAY_STAGE"</span>,</div>
                <div class="pl-4">choosePayment: <span class="text-emerald-500">"Credit"</span>,</div>
                <div class="pl-4">status: <span class="text-[#f59e0b]">200</span>,</div>
                <div class="pl-4">verified: <span class="text-emerald-500">true</span></div>
                <div>}</div>
            </div>

            <!-- 按鈕區 -->
            <div class="flex justify-end pt-4 border-t border-border/40">
                <button
                    @click="handleBack"
                    class="px-5 py-2.5 rounded-lg border border-[#cc7a60] dark:border-[#d99178] text-[#cc7a60] dark:text-[#d99178] bg-transparent font-mono cursor-pointer hover:bg-[#cc7a60]/10 dark:hover:bg-[#d99178]/10 transition-colors flex items-center gap-2 text-sm"
                >
                    <span class="i-carbon-chevron-left text-lg"></span>
                    返回首頁 (Exit)
                </button>
            </div>
        </TerminalCard>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()

// 用 ref 避免 SSR/client 時間戳不一致造成 hydration mismatch
const timestamp = ref('')

onMounted(() => {
    cartStore.clearCart()
    timestamp.value = Date.now()
})

const handleBack = () => {
    navigateTo('/dashboard')
}
</script>