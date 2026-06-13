<template>
  <div class="pet-habitat-container flex flex-col gap-4 font-sans h-[calc(100vh-96px)]">

    <!-- 伺服器主機室環境監控 (即時天氣 Open-Meteo API) -->
    <TerminalCard
      title="server-room-monitor.sh --location taipei"
      headerClass="bg-muted/50"
    >
      <div
        v-if="weather"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono"
      >
        <div class="border border-border/40 p-4 rounded-lg bg-black/5 dark:bg-black/40">
          <span class="block text-xs text-muted-foreground mb-1.5">// 晶片溫度 (CPU Temperature)</span>
          <span class="text-2xl font-bold text-brand">{{ weather.temperature }} {{ weather.unit.temperature }}</span>
        </div>
        <div class="border border-border/40 p-4 rounded-lg bg-black/5 dark:bg-black/40">
          <span class="block text-xs text-muted-foreground mb-1.5">// 機房濕度 (Server Room Humidity)</span>
          <span class="text-2xl font-bold text-brand">{{ weather.humidity }} {{ weather.unit.humidity }}</span>
        </div>
        <div class="border border-border/40 p-4 rounded-lg bg-black/5 dark:bg-black/40">
          <span class="block text-xs text-muted-foreground mb-1.5">// 排風扇速 (Exhaust Fan Speed)</span>
          <span class="text-2xl font-bold text-brand">{{ weather.windSpeed }} {{ weather.unit.windSpeed }}</span>
        </div>
      </div>
      <div
        v-else
        class="weather-loading font-mono text-xs text-muted-foreground"
      >> connecting to mainframes... Loading sensor logs...</div>
    </TerminalCard>

    <!-- 第一排：AI 寵物 -->
    <div class="flex flex-col gap-2">
      <span class="font-mono text-xs text-muted-foreground select-none">> 授權 AI 生物狀態 (Authorized Bio-Agents)</span>
      <!-- 橫向排列，超出寬度出現水平滾軸 -->
      <div class="flex gap-4 overflow-x-auto pb-2">
        <!-- 未購買 -->
        <TerminalCard
          v-if="!hasPet"
          title="no-agent-detected.warning"
          header-class="bg-red-500/10 text-red-500"
          class="border-red-500/30 min-w-[320px]"
        >
          <div class="font-mono text-xs text-muted-foreground space-y-4">
            <div class="text-red-400 font-bold">// WARNING: NO ACTIVE AGENT DETECTED</div>
            <p>目前系統未偵測到任何受授權的 AI 生物實體。</p>
            <p>請前往「數據總覽 (AI 生物市集)」進行挑選，並在完成付款授權後，此控制台將會解鎖。</p>
            <div class="pt-2">
              <el-button type="primary" size="small" @click="navigateTo('/petShop')">前往市集</el-button>
            </div>
          </div>
        </TerminalCard>

        <!-- 每隻寵物各自一張卡片 -->
        <TerminalCard
          v-for="pet in pets"
          :key="pet.id"
          title="cyber-pet-status.json"
          header-class="bg-muted/50"
          class="shadow-sm min-w-[300px] flex-shrink-0"
        >
          <!-- 寵物資訊區 -->
          <div class="flex items-center gap-4 border-b border-border/40 pb-4 mb-4">
            <div
              class="w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl"
              :class="pet.status === 'Working' ? 'animate-work' : 'animate-idle'"
            >
              <img
                v-if="pet.avatar"
                :src="pet.avatar"
                alt="avatar"
                class="w-full h-full object-contain select-none"
              >
              <span v-else class="text-4xl">🤖</span>
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground font-mono">{{ pet.name }}</h3>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded font-mono inline-block mt-1"
                :class="pet.status === 'Idle' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'"
              >
                // STATUS: {{ pet.status }}
              </span>
            </div>
          </div>
          <!-- 技能與配件 -->
          <div class="space-y-4 font-mono text-xs">
            <div>
              <span class="text-muted-foreground block mb-1.5">// 核心特質 (Core Skills):</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in pet.skills"
                  :key="skill"
                  class="bg-muted px-2 py-0.5 rounded text-muted-foreground border border-border/40 text-[10px]"
                >{{ skill }}</span>
              </div>
            </div>
            <div>
              <span class="text-muted-foreground block mb-1.5">// 已掛載模組 (Installed Modules):</span>
              <div class="flex flex-wrap gap-1.5 text-[#f59e0b]">
                <span
                  v-for="acc in pet.accessories"
                  :key="acc"
                  class="bg-[#f59e0b]/5 px-2 py-0.5 rounded border border-[#f59e0b]/20 text-[10px]"
                >⚙️ {{ acc }}</span>
              </div>
            </div>
          </div>
        </TerminalCard>
      </div>
    </div>

    <!-- 第二排：任務紀錄 -->
    <div class="flex flex-col gap-2 flex-1 min-h-0">
      <div class="flex justify-between items-center">
        <span class="font-mono text-xs text-muted-foreground select-none">> 任務紀錄 (active-tasks.log)</span>
        <el-button type="primary" size="small" @click="dialogVisible = true" :disabled="!hasPet">
          ＋ 派遣新任務
        </el-button>
      </div>
      <!-- 橫向排列，超出寬度出現水平滾軸 -->
      <div class="flex gap-4 overflow-x-auto pb-2 h-full">
        <div
          v-if="todos.length === 0"
          class="border border-dashed border-border rounded-xl p-8 text-center font-mono text-xs text-muted-foreground min-w-[280px]"
        >
          // 目前無執行中的派遣任務 (No active tasks found)
        </div>
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="flex-shrink-0 min-w-[260px]"
        >
          <TodoCard
            :id="todo.id"
            :todo-name="todo.todoName"
            :todo-content="todo.todoContent"
            @delete="handleDelete"
            @card-click="handleCardClick"
          />
        </div>
      </div>
    </div>

    <!-- 新增彈窗 -->
    <TodoDialog
      v-model="dialogVisible"
      @confirm="handleAdd"
    />

    <!-- 編輯彈窗 -->
    <TodoDialog
      v-model="editDialogVisible"
      :initial-data="editTarget"
      @confirm="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 引入 API 函式
const { addTodo, editTodo, deleteTodo } = useTodosApi()

// 取得待辦事項列表
const { data: todoRes, refresh } = await useFetch('/api/todos')

//todo資料
const todos = computed(() => todoRes.value?.data ?? [])


//取得已購買寵物
const { data: orderRes } = await useFetch('/api/payment/order')

// 將 DB 的 snake_case 欄位轉換為 camelCase，並 JSON.parse 陣列欄位
const pets = computed(() =>
  (orderRes.value?.data ?? []).map(p => ({
    id: p.id,
    name: p.pet_name,
    type: p.pet_type,
    avatar: p.pet_avatar,
    skills: JSON.parse(p.pet_skills || '[]'),
    accessories: JSON.parse(p.pet_accessories || '[]'),
    status: 'Idle'
  }))
)

const hasPet = computed(() => pets.value.length > 0)

// 呼叫自己的 server API，server 再去打 Open-Meteo
const { data: weatherRes } = await useFetch('/api/weather/current', {
  query: { lat: 25.04, lon: 121.53 }
})
const weather = computed(() => weatherRes.value?.data)


const dialogVisible = ref(false)
const editDialogVisible = ref(false)
const editTarget = ref(null)

// 新增待辦事項（任務）
const handleAdd = async (formData) => {
  if (!formData.todoName || !formData.todoContent) {
    ElMessage.error('任務名稱跟內容不能為空')
    return
  }
  try {
    const toBackend = {
      todoName: formData.todoName,
      todoContent: formData.todoContent
    }
    await addTodo(toBackend)
    await refresh()
  } catch (error) {
    console.error('新增任務失敗', error);
  }
}

// 點擊卡片開啟編輯彈窗
const handleCardClick = (todo) => {
  editTarget.value = todo
  editDialogVisible.value = true
}

// 編輯待辦事項
const handleEdit = async (formData) => {
  try {
    await editTodo(editTarget.value.id, formData)
    await refresh()
  } catch (error) {
    console.error('編輯任務失敗', error)
  }
}

// 刪除待辦事項
const handleDelete = async (id) => {
  try {
    await deleteTodo(id)
    await refresh()
  } catch (error) {
    console.error('刪除任務失敗', error)
  }
}
</script>

<style scoped>
/* 待命狀態：微弱上下漂浮 */
.animate-idle {
  animation: idle-float 3s ease-in-out infinite;
}

/* 工作狀態：純上下跳躍 */
.animate-work {
  animation: work-jump 1s ease-in-out infinite;
}

@keyframes idle-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }
}

@keyframes work-jump {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }
}
</style>
