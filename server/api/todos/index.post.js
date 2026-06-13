import db from '../../utils/db'

export default defineEventHandler(async (event) => {
    // 讀取前端 POST 過來的 body，解構取出 todoName 和 todoContent
    const { todoName, todoContent } = await readBody(event)

    // 驗證：兩個欄位都不能為空
    if (!todoName || !todoContent) {
        throw createError({ statusCode: 400, message: '待辦事項名稱與內容不能為空' })
    }

    // 寫入資料庫
    const res = db.prepare('INSERT INTO todos (todo_name, todo_content) VALUES(?, ?)').run(todoName, todoContent)

    // 用剛新增的 id 查回完整資料
    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(res.lastInsertRowid)

    // 回傳前將 snake_case 欄位轉為 camelCase
    const newTodo = { id: row.id, todoName: row.todo_name, todoContent: row.todo_content, createdAt: row.created_at }
    return { status: { statusCode: 0 }, data: newTodo }
})
