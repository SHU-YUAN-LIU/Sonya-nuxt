import db from '../../utils/db'

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id')

    //先檢查有沒有這筆資料，沒有就回 404
    const todo = db.prepare('SELECT * FROM todos WHERE id=?').get(id)
    if (!todo) {
        throw createError({ statusCode: 404, message: '找不到該待辦事項' })
    }

    db.prepare('DELETE FROM todos WHERE id=?').run(id)

    return { status: { statusCode: 0 } }
})
