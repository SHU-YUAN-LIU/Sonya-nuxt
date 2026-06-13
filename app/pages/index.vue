<script setup>
const { isLoggedIn } = useAuth()
await navigateTo(isLoggedIn.value ? '/petShop' : '/login')
</script>

<template>
  <div>正在跳轉中...</div>
</template>
