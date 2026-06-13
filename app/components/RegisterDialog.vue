<template>
  <el-dialog v-model="visible" :show-close="false" width="480px" align-center destroy-on-close class="terminal-dialog">

    <TerminalCard title="Register" body-class="p-6">
      <template #header-right>
        <span class="cursor-pointer text-[10px] font-mono text-muted-foreground/60 hover:text-red-500 transition-colors"
          @click="visible = false">
          [CLOSE]
        </span>
      </template>

      <el-form :model="registerForm" ref="registerFormRef" :rules="rules" label-position="top" @submit.prevent>

        <h2 class="flex items-center justify-center gap-2 mb-6 font-mono text-lg tracking-tight">
          <span class="text-brand font-bold">></span>
          <span>Create Account <span class="animate-ping font-bold text-brand">_</span></span>
        </h2>

        <el-form-item label="姓名 Name" prop="name">
          <el-input v-model="registerForm.name" placeholder="請輸入姓名" size="large" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="registerForm.email" placeholder="請輸入 Email" size="large" />
        </el-form-item>

        <el-form-item label="密碼 Password" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="請輸入密碼（大小寫字母與數字，至少 6 碼）" size="large"
            show-password />
        </el-form-item>

        <div class="flex justify-end gap-2 mt-6">
          <button
            class="px-4 py-2 border border-border rounded-lg text-xs font-mono text-muted-foreground hover:bg-muted/50 transition-colors"
            type="button" @click="visible = false">
            Cancel
          </button>
          <button class="btn-primary px-6 py-2 text-sm font-mono" type="submit" :disabled="isRegisterLoading"
            @click="handleRegister">
            {{ isRegisterLoading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </el-form>
    </TerminalCard>
  </el-dialog>
</template>

<script setup>
import { rules } from '~/utils/rules'
import { ElMessage } from 'element-plus'

// 使用 Vue 3.4+ defineModel 雙向綁定顯示狀態
const visible = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['success'])

const { register } = useAuthApi()
const isRegisterLoading = ref(false)
const registerFormRef = ref()
const registerForm = ref({
  name: '',
  email: '',
  password: ''
})

// 註冊提交
const handleRegister = async () => {
  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return

  isRegisterLoading.value = true
  try {
    console.log(registerForm.value);

    await register(registerForm.value)
    // await $fetch('/api/auth/register', {
    //   method: 'POST',
    //   body: {
    //     name: registerForm.value.name,
    //     email: registerForm.value.email,
    //     password: registerForm.value.password
    //   }
    // })

    ElMessage.success('註冊成功，請登入！')

    // 觸發成功事件，把註冊的 Email 傳給父元件
    emit('success', registerForm.value.email)
    visible.value = false

    // 清空表單
    registerForm.value = { name: '', email: '', password: '' }
  } catch (err) {
    ElMessage.error(err.data?.message ?? '註冊失敗，請稍後再試')
  } finally {
    isRegisterLoading.value = false
  }
}
</script>

<style>
/* 去掉 scoped，這樣樣式才能套用到被 Teleport 到 body 的彈窗上 */
.el-dialog.terminal-dialog {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.el-dialog.terminal-dialog .el-dialog__header {
  display: none !important;
}

.el-dialog.terminal-dialog .el-dialog__body {
  padding: 0 !important;
}
</style>
