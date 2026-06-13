// POST /api/notes — 新增一筆筆記到資料庫
import db from '../../utils/db'

// async：因為 readBody 是非同步，需要 await 等它讀完
export default defineEventHandler(async (event) => {
  // readBody：讀取前端 POST 過來的 body 資料，解構取出 title 和 content
  const { title, content } = await readBody(event)

  // 驗證資料，任一為空就回傳 400 錯誤，不繼續往下執行
  if (!title || !content) {
    throw createError({ statusCode: 400, message: '標題與內容不能為空' })
  }

  // INSERT：新增一筆資料
  // ? 是占位符，防止 SQL Injection（使用者惡意輸入的 SQL 不會被執行）
  // .run() 執行新增，id 和 created_at 由資料庫自動產生
  // .run() 回傳 { lastInsertRowid: 3, changes: 1 }
  //   lastInsertRowid：剛新增那筆資料的 id
  //   changes：這次 SQL 影響了幾筆資料（INSERT 固定是 1）
  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content)

  // 用 lastInsertRowid 查出完整資料（含資料庫自動產生的 id 和 created_at）回傳給前端
  const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid)

  return { status: { statusCode: 0 }, data: newNote }
})
