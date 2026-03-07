<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8 animate-fade-in">
      <div>
        <h1 class="page-title">My Leave Requests</h1>
        <p class="page-subtitle">Track the status of all your leave applications</p>
      </div>
      <router-link to="/apply-leave" class="btn-primary flex items-center gap-2 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Request
      </router-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
      <div class="card p-4">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Total</p>
        <p class="text-2xl font-semibold text-white">{{ leaves.length }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Pending</p>
        <p class="text-2xl font-semibold text-amber-400">{{ countByStatus('Pending') }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Approved</p>
        <p class="text-2xl font-semibold text-emerald-400">{{ countByStatus('Approved') }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Rejected</p>
        <p class="text-2xl font-semibold text-red-400">{{ countByStatus('Rejected') }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg class="w-8 h-8 animate-spin text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="text-slate-500 text-sm">Loading your requests...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card p-8 text-center">
      <p class="text-red-400">{{ error }}</p>
      <button @click="fetchLeaves" class="btn-secondary mt-4">Try Again</button>
    </div>

    <!-- Empty -->
    <div v-else-if="leaves.length === 0" class="card p-12 text-center animate-fade-in">
      <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="font-display text-xl text-white mb-2">No requests yet</h3>
      <p class="text-slate-400 text-sm mb-6">You haven't submitted any leave requests.</p>
      <router-link to="/apply-leave" class="btn-primary inline-flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Apply for Leave
      </router-link>
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden animate-slide-up">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-800">
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Start</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">End</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Days</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            <tr
              v-for="leave in leaves"
              :key="leave._id"
              class="hover:bg-slate-800/30 transition-colors duration-150"
            >
              <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1.5">
                  <span>{{ typeEmoji(leave.leaveType) }}</span>
                  <span class="text-sm text-slate-300">{{ leave.leaveType }}</span>
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-slate-400 font-mono">{{ formatDate(leave.startDate) }}</td>
              <td class="px-5 py-4 text-sm text-slate-400 font-mono">{{ formatDate(leave.endDate) }}</td>
              <td class="px-5 py-4 text-sm text-slate-400">{{ calcDays(leave.startDate, leave.endDate) }}d</td>
              <td class="px-5 py-4">
                <p class="text-sm text-slate-400 max-w-xs truncate" :title="leave.reason">{{ leave.reason }}</p>
              </td>
              <td class="px-5 py-4">
                <span :class="statusBadge(leave.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(leave.status)"></span>
                  {{ leave.status }}
                </span>
                <button
                  v-if="leave.status === 'Rejected' && leave.rejectionReason"
                  @click="openRejectionReason(leave)"
                  class="ml-2 text-xs text-red-400 hover:text-red-300 underline"
                >
                  View reason
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rejection Reason Modal -->
    <transition name="modal">
      <div v-if="rejectionModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 rounded-2xl max-w-md w-full animate-slide-up">
          <div class="border-b border-slate-800 p-6 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-white">Rejection Reason</h2>
              <p class="text-xs text-slate-500 mt-1">{{ rejectionModal.leaveType }}</p>
            </div>
            <button @click="rejectionModal.show = false" class="text-slate-400 hover:text-slate-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <p class="text-slate-300 leading-relaxed text-sm">{{ rejectionModal.reason }}</p>
          </div>

          <div class="border-t border-slate-800 p-6 flex justify-end">
            <button
              @click="rejectionModal.show = false"
              class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { leaveService } from '@/services/api.js'

const leaves = ref([])
const loading = ref(true)
const error = ref('')
const rejectionModal = ref({ show: false, reason: '', leaveType: '' })

const fetchLeaves = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await leaveService.getMyLeaves()
    leaves.value = res.data.leaves
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load leave requests'
  } finally {
    loading.value = false
  }
}

const openRejectionReason = (leave) => {
  rejectionModal.value = {
    show: true,
    reason: leave.rejectionReason || 'No reason provided',
    leaveType: leave.leaveType,
  }
}

onMounted(fetchLeaves)

const countByStatus = (status) => leaves.value.filter((l) => l.status === status).length

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const calcDays = (start, end) => {
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  return diff > 0 ? diff : 1
}

const typeEmoji = (type) => {
  const map = { 'Sick Leave': '🤒', 'Casual Leave': '☀️', 'Vacation': '🏖️' }
  return map[type] || '📅'
}

const statusBadge = (status) => {
  const map = {
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
  }
  return map[status] || 'badge-pending'
}

const statusDot = (status) => {
  const map = {
    Pending: 'bg-amber-400',
    Approved: 'bg-emerald-400',
    Rejected: 'bg-red-400',
  }
  return map[status] || 'bg-amber-400'
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
