<template>
  <div class="clock-wrapper">
    <div class="clock">{{ formattedDateTime }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { formatTimestamp } from '@/utils/common.js'

const time = ref(new Date())

const formattedDateTime = computed(() => {
  return formatTimestamp(time.value.getTime() / 1000)
})

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.clock-wrapper {
  display: flex;
  justify-content: center;
  @media (width<768px) {
    display: none;
  }
}

.clock {
  letter-spacing: 1.5px;
  font-size: 15px;
  color: gray;
  min-width: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  @media (width<1920px) {
    font-size: 14px;
  }
}
</style>
