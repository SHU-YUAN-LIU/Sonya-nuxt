<template>
  <div class="layout-container font-sans min-h-screen bg-background text-foreground relative">
    <!-- 背景微網格 -->
    <div
      class="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
      style="background-image: linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px); background-size: 32px 32px, 32px 32px; z-index: 1;"
    />

    <!-- 側邊欄 -->
    <aside
      class="fixed left-0 top-0 h-screen z-50 transition-all duration-300 flex flex-col"
      :style="{ width: isWideScreen ? '200px' : '65px' }"
    >
      <!-- Logo -->
      <div
        class="logo-area border-b border-[#262626] py-4 px-4 flex items-center justify-center font-mono bg-[#0a0a0a]">
        <NuxtLink
          to="/petShop"
          class="flex items-center gap-1 hover:opacity-100"
        >
          <span class="text-[#d99178] font-bold">></span>
          <span
            v-if="isWideScreen"
            class="logo-text text-white font-bold tracking-tight"
          >/~/ems<span class="animate-pulse text-[#d99178]">|</span></span>
          <span
            v-else
            class="logo-icon text-white font-bold"
          >⚡</span>
        </NuxtLink>
      </div>

      <!-- El Menu -->
      <el-menu
        :default-active="activeMenu"
        :collapse="!isWideScreen"
        :collapse-transition="true"
        router
        class="el-sidebar-menu flex-1 border-none!"
      >
        <el-menu-item index="/dashboard">
          <el-icon><span class="i-carbon-dashboard" /></el-icon>
          <template #title>AI 寵物飼養室</template>
        </el-menu-item>

        <el-menu-item index="/petShop">
          <el-icon><span class="i-carbon-analytics" /></el-icon>
          <template #title>寵物商店</template>
        </el-menu-item>

        <el-menu-item index="/notes">
          <el-icon><span class="i-carbon-notebook" /></el-icon>
          <template #title>筆記本</template>
        </el-menu-item>
        <el-menu-item index="/payment">
          <el-icon><span class="i-carbon-battery-charging" /></el-icon>
          <template #title>付款</template>
        </el-menu-item>
      </el-menu>

    </aside>

    <!-- 主要內容區 -->
    <div
      :style="{ paddingLeft: isWideScreen ? '200px' : '65px' }"
      class="main-wrapper transition-all duration-300 relative z-10 min-h-screen flex flex-col"
    >
      <!-- Header -->
      <header
        class="app-header fixed top-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6"
        :style="{ left: isWideScreen ? '200px' : '65px' }"
      >
        <!-- 折疊側邊欄 -->
        <div class="flex items-center gap-4">
          <button
            @click="isWideScreen = !isWideScreen"
            class="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <span
              :class="isWideScreen ? 'i-carbon-chevron-left' : 'i-carbon-menu'"
              class="text-xl block"
            />
          </button>
          <span class="breadcrumb-text font-mono text-sm text-muted-foreground">
            > {{ breadcrumb }}
          </span>
        </div>
        <!-- 亮色/深色 切換 -->
        <div class="flex items-center gap-4">
          <button
            @click="toggleDark()"
            class="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors flex items-center justify-center"
          >
            <span
              :class="isDark ? 'i-carbon-sun' : 'i-carbon-moon'"
              class="text-lg block"
            />
          </button>
          <!-- 購物車 -->
          <ClientOnly>
            <button
              @click="isCartOpen = !isCartOpen"
              class="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors flex items-center justify-center"
            >
              <span
                :class="isDark ? 'i-carbon-shopping-cart' : 'i-carbon-shopping-cart'"
                class="text-lg block"
              />
            </button>
          </ClientOnly>
          <!-- 頭像下拉選單 -->
          <!-- ClientOnly:某些內容只能在瀏覽器執行，不能在 SSR（Server Side Rendering）階段執行時使用 -->
          <!-- 
            為何需要 ClientOnly？
            因為使用者的登入資訊 (userEmail) 保存在瀏覽器的 localStorage 中。
            SSR (伺服器端渲染) 時，伺服器讀不到 localStorage，畫出來的頭像會是空的 (?)。
            若不加 ClientOnly，當瀏覽器接手後算出正確的頭像 (S) 時，會因為跟伺服器給的 HTML 不一致
            而導致 Vue 拋出 Hydration Mismatch (水合錯誤)。
            包裝在 ClientOnly 中可強制這塊區域只在瀏覽器端渲染，安全讀取 localStorage。
          -->
          <!-- 頭像下拉選單 (el-dropdown) -->
          <ClientOnly>
            <el-dropdown
              trigger="click"
              placement="bottom-end"
              popper-class="user-dropdown-popper"
            >
              <!-- 頭像 -->
              <button
                class="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted transition-colors outline-none">
                <div
                  class="avatar w-8 h-8 rounded-full bg-[#d99178]/20 border border-[#d99178]/40 flex items-center justify-center text-[#d99178] font-bold text-sm font-mono select-none"
                >
                  {{ avatarLetter }}
                </div>
                <span class="i-carbon-chevron-down text-muted-foreground text-base block" />
              </button>

              <!-- 下拉選單內容 -->
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- 使用者 Email 標頭（非可點擊項目） -->
                  <div class="px-3 py-2 border-b border-[#262626]">
                    <p class="font-mono text-xs text-muted-foreground truncate">{{ userEmail }}</p>
                  </div>
                  <el-dropdown-item @click="navigateTo(`/profile/${encodeURIComponent(userEmail)}`)">
                    <span class="i-carbon-user text-base mr-2" />
                    使用者個人資料
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="text-red-400!"
                    @click="logout()"
                  >
                    <span class="i-carbon-logout text-base mr-2" />
                    登出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </ClientOnly>
        </div>
      </header>
      <!-- 頁面內容 -->
      <main class="content flex-1 p-6 mt-12">
        <slot />
      </main>
    </div>

    <!-- 購物車彈窗 -->
    <ShoppingCart v-model="isCartOpen" />
  </div>
</template>

<script setup>
const route = useRoute()
const userStore = useUserStore()
const { email: userEmail } = storeToRefs(userStore)
const { logout } = userStore

const isWideScreen = ref(true)
const isCartOpen = ref(false)

const isDark = useDark() // vueuse
const toggleDark = useToggle(isDark)

const activeMenu = computed(() => {
  const parts = route.path.split('/')
  return `/${parts[1]}`
})

const pageNames = {
  '/dashboard': 'AI 寵物飼養室',
  '/petShop': '寵物商店',
  '/notes': '筆記本',
  '/payment': '付款'
}

const breadcrumb = computed(() => pageNames[activeMenu.value] || activeMenu.value.replace('/', '> '))

// 頭像
const avatarLetter = computed(() => {
  return userEmail.value ? userEmail.value[0].toUpperCase() : '?'
})


onMounted(() => {
  // 當 Layout 在瀏覽器掛載後，檢查是否登入
  if (!userStore.isLoggedIn) {
    navigateTo('/login')
  }
})
</script>

<style scoped>
.app-header {
  height: 48px;
  left: 0;
  transition: padding-left 0.3s ease-in-out;
}

/* Element Plus Menu 深色主題覆寫 */
:deep(.el-sidebar-menu) {
  background-color: #0a0a0a;
  border-right: 1px solid #606068;
  height: 100%;
  font-family: 'JetBrains Mono', monospace;
}

:deep(.el-sidebar-menu .el-menu-item) {
  color: #9ca3af;
  height: 44px;
  line-height: 44px;
  font-size: 0.875rem;
}

:deep(.el-sidebar-menu .el-menu-item:hover) {
  background-color: rgba(26, 26, 26, 0.5);
  color: #ffffff;
}

:deep(.el-sidebar-menu .el-menu-item.is-active) {
  background-color: #1a1a1a;
  color: #d99178;
}

:deep(.el-sidebar-menu.el-menu--collapse) {
  width: 65px;
}

:deep(.el-sidebar-menu:not(.el-menu--collapse)) {
  width: 200px;
}

/* el-dropdown 彈出選單深色樣式覆寫 */
:global(.user-dropdown-popper .el-dropdown-menu) {
  background-color: #0a0a0a !important;
  border: 1px solid #606068 !important;
  padding: 0 !important;
}

:global(.user-dropdown-popper .el-dropdown-menu__item) {
  color: #d1d5db;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
}

:global(.user-dropdown-popper .el-dropdown-menu__item:not(.is-disabled):hover),
:global(.user-dropdown-popper .el-dropdown-menu__item:not(.is-disabled):focus),
:global(.user-dropdown-popper .el-dropdown-menu__item:not(.is-disabled):active) {
  background-color: #1a1a1a;
  color: #ffffff;
  outline: none;
}

:global(.user-dropdown-popper .el-popper__arrow::before) {
  background-color: #0a0a0a !important;
  border-color: #606068 !important;
}
</style>
