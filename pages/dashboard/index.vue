<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
          <DownloadIcon class="w-4 h-4" />
          Export
        </button>
        <NuxtLink to="/admin/products/create" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <PlusIcon class="w-4 h-4" />
          New Product
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-blue-200 transition-colors relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between z-10">
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
          <BanknoteIcon class="w-5 h-5 text-blue-500" />
        </div>
        <div class="mt-4 flex items-end justify-between z-10">
          <span class="text-3xl font-bold text-slate-900">
            <span v-if="loadingStats" class="animate-pulse bg-slate-200 h-8 w-24 block rounded"></span>
            <span v-else>₦{{ stats.revenue.toLocaleString() }}</span>
          </span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-purple-200 transition-colors relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between z-10">
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
          <ShoppingCartIcon class="w-5 h-5 text-purple-500" />
        </div>
        <div class="mt-4 flex items-end justify-between z-10">
          <span class="text-3xl font-bold text-slate-900">
            <span v-if="loadingStats" class="animate-pulse bg-slate-200 h-8 w-16 block rounded"></span>
            <span v-else>{{ stats.totalOrders.toLocaleString() }}</span>
          </span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-amber-200 transition-colors relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between z-10">
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Products</span>
          <PackageIcon class="w-5 h-5 text-amber-500" />
        </div>
        <div class="mt-4 flex items-end justify-between z-10">
          <span class="text-3xl font-bold text-slate-900">
            <span v-if="loadingProducts" class="animate-pulse bg-slate-200 h-8 w-16 block rounded"></span>
            <span v-else>{{ products?.length || 0 }}</span>
          </span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-emerald-200 transition-colors relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between z-10">
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">New Customers</span>
          <UsersIcon class="w-5 h-5 text-emerald-500" />
        </div>
        <div class="mt-4 flex items-end justify-between z-10">
          <span class="text-3xl font-bold text-slate-900">24</span>
          <span class="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+12%</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders Table -->
      <div class="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 class="font-bold text-slate-800 flex items-center gap-2">
            <ClockIcon class="w-5 h-5 text-slate-500" />
            Recent Orders
          </h2>
          <NuxtLink to="/admin/orders" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">View All</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th class="p-4 font-semibold border-b border-slate-100">Order ID</th>
                <th class="p-4 font-semibold border-b border-slate-100">Customer</th>
                <th class="p-4 font-semibold border-b border-slate-100">Status</th>
                <th class="p-4 font-semibold border-b border-slate-100">Amount</th>
                <th class="p-4 font-semibold border-b border-slate-100">Date</th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-100">
              <template v-if="loadingOrders">
                <tr v-for="i in 5" :key="`loading-${i}`" class="animate-pulse">
                  <td class="p-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                  <td class="p-4"><div class="h-8 bg-slate-200 rounded-full w-32"></div></td>
                  <td class="p-4"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
                  <td class="p-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                  <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                </tr>
              </template>
              <template v-else-if="orders && orders.length > 0">
                <tr class="hover:bg-slate-50 transition-colors group" v-for="order in orders" :key="order._id">
                  <td class="p-4 font-medium text-slate-700">#ORD-{{ order._id.substring(order._id.length - 6).toUpperCase() }}</td>
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
                  <td class="p-4 font-semibold text-slate-700">₦{{ order.totalAmount?.toLocaleString() || '0' }}</td>
                  <td class="p-4 text-slate-500">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5" class="p-8 text-center text-slate-500">No recent orders found.</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions / Top Products Snippet -->
      <div class="col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 class="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUpIcon class="w-5 h-5 text-slate-500" />
            Top Products
          </h2>
        </div>
        <div class="p-6 flex-1 flex flex-col gap-6">
          <div>
            <ul class="space-y-4">
              <template v-if="loadingProducts">
                <li class="flex items-center justify-between animate-pulse" v-for="j in 5" :key="`prod-load-${j}`">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-200"></div>
                    <div class="h-4 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div class="h-4 w-12 bg-slate-200 rounded"></div>
                </li>
              </template>
              <template v-else-if="products && products.length > 0">
                <li class="flex items-center justify-between" v-for="product in products.slice(0, 5)" :key="product._id">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                      {{ product.icon || '📦' }}
                    </div>
                    <div class="text-sm font-medium text-slate-700">{{ product.name }}</div>
                  </div>
                  <div class="text-sm font-semibold text-emerald-600">₦{{ product.price?.toLocaleString() }}</div>
                </li>
              </template>
              <template v-else>
                <li class="text-sm text-slate-500">No products found.</li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  DownloadIcon, 
  PlusIcon, 
  BanknoteIcon, 
  ShoppingCartIcon, 
  PackageIcon, 
  UsersIcon,
  ClockIcon,
  TrendingUpIcon
} from 'lucide-vue-next';

import { useGetOrders } from '~/composables/modules/orders/useGetOrders';
import { useGetStats } from '~/composables/modules/orders/useGetStats';
import { useGetProducts } from '~/composables/modules/products/useGetProducts';

const router = useRouter();
const { loading: loadingOrders, orders, getOrders } = useGetOrders();
const { loading: loadingStats, stats, getStats } = useGetStats();
const { loading: loadingProducts, products, getProducts } = useGetProducts();

onMounted(async () => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    router.push('/auth/login');
    return;
  }

  await Promise.all([
    getStats(),
    getOrders({ limit: 5 }),
    getProducts()
  ]);
});
</script>
