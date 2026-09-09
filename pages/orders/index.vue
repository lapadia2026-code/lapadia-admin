<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p class="text-sm text-slate-500 mt-1">View and manage customer orders and their statuses.</p>
      </div>
      <button @click="downloadExcel" :disabled="downloading" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50">
        <span v-if="downloading" class="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></span>
        <DownloadIcon v-else class="w-4 h-4" />
        {{ downloading ? 'Exporting...' : 'Export CSV' }}
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50">
        <div class="relative w-full sm:w-96">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" v-model="searchQuery" placeholder="Search by order ID or customer..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm" />
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="relative">
            <button @click="showFilterMenu = !showFilterMenu" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
              <FilterIcon class="w-4 h-4" />
              Filter
            </button>
            
            <div v-if="showFilterMenu" @click="showFilterMenu = false" class="fixed inset-0 z-40"></div>
            <div v-if="showFilterMenu" class="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Status</label>
                  <select v-model="statusFilter" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Status</label>
                  <select v-model="orderStatusFilter" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="processing">Processing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
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
              <tr class="transition-colors border-b border-slate-50 last:border-0" v-for="order in filteredOrders" :key="order._id">
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
                  <div class="flex items-center justify-end gap-2">
                    <button @click="viewDetails(order)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button v-if="order.orderStatus !== 'delivered'" @click="markFulfilled(order)" class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark fulfilled">
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

    <!-- Order Details Modal -->
    <div v-if="showOrderModal && selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Order Details</h3>
            <p class="text-sm text-slate-500 mt-1">Ref: {{ selectedOrder._id }}</p>
          </div>
          <button @click="closeModal" class="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer</h4>
              <p class="font-medium text-slate-900">{{ selectedOrder.guestName || selectedOrder.userId?.name || 'Guest' }}</p>
              <p class="text-sm text-slate-500">{{ selectedOrder.guestEmail || selectedOrder.userId?.email || 'N/A' }}</p>
              <p class="text-sm text-slate-500">{{ selectedOrder.guestPhone || 'N/A' }}</p>
            </div>
            <div>
              <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Delivery Details</h4>
              <p class="text-sm text-slate-700 whitespace-pre-wrap">{{ selectedOrder.deliveryAddress || 'No address provided' }}</p>
              <p class="text-sm text-slate-500 mt-1">Time: <span class="capitalize">{{ selectedOrder.deliveryTime || 'Standard' }}</span></p>
            </div>
          </div>
          
          <div>
            <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Items</h4>
            <div class="border border-slate-100 rounded-lg overflow-hidden">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500">
                  <tr>
                    <th class="px-4 py-2 font-medium border-b border-slate-100">Product</th>
                    <th class="px-4 py-2 font-medium border-b border-slate-100">Qty</th>
                    <th class="px-4 py-2 font-medium border-b border-slate-100 text-right">Price</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="item in selectedOrder.items" :key="item._id">
                    <td class="px-4 py-3">{{ item.productId?.name || 'Unknown Product' }}</td>
                    <td class="px-4 py-3 text-slate-500">x{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-right font-medium">₦{{ (item.priceAtPurchase || 0).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <div>
              <span :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mr-2',
                selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              ]">{{ selectedOrder.paymentStatus }}</span>
              <span :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                selectedOrder.orderStatus === 'delivered' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'
              ]">{{ selectedOrder.orderStatus || 'processing' }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm text-slate-500">Total Amount</p>
              <p class="text-xl font-bold text-slate-900">₦{{ (selectedOrder.totalAmount || 0).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { DownloadIcon, SearchIcon, FilterIcon, EyeIcon, CheckCircleIcon, ShoppingCartIcon } from 'lucide-vue-next';
import { useGetOrders } from '~/composables/modules/orders/useGetOrders';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { loading, orders, getOrders } = useGetOrders();
const { showToast } = useCustomToast();

const searchQuery = ref('');
const statusFilter = ref('');
const orderStatusFilter = ref('');
const showFilterMenu = ref(false);
const downloading = ref(false);

const showOrderModal = ref(false);
const selectedOrder = ref<any>(null);

const viewDetails = (order: any) => {
  selectedOrder.value = order;
  showOrderModal.value = true;
};

const closeModal = () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
};

const markFulfilled = async (order: any) => {
  if (!confirm(`Mark order ${order._id} as fulfilled?`)) return;
  try {
    await GATEWAY_ENDPOINT_WITH_AUTH.patch(`/orders/${order._id}/status`, { orderStatus: 'delivered' });
    showToast({ title: 'Success', message: 'Order marked as fulfilled', type: 'success' });
    await getOrders();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to update order status', type: 'error' });
  }
};

const downloadExcel = async () => {
  downloading.value = true;
  try {
    const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/export/orders', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download excel', error);
    alert('Failed to download export file.');
  } finally {
    downloading.value = false;
  }
};

const filteredOrders = computed(() => {
  if (!orders.value) return [];
  let filtered = orders.value;

  if (statusFilter.value) {
    filtered = filtered.filter((o: any) => o.paymentStatus === statusFilter.value);
  }

  if (orderStatusFilter.value) {
    filtered = filtered.filter((o: any) => (o.orderStatus || 'processing') === orderStatusFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((o: any) => 
      o._id.toLowerCase().includes(q) || 
      (o.userId?.name && o.userId.name.toLowerCase().includes(q)) ||
      (o.userId?.email && o.userId.email.toLowerCase().includes(q)) ||
      (o.guestName && o.guestName.toLowerCase().includes(q)) ||
      (o.guestEmail && o.guestEmail.toLowerCase().includes(q))
    );
  }

  return filtered;
});

onMounted(() => {
  getOrders();
});
</script>
