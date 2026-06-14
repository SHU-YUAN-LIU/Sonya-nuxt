//接收前端資料並產生綠界所需參數

//Node.js 內建的加密庫
import crypto from "crypto";

//引入資料庫連線（同 return.post.js）
import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  // 💡 從 event 請求中動態取得當前的協議 (http/https) 與主機 (localhost:3001)
  const host = getRequestHost(event); // 例如：localhost:3001
  const protocol = getRequestProtocol(event); //例如:http
  const siteUrl = `${protocol}://${host}`; // 組合出 http://localhost:3001

  const body = await readBody(event);

  // 從前端傳來的資料（包含訂單資訊與寵物資訊）pets 是一個陣列，裡面有多筆寵物資料（name/type/avatar/skills/accessories）
  const { itemName, totalAmount, pets } = body;

  // 【步驟一】宣告綠界測試環境所需的金鑰與 API 網址
  // 提示：宣告三個常數：MerchantID = '2000132'、HashKey = '5294y06JbISpM5x9'、HashIV = 'v77hoKGq4kWxNNIS'
  // 以及模擬收單端點 paymentUrl = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'

  //直接在server設定環境變數
  const config = useRuntimeConfig(); //用環境變數帶入
  const MerchantID = config.ecpayMerchantId;
  const HashKey = config.ecpayHashKey;
  const HashIV = config.ecpayHashIv;
  const paymentUrl = config.ecpayPaymentUrl;

  // 【步驟二】計算這筆訂單的專屬資訊（訂單編號與交易時間）
  // 提示 1 (訂單編號)：產生長度小於 20 碼的唯一值（例如：英文字母 SNY + 當前時間戳記毫秒數）
  // 提示 2 (交易時間)：格式必須為 YYYY/MM/DD HH:mm:ss 的字串，時區必須為台灣 UTC+8
  //訂單編號
  const orderNumber = "Synerg" + Date.now();
  //交易時間
  // 格式必須為 YYYY/MM/DD HH:mm:ss，用 formatToParts 確保輸出穩定不受環境影響
  const formatter = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const transactionData = `${get("year")}/${get("month")}/${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
  // 結果範例：2024/06/03 10:30:00（格式固定，綠界不會報錯）

  // 【步驟三】打包所有綠界“必要欄位“（這會用來傳送給綠界）
  // 提示：宣告一個物件 params，包含 MerchantID, MerchantTradeNo, MerchantTradeDate, PaymentType: 'aio', TotalAmount, TradeDesc, ItemName, ReturnURL, ChoosePayment: 'ALL', EncryptType: '1'
  const toEcPayParams = {
    MerchantID,
    MerchantTradeNo: orderNumber, //訂單編號
    MerchantTradeDate: transactionData, //交易時間
    PaymentType: "aio", //支付方式
    TotalAmount: Math.round(totalAmount), //總金額(綠界規定整數，不能有小數點)
    // Number() → 轉成數字，但小數點還在
    // Number('100.5')   // → 100.5（浮點數）
    // Number('100')     // → 100（整數）
    // Math.round() → 轉成數字，並四捨五入到整數
    // Math.round('100.5')  // → 101（整數）
    // Math.round('100')    // → 100（整數）
    TradeDesc: "綠界測試付款", //交易描述
    ItemName: itemName, //商品名稱
    // 綠界伺服器會主動 POST 付款結果到這個網址（伺服器對伺服器，不經過瀏覽器）
    // 本機開發時需要 ngrok 公開網址（.env 的 NGROK_URL），正式上線後改用 siteUrl
    ReturnURL: `${config.ngrokUrl || siteUrl}/api/payment/return`,
    ChoosePayment: "ALL", //支付方式(全功能支付（不限付款方式）)
    EncryptType: "1", //加密方式
    ClientBackURL: `${siteUrl}/payment/success`, // 設定跳轉回我們前端的成功頁面
  };

  //【步驟四】實作 CheckMacValue 加密產生器
  //toEcPayParams 物件（10個欄位）
  //         ↓
  // ① 排序 Key
  //         ↓
  // ② 串接成特定格式字串（只是暫時用來加密）
  //         ↓
  // ③ encodeURIComponent 編碼
  //         ↓
  // ④ SHA256 加密 → 得到 CheckMacValue（簽章）
  //         ↓
  // 把 CheckMacValue 塞回 toEcPayParams
  //         ↓
  // 整個 toEcPayParams（含簽章）才透過表單 POST 傳給綠界
  const generateCheckMacValue = (params, hashKey, hashIV) => {
    // 1. 將物件的 Key 排序 //這個物件有 10 個 Key，綠界規定在計算 CheckMacValue 之前，必須把這些 Key 按照英文字母 A→Z 排序，才能串成正確的加密字串。
    const sortedParams = Object.keys(params).sort();

    // 2. 串接成 `HashKey=xxx&Key1=Value1&Key2=Value2&...&HashIV=xxx`
    const str =
      `HashKey=${hashKey}&` +
      sortedParams.map((key) => `${key}=${params[key]}`).join("&") +
      `&HashIV=${hashIV}`;

    // 3. 進行 encodeURIComponent 編碼，並使用正則表示式取代為綠界指定字元，最後轉為小寫
    const encodeStr = encodeURIComponent(str)
      .replace(/%20/g, "+")
      .replace(/%21/g, "!")
      .replace(/%28/g, "(")
      .replace(/%29/g, ")")
      .replace(/%2A/g, "*")
      .replace(/%2D/g, "-")
      .replace(/%2E/g, ".")
      .replace(/%5F/g, "_")
      .toLowerCase(); // 轉小寫（SHA256 之前先轉小寫）

    // 4. 使用 crypto 進行 sha256 加密，並輸出成大寫(crypto模組固定寫法，順序要固定，但帶的參數能換)
    const CheckMacValue = crypto
      .createHash("sha256") // ← 固定：建立 SHA256 加密器（也可以換成 'md5', 'sha512' 等）
      .update(encodeStr) // ← 固定：傳入要加密的字串
      .digest("hex") // ← 固定：輸出格式為 16 進位字串（也可以用 'base64'）
      .toUpperCase(); // ← 綠界規定：輸出要大寫

    return CheckMacValue;
  };

  // 【步驟五】計算安全簽章 CheckMacValue 並將其塞回 params 中
  toEcPayParams.CheckMacValue = generateCheckMacValue(
    toEcPayParams,
    HashKey,
    HashIV,
  );

  // 【步驟六】新增一筆pending訂單(orders)、訂單資訊(order_items)
  //orders
  db.prepare(
    "INSERT INTO orders (merchant_trade_no, item_name, total_amount) VALUES (?, ?, ?)",
  ).run(orderNumber, itemName || "", Math.round(totalAmount));

  //order_items
  const insertItems = db.prepare(
    `
    INSERT INTO order_items(merchant_trade_no, pet_name, pet_type, pet_avatar, pet_skills, pet_accessories) VALUES (?, ?, ?, ?, ?, ? )
    `,
  );
  for (const pet of pets) {
    insertItems.run(
      orderNumber,
      pet.name || "",
      pet.type || "",
      pet.avatar || "",
      JSON.stringify(pet.skills || []), //把陣列轉成字串存進資料庫
      JSON.stringify(pet.accessories || []), //把陣列轉成字串存進資料庫
    );
  }

  // 【步驟七】回傳 JSON 給前端，包含綠界網址(paymentUrl)與打包好的參數物件(params)
  return {
    status: { statusCode: 0 },
    data: {
      paymentUrl,
      params: toEcPayParams,
    },
  };
});
