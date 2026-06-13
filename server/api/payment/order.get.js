import db from '../../utils/db'

export default defineEventHandler(() => {
  //prepare() → 把 SQL 翻譯好放著，.all() / .get() / .run() → 真正去執行
  const orders = db
    .prepare(
      `
    SELECT * 
    FROM orders
    LEFT JOIN order_items ON orders.merchant_trade_no = order_items.merchant_trade_no -- 以訂單編號關聯，一次查出訂單與寵物資訊
    WHERE orders.status = 'paid' -- 只查詢已付款的訂單
    ORDER BY orders.id DESC
    `
    )
    .all()

  return {
    status: { statusCode: 0 },
    data: orders
  }
})
