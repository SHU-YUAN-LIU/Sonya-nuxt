import db from '../../utils/db'

export default defineEventHandler(async (event) => {
    //1.讀取前端POST過來的body
    const { name, email, password } = await readBody(event)

    //2.檢查欄位是否有值
    if (!name || !email || !password) {
        throw createError({ statusCode: 400, message: '姓名、帳號或密碼不能為空' })  //400代表前端傳過來的參數有問題
    }

    //3.先檢查帳號是否註冊過(查db)
    const isExist = db.prepare('SELECT * FROM users WHERE email=?').get(email)

    //db有查到的話，isExist就會是物件(有值)，反之(沒值)則會是undefined
    if (isExist) {
        throw createError({ statusCode: 400, message: '帳號已註冊' })  //400代表前端傳過來的參數有問題
    }
    
    //4.將姓名、帳密存入資料庫
    db.prepare('INSERT INTO users (name, email, password) VALUES(?, ?, ?)').run(name, email, password)
    return { status: { statusCode: 0 }, message: '註冊成功' }
})