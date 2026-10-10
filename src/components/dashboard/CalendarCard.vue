<script setup lang="ts">
import { computed, ref } from 'vue'

const today = new Date(2026, 9, 10) // 2026-10-10
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-11

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const events = ref<Record<number, string[]>>({
  1: ['开学典礼'],
  5: ['月考开始'],
  10: ['AI 助手正式上线 🎉'],
  14: ['物理答疑直播'],
  18: ['数学小测'],
  24: ['英语口语比赛'],
  30: ['家长会'],
})

interface DayCell {
  date: number
  fullDate: Date
  inMonth: boolean
  isToday: boolean
  isWeekend: boolean
  events: string[]
}

const calendarDays = computed<DayCell[]>(() => {
  const year = viewYear.value
  const month = viewMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekday = firstDay.getDay()

  const cells: DayCell[] = []

  // 上月补齐
  const prevLast = new Date(year, month, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevLast - i)
    cells.push({
      date: prevLast - i,
      fullDate: d,
      inMonth: false,
      isToday: false,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      events: [],
    })
  }

  // 当月
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({
      date: d,
      fullDate: date,
      inMonth: true,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      events: events.value[d] ?? [],
    })
  }

  // 下月补齐
  let next = 1
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month + 1, next)
    cells.push({
      date: next,
      fullDate: d,
      inMonth: false,
      isToday: false,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      events: [],
    })
    next++
  }

  // 凑满 6 行
  while (cells.length < 42) {
    const d = new Date(year, month + 1, next)
    cells.push({
      date: next,
      fullDate: d,
      inMonth: false,
      isToday: false,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      events: [],
    })
    next++
  }

  return cells
})

const monthLabel = computed(
  () => `${viewYear.value} 年 ${String(viewMonth.value + 1).padStart(2, '0')} 月`,
)

function prevMonth() {
  if (viewMonth.value === 0) {
    viewYear.value -= 1
    viewMonth.value = 11
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewYear.value += 1
    viewMonth.value = 0
  } else {
    viewMonth.value += 1
  }
}

function goToday() {
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
}
</script>

<template>
  <section class="calendar-card">
    <header class="card-head">
      <div class="title-wrap">
        <h3 class="title">日历</h3>
        <span class="subtitle">今日 {{ today.getMonth() + 1 }} 月 {{ today.getDate() }} 日</span>
      </div>
      <div class="actions">
        <button class="today-btn" @click="goToday">回到今日</button>
        <div class="nav-group">
          <button class="nav-btn" @click="prevMonth" aria-label="上一月">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span class="month-label">{{ monthLabel }}</span>
          <button class="nav-btn" @click="nextMonth" aria-label="下一月">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="calendar-grid">
      <div v-for="(w, idx) in weekDays" :key="w" class="weekday" :class="{ weekend: idx === 0 || idx === 6 }">
        {{ w }}
      </div>

      <div
        v-for="(cell, i) in calendarDays"
        :key="i"
        :class="[
          'day-cell',
          { dim: !cell.inMonth, today: cell.isToday, weekend: cell.isWeekend },
        ]"
      >
        <span class="day-num">{{ cell.date }}</span>
        <span v-if="cell.isToday" class="today-tag">今</span>
        <span v-else-if="cell.events.length" class="event-dot"></span>
      </div>
    </div>

    <div class="upcoming">
      <div class="upcoming-title">即将到来</div>
      <ul class="upcoming-list">
        <li v-for="d in [14, 18, 24, 30]" :key="d" class="upcoming-item">
          <span class="upcoming-date">{{ String(viewMonth + 1).padStart(2, '0') }}-{{ String(d).padStart(2, '0') }}</span>
          <span class="upcoming-event">{{ events[d]?.[0] }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.calendar-card {
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
  flex-wrap: wrap;
  gap: 8px;
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
}

.subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.today-btn {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.today-btn:hover {
  background: #eef2ff;
  color: var(--color-primary);
}

.nav-group {
  display: inline-flex;
  align-items: center;
  background: var(--color-bg);
  border-radius: var(--radius-full);
  padding: 2px;
}

.nav-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #fff;
  color: var(--color-primary);
}

.month-label {
  font-size: 13px;
  font-weight: 600;
  padding: 0 10px;
  color: var(--color-text);
  min-width: 110px;
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: 6px 0;
}

.weekday.weekend {
  color: var(--color-accent);
}

.day-cell {
  position: relative;
  height: 38px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-bg);
  transition: all 0.2s ease;
  cursor: pointer;
}

.day-cell:hover {
  background: #eef2ff;
}

.day-cell.dim {
  color: var(--color-text-muted);
  background: transparent;
}

.day-cell.dim:hover {
  background: var(--color-bg);
}

.day-cell.weekend:not(.dim) {
  color: var(--color-accent);
}

.day-num {
  line-height: 1;
}

.event-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary);
  margin-top: 3px;
}

.day-cell.weekend .event-dot {
  background: var(--color-accent);
}

.day-cell.today {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: #fff;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(99, 102, 241, 0.35);
}

.day-cell.today .event-dot {
  display: none;
}

.today-tag {
  font-size: 9px;
  background: rgba(255, 255, 255, 0.25);
  padding: 1px 5px;
  border-radius: var(--radius-full);
  margin-top: 2px;
  line-height: 1;
}

.upcoming {
  border-top: 1px dashed var(--color-border);
  padding-top: 14px;
}

.upcoming-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  padding: 6px 10px;
  background: var(--color-bg);
  border-radius: 8px;
  transition: background 0.2s ease;
}

.upcoming-item:hover {
  background: #eef2ff;
}

.upcoming-date {
  font-weight: 600;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.upcoming-event {
  color: var(--color-text);
}
</style>
