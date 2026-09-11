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
              <th class="p-4 font-semibold border-b border-slate-200">Linked Products</th>
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
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-12"></div></td>
                <td class="p-4"><div class="h-8 bg-slate-200 rounded w-16 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="plans.length > 0">
              <tr class="transition-colors border-b border-slate-50 last:border-0" v-for="plan in plans" :key="plan._id">
                <td class="p-4">
                  <div class="font-medium text-slate-900">{{ plan.name }}</div>
                  <div class="text-xs text-slate-500 truncate w-48">{{ plan.description }}</div>
                </td>
                <td class="p-4 font-semibold text-emerald-600">₦{{ plan.price?.toLocaleString() }}</td>
                <td class="p-4 text-slate-600 capitalize">{{ plan.frequency }}</td>
                <td class="p-4 text-slate-600">
                  <!-- Show productIds if available, fallback to legacy productId -->
                  <div v-if="plan.productIds && plan.productIds.length > 0" class="flex flex-wrap gap-1.5">
                    <div v-for="prod in plan.productIds" :key="prod._id" class="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full pl-0.5 pr-2 py-0.5">
                      <img v-if="prod.images?.[0]" :src="prod.images[0]" class="w-5 h-5 rounded-full object-cover" />
                      <div v-else class="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                        <PackageIcon class="w-3 h-3 text-slate-400" />
                      </div>
                      <span class="text-xs font-medium text-slate-600 truncate max-w-[80px]">{{ prod.name }}</span>
                    </div>
                  </div>
                  <div v-else-if="plan.productId" class="flex items-center gap-2">
                    <img v-if="plan.productId.images?.[0]" :src="plan.productId.images[0]" class="w-6 h-6 rounded object-cover" />
                    <span class="truncate w-32" :title="plan.productId.name">{{ plan.productId.name }}</span>
                  </div>
                  <span v-else class="text-slate-400 italic">None</span>
                </td>
                <td class="p-4">
                  <span v-if="plan.isPopular" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Yes
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
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
                <td colspan="6" class="p-12 text-center text-slate-500">
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
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 class="text-xl font-bold text-slate-900">{{ isEditing ? 'Edit Plan' : 'New Plan' }}</h2>
          <button @click="closeModal" class="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="savePlan" class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Plan Name</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all" placeholder="e.g. Weekly Basic" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Price (₦)</label>
                <input v-model.number="form.price" type="number" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Frequency</label>
                <select v-model="form.frequency" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <!-- Multi-Product Selector -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Linked Products</label>
              <p class="text-xs text-slate-400 mb-3">Select the products included in this subscription plan.</p>
              
              <!-- Selected Products Chips -->
              <div v-if="form.productIds.length > 0" class="flex flex-wrap gap-2 mb-3">
                <div 
                  v-for="prodId in form.productIds" 
                  :key="prodId" 
                  class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full pl-1 pr-2 py-1 group"
                >
                  <img 
                    v-if="getProductById(prodId)?.images?.[0]" 
                    :src="getProductById(prodId).images[0]" 
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  <div v-else class="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                    <PackageIcon class="w-3 h-3 text-emerald-600" />
                  </div>
                  <span class="text-xs font-semibold text-emerald-800 max-w-[120px] truncate">{{ getProductById(prodId)?.name || 'Product' }}</span>
                  <button type="button" @click="removeProduct(prodId)" class="p-0.5 text-emerald-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <XIcon class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div v-else class="text-xs text-slate-400 italic mb-3 bg-slate-50 rounded-lg px-3 py-2 border border-dashed border-slate-200">No products selected yet. Pick from the list below.</div>

              <!-- Product Search -->
              <div class="relative mb-2">
                <SearchIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input v-model="productSearch" type="text" placeholder="Search products..." class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all" />
              </div>
              
              <!-- Product Grid -->
              <div class="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-slate-50/50">
                <div v-if="filteredProducts.length === 0" class="p-4 text-center text-sm text-slate-400">
                  No products found.
                </div>
                <div 
                  v-for="prod in filteredProducts" 
                  :key="prod._id"
                  @click="toggleProduct(prod._id)"
                  :class="[
                    'flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all border-b border-slate-100 last:border-0',
                    isProductSelected(prod._id) 
                      ? 'bg-emerald-50 hover:bg-emerald-100' 
                      : 'bg-white hover:bg-slate-50'
                  ]"
                >
                  <div class="relative flex-shrink-0">
                    <img 
                      v-if="prod.images?.[0]" 
                      :src="prod.images[0]" 
                      class="w-10 h-10 rounded-lg object-cover border border-slate-100"
                    />
                    <div v-else class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <PackageIcon class="w-5 h-5 text-slate-400" />
                    </div>
                    <!-- Checkmark overlay -->
                    <div v-if="isProductSelected(prod._id)" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                      <CheckIcon class="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-slate-800 truncate">{{ prod.name }}</div>
                    <div class="text-xs text-slate-400">₦{{ prod.price?.toLocaleString() }}</div>
                  </div>
                  <div :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    isProductSelected(prod._id)
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300 bg-white'
                  ]">
                    <CheckIcon v-if="isProductSelected(prod._id)" class="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p class="text-xs text-slate-400 mt-1.5">{{ form.productIds.length }} product{{ form.productIds.length !== 1 ? 's' : '' }} selected</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea v-model="form.description" rows="2" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all"></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Features (comma separated)</label>
              <input v-model="form.featuresStr" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all" placeholder="e.g. 10-15 Fresh items, Free Delivery" />
            </div>

            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <input v-model="form.isPopular" type="checkbox" id="isPopular" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <label for="isPopular" class="text-sm font-medium text-slate-700">Mark as Most Popular</label>
              </div>
              <div class="flex items-center gap-2">
                <input v-model="form.allowSwaps" type="checkbox" id="allowSwaps" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <label for="allowSwaps" class="text-sm font-medium text-slate-700">Allow Product Swapping</label>
              </div>
            </div>

            <!-- Swappable Products Selector (only when allowSwaps is enabled) -->
            <div v-if="form.allowSwaps">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Swappable Products</label>
              <p class="text-xs text-slate-400 mb-3">Select the products users can swap between. These are the options shown in the user's swap modal.</p>

              <!-- Selected Swappable Products Chips -->
              <div v-if="form.swappableProductIds.length > 0" class="flex flex-wrap gap-2 mb-3">
                <div 
                  v-for="prodId in form.swappableProductIds" 
                  :key="'swap-' + prodId" 
                  class="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full pl-1 pr-2 py-1 group"
                >
                  <img 
                    v-if="getProductById(prodId)?.images?.[0]" 
                    :src="getProductById(prodId).images[0]" 
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  <div v-else class="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
                    <PackageIcon class="w-3 h-3 text-blue-600" />
                  </div>
                  <span class="text-xs font-semibold text-blue-800 max-w-[120px] truncate">{{ getProductById(prodId)?.name || 'Product' }}</span>
                  <button type="button" @click="removeSwappableProduct(prodId)" class="p-0.5 text-blue-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <XIcon class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div v-else class="text-xs text-slate-400 italic mb-3 bg-slate-50 rounded-lg px-3 py-2 border border-dashed border-slate-200">No swappable products selected yet. Pick from the list below.</div>

              <!-- Swappable Product Search -->
              <div class="relative mb-2">
                <SearchIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input v-model="swapProductSearch" type="text" placeholder="Search products..." class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 transition-all" />
              </div>

              <!-- Swappable Product Grid -->
              <div class="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-slate-50/50">
                <div v-if="filteredSwapProducts.length === 0" class="p-4 text-center text-sm text-slate-400">
                  No products found.
                </div>
                <div 
                  v-for="prod in filteredSwapProducts" 
                  :key="'swap-grid-' + prod._id"
                  @click="toggleSwappableProduct(prod._id)"
                  :class="[
                    'flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all border-b border-slate-100 last:border-0',
                    isSwappableProductSelected(prod._id) 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'bg-white hover:bg-slate-50'
                  ]"
                >
                  <div class="relative flex-shrink-0">
                    <img 
                      v-if="prod.images?.[0]" 
                      :src="prod.images[0]" 
                      class="w-10 h-10 rounded-lg object-cover border border-slate-100"
                    />
                    <div v-else class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <PackageIcon class="w-5 h-5 text-slate-400" />
                    </div>
                    <!-- Checkmark overlay -->
                    <div v-if="isSwappableProductSelected(prod._id)" class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                      <CheckIcon class="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-slate-800 truncate">{{ prod.name }}</div>
                    <div class="text-xs text-slate-400">₦{{ prod.price?.toLocaleString() }}</div>
                  </div>
                  <div :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    isSwappableProductSelected(prod._id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-300 bg-white'
                  ]">
                    <CheckIcon v-if="isSwappableProductSelected(prod._id)" class="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p class="text-xs text-slate-400 mt-1.5">{{ form.swappableProductIds.length }} swappable product{{ form.swappableProductIds.length !== 1 ? 's' : '' }} selected</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 shadow-sm">
              {{ saving ? 'Saving...' : 'Save Plan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <CoreConfirmModal
      :isOpen="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="executeConfirm"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PlusIcon, EditIcon, TrashIcon, XIcon, SearchIcon, CheckIcon, PackageIcon } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { showToast } = useCustomToast();

const loading = ref(true);
const saving = ref(false);
const plans = ref<any[]>([]);

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentPlanId = ref('');

const showConfirm = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmAction = ref<(() => void) | null>(null);

const requestConfirm = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirm.value = true;
};

const executeConfirm = () => {
  if (confirmAction.value) confirmAction.value();
  showConfirm.value = false;
};

const form = ref({
  name: '',
  price: 0,
  frequency: 'weekly',
  description: '',
  featuresStr: '',
  isPopular: false,
  allowSwaps: false,
  productId: '',
  productIds: [] as string[],
  swappableProductIds: [] as string[]
});

const productsList = ref<any[]>([]);
const productSearch = ref('');

const filteredProducts = computed(() => {
  const q = productSearch.value.toLowerCase().trim();
  if (!q) return productsList.value;
  return productsList.value.filter(p => p.name?.toLowerCase().includes(q));
});

const getProductById = (id: string) => {
  return productsList.value.find(p => p._id === id);
};

const isProductSelected = (id: string) => {
  return form.value.productIds.includes(id);
};

const toggleProduct = (id: string) => {
  const idx = form.value.productIds.indexOf(id);
  if (idx >= 0) {
    form.value.productIds.splice(idx, 1);
  } else {
    form.value.productIds.push(id);
  }
};

const removeProduct = (id: string) => {
  form.value.productIds = form.value.productIds.filter(pid => pid !== id);
};

const swapProductSearch = ref('');

const filteredSwapProducts = computed(() => {
  const q = swapProductSearch.value.toLowerCase().trim();
  if (!q) return productsList.value;
  return productsList.value.filter(p => p.name?.toLowerCase().includes(q));
});

const isSwappableProductSelected = (id: string) => {
  return form.value.swappableProductIds.includes(id);
};

const toggleSwappableProduct = (id: string) => {
  const idx = form.value.swappableProductIds.indexOf(id);
  if (idx >= 0) {
    form.value.swappableProductIds.splice(idx, 1);
  } else {
    form.value.swappableProductIds.push(id);
  }
};

const removeSwappableProduct = (id: string) => {
  form.value.swappableProductIds = form.value.swappableProductIds.filter(pid => pid !== id);
};

const fetchProducts = async () => {
  try {
    const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/products');
    productsList.value = res.data;
  } catch (error) {
    console.error('Failed to fetch products', error);
  }
};

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
  fetchProducts();
});

const openCreateModal = () => {
  isEditing.value = false;
  currentPlanId.value = '';
  productSearch.value = '';
  form.value = { name: '', price: 0, frequency: 'weekly', description: '', featuresStr: '', isPopular: false, allowSwaps: true, productId: '', productIds: [], swappableProductIds: [] };
  isModalOpen.value = true;
};

const openEditModal = (plan: any) => {
  isEditing.value = true;
  currentPlanId.value = plan._id;
  productSearch.value = '';
  
  // Build productIds from both new array and legacy single field
  let selectedIds: string[] = [];
  if (plan.productIds && plan.productIds.length > 0) {
    selectedIds = plan.productIds.map((p: any) => typeof p === 'string' ? p : p._id);
  } else if (plan.productId) {
    selectedIds = [typeof plan.productId === 'string' ? plan.productId : plan.productId._id];
  }
  
  // Build swappableProductIds
  let swappableIds: string[] = [];
  if (plan.swappableProductIds && plan.swappableProductIds.length > 0) {
    swappableIds = plan.swappableProductIds.map((p: any) => typeof p === 'string' ? p : p._id);
  }
  
  form.value = {
    name: plan.name,
    price: plan.price,
    frequency: plan.frequency,
    description: plan.description,
    featuresStr: (plan.features || []).join(', '),
    isPopular: plan.isPopular || false,
    allowSwaps: plan.allowSwaps !== false,
    productId: plan.productId ? (typeof plan.productId === 'string' ? plan.productId : plan.productId._id) : '',
    productIds: selectedIds,
    swappableProductIds: swappableIds
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const savePlan = async () => {
  saving.value = true;
  try {
    const payload: any = {
      name: form.value.name,
      price: form.value.price,
      frequency: form.value.frequency,
      description: form.value.description,
      features: form.value.featuresStr.split(',').map(s => s.trim()).filter(s => s),
      isPopular: form.value.isPopular,
      productIds: form.value.productIds,
      allowSwaps: form.value.allowSwaps,
      swappableProductIds: form.value.allowSwaps ? form.value.swappableProductIds : [],
      // Keep legacy productId as first selected product for backward compat
      productId: form.value.productIds.length > 0 ? form.value.productIds[0] : undefined
    };
    
    if (!payload.productId) delete payload.productId;
    
    if (isEditing.value) {
      await GATEWAY_ENDPOINT_WITH_AUTH.put(`/subscriptions/plans/${currentPlanId.value}`, payload);
    } else {
      await GATEWAY_ENDPOINT_WITH_AUTH.post('/subscriptions/plans', payload);
    }
    
    closeModal();
    await fetchPlans();
    showToast({ title: 'Success', message: 'Plan saved successfully', type: 'success' });
  } catch (error) {
    console.error('Failed to save plan', error);
    showToast({ title: 'Error', message: 'Failed to save plan', type: 'error' });
  } finally {
    saving.value = false;
  }
};

const handleDelete = (id: string) => {
  requestConfirm(
    'Delete Plan',
    'Are you sure you want to delete this plan?',
    async () => {
      try {
        await GATEWAY_ENDPOINT_WITH_AUTH.delete(`/subscriptions/plans/${id}`);
        showToast({ title: 'Success', message: 'Plan deleted successfully', type: 'success' });
        await fetchPlans();
      } catch (e) {
        showToast({ title: 'Error', message: 'Failed to delete plan.', type: 'error' });
      }
    }
  );
};
</script>
