import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    email: '',
    token: ''
  }),

  actions: {
    login(email, token) {
      this.isLoggedIn = true
      this.email = email
      this.token = token
    },

    logout() {
      this.isLoggedIn = false
      this.email = ''
      this.token = ''
      navigateTo('/login')
    }
  },
  persist: {
    //自訂資料要存放在哪裡。如果不寫，預設會使用瀏覽器的 localStorage
    //把 Pinia 的最新狀態寫進 Cookie
    storage: {
      getItem: (key) => {
        return useCookie(key).value
      },
      setItem: (key, value) => {
        // 設定 cookie，並可加上安全屬性（例如過期時間、HttpOnly 等）
        useCookie(key, { maxAge: 60 * 60 * 24 * 7 }).value = value // 存 7 天
      }
    },
  }
})
