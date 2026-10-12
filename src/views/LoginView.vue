<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type UserRole } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

type Mode = 'login' | 'register'
const mode = ref<Mode>('login')

const loginForm = reactive({ name: '', password: '' })
const registerForm = reactive({ name: '', password: '', role: 'student' as UserRole })

const errorMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'student', label: '我是学生', desc: '查看日程 · 追踪学习进度' },
  { value: 'teacher', label: '我是老师', desc: '管理班级 · 布置学习任务' },
]

function switchMode(next: Mode): void {
  mode.value = next
  errorMsg.value = ''
}

function submit(): void {
  errorMsg.value = ''

  if (mode.value === 'login') {
    if (!loginForm.name.trim() || !loginForm.password) {
      errorMsg.value = '请输入名称和密码'
      return
    }
    loading.value = true
    const res = auth.login(loginForm.name, loginForm.password)
    loading.value = false
    if (!res.ok) {
      errorMsg.value = res.message
      return
    }
    void router.push('/')
  } else {
    if (!registerForm.name.trim() || !registerForm.password) {
      errorMsg.value = '请输入名称和密码'
      return
    }
    loading.value = true
    const res = auth.register(registerForm.name, registerForm.password, registerForm.role)
    loading.value = false
    if (!res.ok) {
      errorMsg.value = res.message
      return
    }
    void router.push('/')
  }
}

function fillDemo(role: UserRole): void {
  loginForm.name = role === 'student' ? '小乐同学' : '王老师'
  loginForm.password = '123456'
  errorMsg.value = ''
}
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <aside class="brand-panel">
      <div class="brand-inner">
        <div class="brand-logo">
          <span class="logo-circle"><span class="logo-inner"></span></span>
          <span class="brand-name">嘉乐 AI 伴学</span>
        </div>

        <h1 class="brand-title">让每一次学习<br />都有 AI 陪伴</h1>
        <p class="brand-desc">
          智能日程规划、学习进度追踪、错题回顾。老师与学生，都能轻松上手。
        </p>

        <ul class="brand-features">
          <li><span class="feat-dot"></span>今日日程自动整理</li>
          <li><span class="feat-dot"></span>学习进度可视化</li>
          <li><span class="feat-dot"></span>AI 助手随时答疑</li>
        </ul>
      </div>

      <span class="deco deco-1"></span>
      <span class="deco deco-2"></span>
      <span class="deco deco-3"></span>
    </aside>

    <!-- 右侧表单区 -->
    <section class="form-panel">
      <div class="form-card">
        <div class="tabs">
          <button
            :class="['tab', { active: mode === 'login' }]"
            @click="switchMode('login')"
          >
            登录
          </button>
          <button
            :class="['tab', { active: mode === 'register' }]"
            @click="switchMode('register')"
          >
            注册
          </button>
        </div>

        <p class="form-tip">
          {{ mode === 'login' ? '欢迎回来，请输入账号继续' : '只需名称和密码，选择身份即可创建' }}
        </p>

        <form class="form" @submit.prevent="submit">
          <!-- 名称 -->
          <label class="field">
            <span class="field-label">名称</span>
            <span class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                v-if="mode === 'login'"
                v-model="loginForm.name"
                type="text"
                placeholder="请输入名称"
                autocomplete="username"
              />
              <input
                v-else
                v-model="registerForm.name"
                type="text"
                placeholder="请输入名称"
                autocomplete="username"
              />
            </span>
          </label>

          <!-- 密码 -->
          <label class="field">
            <span class="field-label">密码</span>
            <span class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                v-if="mode === 'login'"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                autocomplete="current-password"
              />
              <input
                v-else
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码（至少 6 位）"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="eye-btn"
                :title="showPassword ? '隐藏密码' : '显示密码'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </span>
          </label>

          <!-- 注册时选择身份 -->
          <div v-if="mode === 'register'" class="field">
            <span class="field-label">身份</span>
            <div class="role-grid">
              <button
                v-for="r in roles"
                :key="r.value"
                type="button"
                :class="['role-card', { selected: registerForm.role === r.value }]"
                @click="registerForm.role = r.value"
              >
                <span class="role-icon">
                  <svg v-if="r.value === 'student'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10L12 5 2 10l10 5 10-5z" />
                    <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="12" rx="2" />
                    <path d="M8 21h8" />
                    <path d="M12 16v5" />
                  </svg>
                </span>
                <span class="role-label">{{ r.label }}</span>
                <span class="role-desc">{{ r.desc }}</span>
                <span class="role-check">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

          <button class="submit-btn" type="submit" :disabled="loading">
            {{ loading ? '处理中…' : mode === 'login' ? '登录' : '注册并进入' }}
          </button>
        </form>

        <div v-if="mode === 'login'" class="demo">
          <span class="demo-label">演示账号</span>
          <div class="demo-btns">
            <button type="button" class="demo-btn" @click="fillDemo('student')">
              学生 · 小乐同学 / 123456
            </button>
            <button type="button" class="demo-btn" @click="fillDemo('teacher')">
              老师 · 王老师 / 123456
            </button>
          </div>
        </div>

        <p class="switch-line">
          {{ mode === 'login' ? '还没有账号？' : '已有账号？' }}
          <button class="switch-btn" @click="switchMode(mode === 'login' ? 'register' : 'login')">
            {{ mode === 'login' ? '立即注册' : '去登录' }}
          </button>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100vh;
  background: var(--color-bg);
}

/* ---------- 左侧品牌区 ---------- */
.brand-panel {
  position: relative;
  overflow: hidden;
  background: linear-gradient(140deg, #6366f1 0%, #8b5cf6 45%, #ec4899 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 60px 56px;
}

.brand-inner {
  position: relative;
  z-index: 2;
  max-width: 460px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  position: relative;
}

.logo-inner::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.65);
}

.brand-name {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.brand-title {
  margin: 0 0 16px;
  font-size: 34px;
  line-height: 1.35;
  font-weight: 700;
}

.brand-desc {
  margin: 0 0 32px;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.9;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  opacity: 0.95;
}

.feat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  flex-shrink: 0;
}

.deco {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.deco-1 {
  width: 240px;
  height: 240px;
  top: -80px;
  right: -70px;
}

.deco-2 {
  width: 160px;
  height: 160px;
  bottom: -50px;
  left: -40px;
}

.deco-3 {
  width: 90px;
  height: 90px;
  bottom: 120px;
  right: 60px;
  background: rgba(255, 255, 255, 0.08);
}

/* ---------- 右侧表单区 ---------- */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  overflow-y: auto;
}

.form-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 36px 34px 28px;
  box-shadow: var(--shadow-lg);
}

.tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--color-bg);
  border-radius: var(--radius-full);
  margin-bottom: 14px;
}

.tab {
  padding: 8px 26px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.tab.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.form-tip {
  margin: 0 0 22px;
  font-size: 12.5px;
  color: var(--color-text-muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 46px;
  padding: 0 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.input-wrap:focus-within {
  border-color: var(--color-primary);
  background: #eef2ff;
}

.input-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.input-wrap input {
  flex: 1;
  min-width: 0;
  height: 100%;
  font-size: 14px;
  color: var(--color-text);
}

.input-wrap input::placeholder {
  color: var(--color-text-muted);
}

.eye-btn {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.eye-btn:hover {
  color: var(--color-primary);
}

/* 身份选择卡片 */
.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 16px 10px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  text-align: center;
  transition: all 0.2s ease;
}

.role-card:hover {
  border-color: var(--color-primary-light);
}

.role-card.selected {
  border-color: var(--color-primary);
  background: #eef2ff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.role-icon {
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.role-card.selected .role-icon {
  color: var(--color-primary);
}

.role-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.role-desc {
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--color-text-muted);
}

.role-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.2s ease;
}

.role-card.selected .role-check {
  opacity: 1;
  transform: scale(1);
}

.error {
  margin: 0;
  font-size: 12.5px;
  color: var(--color-danger);
  background: #fef2f2;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.submit-btn {
  height: 46px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.28);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(99, 102, 241, 0.34);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 演示账号 */
.demo {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed var(--color-border);
}

.demo-label {
  font-size: 11.5px;
  color: var(--color-text-muted);
}

.demo-btns {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.demo-btn {
  text-align: left;
  font-size: 12px;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.demo-btn:hover {
  background: #eef2ff;
  color: var(--color-primary);
}

.switch-line {
  margin: 18px 0 0;
  text-align: center;
  font-size: 12.5px;
  color: var(--color-text-muted);
}

.switch-btn {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 12.5px;
}

.switch-btn:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    padding: 40px 32px;
  }

  .brand-title {
    font-size: 26px;
  }

  .brand-desc,
  .brand-features {
    display: none;
  }
}
</style>
