  import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UserRole = 'teacher' | 'student'

export interface Account {
  name: string
  password: string
  role: UserRole
}

export interface SessionUser {
  name: string
  role: UserRole
}

export interface AuthResult {
  ok: boolean
  message: string
}

const ACCOUNTS_KEY = 'aidata:accounts'
const SESSION_KEY = 'aidata:session'

// 预置的演示账号，方便直接体验
const DEMO_ACCOUNTS: Account[] = [
  { name: '小乐同学', password: '123456', role: 'student' },
  { name: '王老师', password: '123456', role: 'teacher' },
]

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 存储不可用时忽略，不影响页面交互 */
  }
}

export const useAuthStore = defineStore('auth', () => {
  const storedAccounts = readJSON<Account[]>(ACCOUNTS_KEY)
  const accounts = ref<Account[]>(storedAccounts?.length ? storedAccounts : [...DEMO_ACCOUNTS])
  const user = ref<SessionUser | null>(readJSON<SessionUser>(SESSION_KEY))

  // 首次使用时把演示账号落盘
  if (!storedAccounts?.length) {
    writeJSON(ACCOUNTS_KEY, accounts.value)
  }

  const isLoggedIn = computed(() => user.value !== null)
  const roleLabel = computed(() => (user.value?.role === 'teacher' ? '老师' : '学生'))

  function persistSession(): void {
    if (user.value) {
      writeJSON(SESSION_KEY, user.value)
    } else {
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch {
        /* ignore */
      }
    }
  }

  function login(name: string, password: string): AuthResult {
    const found = accounts.value.find((a) => a.name === name.trim())
    if (!found) {
      return { ok: false, message: '该用户不存在，请先注册' }
    }
    if (found.password !== password) {
      return { ok: false, message: '密码不正确，请重试' }
    }
    user.value = { name: found.name, role: found.role }
    persistSession()
    return { ok: true, message: '登录成功' }
  }

  function register(name: string, password: string, role: UserRole): AuthResult {
    const trimmed = name.trim()
    if (!trimmed) {
      return { ok: false, message: '请输入名称' }
    }
    if (password.length < 6) {
      return { ok: false, message: '密码至少 6 位' }
    }
    if (accounts.value.some((a) => a.name === trimmed)) {
      return { ok: false, message: '该名称已被注册' }
    }

    accounts.value = [...accounts.value, { name: trimmed, password, role }]
    writeJSON(ACCOUNTS_KEY, accounts.value)

    // 注册后直接登录
    user.value = { name: trimmed, role }
    persistSession()
    return { ok: true, message: '注册成功' }
  }

  function logout(): void {
    user.value = null
    persistSession()
  }

  return { user, isLoggedIn, roleLabel, login, register, logout }
})
