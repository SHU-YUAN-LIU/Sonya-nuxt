// Email 格式正則
const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,6}){1,2}$/

// 密碼格式正則：至少 6 碼，含大小寫字母與數字
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

export const rules = {
  name: [
    { required: true, message: '姓名不能為空', trigger: 'blur' },
    { min: 2, message: '姓名至少需 2 個字', trigger: 'blur' }
  ],

  email: [
    { required: true, message: 'Email 不能為空', trigger: 'blur' },
    { pattern: emailPattern, message: '請輸入有效的 Email 格式', trigger: 'blur' }
  ],

  loginPassword: [
    { required: true, message: '密碼不能為空', trigger: 'blur' }
  ],

  password: [
    { required: true, message: '密碼不能為空', trigger: 'blur' },
    { min: 6, message: '密碼至少 6 碼', trigger: 'blur' },
    { pattern: passwordPattern, message: '密碼需包含大小寫字母與數字', trigger: 'blur' }
  ]
}

