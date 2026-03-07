import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/services/auth.js'

// Lazy-loaded pages
const LoginPage = () => import('@/pages/LoginPage.vue')
const RegisterPage = () => import('@/pages/RegisterPage.vue')
const ApplyLeavePage = () => import('@/pages/ApplyLeavePage.vue')
const MyLeavesPage = () => import('@/pages/MyLeavesPage.vue')
const EmployerDashboard = () => import('@/pages/EmployerDashboard.vue')
const NotFound = () => import('@/pages/NotFound.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage, meta: { guest: true } },
  { path: '/register', component: RegisterPage, meta: { guest: true } },
  {
    path: '/apply-leave',
    component: ApplyLeavePage,
    meta: { requiresAuth: true, role: 'employee' },
  },
  {
    path: '/my-leaves',
    component: MyLeavesPage,
    meta: { requiresAuth: true, role: 'employee' },
  },
  {
    path: '/dashboard',
    component: EmployerDashboard,
    meta: { requiresAuth: true, role: 'employer' },
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn, user } = useAuth()

  if (to.meta.guest && isLoggedIn.value) {
    const redirect = user.value?.role === 'employer' ? '/dashboard' : '/my-leaves'
    return next(redirect)
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return next('/login')
  }

  if (to.meta.role && user.value?.role !== to.meta.role) {
    const redirect = user.value?.role === 'employer' ? '/dashboard' : '/my-leaves'
    return next(redirect)
  }

  next()
})

export default router
