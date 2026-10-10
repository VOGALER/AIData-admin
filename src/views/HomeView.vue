<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import AppHeader from '@/components/dashboard/AppHeader.vue'
import ChatPanel from '@/components/dashboard/ChatPanel.vue'
import ScheduleCard from '@/components/dashboard/ScheduleCard.vue'
import StudyCard from '@/components/dashboard/StudyCard.vue'
import CalendarCard from '@/components/dashboard/CalendarCard.vue'

const MIN_WIDTH = 320
const MAX_WIDTH = 760
const DEFAULT_WIDTH = 420
const RESIZER_WIDTH = 16
const PADDING_X = 24
const RIGHT_MIN_WIDTH = 420

const dashboardRef = ref<HTMLElement | null>(null)
const chatWidth = ref(DEFAULT_WIDTH)
const collapsed = ref(false)
const isResizing = ref(false)

// 用 CSS 变量传宽度，这样媒体查询里的响应式规则不会被内联样式覆盖
const gridStyle = computed(() => ({
  '--chat-w': `${chatWidth.value}px`,
}))

function startResize(e: PointerEvent): void {
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', onResize)
  window.addEventListener('pointerup', stopResize)
  e.preventDefault()
}

function onResize(e: PointerEvent): void {
  if (!isResizing.value) return
  const el = dashboardRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const contentLeft = rect.left + PADDING_X
  const contentWidth = rect.width - PADDING_X * 2

  // 右侧主界面至少保留 RIGHT_MIN_WIDTH，避免被压扁
  const maxAllowed = Math.max(
    Math.min(MAX_WIDTH, contentWidth - RESIZER_WIDTH - RIGHT_MIN_WIDTH),
    MIN_WIDTH,
  )
  const next = e.clientX - contentLeft - RESIZER_WIDTH / 2
  chatWidth.value = Math.round(Math.min(Math.max(next, MIN_WIDTH), maxAllowed))
}

function stopResize(): void {
  if (!isResizing.value) return
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  window.removeEventListener('pointermove', onResize)
  window.removeEventListener('pointerup', stopResize)
}

function resetWidth(): void {
  chatWidth.value = DEFAULT_WIDTH
}

function toggleCollapse(): void {
  collapsed.value = !collapsed.value
}

onBeforeUnmount(stopResize)
</script>

<template>
  <div class="home-view">
    <AppHeader />

    <main
      ref="dashboardRef"
      class="dashboard"
      :class="{ 'is-collapsed': collapsed }"
      :style="gridStyle"
    >
      <!-- 左侧：AI 聊天框，sticky 常驻视口，不随滚动消失 -->
      <template v-if="!collapsed">
        <div class="left-col">
          <ChatPanel />
        </div>

        <!-- 拖拽分隔条：拖动调宽，双击恢复默认，按钮可完全收起 -->
        <div
          class="resizer"
          :class="{ active: isResizing }"
          role="separator"
          aria-orientation="vertical"
          title="拖动调整宽度 · 双击恢复默认"
          @pointerdown="startResize"
          @dblclick="resetWidth"
        >
          <span class="resizer-line"></span>
          <button
            class="collapse-btn"
            title="收起 AI 助手"
            @pointerdown.stop
            @dblclick.stop
            @click="toggleCollapse"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </template>

      <!-- 右侧：主界面，可自由滚动 -->
      <div class="right-col">
        <div class="welcome-card">
          <div class="welcome-text">
            <h2 class="greeting">早上好，小乐同学 ☀️</h2>
            <p class="greeting-sub">
              今天的学习之旅，从一句 AI 助手的鼓励开始吧～ 继续保持，全班第 8 名很棒哦！
            </p>
          </div>
          <div class="welcome-stats">
            <div class="stat">
              <div class="stat-num">28</div>
              <div class="stat-label">连续打卡</div>
            </div>
            <div class="stat">
              <div class="stat-num">1.5h</div>
              <div class="stat-label">今日学习</div>
            </div>
            <div class="stat">
              <div class="stat-num">+12</div>
              <div class="stat-label">本周积分</div>
            </div>
          </div>
        </div>

        <div class="row">
          <ScheduleCard />
          <StudyCard />
        </div>

        <CalendarCard />
      </div>
    </main>

    <!-- 收起后：唤出 AI 助手的悬浮按钮 -->
    <button v-if="collapsed" class="expand-fab" title="展开 AI 助手" @click="toggleCollapse">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 14a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span class="fab-label">AI 助手</span>
    </button>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
}

/* 列宽：聊天(--chat-w) + 分隔条(16px) + 主界面 */
.dashboard {
  flex: 1;
  display: grid;
  grid-template-columns: var(--chat-w, 420px) 16px minmax(0, 1fr);
  padding: 20px 24px 28px;
  column-gap: 0;
  row-gap: 16px;
  align-items: start;
}

/* 完全收起：只展示右侧主界面 */
.dashboard.is-collapsed {
  grid-template-columns: minmax(0, 1fr);
}

/* AI 聊天常驻：sticky 钉在视口内，右侧内容滚动时不会消失 */
.left-col {
  position: sticky;
  top: calc(var(--header-height) + 20px);
  align-self: start;
  height: calc(100vh - var(--header-height) - 48px);
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

/* ---------- 拖拽分隔条 ---------- */
.resizer {
  position: relative;
  align-self: stretch;
  cursor: col-resize;
  touch-action: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.resizer-line {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  border-radius: 9999px;
  background: var(--color-border);
  transition: background 0.2s ease, width 0.2s ease;
}

.resizer:hover .resizer-line,
.resizer.active .resizer-line {
  background: var(--color-primary);
  width: 4px;
}

/* sticky 保证滚动时收起按钮始终可见 */
.collapse-btn {
  position: sticky;
  top: calc(var(--header-height) + 56px);
  flex: 0 0 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-sm);
  z-index: 6;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.collapse-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.08);
}

/* ---------- 收起后的唤出按钮 ---------- */
.expand-fab {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 56px;
  height: 60px;
  border-radius: 0 16px 16px 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: #fff;
  box-shadow: var(--shadow-lg);
  z-index: 30;
  transition: transform 0.2s ease;
}

.expand-fab:hover {
  transform: translateY(-50%) translateX(2px);
}

.fab-label {
  font-size: 10px;
  line-height: 1;
}

.right-col {
  display: grid;
  grid-template-rows: auto minmax(320px, auto) minmax(300px, auto);
  gap: 16px;
  align-content: start;
  min-height: 0;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-height: 0;
}

.welcome-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  color: #fff;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.welcome-card::after {
  content: '';
  position: absolute;
  bottom: -60px;
  left: 30%;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.welcome-text {
  position: relative;
  z-index: 1;
  margin-bottom: 14px;
}

.greeting {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 700;
}

.greeting-sub {
  margin: 0;
  font-size: 13px;
  opacity: 0.92;
  line-height: 1.55;
  max-width: 620px;
}

.welcome-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 140px));
  gap: 10px;
}

.stat {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  text-align: center;
}

.stat-num {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 11px;
  opacity: 0.9;
  margin-top: 2px;
}

@media (max-width: 1100px) {
  /* 窄屏改为上下堆叠，隐藏分隔条、禁用拖拽 */
  .dashboard {
    grid-template-columns: minmax(0, 1fr);
  }

  .resizer {
    display: none;
  }

  /* 单列布局时取消常驻，避免挡住内容 */
  .left-col {
    position: static;
    height: 60vh;
  }

  .row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .row {
    grid-template-columns: 1fr;
  }

  .welcome-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
