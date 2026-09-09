<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Subscription Plans</h1>
        <p class="text-sm text-slate-500 mt-1">Manage subscription plans available to customers.</p>
      </div>
      <button @click="openCreateModal" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        <PlusIcon class="w-4 h-4" />
        New Plan
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200">Plan Name</th>
              <th class="p-4 font-semibold border-b border-slate-200">Price</th>
              <th class="p-4 font-semibold border-b border-slate-200">Frequency</th>
              <th class="p-4 font-semibold border-b border-slate-200">Popular</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <template v-if="loading">
              <tr v-for="i in 3" :key="`loading-${i}`" class="animate-pulse">
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-32"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-12"></div></td>
                <td class="p-4"><div class="h-8 bg-slate-200 rounded w-16 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="plans.length > 0">
              <tr class="hover:bg-slate-50 transition-colors group" v-for="plan in plans" :key="plan._id">
                <td class="p-4">
                  <div class="font-medium text-slate-900">{{ plan.name }}</div>
                  <div class="text-xs text-slate-500 truncate w-48">{{ plan.description }}</div>
                </td>
                <td class="p-4 font-semibold text-emerald-600">₦{{ plan.price?.toLocaleString() }}</td>
                <td class="p-4 text-slate-600 capitalize">{{ plan.frequency }}</td>
                <td class="p-4">
                  <span v-if="plan.isPopular" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Yes
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(plan)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button @click="handleDelete(plan._id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="5" class="p-12 text-center text-slate-500">
                  <p class="text-lg font-medium text-slate-700">No subscription plans</p>
                  <p class="text-sm mt-1">Create your first plan to get started.</p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h2 class="text-xl font-bold text-slate-900">{{ isEditing ? 'Edit Plan' : 'New Plan' }}</h2>
        </div>
        <form @submit.prevent="savePlan" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Weekly Basic" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Price (₦)</label>
              <input v-model.number="form.price" type="number" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <select v-model="form.frequency" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Features (comma separated)</label>
            <input v-model="form.featuresStr" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10-15 Fresh items, Free Delivery" />
          </div>

          <div class="flex items-center gap-2 mt-2">
            <input v-model="form.isPopular" type="checkbox" id="isPopular" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
            <label for="isPopular" class="text-sm font-medium text-slate-700">Mark as Most Popular</label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save Plan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';

const loading = ref(true);
const saving = ref(false);
const plans = ref<any[]>([]);

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentPlanId = ref('');

const form = ref({
  name: '',
  price: 0,
  frequency: 'weekly',
  description: '',
  featuresStr: '',
  isPopular: false
});

const fetchPlans = async () => {
  loading.value = true;
  try {
    const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/subscriptions/plans');
    plans.value = res.data;
  } catch (error) {
    console.error('Failed to fetch plans', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPlans();
});

const openCreateModal = () => {
  isEditing.value = false;
  currentPlanId.value = '';
  form.value = { name: '', price: 0, frequency: 'weekly', description: '', featuresStr: '', isPopular: false };
  isModalOpen.value = true;
};

const openEditModal = (plan: any) => {
  isEditing.value = true;
  currentPlanId.value = plan._id;
  form.value = {
    name: plan.name,
    price: plan.price,
    frequency: plan.frequency,
    description: plan.description,
    featuresStr: (plan.features || []).join(', '),
    isPopular: plan.isPopular
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const savePlan = async () => {
  saving.value = true;
  try {
    const payload = {
      ...form.value,
      features: form.value.featuresStr.split(',').map(s => s.trim()).filter(s => s)
    };
    
    if (isEditing.value) {
      await GATEWAY_ENDPOINT_WITH_AUTH.put(`/subscriptions/plans/${currentPlanId.value}`, payload);
    } else {
      await GATEWAY_ENDPOINT_WITH_AUTH.post('/subscriptions/plans', payload);
    }
    
    closeModal();
    await fetchPlans();
  } catch (error) {
    console.error('Failed to save plan', error);
    alert('Failed to save plan');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this plan?')) {
    try {
      await GATEWAY_ENDPOINT_WITH_AUTH.delete(`/subscriptions/plans/${id}`);
      await fetchPlans();
    } catch (e) {
      alert('Failed to delete plan.');
    }
  }
};
</script>
