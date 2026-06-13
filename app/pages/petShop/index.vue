<template>
  <div class="petShop-container flex flex-col gap-4 font-sans">

    <!-- 頂部市集標題 -->
    <div class="flex flex-col gap-1.5 font-mono select-none">
      <span class="text-xs text-muted-foreground">> ./list-market-agents.sh</span>
      <h1 class="text-xl font-bold text-foreground">// AI 生物圖鑑 (AI Pet Universe)</h1>
    </div>

    <!-- 商品卡片格線 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <TerminalCard
        v-for="(pet, idx) in products"
        :key="pet.id"
        :title="`pet-${idx + 1}.json`"
        header-class="bg-muted/50"
        class="shadow-sm"
      >
        <div class="flex flex-col md:flex-row gap-5 font-mono">

          <!-- 商品頭像 (固定尺寸，object-cover) -->
          <div
            class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center select-none overflow-hidden rounded-xl animate-idle"
          >
            <img
              v-if="pet.avatar"
              :src="pet.avatar"
              class="w-full h-full object-contain"
              :alt="pet.name"
            />
            <span
              v-else
              class="text-4xl animate-idle"
            >
              🤖
            </span>
          </div>

          <!-- 商品規格與加購 -->
          <div class="flex-1 flex flex-col justify-between gap-4">
            <div>
              <h3 class="font-bold text-base text-foreground mb-1">// {{ pet.name }}</h3>
              <p class="text-xs text-muted-foreground leading-relaxed mb-3">{{ pet.description }}</p>

              <!-- 配件加購區 -->
              <div class="space-y-2">
                <span class="text-[10px] text-muted-foreground block">// 可用增強模組 (Available Upgrades):</span>
                <div class="flex flex-col gap-1.5">
                  <el-checkbox
                    v-for="(addon, aIdx) in pet.addons"
                    :key="addon.id"
                    v-model="pet.addons[aIdx].selected"
                    size="small"
                    class="addon-checkbox!"
                  >
                    <span class="text-xs font-mono">
                      {{ addon.name }} (
                      <span class="text-brand-light dark:text-brand-dark">
                        +NT$ {{ addon.price }}
                      </span>)
                    </span>
                  </el-checkbox>
                </div>
              </div>
            </div>

            <!-- 金額與購買按鈕 -->
            <div class="flex items-center justify-between pt-3 border-t border-border/40 mt-2">
              <div>
                <span class="text-[10px] text-muted-foreground block">結帳金額</span>
                <span class="text-lg font-bold text-brand-light dark:text-brand-dark">
                  NT$ {{ calculateTotal(pet) }}
                </span>
              </div>
              <el-button
                type="primary"
                size="default"
                class="font-mono"
                @click="handlePurchase(pet)"
              >
                加入購物車
              </el-button>
            </div>

          </div>

        </div>
      </TerminalCard>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockProducts } from '@/data/mockData'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const products = ref(JSON.parse(JSON.stringify(mockProducts)))

// 計算單一商品的總金額（基本價 + 選配價）
const calculateTotal = (pet) => {
  const addonsTotal = pet.addons
    .filter(addon => addon.selected)
    .reduce((sum, addon) => sum + addon.price, 0)
  return pet.basePrice + addonsTotal
}

// 立即購買處理，跳轉至付款收銀台，並將資訊帶過去
const handlePurchase = (pet) => {
  console.log('購買的寵物', pet);
  cartStore.addToCart(pet)
}
</script>

<style scoped>
:deep(.addon-checkbox .el-checkbox__label) {
  padding-left: 6px;
}

/* 寵物漂浮動畫 */
.animate-idle {
  animation: idle-float 3s ease-in-out infinite;
}

@keyframes idle-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}
</style>
