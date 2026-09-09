<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p class="text-sm text-slate-500 mt-1">View and manage customer orders and their statuses.</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
        <DownloadIcon class="w-4 h-4" />
        Export CSV
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50">
        <div class="relative w-full sm:w-96">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" v-model="searchQuery" placeholder="Search by order ID or customer..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm" />
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <select v-model="statusFilter" class="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm font-medium">
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            <FilterIcon class="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200">Order Details</th>
              <th class="p-4 font-semibold border-b border-slate-200">Customer</th>
              <th class="p-4 font-semibold border-b border-slate-200">Payment Status</th>
              <th class="p-4 font-semibold border-b border-slate-200">Amount</th>
              <th class="p-4 font-semibold border-b border-slate-200">Date</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <template v-if="loading">
              <tr v-for="i in 5" :key="`loading-${i}`" class="animate-pulse">
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div class="space-y-2">
                      <div class="h-3 bg-slate-200 rounded w-24"></div>
                      <div class="h-2 bg-slate-200 rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td class="p-4"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="p-4"><div class="h-8 bg-slate-200 rounded w-16 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="filteredOrders.length > 0">
              <tr class="hover:bg-slate-50 transition-colors group" v-for="order in filteredOrders" :key="order._id">
                <td class="p-4">
                  <div class="font-medium text-slate-900">#ORD-{{ order._id.substring(order._id.length - 6).toUpperCase() }}</div>
                  <div class="text-xs text-slate-500">{{ order.items?.length || 0 }} items</div>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                      {{ order.userId?.name ? order.userId.name.substring(0, 2) : 'US' }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-800">{{ order.userId?.name || 'Guest' }}</div>
                      <div class="text-xs text-slate-500">{{ order.userId?.email || 'No email' }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                    order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  ]">
                    <span :class="['w-1.5 h-1.5 rounded-full', order.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500']"></span>
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td class="p-4 font-semibold text-emerald-600">₦{{ order.totalAmount?.toLocaleString() || '0' }}</td>
                <td class="p-4 text-slate-500">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark fulfilled">
                      <CheckCircleIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-12 text-center text-slate-500">
                  <ShoppingCartIcon class="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p class="text-lg font-medium text-slate-700">No orders found</p>
                  <p class="text-sm mt-1">Try adjusting your search or filters.</p>
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
import { ref, computed, onMounted } from 'vue';
import { DownloadIcon, SearchIcon, FilterIcon, EyeIcon, CheckCircleIcon, ShoppingCartIcon } from 'lucide-vue-next';
import { useGetOrders } from '~/composables/modules/orders/useGetOrders';

const { loading, orders, getOrders } = useGetOrders();
const searchQuery = ref('');
const statusFilter = ref('');

const filteredOrders = computed(() => {
  if (!orders.value) return [];
  let filtered = orders.value;

  if (statusFilter.value) {
    filtered = filtered.filter((o: any) => o.paymentStatus === statusFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((o: any) => 
      o._id.toLowerCase().includes(q) || 
      (o.userId?.name && o.userId.name.toLowerCase().includes(q)) ||
      (o.userId?.email && o.userId.email.toLowerCase().includes(q))
    );
  }

  return filtered;
});

onMounted(() => {
  getOrders();
});
</script>
