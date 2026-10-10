<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue'

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  text: string
  time: string
}

const navItems = [
  { key: 'today', label: '今日', icon: 'sun' },
  { key: 'plan', label: '学习计划', icon: 'clipboard' },
  { key: 'qa', label: '智能问答', icon: 'chat' },
  { key: 'review', label: '错题回顾', icon: 'refresh' },
  { key: 'rank', label: '排行榜', icon: 'trophy' },
]

const activeNav = ref('today')

const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'ai',
    text: '你好呀，小乐同学 👋 今天是 10 月 10 日（周六），今天有什么学习计划要安排吗？',
    time: '09:00',
  },
  {
    id: 2,
    role: 'user',
    text: '我想先把今天的数学作业做完，下午再复习一下英语。',
    time: '09:01',
  },
  {
    id: 3,
    role: 'ai',
    text: '好的！我已经帮你把今天剩余的日程整理出来了：上午建议先做数学（40 分钟），休息 10 分钟后做英语听力，下午 14:30 有一次物理答疑直播。需要我顺便安排吗？',
    time: '09:01',
  },
  {
    id: 4,
    role: 'user',
    text: '安排吧，物理直播我准时参加。',
    time: '09:02',
  },
  {
    id: 5,
    role: 'ai',
    text: '搞定啦 ✅ 数学、英语复习、物理答疑都加进今日日程咯，加油～',
    time: '09:02',
  },
])

const draft = ref('')
// 显式模板引用，类型更精确
const listRef = useTemplateRef<HTMLElement>('listRef')
let nextId = messages.value.length + 1

function nowTime(offsetMinutes = 0): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + offsetMinutes)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function appendMessage(role: ChatMessage['role'], text: string): void {
  const msg: ChatMessage = {
    id: nextId++,
    role,
    text,
    time: nowTime(),
  }
  messages.value = [...messages.value, msg]
}

function scrollToBottom(): void {
  void nextTick(() => {
    const el = listRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

function send(): void {
  const text = draft.value.trim()
  if (!text) return

  appendMessage('user', text)
  draft.value = ''
  scrollToBottom()

  // 假装 AI 回复一条
  setTimeout(() => {
    appendMessage('ai', '收到，我先帮你记录一下～')
    scrollToBottom()
  }, 600)
}
</script>

<template>
  <section class="chat-panel">
    <header class="chat-nav">
      <div class="chat-title">
        <span class="ai-badge">
          <span class="online-dot"></span>
          AI 学习助手
        </span>
        <span class="status-text">在线 · 随时提问</span>
      </div>
      <ul class="chat-nav-list">
        <li
          v-for="item in navItems"
          :key="item.key"
          :class="['chat-nav-item', { active: activeNav === item.key }]"
          @click="activeNav = item.key"
        >
          <span class="dot"></span>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </header>

    <div ref="listRef" class="chat-list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-msg', msg.role]"
      >
        <div class="chat-avatar" :class="msg.role">
          <span v-if="msg.role === 'user'">我</span>
          <span v-else>AI</span>
        </div>
        <div class="chat-bubble-wrap">
          <div class="chat-bubble">{{ msg.text }}</div>
          <div class="chat-time">{{ msg.time }}</div>
        </div>
      </div>
    </div>

    <footer class="chat-input">
      <button class="chat-extra" title="表情">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </button>
      <input
        v-model="draft"
        class="chat-text"
        type="text"
        placeholder="向 AI 助手提问 …"
        @keydown.enter="send"
      />
      <button class="chat-send" :disabled="!draft.trim()" @click="send">
        <span>发送</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </footer>
  </section>
</template>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

.chat-nav {
  border-bottom: 1px solid var(--color-border-light);
  padding: 14px 18px;
}

.chat-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
}

.status-text {
  font-size: 11px;
  color: var(--color-text-muted);
}

.chat-nav-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chat-nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--color-border-light);
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-nav-item:hover {
  background: #e5e7eb;
}

.chat-nav-item .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-muted);
}

.chat-nav-item.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: #fff;
}

.chat-nav-item.active .dot {
  background: #fff;
}

.chat-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(180deg, #fafbff 0%, #ffffff 100%);
}

.chat-msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.chat-msg.user {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.chat-avatar.ai {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
}

.chat-avatar.user {
  background: linear-gradient(135deg, #34d399, #059669);
}

.chat-bubble-wrap {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-msg.user .chat-bubble-wrap {
  align-items: flex-end;
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  background: #f3f4f6;
  color: var(--color-text);
  line-height: 1.55;
  font-size: 13px;
  word-break: break-word;
  white-space: pre-wrap;
}

.chat-msg.ai .chat-bubble {
  border-top-left-radius: 4px;
}

.chat-msg.user .chat-bubble {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  border-top-right-radius: 4px;
}

.chat-time {
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 0 4px;
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-surface);
}

.chat-extra {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: background 0.2s ease;
}

.chat-extra:hover {
  background: var(--color-border-light);
}

.chat-text {
  flex: 1;
  height: 38px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: var(--color-bg);
  transition: background 0.2s ease;
}

.chat-text:focus {
  background: #eef2ff;
}

.chat-send {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 16px;
  height: 36px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.chat-send:hover:not(:disabled) {
  transform: translateY(-1px);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
