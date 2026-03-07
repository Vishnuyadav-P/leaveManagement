<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-400/5 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md relative animate-slide-up">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-amber-400 rounded-2xl mb-4 shadow-xl shadow-amber-400/30">
          <svg class="w-7 h-7 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="font-display text-3xl text-white">Create account</h1>
        <p class="text-slate-400 mt-1 text-sm">Join LeaveFlow today</p>
      </div>

      <div class="card p-8">
        <div v-if="error" class="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5">
          <svg class="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <div class="space-y-5">
          <div class="form-group">
            <label class="label">Full name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="Jane Smith" />
          </div>

          <div class="form-group">
            <label class="label">Email address</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="you@company.com" />
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <input v-model="form.password" type="password" class="input-field" placeholder="Min. 6 characters" />
          </div>

          <!-- Role selector -->
          <div class="form-group">
            <label class="label">I am a...</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="r in roles"
                :key="r.value"
                @click="form.role = r.value"
                :class="[
                  'relative p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  form.role === r.value
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                ]"
              >
                <div class="text-2xl mb-1.5">{{ r.emoji }}</div>
                <div class="font-medium text-sm text-slate-200">{{ r.label }}</div>
                <div class="text-xs text-slate-500 mt-0.5">{{ r.desc }}</div>
                <div
                  v-if="form.role === r.value"
                  class="absolute top-2 right-2 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center"
                >
                  <svg class="w-2.5 h-2.5 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <button
            @click="handleRegister"
            :disabled="loading"
            class="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
          </button>
        </div>

        <div class="mt-6 pt-5 border-t border-slate-800 text-center">
          <p class="text-slate-400 text-sm">
            Already have an account?
            <router-link to="/login" class="text-amber-400 hover:text-amber-300 font-medium ml-1 transition-colors">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/auth.js'

const router = useRouter()
const { register, isEmployer } = useAuth()

const roles = [
  { value: 'employee', label: 'Employee', emoji: '👤', desc: 'Apply for leave' },
  { value: 'employer', label: 'Employer', emoji: '🏢', desc: 'Manage requests' },
]

const form = ref({ name: '', email: '', password: '', role: 'employee' })
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  if (!form.value.name || !form.value.email || !form.value.password) {
    error.value = 'Please fill in all required fields'
    return
  }
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  try {
    await register(form.value)
    const dest = isEmployer.value ? '/dashboard' : '/my-leaves'
    router.push(dest)
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
