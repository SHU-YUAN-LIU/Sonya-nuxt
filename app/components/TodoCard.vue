<template>
  <TerminalCard
    :title="`todo-item-${id}.json`"
    dots-size="sm"
    class="card-container cursor-pointer"
    body-class="card-body bg-white dark:bg-[#111]"
    @click="emit('card-click', { id, todoName, todoContent })"
  >
    <template #header-right>
      <button 
        class="text-muted-foreground hover:text-red-500 transition-colors p-0.5 rounded cursor-pointer flex items-center justify-center" 
        @click.stop="emit('delete', id)"
      >
        <span class="i-ep-close text-xs block"></span>
      </button>
    </template>

    <div class="card-title font-mono">// {{ todoName }}</div>
    <div class="data-value">{{ todoContent }}</div>
  </TerminalCard>
</template>

<script setup>
defineProps({
  id: { type: Number, default: null },
  todoName: { type: String, default: '' },
  todoContent: { type: String, default: '' }
})

const emit = defineEmits(['delete', 'card-click'])
</script>
