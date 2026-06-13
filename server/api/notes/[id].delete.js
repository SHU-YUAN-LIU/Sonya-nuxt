// DELETE /api/notes/:id — 刪除指定筆記
// 檔名 [id] 對應路由 :id，例如 DELETE /api/notes/3
import db from '../../utils/db'

// 不需要 async：DELETE 不讀 body，SQLite 也是同步的
export default defineEventHandler((event) => {
  // getRouterParam：讀取網址裡的動態參數
  //getRouterParam(event, '參數名稱')
  // 檔名是 [id]，所以這裡寫 'id'
  // 例如 DELETE /api/notes/3 → id = '3'
  const id = getRouterParam(event, 'id')

  // 先查這筆資料存不存在，不存在就回 404
  // 避免刪除一個根本不在資料庫裡的 id
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id)
  if (!note) {
    throw createError({ statusCode: 404, message: '找不到該筆記' })
  }

  // DELETE：刪除 id 符合的那筆資料
  // .run() 回傳 { changes: 1 }（刪了幾筆）
  db.prepare('DELETE FROM notes WHERE id = ?').run(id)

  return { status: { statusCode: 0 } }
})
