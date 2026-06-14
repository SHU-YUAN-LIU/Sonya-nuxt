# ── Stage 1: Build ──────────────────────────────────────────────────────────
# 使用 Node 22 Alpine（輕量版 Linux）作為 build 環境
FROM node:22-alpine AS builder

# better-sqlite3 是「原生模組」，需要 C++ 編譯工具才能在 Linux 容器內編譯
# python3 / make / g++ 是編譯 .node 檔案所需的最小工具集
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 先只複製 package 檔，讓 Docker 快取 npm install 層
# 只要 package.json 沒變，下次 build 會直接用快取，不重新安裝
COPY package*.json ./
RUN npm ci

# 再複製原始碼，執行 Nuxt build
# nuxt build → 輸出到 .output/（server + client 靜態資源）
COPY . .
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
# 從乾淨的 Alpine 開始，不帶入 build 工具，讓 image 更小
FROM node:22-alpine AS runner

# 生產環境仍需編譯工具，因為 npm ci --omit=dev 會重新編譯 better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 只安裝 dependencies（排除 devDependencies），重新編譯 better-sqlite3 for Linux
COPY package*.json ./
RUN npm ci --omit=dev

# 從 builder 複製 Nuxt build 產物
COPY --from=builder /app/.output ./.output

# 建立 SQLite 資料庫目錄（搭配 docker-compose volume 使用）
RUN mkdir -p /app/db

EXPOSE 3000

ENV NODE_ENV=production
# NITRO_HOST=0.0.0.0 讓容器外部可以連進來（預設只接受 localhost）
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

CMD ["node", ".output/server/index.mjs"]
