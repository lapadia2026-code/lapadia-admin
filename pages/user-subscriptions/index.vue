<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">User Subscriptions</h1>
        <p class="text-sm text-slate-500 mt-1">Manage user subscriptions, view their plans, and track billing dates.</p>
      </div>
      <button @click="downloadExcel" :disabled="downloading" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50">
        <span v-if="downloading" class="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></span>
        <DownloadIcon v-else class="w-4 h-4" />
        {{ downloading ? 'Exporting...' : 'Download Report' }}
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200">Customer</th>
              <th class="p-4 font-semibold border-b border-slate-200">Plan</th>
              <th class="p-4 font-semibold border-b border-slate-200">Status</th>
              <th class="p-4 font-semibold border-b border-slate-200">Next Billing Date</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Created</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <template v-if="loading">
              <tr v-for="i in 5" :key="`loading-${i}`" class="animate-pulse">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div class="space-y-2">
                      <div class="h-3 bg-slate-200 rounded w-24"></div>
                      <div class="h-2 bg-slate-200 rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                <td class="p-4"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="subscriptions.length > 0">
              <tr class="transition-colors hover:bg-slate-50" v-for="sub in subscriptions" :key="sub._id">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                      {{ sub.userId?.name ? sub.userId.name.substring(0, 2) : 'US' }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-800">{{ sub.userId?.name || 'Guest' }}</div>
                      <div class="text-xs text-slate-500">{{ sub.userId?.email || 'No email' }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-slate-900 font-medium">{{ sub.planId?.name || 'Custom Plan' }}</td>
                <td class="p-4">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                    sub.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    sub.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                  ]">
                    <span :class="['w-1.5 h-1.5 rounded-full', 
                      sub.status === 'active' ? 'bg-emerald-500' : 
                      sub.status === 'cancelled' ? 'bg-rose-500' : 'bg-slate-500'
                    ]"></span>
                    {{ sub.status }}
                  </span>
                </td>
                <td class="p-4 text-slate-500">{{ sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A' }}</td>
                <td class="p-4 text-slate-500 text-right">{{ new Date(sub.createdAt).toLocaleDateString() }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="5" class="p-12 text-center text-slate-500">
                  <p class="text-lg font-medium text-slate-700">No subscriptions found</p>
                  <p class="text-sm mt-1">User subscriptions will appear here.</p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DownloadIcon } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { showToast } = useCustomToast();
const loading = ref(true);
const subscriptions = ref<any[]>([]);
const downloading = ref(false);

const fetchSubscriptions = async () => {
  loading.value = true;
  try {
    const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/subscriptions/admin/user-subscriptions');
    subscriptions.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user subscriptions', error);
  } finally {
    loading.value = false;
  }
};

const downloadExcel = async () => {
  downloading.value = true;
  try {
    const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/export/subscriptions', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subscriptions.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download excel', error);
    showToast({ title: 'Error', message: 'Failed to download export file.', type: 'error' });
  } finally {
    downloading.value = false;
  }
};

onMounted(() => {
  fetchSubscriptions();
});
</script>
