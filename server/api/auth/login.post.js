import db from '../../utils/db'

export default defineEventHandler(async (event) => {
  // 1. 讀取前端送來的 body
  const body = await readBody(event)
  const { email, password } = body

  // 2. 驗證必填欄位
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: '請輸入帳號與密碼'
    })
  }

//3.查詢資料庫是否有這筆
const user = db.prepare('SELECT * FROM users WHERE email=? AND password=?').get(email,password)

//4.比對沒有的話，跳錯誤訊息
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '帳號或密碼錯誤'
    })
  }

  // 5. 成功就回傳登入結果（實務上JWT token）
  return {
    status: { statusCode: 0, statusMessage: '登入成功' },
    data: {
      token: `mock-jwt-token-${user.id}`,
      email: user.email,
      name: user.name
    }
  }
})
