import db from '../../utils/db'

const toCamel = (row) => ({
    id: row.id,
    todoName: row.todo_name,
    todoContent: row.todo_content,
    createdAt: row.created_at
})

export default defineEventHandler(() => {
    const todos = db.prepare('SELECT * FROM todos ORDER BY id ASC').all()
    return { status: { statusCode: 0 }, data: todos.map(toCamel) }
})
