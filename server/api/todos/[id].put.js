import db from '../../utils/db'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const { todoName, todoContent } = await readBody(event)

    if (!id) {
        throw createError({ statusCode: 400, message: 'id 不能為空' })
    }
    if (!todoName || !todoContent) {
        throw createError({ statusCode: 400, message: '待辦事項名稱與內容不能為空' })
    }

    db.prepare('UPDATE todos SET todo_name = ?, todo_content = ? WHERE id = ?').run(todoName, todoContent, id)

    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
    const updatedTodo = { id: row.id, todoName: row.todo_name, todoContent: row.todo_content, createdAt: row.created_at }
    return { status: { statusCode: 0 }, data: updatedTodo }
})
