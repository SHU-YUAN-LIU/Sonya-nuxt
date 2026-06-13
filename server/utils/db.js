//套件：讓Node.js可以操作SQLite
import Database from 'better-sqlite3'

//Node.js內建的工具，用來組合路徑字串，例如 join('/Users/sonya', 'db', 'app.db') → /Users/sonya/db/app.db
import { join } from 'path'

// 資料庫檔案存在專案根目錄的 db/ 資料夾
//process.cwd():Node.js 裡的一個方法，“目前執行程式的工作目錄(Current Working Directory)”
const dbPath = join(process.cwd(), 'db', 'app.db')
console.log('[db] 實際寫入路徑：', dbPath)

// 建立連線（檔案不存在會自動新增）
//new Database(路徑)：開啟這個路徑的資料庫，檔案不存在會自動建立
//建立一條連線，之後所有 SQL 都透過這條連線執行
const db = new Database(dbPath)

//建立 users
db.exec(`
  CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`)

// 建立 notes 資料表（如果還沒有的話）
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT    NOT NULL,
    content TEXT    NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`)

// 建立 todos 資料表（如果還沒有的話）
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    todo_name    TEXT    NOT NULL,
    todo_content TEXT    NOT NULL,
    created_at   TEXT    DEFAULT (datetime('now', 'localtime'))
  )
`)

// 建立 orders 訂單資料表
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id                INTEGER PRIMARY KEY AUTOINCREMENT, -- 資料表流水號
    merchant_trade_no TEXT UNIQUE NOT NULL,              -- 你的商店自訂訂單編號 (例如: Synerg1718000...)
    item_name         TEXT,                              -- 商品名稱 (綠界 ReturnURL 不回傳此欄位)
    total_amount      INTEGER NOT NULL,                  -- 付款總金額 (綠界格式為整數)
    payment_date      TEXT,                              -- 綠界端付款完成時間 (格式: YYYY/MM/DD HH:mm:ss)
    trade_no          TEXT,                              -- 綠界端的交易金流流水號 (對帳用)
    payment_type      TEXT,                              -- 交易付款方式 (例如: Credit_CreditCard)
    rtn_code          INTEGER,                           -- 交易狀態碼 (1 代表付款成功)
    status            TEXT DEFAULT 'pending',            -- 訂單狀態：pending（待付款）→ paid（已付款）
    created_at        TEXT DEFAULT (datetime('now', 'localtime')) -- 資料寫入本機資料庫的時間
  )
`)
db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id                INTEGER PRIMARY KEY AUTOINCREMENT, -- 資料表流水號
    merchant_trade_no TEXT NOT NULL,                     -- 關聯 orders 表（同一筆訂單可有多筆）
    pet_name          TEXT,                              -- 寵物名稱 (例如: 小黑)
    pet_type          TEXT,                              -- 寵物種類 (例如: dog / cat)
    pet_avatar        TEXT,                              -- 寵物頭像圖片路徑 (例如: /images/dog-1.png)
    pet_skills        TEXT,                              -- 寵物技能 JSON 字串 (例如: ["Jasmine","Debugging"])
    pet_accessories   TEXT,                              -- 寵物配件 JSON 字串 (例如: ["防禦力晶片"])
    created_at        TEXT DEFAULT (datetime('now', 'localtime')) -- 資料寫入本機資料庫的時間
  )
`)

export default db
