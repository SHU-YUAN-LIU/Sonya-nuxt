<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    :width="width"
    align-center
    destroy-on-close
    class="terminal-dialog"
  >
    <TerminalCard
      :title="title"
      :body-class="bodyClass"
      :header-class="headerClass"
      :dots-size="dotsSize"
    >
      <template #header-right>
        <div class="flex items-center gap-2">
          <slot name="header-right" />
          <span
            v-if="showClose"
            class="cursor-pointer text-[10px] font-mono text-muted-foreground/60 hover:text-red-500 transition-colors"
            @click="visible = false"
          >
            [CLOSE]
          </span>
        </div>
      </template>

      <!-- 主要內容插槽 -->
      <slot />

      <!-- 底部按鈕插槽 (可選) -->
      <div
        v-if="$slots.footer"
        class="mt-6 flex justify-end gap-3"
      >
        <slot name="footer" />
      </div>
    </TerminalCard>
  </el-dialog>
</template>

<script setup>
const visible = defineModel({ type: Boolean, default: false })

defineProps({
  title: {
    type: String,
    required: true
  },
  bodyClass: {
    type: String,
    default: 'p-6 bg-white dark:bg-[#111]'
  },
  headerClass: {
    type: String,
    default: 'bg-muted'
  },
  dotsSize: {
    type: String,
    default: 'md'
  },
  width: {
    type: String,
    default: '480px'
  },
  showClose: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
/* 
  去掉 scoped，這樣樣式才能套用到被 Teleport 到 body 的 Element Plus 彈窗上 
  這是讓 TerminalCard 完美取代預設對話框外觀的關鍵！
*/
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
