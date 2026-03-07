<template>
  <div class="min-h-screen">
    <!-- Navbar -->
    <nav v-if="isLoggedIn" class="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="font-display text-xl text-white">LeaveFlow</span>
          </div>

          <!-- Nav Links -->
          <div class="hidden sm:flex items-center gap-1">
            <template v-if="isEmployee">
              <router-link to="/apply-leave" class="nav-link">Apply Leave</router-link>
              <router-link to="/my-leaves" class="nav-link">My Requests</router-link>
            </template>
            <template v-if="isEmployer">
              <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            </template>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-3">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-slate-200">{{ user?.name }}</p>
              <p class="text-xs text-amber-400 capitalize">{{ user?.role }}</p>
            </div>
            <button @click="handleLogout" class="btn-secondary text-sm py-2 px-4">
              Sign Out
            </button>
          </div>
        </div>

        <!-- Mobile nav -->
        <div class="sm:hidden pb-3 flex gap-2">
          <template v-if="isEmployee">
            <router-link to="/apply-leave" class="nav-link text-sm">Apply</router-link>
            <router-link to="/my-leaves" class="nav-link text-sm">Requests</router-link>
          </template>
          <template v-if="isEmployer">
            <router-link to="/dashboard" class="nav-link text-sm">Dashboard</router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/auth.js'

const router = useRouter()
const { isLoggedIn, isEmployee, isEmployer, user, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style>
.nav-link {
  @apply text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium
         transition-colors duration-200 hover:bg-slate-800/60;
}

.router-link-active.nav-link {
  @apply text-amber-400 bg-amber-400/10;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
