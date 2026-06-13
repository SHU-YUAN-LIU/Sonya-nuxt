<template>
  <el-dialog v-model="visible" :title="isEdit ? '編輯待辦事項' : '新增待辦事項'" width="400px" @close="handleClose">
    <el-form :model="form" label-width="80px">
      <el-form-item label="待辦名稱">
        <el-input v-model="form.todoName" placeholder="請輸入待辦名稱" />
      </el-form-item>
      <el-form-item label="內容">
        <el-input v-model="form.todoContent" type="textarea" :rows="3" placeholder="請輸入內容" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">{{ isEdit ? '確認編輯' : '確認新增' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // edit 模式時傳入待辦資料
  initialData: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isEdit = computed(() => !!props.initialData)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const form = ref({ todoName: '', todoContent: '' })

// 開啟時若有 initialData，帶入表單
watch(() => props.modelValue, (val) => {
  if (val && props.initialData) {
    form.value = { todoName: props.initialData.todoName, todoContent: props.initialData.todoContent }
  }
})

const handleClose = () => {
  form.value = { todoName: '', todoContent: '' }
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  if (!form.value.todoName || !form.value.todoContent) {
    ElMessage.warning('請填寫完整資料')
    return
  }
  emit('confirm', { ...form.value })
  handleClose()
}
</script>
