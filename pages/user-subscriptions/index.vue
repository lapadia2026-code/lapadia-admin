<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">User Subscriptions</h1>
        <p class="text-sm text-slate-500 mt-1">Manage user subscriptions, view their plans, and track billing dates.</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="statusFilter" class="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
        <button @click="downloadExcel" :disabled="downloading" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50">
          <span v-if="downloading" class="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></span>
          <DownloadIcon v-else class="w-4 h-4" />
          {{ downloading ? 'Exporting...' : 'Download Report' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200">Customer</th>
              <th class="p-4 font-semibold border-b border-slate-200">Plan</th>
              <th class="p-4 font-semibold border-b border-slate-200">Product</th>
              <th class="p-4 font-semibold border-b border-slate-200">Status</th>
              <th class="p-4 font-semibold border-b border-slate-200">Next Billing Date</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Created</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Actions</th>
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
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                <td class="p-4"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20 float-right"></div></td>
                <td class="p-4"><div class="h-8 bg-slate-200 rounded-lg w-16 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="filteredSubscriptions.length > 0">
              <tr class="transition-colors hover:bg-slate-50" v-for="sub in filteredSubscriptions" :key="sub._id">
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
                <td class="p-4 text-slate-900 font-medium">
                  <div>{{ sub.planId?.name || 'Custom Plan' }}</div>
                  <div class="text-xs text-slate-500 font-normal mt-0.5 capitalize">{{ sub.frequency || sub.planId?.frequency || 'N/A' }}</div>
                </td>
                <td class="p-4 text-slate-600">
                  <div v-if="sub.items?.length" class="flex flex-col gap-1.5">
                    <div v-for="(item, idx) in sub.items.slice(0, 2)" :key="idx" class="flex items-center gap-2">
                      <img v-if="item.productId?.images?.[0]" :src="item.productId.images[0]" class="w-6 h-6 rounded object-cover" />
                      <span class="truncate w-32 text-xs" :title="item.productId?.name">{{ item.productId?.name || 'Unknown' }}</span>
                    </div>
                    <div v-if="sub.items.length > 2" class="text-xs text-blue-600 font-medium">+{{ sub.items.length - 2 }} more</div>
                  </div>
                  <div v-else-if="sub.planId?.productIds?.length" class="flex flex-col gap-1.5">
                     <div v-for="(pid, idx) in sub.planId.productIds.slice(0, 2)" :key="idx" class="flex items-center gap-2">
                      <span class="truncate w-32 text-xs text-slate-400 italic">Plan Default</span>
                     </div>
                  </div>
                  <span v-else class="text-slate-400 italic">None</span>
                </td>
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
                <td class="p-4 text-slate-500">{{ sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleString() : 'N/A' }}</td>
                <td class="p-4 text-slate-500 text-right">{{ new Date(sub.createdAt).toLocaleString() }}</td>
                <td class="p-4 text-right">
                  <button @click="openManageModal(sub)" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg text-xs font-medium transition-colors">
                    Manage
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-12 text-center text-slate-500">
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

  <!-- Manage Status Modal -->
  <div v-if="isManageModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
      <div class="flex items-center justify-between p-6 border-b border-slate-100">
        <h3 class="text-lg font-bold text-slate-800">Manage Subscription</h3>
        <button @click="closeManageModal" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Subscription Status</label>
          <select v-model="selectedStatus" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <p class="mt-2 text-xs text-slate-500">Updating the status to cancelled will prevent future billing for this subscription.</p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
        <button @click="closeManageModal" class="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button @click="updateSubscriptionStatus" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { DownloadIcon } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { showToast } = useCustomToast();
const loading = ref(true);
const subscriptions = ref<any[]>([]);
const downloading = ref(false);
const statusFilter = ref('all');

const isManageModalOpen = ref(false);
const selectedSub = ref<any>(null);
const selectedStatus = ref('');
const saving = ref(false);

const filteredSubscriptions = computed(() => {
  if (statusFilter.value === 'all') return subscriptions.value;
  return subscriptions.value.filter(sub => sub.status === statusFilter.value);
});

const openManageModal = (sub: any) => {
  selectedSub.value = sub;
  selectedStatus.value = sub.status;
  isManageModalOpen.value = true;
};

const closeManageModal = () => {
  isManageModalOpen.value = false;
  selectedSub.value = null;
};

const updateSubscriptionStatus = async () => {
  if (!selectedSub.value) return;
  saving.value = true;
  try {
    const response = await GATEWAY_ENDPOINT_WITH_AUTH.put(`/subscriptions/admin/user-subscriptions/${selectedSub.value._id}/status`, {
      status: selectedStatus.value
    });
    
    // Update local state
    selectedSub.value.status = selectedStatus.value;
    showToast({ title: 'Success', message: 'Subscription status updated', type: 'success' });
    closeManageModal();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to update subscription', type: 'error' });
  } finally {
    saving.value = false;
  }
};

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
