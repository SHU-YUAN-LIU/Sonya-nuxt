// GET /api/weather/current
// 向 Open-Meteo 公開 API 取得即時天氣，再回傳給前端
// 好處：前端只需呼叫自己的 server，外部 API 網址和邏輯都藏在後端

export default defineEventHandler(async (event) => {
  //getQuery():nuxt內建方法，可抓到前端?lat=&lon= 後面的參數
  // 從 query 讀取經緯度，預設為台北
  const query = getQuery(event)
  const lat = query.lat ?? 25.04
  const lon = query.lon ?? 121.53

  // 在 server 端呼叫外部 API（$fetch 在 server 端也能用）
  const data = await $fetch('https://api.open-meteo.com/v1/forecast', {
    query: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m'
    }
  })

  const current = data.current

  // 整理成前端需要的格式後回傳
  return {
    status: { statusCode: 0 },
    data: {
      temperature: current.temperature_2m,
      windSpeed: current.wind_speed_10m,
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      unit: {
        temperature: data.current_units.temperature_2m,
        windSpeed: data.current_units.wind_speed_10m,
        humidity: data.current_units.relative_humidity_2m
      }
    }
  }
})
