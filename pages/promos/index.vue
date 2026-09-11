<template>
  <div class="p-6">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Promo Codes</h1>
        <p class="text-slate-500 mt-1">Manage marketing promo codes and discounts.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <PlusIcon class="w-5 h-5" />
        Create Promo
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Discount</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Usage</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="5" class="px-6 py-8 text-center text-slate-400">Loading promos...</td>
            </tr>
            <tr v-else-if="promos.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-400">No promo codes found</td>
            </tr>
            <tr v-for="promo in promos" :key="promo._id" class="hover:bg-slate-50">
              <td class="px-6 py-4">
                <span class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{{ promo.code }}</span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-slate-900">
                {{ promo.discountType === 'percentage' ? promo.discountValue + '%' : '₦' + promo.discountValue }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-slate-900">{{ promo.usageCount }} uses</span>
                  <span class="text-xs text-slate-500" v-if="promo.maxUses">Limit: {{ promo.maxUses }}</span>
                  <span class="text-xs text-slate-500" v-else>Unlimited</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="promo.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'">
                  {{ promo.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="confirmDelete(promo)" class="text-rose-600 hover:text-rose-800 transition-colors p-1 rounded hover:bg-rose-50">
                  <TrashIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">Create Promo Code</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-500">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="createPromo" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Code</label>
            <input v-model="form.code" type="text" required class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono" placeholder="SUMMER20">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
              <select v-model="form.discountType" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Value</label>
              <input v-model="form.discountValue" type="number" min="1" required class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Max Uses (Optional)</label>
            <input v-model="form.maxUses" type="number" min="1" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Leave blank for unlimited">
          </div>
          <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
            <button type="submit" :disabled="creating" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
              {{ creating ? 'Creating...' : 'Create Promo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <CoreConfirmModal
      :is-open="showDeleteModal"
      title="Delete Promo Code"
      message="Are you sure you want to delete this promo code? This action cannot be undone."
      confirm-text="Delete"
      confirm-color="rose"
      @confirm="deletePromo"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusIcon, TrashIcon, XIcon } from 'lucide-vue-next';
import { useCustomToast } from '~/composables/core/useCustomToast';
import { useApi } from '~/composables/useApi';

const { showToast } = useCustomToast();
const { api } = useApi();
const loading = ref(true);
const promos = ref<any[]>([]);

const showCreateModal = ref(false);
const creating = ref(false);
const form = ref({
  code: '',
  discountType: 'percentage',
  discountValue: '',
  maxUses: ''
});

const showDeleteModal = ref(false);
const selectedPromo = ref<any>(null);

const fetchPromos = async () => {
  loading.value = true;
  try {
    const res = await api.get('/promos');
    promos.value = res.data;
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load promo codes', type: 'error' });
  } finally {
    loading.value = false;
  }
};

const createPromo = async () => {
  creating.value = true;
  try {
    const payload = {
      ...form.value,
      code: form.value.code.toUpperCase(),
      discountValue: Number(form.value.discountValue),
      maxUses: form.value.maxUses ? Number(form.value.maxUses) : null
    };
    
    await api.post('/promos', payload);
    showToast({ title: 'Success', message: 'Promo code created!', type: 'success' });
    showCreateModal.value = false;
    form.value = { code: '', discountType: 'percentage', discountValue: '', maxUses: '' };
    fetchPromos();
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to create promo', type: 'error' });
  } finally {
    creating.value = false;
  }
};

const confirmDelete = (promo: any) => {
  selectedPromo.value = promo;
  showDeleteModal.value = true;
};

const deletePromo = async () => {
  if (!selectedPromo.value) return;
  try {
    await api.delete(`/promos/${selectedPromo.value._id}`);
    showToast({ title: 'Deleted', message: 'Promo code deleted successfully', type: 'success' });
    fetchPromos();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to delete promo code', type: 'error' });
  } finally {
    showDeleteModal.value = false;
    selectedPromo.value = null;
  }
};

onMounted(() => {
  fetchPromos();
});
</script>
