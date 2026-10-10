<script setup lang="ts">
import { computed, ref } from 'vue'

interface ScheduleItem {
  id: number
  time: string
  title: string
  tag: string
  tagColor: string
  done: boolean
}

const items = ref<ScheduleItem[]>([
  {
    id: 1,
    time: '09:30',
    title: '数学 · 二次函数综合题',
    tag: '数学',
    tagColor: '#6366f1',
    done: true,
  },
  {
    id: 2,
    time: '10:30',
    title: '英语 · 完形填空练习',
    tag: '英语',
    tagColor: '#10b981',
    done: true,
  },
  {
    id: 3,
    time: '14:30',
    title: '物理 · 期中复习直播课',
    tag: '物理',
    tagColor: '#f59e0b',
    done: false,
  },
  {
    id: 4,
    time: '16:00',
    title: '语文 · 古诗词背诵抽查',
    tag: '语文',
    tagColor: '#ec4899',
    done: false,
  },
  {
    id: 5,
    time: '20:00',
    title: '错题回顾 · 整理本周错题',
    tag: '错题',
    tagColor: '#ef4444',
    done: false,
  },
])

const finishedCount = computed(() => items.value.filter((i) => i.done).length)

function toggle(item: ScheduleItem) {
  item.done = !item.done
}
</script>

<template>
  <section class="schedule-card">
    <header class="card-head">
      <div class="title-wrap">
        <h3 class="title">今日日程</h3>
        <span class="subtitle">{{ finishedCount }} / {{ items.length }} 已完成</span>
      </div>
      <button class="more">查看全部 →</button>
    </header>

    <ul class="schedule-list">
      <li
        v-for="(item, idx) in items"
        :key="item.id"
        :class="['schedule-item', { done: item.done }]"
        :style="{ '--tag-color': item.tagColor }"
      >
        <div class="timeline">
          <span class="time">{{ item.time }}</span>
          <span class="dot" v-if="idx !== items.length - 1"></span>
        </div>
        <div class="content" @click="toggle(item)">
          <div class="title-row">
            <span class="tag">{{ item.tag }}</span>
            <span class="item-title">{{ item.title }}</span>
          </div>
          <div class="status">
            <span class="check">
              <svg v-if="item.done" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span>{{ item.done ? '已完成' : '进行中' }}</span>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.schedule-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.title-wrap {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
}

.more {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 500;
}

.more:hover {
  color: var(--color-primary-dark);
}

.schedule-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 4px;
}

.schedule-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  align-items: stretch;
}

.timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px;
  position: relative;
}

.time {
  font-size: 12px;
  font-weight: 600;
  color: var(--tag-color);
  background: #fff;
  padding: 2px 4px;
  border-radius: 4px;
  margin-top: 8px;
}

.dot {
  flex: 1;
  width: 2px;
  background: var(--color-border);
  margin-top: 4px;
  border-radius: 1px;
}

.content {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: var(--color-bg);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.content:hover {
  transform: translateX(2px);
  background: #eef2ff;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--tag-color);
  color: #fff;
  font-weight: 500;
  flex-shrink: 0;
}

.item-title {
  font-size: 13px;
  color: var(--color-text);
  font-weight: 500;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.check {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.2s ease;
}

.schedule-item.done .check {
  background: var(--tag-color);
  border-color: var(--tag-color);
  color: #fff;
}

.schedule-item.done .item-title {
  color: var(--color-text-muted);
  text-decoration: line-through;
}
</style>
