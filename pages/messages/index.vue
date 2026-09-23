<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Support Messages</h1>
      <p class="text-slate-500 mt-2">Manage customer inquiries and contact form submissions.</p>
    </div>

    <!-- Messages List -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-slate-500">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading messages...
      </div>
      
      <div v-else-if="messages.length === 0" class="p-16 text-center text-slate-500">
        <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <p class="text-lg font-medium text-slate-900">No messages found</p>
        <p class="mt-1">You're all caught up!</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Sender Info</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[300px]">Subject & Message</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="msg in messages" :key="msg._id" class="hover:bg-slate-50/50 transition-colors" :class="{ 'bg-blue-50/20': msg.status === 'unread' }">
              <td class="px-6 py-4 align-top">
                <div class="w-32">
                  <select
                    v-model="msg.status"
                    @change="updateStatus(msg._id, msg.status)"
                    class="block w-full text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors py-2 px-3 bg-white"
                    :class="{
                      'text-blue-600': msg.status === 'unread',
                      'text-slate-600': msg.status === 'read',
                      'text-green-600': msg.status === 'replied'
                    }"
                  >
                    <option v-for="option in statusOptions" :key="option.id" :value="option.id">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </td>
              <td class="px-6 py-4 align-top">
                <div class="font-bold text-slate-900 mb-1 whitespace-nowrap">{{ msg.fullName }}</div>
                <div class="flex flex-col gap-1.5">
                  <a :href="`mailto:${msg.email}`" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors group">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span class="group-hover:underline">{{ msg.email }}</span>
                  </a>
                  <a v-if="msg.phone" :href="`tel:${msg.phone}`" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors group">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span class="group-hover:underline">{{ msg.phone }}</span>
                  </a>
                </div>
              </td>
              <td class="px-6 py-4 align-top">
                <div class="font-bold text-slate-900 mb-1">{{ msg.subject }}</div>
                <div class="text-sm text-slate-600 whitespace-pre-wrap">{{ msg.message }}</div>
              </td>
              <td class="px-6 py-4 align-top">
                <div class="text-sm text-slate-500 whitespace-nowrap">
                  {{ new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                </div>
                <div class="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                  {{ new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
                </div>
              </td>
              <td class="px-6 py-4 align-top text-right space-x-2">
                <a :href="`mailto:${msg.email}?subject=Re: ${msg.subject}`" class="inline-flex items-center justify-center p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors" title="Reply via Email">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>
                <a v-if="msg.phone" :href="`tel:${msg.phone}`" class="inline-flex items-center justify-center p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors" title="Call User">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GATEWAY_ENDPOINT } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

useHead({
  title: 'Support Messages - Lapadia Admin',
});

const { showToast } = useCustomToast();
const loading = ref(true);
const messages = ref<any[]>([]);

const statusOptions = [
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
  { id: 'replied', label: 'Replied' }
];

const fetchMessages = async () => {
  loading.value = true;
  try {
    const response = await GATEWAY_ENDPOINT.get('/contacts');
    messages.value = response.data;
  } catch (error) {
    showToast({
      title: 'Error',
      message: 'Failed to load messages',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id: string, newStatus: string) => {
  try {
    await GATEWAY_ENDPOINT.patch(`/contacts/${id}/status`, { status: newStatus });
    showToast({
      title: 'Status Updated',
      message: 'Message status has been updated.',
      type: 'success'
    });
  } catch (error) {
    showToast({
      title: 'Error',
      message: 'Failed to update status',
      type: 'error'
    });
    // Revert status on failure by re-fetching
    fetchMessages();
  }
};

onMounted(() => {
  fetchMessages();
});
</script>
