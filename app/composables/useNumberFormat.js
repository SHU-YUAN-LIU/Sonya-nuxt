export function useNumberFormat() {
  /**
   * 將數值轉為千分位格式
   * @param {number|string} value - 要格式化的數值
   * @param {number} [decimalPlaces=1] - 小數位數，預設為 1
   * @param {boolean} [forceDecimal=true] - 是否強制顯示小數位數（整數也補0），預設為 true
   * @returns {string} 返回格式化後的字串
   *  - 正數範例: '1,234.50'
   *  - 負數範例: '-1,234.50'
   *  - 零範例: '0.00' (forceDecimal=true) 或 '0' (forceDecimal=false)
   *  - 無效值: 返回原始值的字串形式
   * 
   * @example
   * formatThousand(1234.567, 2, true)   // '1,234.56'
   * formatThousand(-0.02169, 2, true)   // '-0.02'
   * formatThousand(1234, 2, false)      // '1,234'
   * formatThousand(0, 2, true)          // '0.00'
   */
  const formatThousand = (value, decimalPlaces = 1, forceDecimal = true) => {
    // 1. 將值轉為數字型別
    const num = Number(value)
  
    // 2. 是否有效數字，若無法轉換則回傳原始字串
    if (isNaN(num)) return String(value)
  
    // 3. 處理數值為 0 的情況
    if (num === 0) {
      // 根據 forceDecimal 和 decimalPlaces 決定輸出
      return forceDecimal && decimalPlaces > 0 
        ? `0.${'0'.repeat(decimalPlaces)}` 
        : '0'
    }
  
    // 4. 處理正數和負數（統一邏輯）
    // 記錄是否為負數
    const isNegative = num < 0
    const absNum = Math.abs(num)
  
    // 計算截取的倍數(10的"decimalPlaces"次方)
    const multiplier = Math.pow(10, decimalPlaces)
  
    // 直接截取到指定小數位數，不進行四捨五入
    const truncated = Math.floor(absNum * multiplier) / multiplier
  
    let result
    if (forceDecimal) {
      // 強制顯示指定小數位數
      result = truncated.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      })
    } else {
      // 整數不顯示小數，非整數顯示實際小數
      result = truncated % 1 === 0
        ? Math.floor(absNum).toLocaleString('en-US')
        : truncated.toLocaleString('en-US')
    }
  
    // 5. 如果是負數，加上負號
    return isNegative ? `-${result}` : result
  }

  /**
   * 根據 unitScale 轉換數值
   * @param {number|string} value - 要轉換的原始數值
   * @param {number} unitScale - 轉換類型 (1: 原值, 2: 除以1000, 3: 除以1000000)
   * @returns {number} 轉換後的數值
   */
  const convertValueByUnitScale = (value, unitScale) => {
    const num = Number(value)
    if (isNaN(num)) return 0

    if (unitScale === 2) {
      return num / 1000
    } else if (unitScale === 3) {
      return num / 1000000
    }
    return num
  }

  return {
    formatThousand,
    convertValueByUnitScale
  }
}