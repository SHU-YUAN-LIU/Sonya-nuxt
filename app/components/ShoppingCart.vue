<template>
  <ClientOnly>
    <TerminalDialog
      v-model="visible"
      title="購物車"
      header-class="bg-muted/50"
    >
      <div class="text-center py-8 text-muted-foreground font-mono">
        <div
          v-if="cartItems.length === 0"
          class="text-muted-foreground text-center"
        >
          購物車內沒有商品
        </div>
        <div
          v-else
          class="flex flex-col gap-4 text-left"
        >
          <!-- 購物車內的每一個商品 -->
          <div
            v-for="(item, index) in cartItems"
            :key="index"
            class="border border-border/50 rounded-lg p-4 bg-muted/20 relative group"
          >
            <!-- 垃圾桶移除按鈕 -->
            <button
              @click="cartStore.removeFromCart(index)"
              class="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <span class="i-carbon-trash-can text-lg block" />
            </button>

            <!-- 寵物名稱 -->
            <div class="font-bold text-brand mb-1">{{ item.name }}</div>

            <!-- 基礎機型金額 -->
            <div class="text-xs text-muted-foreground flex justify-between mb-2">
              <span>基礎機型</span>
              <span>NT$ {{ item.basePrice }}</span>
            </div>

            <!-- 已勾選的增強模組 -->
            <template v-if="item.addons.some(a => a.selected)">
              <div class="text-[10px] font-mono text-muted-foreground mb-1 border-t border-border/30 pt-2">增強模組：</div>
              <div
                v-for="addon in item.addons.filter(a => a.selected)"
                :key="addon.id"
                class="text-xs text-foreground flex justify-between ml-2 mb-1"
              >
                <span>- {{ addon.name }}</span>
                <span class="text-brand-light">+NT$ {{ addon.price }}</span>
              </div>
            </template>

            <!-- 單隻寵物小計 -->
            <div class="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-sm">
              <span class="font-bold text-foreground">小計</span>
              <span class="font-mono text-brand font-bold">
                NT$ {{item.basePrice + item.addons.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0)}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <template
        #footer
        v-if="cartItems.length > 0"
      >
        <div class="w-full flex flex-col gap-4">
          <!-- 總計金額 -->
          <div class="flex justify-between items-center text-lg font-bold border-t border-border/50 pt-4">
            <span class="text-foreground">總計 Total</span>
            <span class="text-brand font-mono text-xl">NT$ {{ cartStore.totalAmount }}</span>
          </div>
          <!-- 結帳按鈕 -->
          <button
            @click="handleCheckout"
            class="btn-primary w-full py-2.5 flex items-center justify-center gap-2 font-bold"
          >
            <span>前往綠界結帳 Checkout</span>
            <span class="i-carbon-arrow-right text-lg block" />
          </button>
        </div>
      </template>
    </TerminalDialog>
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const visible = defineModel({ type: Boolean, default: false })
const cartStore = useCartStore()

//購物車list
const cartItems = computed(() => {
  return cartStore.AIPetList
})

//結帳(呼叫綠界)
const { getPaymentSession } = usePaymentApi()
const handleCheckout = async () => {
  // 1. 把購物車商品組成綠界規定的 ItemName 格式（多件用 # 分隔）
  const itemName = cartStore.AIPetList
    .map(item => {
      const addonNames = item.addons
        .filter(a => a.selected)
        .map(a => a.name)
      return addonNames.length > 0
        ? `${item.name}(含${addonNames.join('、')})`
        : item.name
    })
    .join('#')

  // 2. 呼叫封裝好的 API，取得綠界所需的 paymentUrl 與 params
  const res = await getPaymentSession({
    itemName,
    totalAmount: cartStore.totalAmount,
    pets: cartStore.AIPetList.map(item => ({
      name: item.name,
      type: item.type,
      avatar: item.avatar,
      skills: item.skills || [],
      accessories: item.addons.filter(a => a.selected).map(a => a.name)
    }))
  })

  // 3. 動態建立 form 並 submit → 跳轉到綠界付款頁
  const { paymentUrl, params } = res.data
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = paymentUrl

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()

  visible.value = false
}
</script>
