<script setup>
// 取得目前頁面的路由資訊（路徑、params、query 等）
const route = useRoute()

// 從網址取出 [id] 參數，並用 decodeURIComponent 將 %40 還原成 @
const userId = decodeURIComponent(route.params.id)
console.log('使用者 ID:', userId)
// 取 email 第一個字母並轉大寫作為頭像文字，若 userId 為空則顯示 ?
const avatarLetter = userId ? userId[0].toUpperCase() : '?'

</script>

<template>
  <div class="flex flex-col gap-6 font-sans">
    <TerminalCard title="個人資料">

      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-8">

        <!-- 頭像 -->
        <div class="flex flex-col items-center gap-3 shrink-0">
          <div
            class="w-24 h-24 rounded-full bg-[#d99178]/15 border-2 border-[#d99178]/50 flex items-center justify-center text-[#d99178] font-bold text-4xl font-mono select-none shadow-lg"
          >
            {{ avatarLetter }}
          </div>
        </div>

        <!-- 使用者資訊 -->
        <div class="flex-1 flex flex-col gap-4 w-full">

          <div>
            <span class="text-xs font-mono text-muted-foreground">// 基本資訊</span>
          </div>
          <div>
            <span class="block text-xs font-mono mb-1 text-brand">信箱 (Email)</span>
            <span class="text-sm font-mono text-foreground break-all">{{ userId }}</span>
          </div>
          <div>
            <span class="block text-xs font-mono mb-1 text-brand">使用者名稱 (Username)</span>
            <span class="text-sm font-mono ">{{ userId.split('@')[0] }}</span>
          </div>

        </div>
      </div>

    </TerminalCard>
  </div>
</template>
