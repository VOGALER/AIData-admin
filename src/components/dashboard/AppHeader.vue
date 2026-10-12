<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const classAvatar = {
  initials: 'H3',
  gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
}

const userAvatar = {
  gradient: 'linear-gradient(135deg, #6366f1, #ec4899)',
}

const projectName = '嘉乐 AI 伴学'
const className = '三年级 (3) 班'

const displayName = computed(() => auth.user?.name ?? '未登录')
const role = computed(() => auth.user?.role ?? 'student')
const roleText = computed(() => (role.value === 'teacher' ? '老师' : '学生'))

const avatarText = computed(() => {
  const name = displayName.value
  if (!name) return '?'
  // 英文/数字取前 2 位，中文取 1 位
  return /^[\x20-\x7f]/.test(name) ? name.slice(0, 2).toUpperCase() : name.slice(0, 1)
})

const navMenu = [
  { name: '首页', active: true },
  { name: '课程', active: false },
  { name: '题库', active: false },
  { name: '社区', active: false },
]

function handleLogout(): void {
  auth.logout()
  void router.push({ name: 'login' })
}
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <div class="logo" aria-label="logo">
        <span class="logo-shape"></span>
      </div>
      <span class="project-name">{{ projectName }}</span>
      <nav class="menu">
        <a
          v-for="m in navMenu"
          :key="m.name"
          :class="['menu-item', { active: m.active }]"
          href="#"
        >
          {{ m.name }}
        </a>
      </nav>
    </div>

    <div class="user-area">
      <div class="class-info">
        <div
          class="avatar avatar-class"
          :style="{ background: classAvatar.gradient }"
        >
          <span>{{ classAvatar.initials }}</span>
        </div>
        <div class="info">
          <div class="info-label">班级</div>
          <div class="info-value">{{ className }}</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="user-info">
        <div
          class="avatar avatar-user"
          :style="{ background: userAvatar.gradient }"
        >
          <span>{{ avatarText }}</span>
        </div>
        <div class="info">
          <div class="info-label">欢迎</div>
          <div class="info-value">
            {{ displayName }}
            <span :class="['role-badge', role]">{{ roleText }}</span>
          </div>
        </div>
        <button class="logout-btn" title="退出登录" @click="handleLogout">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.brand {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.logo-shape {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  position: relative;
}

.logo-shape::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

.project-name {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.4px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.menu {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}

.menu-item {
  position: relative;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.menu-item:hover {
  color: var(--color-text);
  background: var(--color-bg);
}

.menu-item.active {
  color: var(--color-primary);
  background: #eef2ff;
  font-weight: 500;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 14px;
}

.class-info,
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  transition: background 0.2s ease;
}

.class-info:hover,
.user-info:hover {
  background: var(--color-bg);
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.avatar-class {
  outline: 2px solid rgba(245, 158, 11, 0.15);
}

.avatar-user {
  outline: 2px solid rgba(99, 102, 241, 0.15);
}

.info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.info-label {
  font-size: 10.5px;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 13px;
  color: var(--color-text);
  font-weight: 500;
}

.role-badge {
  display: inline-block;
  margin-left: 5px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;
  vertical-align: middle;
}

.role-badge.teacher {
  background: #fef3c7;
  color: #b45309;
}

.role-badge.student {
  background: #e0e7ff;
  color: #4338ca;
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

.logout-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: #fef2f2;
  color: var(--color-danger);
}
</style>
