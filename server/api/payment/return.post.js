import crypto from 'crypto'
import db from '../../utils/db'

/**
 * 【為何需要這個檔案？】
 *
 * 綠界支付完成後，有兩條回傳路徑，目的完全不同：
 *
 * 路徑一：ClientBackURL → /payment/success（使用者的瀏覽器跳轉）
 *   - 把使用者的瀏覽器導回我們的成功頁面
 *   - 這條路徑「不可靠」：使用者付完款可能關掉視窗、網路斷線、按上一頁
 *   - 所以不能靠這條路徑來確認付款或寫入資料庫
 *
 * 路徑二：ReturnURL → /api/payment/return（伺服器對伺服器通知）← 這個檔案負責
 *   - 綠界伺服器「主動 POST」通知我們的伺服器，完全不經過使用者瀏覽器
 *   - 這才是真正可信任的付款結果通知
 *   - 若我們沒有回覆 '1|OK'，綠界會持續重試通知
 *
 * 這個檔案（return.post.js）做三件事：
 *   1. 驗證 CheckMacValue：確認這個 POST 真的來自綠界，不是偽造請求
 *   2. 確認 RtnCode === '1'：確認付款真的成功（不是失敗或取消）
 *   3. 寫入資料庫 + 回覆 '1|OK'：記錄訂單，告知綠界已收到通知
 *
 * 結論：
 *   /payment/success  → 給使用者看的頁面，畫面好看就好
 *   /api/payment/return → 給綠界伺服器報到的端點，這裡才是真正寫進資料庫的地方
 *
 * 實作與 checkout.post.js 相同的 CheckMacValue 驗證邏輯
 * 提示：利用傳入的 params 物件（不含 CheckMacValue）、hashKey 與 hashIV，
 * 照 A-Z 排序 Key、串接、URL 編碼、取代特定字元、轉小寫、SHA256 加密後轉大寫。
 */

//這部分跟 checkout.post.js 的 generateCheckMacValue 是一模一樣的，可以直接複製過來使用
// 整個 toEcPayParams（含簽章）才透過表單 POST 傳給綠界
const generateCheckMacValue = (params, hashKey, hashIV) => {
  // 1. 將物件的 Key 排序 //這個物件有 10 個 Key，綠界規定在計算 CheckMacValue 之前，必須把這些 Key 按照英文字母 A→Z 排序，才能串成正確的加密字串。
  const sortedParams = Object.keys(params).sort()

  // 2. 串接成 `HashKey=xxx&Key1=Value1&Key2=Value2&...&HashIV=xxx`
  const str =
    `HashKey=${hashKey}&` +
    sortedParams.map((key) => `${key}=${params[key]}`).join('&') +
    `&HashIV=${hashIV}`

  // 3. 進行 encodeURIComponent 編碼，並使用正則表示式取代為綠界指定字元，最後轉為小寫
  const encodeStr = encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2A/g, '*')
    .replace(/%2D/g, '-')
    .replace(/%2E/g, '.')
    .replace(/%5F/g, '_')
    .toLowerCase() // 轉小寫（SHA256 之前先轉小寫）

  // 4. 使用 crypto 進行 sha256 加密，並輸出成大寫(crypto模組固定寫法，順序要固定，但帶的參數能換)
  const CheckMacValue = crypto
    .createHash('sha256') // ← 固定：建立 SHA256 加密器（也可以換成 'md5', 'sha512' 等）
    .update(encodeStr) // ← 固定：傳入要加密的字串
    .digest('hex') // ← 固定：輸出格式為 16 進位字串（也可以用 'base64'）
    .toUpperCase() // ← 綠界規定：輸出要大寫

  return CheckMacValue
}

export default defineEventHandler(async (event) => {
  // 你的步驟二：讀取綠界 POST 過來的 body 資料 (提示：使用 readBody)
  const body = await readBody(event)

  // 你的步驟三：取得環境變數中的 ecpayHashKey 和 ecpayHashIv (提示：使用 useRuntimeConfig)
  const config = useRuntimeConfig()
  const HashKey = config.ecpayHashKey
  const HashIV = config.ecpayHashIv

  // 你的步驟四：從 body 中把 CheckMacValue 解構出來，其餘參數留作驗證 (提示：const { CheckMacValue, ...paramsToVerify } = body)
  const { CheckMacValue, ...paramsToVerify } = body

  // 你的步驟五：呼叫 generateCheckMacValue 計算正確的 CheckMacValue，並與綠界帶過來的 CheckMacValue 進行比對
  const calculatedCheckMacValue = generateCheckMacValue(paramsToVerify, HashKey, HashIV)

  // 你的步驟六：檢查比對失敗時，印出錯誤訊息，並回傳失敗狀態碼給綠界 (提示：回傳 '0|CheckMacValueVerifyFail')
  if (!calculatedCheckMacValue || calculatedCheckMacValue !== CheckMacValue) {
    console.error('CheckMacValue 驗證失敗', {
      calculatedCheckMacValue,
      receivedCheckMacValue: CheckMacValue,
      paramsToVerify
    })
    return '0|CheckMacValueVerifyFail'
  }

  // 你的步驟七：若比對成功，且確認 body.RtnCode === '1' (代表付款成功)，更新訂單狀態為 paid
  if (body.RtnCode === '1') {
    db.prepare(
      'UPDATE orders SET trade_no = ?, rtn_code = ?, payment_date = ?, payment_type = ?, status = ? WHERE merchant_trade_no = ?'
    ).run(
      body.TradeNo,
      body.RtnCode,
      body.PaymentDate,
      body.PaymentType || '',
      'paid',
      body.MerchantTradeNo
    )
  }

  // 你的步驟八：不論付款成功或失敗，只要 CheckMacValue 驗證通過，最後都必須回覆 '1|OK' 給綠界
  return '1|OK'
})
