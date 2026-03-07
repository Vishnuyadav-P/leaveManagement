<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-10">
    <!-- Page Header -->
    <div class="mb-8 animate-fade-in">
      <h1 class="page-title">Apply for Leave</h1>
      <p class="page-subtitle">Submit a new leave request for approval</p>
    </div>

    <!-- Success State -->
    <div v-if="success" class="card p-8 text-center animate-slide-up">
      <div class="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="font-display text-2xl text-white mb-2">Request Submitted!</h2>
      <p class="text-slate-400 text-sm mb-6">Your leave request has been sent for approval.</p>
      <div class="flex gap-3 justify-center">
        <button @click="resetForm" class="btn-secondary">Apply Again</button>
        <router-link to="/my-leaves" class="btn-primary">View My Requests</router-link>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="card p-8 animate-slide-up">
      <div v-if="error" class="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5">
        <svg class="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <div class="space-y-6">
        <!-- Leave Type -->
        <div class="form-group">
          <label class="label">Leave Type <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="type in leaveTypes"
              :key="type.value"
              @click="form.leaveType = type.value"
              :class="[
                'p-3.5 rounded-xl border-2 transition-all duration-200 text-left',
                form.leaveType === type.value
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              ]"
            >
              <div class="text-xl mb-1">{{ type.emoji }}</div>
              <div class="text-xs font-medium text-slate-300">{{ type.label }}</div>
            </button>
          </div>
          <p v-if="fieldErrors.leaveType" class="error-text">{{ fieldErrors.leaveType }}</p>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="label">Start Date <span class="text-red-400">*</span></label>
            <input
              v-model="form.startDate"
              type="date"
              class="input-field"
              :min="todayStr"
              @change="validateDates"
            />
            <p v-if="fieldErrors.startDate" class="error-text">{{ fieldErrors.startDate }}</p>
          </div>
          <div class="form-group">
            <label class="label">End Date <span class="text-red-400">*</span></label>
            <input
              v-model="form.endDate"
              type="date"
              class="input-field"
              :min="form.startDate || todayStr"
              @change="validateDates"
            />
            <p v-if="fieldErrors.endDate" class="error-text">{{ fieldErrors.endDate }}</p>
          </div>
        </div>

        <!-- Duration preview -->
        <div v-if="leaveDuration > 0" class="p-3 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-slate-300">
            Duration: <span class="text-amber-400 font-semibold">{{ leaveDuration }} day{{ leaveDuration > 1 ? 's' : '' }}</span>
          </span>
        </div>

        <!-- Reason -->
        <div class="form-group">
          <label class="label">Reason <span class="text-red-400">*</span></label>
          <textarea
            v-model="form.reason"
            class="input-field resize-none"
            rows="4"
            placeholder="Briefly explain your reason for leave..."
            maxlength="500"
          ></textarea>
          <div class="flex justify-between mt-1">
            <p v-if="fieldErrors.reason" class="error-text">{{ fieldErrors.reason }}</p>
            <span class="text-xs text-slate-600 ml-auto">{{ form.reason.length }}/500</span>
          </div>
        </div>

        <button
          @click="handleSubmit"
          :disabled="loading"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>{{ loading ? 'Submitting...' : 'Submit Request' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { leaveService } from '@/services/api.js'

const leaveTypes = [
  { value: 'Sick Leave', label: 'Sick Leave', emoji: '🤒' },
  { value: 'Casual Leave', label: 'Casual Leave', emoji: '☀️' },
  { value: 'Vacation', label: 'Vacation', emoji: '🏖️' },
]

const todayStr = new Date().toISOString().split('T')[0]

const form = ref({
  leaveType: '',
  startDate: '',
  endDate: '',
  reason: '',
})

const fieldErrors = ref({})
const error = ref('')
const loading = ref(false)
const success = ref(false)

const leaveDuration = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 0
  const start = new Date(form.value.startDate)
  const end = new Date(form.value.endDate)
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  return diff > 0 ? diff : 0
})

const validateDates = () => {
  if (form.value.startDate && form.value.endDate) {
    if (new Date(form.value.endDate) < new Date(form.value.startDate)) {
      fieldErrors.value.endDate = 'End date cannot be before start date'
    } else {
      delete fieldErrors.value.endDate
    }
  }
}

const validate = () => {
  fieldErrors.value = {}
  if (!form.value.leaveType) fieldErrors.value.leaveType = 'Please select a leave type'
  if (!form.value.startDate) fieldErrors.value.startDate = 'Start date is required'
  if (!form.value.endDate) fieldErrors.value.endDate = 'End date is required'
  if (form.value.startDate && form.value.endDate) {
    if (new Date(form.value.endDate) < new Date(form.value.startDate)) {
      fieldErrors.value.endDate = 'End date cannot be before start date'
    }
  }
  if (!form.value.reason.trim()) fieldErrors.value.reason = 'Reason is required'
  else if (form.value.reason.trim().length < 5) fieldErrors.value.reason = 'Reason must be at least 5 characters'
  return Object.keys(fieldErrors.value).length === 0
}

const handleSubmit = async () => {
  error.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await leaveService.applyLeave(form.value)
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to submit request. Please try again.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = { leaveType: '', startDate: '', endDate: '', reason: '' }
  fieldErrors.value = {}
  error.value = ''
  success.value = false
}
</script>
