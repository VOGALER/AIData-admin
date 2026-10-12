import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // 未登录访问受保护页面 → 去登录
  if (!to.meta.public && !auth.isLoggedIn) {
    return { name: 'login' }
  }

  // 已登录访问登录页 → 回首页
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
