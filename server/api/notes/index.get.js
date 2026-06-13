// GET /api/notes — 從資料庫讀取所有筆記
//每個檔案都要寫 import db，但實際上共用的是同一條資料庫連線
import db from '../../utils/db'

//defineEventHandler是NUXT內建方法
export default defineEventHandler(() => {

  //prepare() → 把 SQL 翻譯好放著，.all() / .get() / .run() → 真正去執行
  const notes = db.prepare('SELECT * FROM notes ORDER BY id DESC').all()
  return { status: { statusCode: 0 }, data: notes }
})
