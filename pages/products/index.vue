<template>
  <div class="space-y-6 relative">
    <!-- Overlay & Modal for Product -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 class="text-xl font-bold text-slate-900">{{ editMode ? 'Edit Product' : 'Add New Product' }}</h2>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input v-model="form.name" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. Fresh Tomatoes" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea v-model="form.description" rows="3" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="Product details..."></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Price (₦)</label>
                <input v-model.number="form.price" type="number" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0.00" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Stock</label>
                <input v-model.number="form.stock" type="number" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select v-model="form.category" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                  <option value="" disabled>Select category...</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Meat">Meat</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Icon (Emoji)</label>
                <input v-model="form.icon" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="🍅" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                <input v-model="form.imageUrl" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="https://..." />
              </div>
            </div>
            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ editMode ? 'Save Changes' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-[110] flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="showConfirmModal = false"></div>
      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
        <div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrashIcon class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Product?</h3>
        <p class="text-slate-500 text-sm mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button @click="showConfirmModal = false" class="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="px-4 py-2 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2">
            <span v-if="isDeleting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
        <p class="text-sm text-slate-500 mt-1">Manage your store's inventory and product details.</p>
      </div>
      <button @click="openCreateModal" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        <PlusIcon class="w-4 h-4" />
        New Product
      </button>
    </div>
    
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50">
        <div class="relative w-full sm:w-96">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" v-model="searchQuery" placeholder="Search products..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm" />
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shrink-0">
          <FilterIcon class="w-4 h-4" />
          Filter
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200">Product</th>
              <th class="p-4 font-semibold border-b border-slate-200">Category</th>
              <th class="p-4 font-semibold border-b border-slate-200">Price</th>
              <th class="p-4 font-semibold border-b border-slate-200">Stock</th>
              <th class="p-4 font-semibold border-b border-slate-200">Status</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <template v-if="loading">
              <tr v-for="i in 5" :key="`loading-${i}`" class="animate-pulse">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-slate-200 rounded-lg"></div>
                    <div class="h-4 bg-slate-200 rounded w-32"></div>
                  </div>
                </td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-12"></div></td>
                <td class="p-4"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
                <td class="p-4"><div class="h-8 bg-slate-200 rounded w-16 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="filteredProducts.length > 0">
              <tr class="hover:bg-slate-50 transition-colors group" v-for="product in filteredProducts" :key="product._id">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      {{ product.icon || '📦' }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-900">{{ product.name }}</div>
                      <div class="text-xs text-slate-500 truncate w-48">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-slate-600">{{ product.category }}</td>
                <td class="p-4 font-semibold text-emerald-600">₦{{ product.price?.toLocaleString() }}</td>
                <td class="p-4 text-slate-600">
                  <span :class="product.stock > 10 ? 'text-slate-600' : 'text-rose-600 font-medium'">
                    {{ product.stock }}
                  </span>
                </td>
                <td class="p-4">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                    product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  ]">
                    <span :class="['w-1.5 h-1.5 rounded-full', product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500']"></span>
                    {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(product)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button @click="handleDelete(product._id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-12 text-center text-slate-500">
                  <PackageIcon class="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p class="text-lg font-medium text-slate-700">No products found</p>
                  <p class="text-sm mt-1">Try adjusting your search query.</p>
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
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, PackageIcon } from 'lucide-vue-next';
import { useGetProducts } from '~/composables/modules/products/useGetProducts';
import { useDeleteProduct } from '~/composables/modules/products/useDeleteProduct';
import { useCreateProduct } from '~/composables/modules/products/useCreateProduct';
import { useUpdateProduct } from '~/composables/modules/products/useUpdateProduct';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { loading, products, getProducts } = useGetProducts();
const { deleteProduct } = useDeleteProduct();
const { createProduct } = useCreateProduct();
const { updateProduct } = useUpdateProduct();
const { showToast } = useCustomToast();

const searchQuery = ref('');

const showModal = ref(false);
const editMode = ref(false);
const isSubmitting = ref(false);
const form = ref({
  _id: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  icon: '',
  imageUrl: ''
});

const showConfirmModal = ref(false);
const isDeleting = ref(false);
const productToDelete = ref('');

const openCreateModal = () => {
  editMode.value = false;
  form.value = { _id: '', name: '', description: '', price: 0, stock: 0, category: '', icon: '', imageUrl: '' };
  showModal.value = true;
};

const openEditModal = (product: any) => {
  editMode.value = true;
  form.value = { ...product };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (editMode.value) {
      await updateProduct(form.value._id, form.value);
      showToast({ title: 'Success', message: 'Product updated successfully', type: 'success' });
    } else {
      await createProduct(form.value);
      showToast({ title: 'Success', message: 'Product created successfully', type: 'success' });
    }
    closeModal();
    await getProducts();
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to save product', type: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};

const filteredProducts = computed(() => {
  if (!products.value) return [];
  if (!searchQuery.value) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter((p: any) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
});

onMounted(() => {
  getProducts();
});

const handleDelete = (id: string) => {
  productToDelete.value = id;
  showConfirmModal.value = true;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    await deleteProduct(productToDelete.value);
    showConfirmModal.value = false;
    showToast({ title: 'Deleted', message: 'Product has been removed', type: 'success' });
    await getProducts();
  } catch (e: any) {
    showToast({ title: 'Error', message: 'Failed to delete product', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};
</script>
