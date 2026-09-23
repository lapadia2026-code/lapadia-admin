<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
      <p class="text-slate-500 mt-2">Manage all registered users on the platform.</p>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-slate-500">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading users...
      </div>
      
      <div v-else-if="users.length === 0" class="p-16 text-center text-slate-500">
        <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <p class="text-lg font-medium text-slate-900">No users found</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Email</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Role</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Auth Method</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Joined Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="user in users" :key="user._id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-medium text-slate-900 whitespace-nowrap">
                  {{ user.name || (user.firstName ? `${user.firstName} ${user.lastName}` : 'N/A') }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                <a :href="`mailto:${user.email}`" class="hover:text-blue-600 transition-colors">{{ user.email }}</a>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'"
                >
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="user.googleId || user.provider === 'google' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ user.googleId || user.provider === 'google' ? 'Google' : 'Email' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-500 whitespace-nowrap">
                  {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown' }}
                </div>
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
  title: 'Users - Lapadia Admin',
});

const { showToast } = useCustomToast();
const loading = ref(true);
const users = ref<any[]>([]);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await GATEWAY_ENDPOINT.get('/users');
    users.value = response.data;
  } catch (error) {
    showToast({
      title: 'Error',
      message: 'Failed to load users',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
