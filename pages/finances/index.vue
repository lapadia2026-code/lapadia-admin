<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Finances</h1>
        <p class="text-sm text-slate-500 mt-1">Manage your revenue, payouts, and financial reports.</p>
      </div>
      <button @click="downloadExcel" :disabled="downloading" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
        <DownloadIcon class="w-4 h-4" />
        {{ downloading ? 'Downloading...' : 'Download Report' }}
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ArrowUpRightIcon class="w-5 h-5 text-emerald-600" />
          </div>
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Income</span>
        </div>
        <div class="text-3xl font-bold text-slate-900">
          <span v-if="loading" class="animate-pulse bg-slate-200 rounded h-8 w-32 inline-block"></span>
          <span v-else>₦{{ stats.totalIncome.toLocaleString() }}</span>
        </div>
        <div class="mt-2 text-sm font-medium text-emerald-600">All-time Revenue</div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <WalletIcon class="w-5 h-5 text-blue-600" />
          </div>
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Available Balance</span>
        </div>
        <div class="text-3xl font-bold text-slate-900">
          <span v-if="loading" class="animate-pulse bg-slate-200 rounded h-8 w-32 inline-block"></span>
          <span v-else>₦{{ stats.availableBalance.toLocaleString() }}</span>
        </div>
        <button @click="showPayoutModal = true" class="mt-4 w-full bg-slate-900 text-white font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
          Request Payout
        </button>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <CreditCardIcon class="w-5 h-5 text-purple-600" />
          </div>
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</span>
        </div>
        <div class="text-3xl font-bold text-slate-900">
          <span v-if="loading" class="animate-pulse bg-slate-200 rounded h-8 w-32 inline-block"></span>
          <span v-else>₦{{ stats.totalExpenses.toLocaleString() }}</span>
        </div>
        <div class="mt-2 text-sm font-medium text-purple-600">Platform Fees & Refunds</div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 class="font-bold text-slate-800">Recent Transactions</h2>
      </div>
      
      <div v-if="loading" class="p-8 text-center animate-pulse">
        <div class="h-4 bg-slate-200 rounded w-1/4 mx-auto mb-4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
      
      <div v-else-if="transactions.length === 0" class="p-8 text-center text-slate-500">
        <BanknoteIcon class="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p class="text-lg font-medium text-slate-700">No recent transactions</p>
        <p class="text-sm mt-1">Your payout history and transactions will appear here.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200">Ref</th>
              <th class="p-4 font-semibold border-b border-slate-200">Customer</th>
              <th class="p-4 font-semibold border-b border-slate-200">Amount</th>
              <th class="p-4 font-semibold border-b border-slate-200">Date</th>
              <th class="p-4 font-semibold border-b border-slate-200">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-for="txn in transactions" :key="txn._id" class="transition-colors hover:bg-slate-50">
              <td class="p-4 text-slate-500 font-mono text-xs">{{ txn._id }}</td>
              <td class="p-4 text-slate-900 font-medium">{{ txn.guestName || txn.userId?.name || 'Guest' }}</td>
              <td class="p-4 text-emerald-600 font-semibold">₦{{ (txn.totalAmount || 0).toLocaleString() }}</td>
              <td class="p-4 text-slate-500">{{ new Date(txn.createdAt).toLocaleDateString() }}</td>
              <td class="p-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Paid
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payout Modal -->
    <div v-if="showPayoutModal" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="showPayoutModal = false"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div class="mb-5">
          <h3 class="text-lg font-bold text-slate-900 mb-2">Request Payout</h3>
          <p class="text-slate-500 text-sm leading-relaxed">Enter the amount you wish to withdraw from your available balance.</p>
        </div>
        
        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-700 mb-1">Amount (₦)</label>
          <input 
            type="number" 
            v-model="payoutAmount" 
            class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
            placeholder="e.g. 10000"
            :max="stats.availableBalance"
          />
        </div>
        
        <div class="flex items-center justify-end gap-3">
          <button 
            @click="showPayoutModal = false" 
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="requestPayout" 
            :disabled="requestingPayout || !payoutAmount || payoutAmount <= 0 || payoutAmount > stats.availableBalance"
            class="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {{ requestingPayout ? 'Requesting...' : 'Submit Request' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { DownloadIcon, ArrowUpRightIcon, WalletIcon, CreditCardIcon, BanknoteIcon } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { showToast } = useCustomToast();

const loading = ref(true);
const stats = ref({
  totalIncome: 0,
  availableBalance: 0,
  totalExpenses: 0
});
const transactions = ref<any[]>([]);

const downloading = ref(false);
const showPayoutModal = ref(false);
const payoutAmount = ref<number | null>(null);
const requestingPayout = ref(false);

const downloadExcel = async () => {
  downloading.value = true;
  try {
    const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/export/finances', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'finances.xlsx');
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

const requestPayout = async () => {
  if (!payoutAmount.value || payoutAmount.value <= 0) return;
  
  requestingPayout.value = true;
  try {
    await GATEWAY_ENDPOINT_WITH_AUTH.post('/finances/request-payout', { amount: payoutAmount.value });
    showToast({ title: 'Success', message: 'Payout requested successfully. We will process it shortly.', type: 'success' });
    showPayoutModal.value = false;
    payoutAmount.value = null;
    await fetchFinances();
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to request payout', type: 'error' });
  } finally {
    requestingPayout.value = false;
  }
};

const fetchFinances = async () => {
  loading.value = true;
  try {
    const [overviewRes, transactionsRes] = await Promise.all([
      GATEWAY_ENDPOINT_WITH_AUTH.get('/finances/overview'),
      GATEWAY_ENDPOINT_WITH_AUTH.get('/finances/transactions')
    ]);
    
    stats.value = overviewRes.data;
    transactions.value = transactionsRes.data;
  } catch (error) {
    console.error('Failed to fetch finances', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFinances();
});
</script>
