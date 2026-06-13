import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        AIPetList: [],

    }),
    actions: {
        //新增到購物車
        addToCart(item) {
            this.AIPetList.push(item)
        },
        //從購物車移除
        removeFromCart(index) {
            this.AIPetList.splice(index, 1)
        },
        //清除所有
        clearCart() {
            this.AIPetList = []
        }
    },
    getters: {
        //計算總金額 (基礎價格 + 勾選的增強模組)
        totalAmount(state) {
            return state.AIPetList.reduce((total, pet) => {
                const addonsPrice = pet.addons
                    .filter(addon => addon.selected)
                    .reduce((sum, addon) => sum + addon.price, 0)
                return total + pet.basePrice + addonsPrice
            }, 0)
        }
    },
    // 啟用資料持久化 (儲存至 localStorage)
    // process.client 是 Nuxt 提供的全域變數：
    // 在伺服器 (Server) 渲染時為 false -> 不啟用 persist，避免出現 window is not defined 的報錯
    // 在瀏覽器 (Client) 執行時為 true -> 啟用 persist，並使用預設的 localStorage 儲存購物車
    persist: process.client
})
