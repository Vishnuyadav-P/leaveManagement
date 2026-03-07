<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <!-- Header -->
    <div class="mb-8 animate-fade-in">
      <h1 class="page-title">Leave Management</h1>
      <p class="page-subtitle">Review and manage all employee leave requests</p>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
      <div class="card p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-slate-500 uppercase tracking-wider">Total</p>
          <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-semibold text-white">{{ leaves.length }}</p>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-slate-500 uppercase tracking-wider">Pending</p>
          <div class="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-semibold text-amber-400">{{ countByStatus('Pending') }}</p>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-slate-500 uppercase tracking-wider">Approved</p>
          <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-semibold text-emerald-400">{{ countByStatus('Approved') }}</p>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-slate-500 uppercase tracking-wider">Rejected</p>
          <div class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-semibold text-red-400">{{ countByStatus('Rejected') }}</p>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 mb-5">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        @click="activeFilter = tab.value"
        :class="[
          'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
          activeFilter === tab.value
            ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
        ]"
      >
        {{ tab.label }}
        <span
          :class="['ml-1.5 text-xs', activeFilter === tab.value ? 'text-amber-400' : 'text-slate-600']"
        >{{ tab.value === 'All' ? leaves.length : countByStatus(tab.value) }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg class="w-8 h-8 animate-spin text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="text-slate-500 text-sm">Loading leave requests...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="fetchError" class="card p-8 text-center">
      <p class="text-red-400">{{ fetchError }}</p>
      <button @click="fetchLeaves" class="btn-secondary mt-4">Try Again</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredLeaves.length === 0" class="card p-12 text-center animate-fade-in">
      <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="font-display text-xl text-white mb-2">No requests found</h3>
      <p class="text-slate-400 text-sm">
        {{ activeFilter === 'All' ? 'No leave requests have been submitted yet.' : `No ${activeFilter.toLowerCase()} requests.` }}
      </p>
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden animate-slide-up">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-800">
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dates</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Days</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            <tr
              v-for="leave in filteredLeaves"
              :key="leave._id"
              @click="openPreview(leave)"
              class="hover:bg-slate-800/20 transition-colors duration-150 cursor-pointer"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-400/20">
                    <span class="text-amber-400 text-sm font-semibold">
                      {{ leave.employeeId?.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-200">{{ leave.employeeId?.name }}</p>
                    <p class="text-xs text-slate-500">{{ leave.employeeId?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1.5 text-sm text-slate-300">
                  {{ typeEmoji(leave.leaveType) }} {{ leave.leaveType }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="text-sm font-mono">
                  <p class="text-slate-300">{{ formatDate(leave.startDate) }}</p>
                  <p class="text-slate-500 text-xs">to {{ formatDate(leave.endDate) }}</p>
                </div>
              </td>
              <td class="px-5 py-4 text-sm text-slate-400">{{ calcDays(leave.startDate, leave.endDate) }}d</td>
              <td class="px-5 py-4">
                <p class="text-sm text-slate-400 max-w-[180px] truncate" :title="leave.reason">{{ leave.reason }}</p>
              </td>
              <td class="px-5 py-4">
                <span :class="statusBadge(leave.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(leave.status)"></span>
                  {{ leave.status }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div v-if="leave.status === 'Pending'" class="flex items-center gap-2">
                  <button
                    @click.stop="updateStatus(leave._id, 'Approved')"
                    :disabled="processingId === leave._id"
                    class="btn-success"
                  >
                    <svg v-if="processingId === leave._id" class="w-3 h-3 animate-spin inline" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span v-else>✓ Approve</span>
                  </button>
                  <button
                    @click.stop="openRejectDialog(leave)"
                    :disabled="processingId === leave._id"
                    class="btn-danger"
                  >
                    ✕ Reject
                  </button>
                </div>
                <span v-else-if="leave.status === 'Rejected'" class="text-xs text-slate-400">
                  <button @click.stop="openReviewReason(leave)" class="text-red-400 hover:text-red-300 underline">
                    View reason
                  </button>
                </span>
                <span v-else class="text-xs text-slate-600 italic">Processed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 z-50',
          toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        ]"
      >
        <svg v-if="toast.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Preview Modal -->
    <transition name="modal">
      <div v-if="previewModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
          <!-- Header -->
          <div class="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Leave Request Preview</h2>
              <p class="text-slate-400 text-sm mt-1">Review employee leave application</p>
            </div>
            <button @click="previewModal.show = false" class="text-slate-400 hover:text-slate-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="previewModal.leave" class="p-8 space-y-6">
            <!-- Employee Info Card -->
            <div class="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-400/30">
                  <span class="text-amber-400 text-lg font-semibold">
                    {{ previewModal.leave.employeeId?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-white">{{ previewModal.leave.employeeId?.name }}</h3>
                  <p class="text-sm text-slate-400">{{ previewModal.leave.employeeId?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Leave Details Card -->
            <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Leave Information</h3>
              <div class="space-y-4">
                <!-- Leave Type & Duration Row -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                    <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Leave Type</p>
                    <p class="text-white font-semibold flex items-center gap-2">
                      <span>{{ typeEmoji(previewModal.leave.leaveType) }}</span>
                      {{ previewModal.leave.leaveType }}
                    </p>
                  </div>
                  <div class="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                    <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Duration</p>
                    <p class="text-white font-semibold">{{ calcDays(previewModal.leave.startDate, previewModal.leave.endDate) }} days</p>
                  </div>
                </div>

                <!-- Date Range Row -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                    <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Start Date</p>
                    <p class="text-white font-semibold text-lg">{{ formatDate(previewModal.leave.startDate) }}</p>
                  </div>
                  <div class="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                    <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">End Date</p>
                    <p class="text-white font-semibold text-lg">{{ formatDate(previewModal.leave.endDate) }}</p>
                  </div>
                </div>

                <!-- Reason Section -->
                <div class="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                  <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Reason for Leave</p>
                  <p class="text-slate-200 text-sm leading-relaxed">{{ previewModal.leave.reason }}</p>
                </div>
              </div>
            </div>

            <!-- Status Section -->
            <div v-if="previewModal.leave.status !== 'Pending'" class="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
              <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Request Status</h3>
              <div class="flex items-center gap-3">
                <span :class="statusBadge(previewModal.leave.status)">
                  <span class="w-2 h-2 rounded-full" :class="statusDot(previewModal.leave.status)"></span>
                  {{ previewModal.leave.status }}
                </span>
                <p class="text-sm text-slate-400">Request has already been processed</p>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div v-if="previewModal.leave?.status === 'Pending'" class="border-t border-slate-700 bg-slate-800/50 p-6 flex items-center gap-3 justify-end">
            <button
              @click="previewModal.show = false"
              class="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              @click.stop="openRejectDialog(previewModal.leave)"
              :disabled="processingId === previewModal.leave._id"
              class="px-6 py-2.5 rounded-lg text-sm font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50"
            >
              ✕ Reject
            </button>
            <button
              @click="updateStatus(previewModal.leave._id, 'Approved')"
              :disabled="processingId === previewModal.leave._id"
              class="px-6 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="processingId === previewModal.leave._id" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span v-else>✓ Approve</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Reject Dialog -->
    <transition name="modal">
      <div v-if="rejectDialog.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 rounded-2xl max-w-md w-full animate-slide-up">
          <div class="border-b border-slate-800 p-6">
            <h2 class="text-xl font-semibold text-white">Reject Leave Request</h2>
            <p class="text-slate-400 text-sm mt-1">Provide a reason for rejection</p>
          </div>

          <div class="p-6 space-y-4">
            <div class="form-group">
              <label class="label">Rejection Reason</label>
              <textarea
                v-model="rejectDialog.reason"
                class="input-field min-h-[120px] resize-none"
                placeholder="Please provide a clear reason for rejection..."
              ></textarea>
              <p v-if="rejectDialog.reason.length < 5 && rejectDialog.reason.length > 0" class="text-xs text-red-400 mt-2">
                Minimum 5 characters required
              </p>
              <p class="text-xs text-slate-500 mt-2">{{ rejectDialog.reason.length }} characters</p>
            </div>
          </div>

          <div class="border-t border-slate-800 p-6 flex items-center gap-3 justify-end">
            <button
              @click="closeRejectDialog"
              class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitRejectReason"
              :disabled="rejectDialog.reason.length < 5 || processingId"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                rejectDialog.reason.length < 5
                  ? 'bg-red-500/30 text-red-300 cursor-not-allowed'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
              ]"
            >
              <svg v-if="processingId === rejectDialog.leaveId" class="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span v-else>Reject Request</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- View Rejection Reason Modal -->
    <transition name="modal">
      <div v-if="reasonModal.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 rounded-2xl max-w-md w-full animate-slide-up">
          <div class="border-b border-slate-800 p-6 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">Rejection Reason</h2>
            <button @click="reasonModal.show = false" class="text-slate-400 hover:text-slate-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="reasonModal.reason" class="p-6">
            <p class="text-slate-300 leading-relaxed">{{ reasonModal.reason }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { leaveService } from '@/services/api.js'

const leaves = ref([])
const loading = ref(true)
const fetchError = ref('')
const processingId = ref(null)
const activeFilter = ref('All')

const previewModal = ref({ show: false, leave: null })
const rejectDialog = ref({ show: false, leaveId: null, reason: '' })
const reasonModal = ref({ show: false, reason: '' })

const filterTabs = [
  { label: 'All Requests', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

const toast = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

const openPreview = (leave) => {
  previewModal.value = { show: true, leave }
}

const openRejectDialog = (leave) => {
  rejectDialog.value = { show: true, leaveId: leave._id, reason: '' }
}

const closeRejectDialog = () => {
  rejectDialog.value = { show: false, leaveId: null, reason: '' }
}

const openReviewReason = (leave) => {
  reasonModal.value = { show: true, reason: leave.rejectionReason || 'No reason provided' }
}

const submitRejectReason = async () => {
  if (rejectDialog.value.reason.length < 5) {
    showToast('Rejection reason must be at least 5 characters', 'error')
    return
  }

  processingId.value = rejectDialog.value.leaveId
  try {
    const res = await leaveService.updateLeaveStatus(
      rejectDialog.value.leaveId,
      'Rejected',
      rejectDialog.value.reason
    )
    const idx = leaves.value.findIndex((l) => l._id === rejectDialog.value.leaveId)
    if (idx !== -1) {
      leaves.value[idx] = res.data.leave
    }
    showToast('Leave rejected successfully', 'success')
    closeRejectDialog()
    previewModal.value.show = false
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to reject leave', 'error')
  } finally {
    processingId.value = null
  }
}

const filteredLeaves = computed(() => {
  if (activeFilter.value === 'All') return leaves.value
  return leaves.value.filter((l) => l.status === activeFilter.value)
})

const fetchLeaves = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await leaveService.getAllLeaves()
    leaves.value = res.data.leaves
  } catch (err) {
    fetchError.value = err.response?.data?.message || 'Failed to load leave requests'
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status) => {
  processingId.value = id
  try {
    const res = await leaveService.updateLeaveStatus(id, status)
    const idx = leaves.value.findIndex((l) => l._id === id)
    if (idx !== -1) {
      leaves.value[idx] = res.data.leave
    }
    showToast(`Leave ${status.toLowerCase()} successfully`, 'success')
    previewModal.value.show = false
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to update status', 'error')
  } finally {
    processingId.value = null
  }
}

onMounted(fetchLeaves)

const countByStatus = (status) => leaves.value.filter((l) => l.status === status).length

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const calcDays = (start, end) => {
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  return diff > 0 ? diff : 1
}

const typeEmoji = (type) => {
  const map = { 'Sick Leave': '🤒', 'Casual Leave': '☀️', 'Vacation': '🏖️' }
  return map[type] || '📅'
}

const statusBadge = (status) => {
  const map = { Pending: 'badge-pending', Approved: 'badge-approved', Rejected: 'badge-rejected' }
  return map[status] || 'badge-pending'
}

const statusDot = (status) => {
  const map = { Pending: 'bg-amber-400', Approved: 'bg-emerald-400', Rejected: 'bg-red-400' }
  return map[status] || 'bg-amber-400'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
