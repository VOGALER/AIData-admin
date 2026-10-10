<script setup lang="ts">
const classAvatar = {
  initials: 'H3',
  gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
}

const userAvatar = {
  initials: '小',
  gradient: 'linear-gradient(135deg, #6366f1, #ec4899)',
}

const projectName = '嘉乐 AI 伴学'
const className = '三年级 (3) 班'
const userName = '小乐同学'

const navMenu = [
  { name: '首页', active: true },
  { name: '课程', active: false },
  { name: '题库', active: false },
  { name: '社区', active: false },
]
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
          <span>{{ userAvatar.initials }}</span>
        </div>
        <div class="info">
          <div class="info-label">欢迎</div>
          <div class="info-value">{{ userName }}</div>
        </div>
        <button class="dropdown" aria-label="更多">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
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

.divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

.dropdown {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.dropdown:hover {
  background: var(--color-border-light);
  color: var(--color-text);
}
</style>
