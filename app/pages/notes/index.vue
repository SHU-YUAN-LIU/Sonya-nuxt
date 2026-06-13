<template>
  <div class="notes-container flex flex-col gap-6 font-sans">
    <!-- 新增筆記表單 -->
    <TerminalCard title="write-note.sh" body-class="p-6" header-class="bg-transparent">
      <el-form :model="form" label-width="60px" class="font-mono">
        <el-form-item label="標題">
          <el-input v-model="form.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="內容">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="請輸入內容" />
        </el-form-item>
        <div class="flex justify-end">
          <button
            class="btn-primary px-6 py-2 text-sm flex items-center gap-2"
            :disabled="isSaving"
            @click.prevent="handleAddNote"
          >
            <span v-if="isSaving" class="i-ep-loading animate-spin"></span>
            <span>新增筆記</span>
          </button>
        </div>
      </el-form>
    </TerminalCard>

    <!-- 筆記列表 -->
    <TerminalCard title="notes-list.db" body-class="p-6" header-class="bg-transparent">
      <template #header-right>
        <span>共 {{ notes.length }} 筆</span>
      </template>

      <div v-if="notes.length === 0" class="text-center py-8 font-mono text-xs text-muted-foreground">
        // 還沒有任何筆記。
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="note in notes"
          :key="note.id"
          class="border border-border rounded-lg p-4 flex flex-col justify-between hover:border-brand transition-colors bg-muted/20"
        >
          <div>
            <div class="flex justify-between items-start gap-4 mb-2">
              <div class="font-mono text-sm font-bold text-foreground"># {{ note.title }}</div>
              <button
                class="text-xs text-red-500 hover:text-red-700 transition-colors p-1 rounded font-mono border border-red-500/20 hover:bg-red-500/10 cursor-pointer"
                @click="handleDelete(note.id)"
              >
                刪除
              </button>
            </div>
            <div class="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed mb-4">{{ note.content }}</div>
          </div>
          <div class="font-mono text-[10px] text-muted-foreground/60">// Created: {{ note.created_at }}</div>
        </div>
      </div>
    </TerminalCard>
  </div>
</template>

<script setup>
// Force recompilation comment
const { addNote, deleteNote } = useNotesApi()

// 頁面載入時：GET /api/notes 讀取所有筆記
const { data: res, refresh } = await useFetch('/api/notes')
//notes數據
const notes = computed(() => res.value?.data ?? [])

// 新增筆記表單
const form = ref({ title: '', content: '' })
const isSaving = ref(false)


//刪除
const handleDelete = async (id) => {
  try {
    await deleteNote(id)
    ElMessage.success('刪除成功')
    await refresh()
  } catch (err) {
    ElMessage.error(err.data?.message ?? '刪除失敗')
  }
}

//新增
const handleAddNote = async () => {
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('標題與內容不能為空')
    return
  }

  isSaving.value = true
  try {
    await addNote({ title: form.value.title, content: form.value.content })
    form.value = { title: '', content: '' }
    ElMessage.success('新增成功')
    await refresh()
  } catch (err) {
    ElMessage.error(err.data?.message ?? '新增失敗')
  } finally {
    isSaving.value = false
  }
}
</script>

