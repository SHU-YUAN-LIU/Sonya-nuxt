// 檔名 data.get.js → 只接受 GET 請求
// 路徑自動對應 GET /api/meter/data

// 模擬資料庫的電表資料（實務上這裡會查詢資料庫）
const MOCK_METER_DATA = [
  { label: '總有功功率', value: '42.3', unit: 'kW' },
  { label: '總無功功率', value: '8.6', unit: 'kVar' },
  { label: '總視在功率', value: '43.2', unit: 'kVA' },
  { label: '累積用電量', value: '12,847.6', unit: 'kWh' },
  { label: '功率因數', value: '0.98', unit: 'PF' },
  { label: '電表頻率', value: '60.0', unit: 'Hz' },
  { label: 'A 相電壓', value: '218.4', unit: 'V' },
  { label: 'B 相電壓', value: '219.2', unit: 'V' },
  { label: 'C 相電壓', value: '217.8', unit: 'V' },
  { label: 'A 相電流', value: '62.3', unit: 'A' },
  { label: 'B 相電流', value: '64.7', unit: 'A' },
  { label: 'C 相電流', value: '65.1', unit: 'A' },
]

export default defineEventHandler(async (event) => {
  // GET 可以用 getQuery 讀取網址上的參數
  // 例如：/api/meter/data?meterId=123
  const query = getQuery(event)
  const meterId = query.meterId

  console.log(`[GET /api/meter/data] meterId: ${meterId}`)

  // 模擬資料庫查詢延遲
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    status: { statusCode: 0 },
    data: MOCK_METER_DATA
  }
})
