<template>
  <div
    class="flex justify-center items-center h-screen bg-background text-foreground relative overflow-hidden font-sans">
    <!-- 背景微網格 -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
      style="background-image: linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px); background-size: 32px 32px, 32px 32px; z-index: 1;" />

    <!-- 終端機登入視窗 -->
    <TerminalCard title="Login" class="w-[420px] shadow-xl relative z-10" body-class="p-6">
      <template #header-right>
        <span class="text-[10px] text-muted-foreground/60">Welcome</span>
      </template>

      <!-- Form Content -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="rules" class="p-6 bg-white dark:bg-[#111]" @submit.prevent>
        <h2 class="flex items-center justify-center gap-2 mb-6 font-mono text-xl tracking-tight">
          <span class="text-brand font-bold">></span>
          <span>Sonya System <span class="animate-ping font-bold text-brand">_</span></span>
        </h2>
        <!-- EMAIL -->
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" :prefix-icon="Avatar" placeholder="請輸入帳號 Email" type="text"
            size="large" />
        </el-form-item>

        <!-- PASSWORD -->
        <el-form-item prop="loginPassword">
          <el-input v-model="loginForm.loginPassword" :prefix-icon="Lock"
            :type="isPasswordVisible ? 'text' : 'password'" placeholder="請輸入密碼" size="large">
            <template #suffix>
              <el-icon @click="isPasswordVisible = !isPasswordVisible" class="cursor-pointer">
                <View v-if="isPasswordVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 錯誤提示 -->
        <p v-if="loginError" class="text-red-500 font-mono text-xs mb-3">> Error: {{ loginError }}</p>

        <div class="flex justify-between items-center mt-6">
          <span 
            class="text-sm font-mono text-brand hover:underline cursor-pointer" 
            @click="isRegisterVisible = true"
          >
            註冊帳號
          </span>
          <!-- <span class="text-[10px] font-mono text-muted-foreground">註冊帳號</span> -->
          <button class="btn-primary px-6 py-2 text-sm" type="submit" :disabled="isLoading" @click="handleLogin">
            {{ isLoading ? '登入中...' : '登入' }}
          </button>
        </div>

        <div class="mt-8 pt-4 border-t border-border/40 font-mono text-[11px] text-muted-foreground/80 space-y-1">
          <p class="text-brand">// 測試帳號與密碼</p>
          <p>Email: admin@ems.com</p>
          <p>Password: Aa123456789@</p>
        </div>
      </el-form>
    </TerminalCard>

    <!-- 註冊彈窗元件 (自動從 components/ 目錄引入) -->
    <RegisterDialog v-model="isRegisterVisible" @success="onRegisterSuccess" />
  </div>
</template>

<script setup>
import { Lock, Avatar, Hide, View } from '@element-plus/icons-vue'
import { rules } from '~/utils/rules'

definePageMeta({ layout: false })//不使用layout中的排版

const { login } = useAuth()
const { login: loginApi } = useAuthApi()
const loginFormRef = ref()
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const loginError = ref('')

const loginForm = ref({
  email: '',
  loginPassword: ''
})

// 註冊彈窗的顯示狀態
const isRegisterVisible = ref(false)

//登入
const handleLogin = async () => {
  loginError.value = ''
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return

  isLoading.value = true
  try {
    const res = await loginApi({
      email: loginForm.value.email,
      password: loginForm.value.loginPassword
    })

    // 登入成功：把 token 存到 store
    login(res.data.email, res.data.token)
    await navigateTo('/dashboard')
  } catch (err) {
    loginError.value = err.data?.message ?? '登入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// 註冊成功後的回呼函數，自動帶入 Email
const onRegisterSuccess = (email) => {
  loginForm.value.email = email
}
</script>



