<template>
  <div class="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col">
    <!-- 卡片頂部 Bar -->
    <div
      class="flex items-center px-4 py-2 border-b border-border font-mono text-xs text-muted-foreground justify-between select-none"
      :class="headerClass"
    >
      <div class="flex items-center">
        <!-- 終端機按鈕（直接在此實作） -->
        <div class="flex items-center gap-1.5 mr-4">
          <span
            class="rounded-full bg-[#ff5f56] inline-block"
            :class="dotsSizeClass"
          ></span>
          <span
            class="rounded-full bg-[#ffbd2e] inline-block"
            :class="dotsSizeClass"
          ></span>
          <span
            class="rounded-full bg-[#27c93f] inline-block"
            :class="dotsSizeClass"
          ></span>
        </div>
        <!-- 卡片標題 -->
        <span class="font-mono text-xs leading-none">{{ title }}</span>
      </div>
      <!-- 右側插槽（放置統計數量或按鈕） -->
      <slot name="header-right" />
    </div>

    <!-- 卡片主要內容區 -->
    <div
      class="p-6 bg-white dark:bg-[#111] flex-1"
      :class="bodyClass"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  dotsSize: {
    type: String,
    default: 'md'
  },
  bodyClass: {
    type: String,
    default: ''
  },
  headerClass: {
    type: String,
    default: 'bg-muted' // 預設為灰底，可傳入 bg-transparent 或 bg-white 實現白底
  },

})

const dotsSizeClass = computed(() => {
  return props.dotsSize === 'md' ? 'w-2.5 h-2.5' : 'w-2 h-2'
})
</script>
