// 商品列表資料 (包含加購配件的 selected 狀態)
export const mockProducts = [
  {
    id: 1,
    name: '快樂小狗 (Happy Dog)',
    type: 'dog',
    skills: ['Jasmine Unit Testing', 'API Error Debugging'],
    description:
      '具備自動單元測試與 API 除錯能力。個性活潑，會在發現 Bug 時發出汪汪警報，是工程師深夜加班時的心靈與程式雙重伴侶。',
    avatar: '/images/dog-1.png',
    basePrice: 666,
    addons: [
      { id: 'shield', name: '防禦力安全晶片', price: 50, selected: false },
      { id: 'rgb_tail', name: 'RGB 炫光發光尾巴', price: 10, selected: false }
    ]
  },
  {
    id: 2,
    name: '快樂加菲貓 (Happy Cat)',
    type: 'cat',
    skills: ['Auto API Calling', 'Background Processing'],
    description:
      '內建自動化調用模組，能在背景幫你寫 API。平日待命（Idle）時會趴在鍵盤旁呼吸，當你需要時會自動用極高的運算速度完成需求。',
    avatar: '/images/cat-1.png', // 預設顯示機器人
    basePrice: 5978,
    addons: [
      { id: 'cpu_core', name: '極速處理核心晶片', price: 300, selected: false },
      { id: 'canned_food', name: '高階運算維持包 (罐罐)', price: 1000, selected: false }
    ]
  },
  {
    id: 3,
    name: '工程雞 (Dev Chicken)',
    type: 'chicken',
    skills: ['CI/CD Pipeline', 'Automated Build'],
    description:
      '內建持續整合基因，每天準時在 08:00 啄醒整個 CI/CD Pipeline。以驚人的專注力逐行啄完程式碼，每產出一顆「金雞蛋」就代表一次成功的 Build，是團隊最可靠的早班工程師。',
    avatar: '/images/chicken-1.png',
    basePrice: 1024,
    addons: [
      { id: 'golden_egg', name: '金雞蛋產生器', price: 200, selected: false },
      { id: 'alarm', name: '凌晨報警模組(早安morning call)', price: 80, selected: false }
    ]
  },
  {
    id: 4,
    name: '工程雞 (Dev Chicken)',
    type: 'chicken',
    skills: ['CI/CD Pipeline', 'Automated Build'],
    description:
      '內建持續整合基因，每天準時在 08:00 啄醒整個 CI/CD Pipeline。以驚人的專注力逐行啄完程式碼，每產出一顆「金雞蛋」就代表一次成功的 Build，是團隊最可靠的早班工程師。',
    avatar: '/images/cow-1.png',
    basePrice: 1024,
    addons: [
      { id: 'golden_egg', name: '金雞蛋產生器', price: 200, selected: false },
      { id: 'alarm', name: '凌晨報警模組(早安morning call)', price: 80, selected: false }
    ]
  }
]
