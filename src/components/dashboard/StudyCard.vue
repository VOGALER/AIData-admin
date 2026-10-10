<script setup lang="ts">
interface Subject {
  name: string
  percent: number
  color: string
}

const rank = 8
const totalRank = 56
const totalPercent = 68

const subjects: Subject[] = [
  { name: '数学', percent: 82, color: '#6366f1' },
  { name: '英语', percent: 74, color: '#10b981' },
  { name: '语文', percent: 61, color: '#ec4899' },
  { name: '物理', percent: 53, color: '#f59e0b' },
]

const ringStyle = (percent: number) => {
  const remain = 100 - percent
  return {
    background: `conic-gradient(#6366f1 0% ${percent}%, #eef2ff ${percent}% ${percent + remain}%)`,
  }
}
</script>

<template>
  <section class="study-card">
    <header class="card-head">
      <h3 class="title">学习完成情况</h3>
      <button class="more">详情</button>
    </header>

    <div class="study-body">
      <div class="ring-wrap">
        <div class="ring" :style="ringStyle(totalPercent)"></div>
        <div class="ring-inner">
          <div class="percent">{{ totalPercent }}<span class="sign">%</span></div>
          <div class="label">总进度</div>
        </div>
      </div>

      <div class="stats">
        <div class="stat-row">
          <div class="stat-icon rank">🏆</div>
          <div class="stat-info">
            <div class="stat-label">学习总排名</div>
            <div class="stat-value">
              <span class="num">{{ rank }}</span>
              <span class="suffix">/ {{ totalRank }} 班级</span>
            </div>
          </div>
        </div>

        <div class="subjects">
          <div v-for="s in subjects" :key="s.name" class="subject">
            <div class="subject-head">
              <span class="dot" :style="{ background: s.color }"></span>
              <span class="name">{{ s.name }}</span>
              <span class="percent">{{ s.percent }}%</span>
            </div>
            <div class="bar">
              <div
                class="bar-fill"
                :style="{
                  width: s.percent + '%',
                  background: s.color,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.study-card {
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

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.more {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 500;
}

.study-body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
  flex: 1;
  min-height: 0;
}

.ring-wrap {
  position: relative;
  width: 116px;
  height: 116px;
  flex-shrink: 0;
}

.ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ring::after {
  content: '';
  position: absolute;
  inset: 8px;
  background: #fff;
  border-radius: 50%;
}

.ring-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.percent {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.percent .sign {
  font-size: 14px;
  margin-left: 2px;
  color: var(--color-primary-light);
}

.label {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.stat-icon.rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #92400e;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value .num {
  font-size: 18px;
  font-weight: 700;
  color: #b45309;
  line-height: 1;
}

.stat-value .suffix {
  font-size: 11px;
  color: #b45309;
}

.subjects {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subject {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subject-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.subject-head .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.subject-head .name {
  color: var(--color-text);
  font-weight: 500;
}

.subject-head .percent {
  margin-left: auto;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.bar {
  height: 6px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
