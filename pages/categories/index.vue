<template>
  <div class="space-y-6 relative">
    <!-- Overlay & Modal for Category -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 class="text-xl font-bold text-slate-900">{{ editMode ? 'Edit Category' : 'Add New Category' }}</h2>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Category Name</label>
              <input v-model="form.name" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. Smoothies" />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Slug (Optional)</label>
              <input v-model="form.slug" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. smoothies" />
              <p class="text-xs text-slate-500 mt-1">Leave empty to auto-generate from name.</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea v-model="form.description" rows="2" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="Category details..."></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Icon (Emoji)</label>
                <input v-model="form.icon" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="🥤" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Color (Hex)</label>
                <div class="flex items-center gap-2">
                  <input v-model="form.color" type="color" class="w-10 h-10 p-1 border border-slate-300 rounded-lg shrink-0 cursor-pointer" />
                  <input v-model="form.color" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-mono text-sm uppercase" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Sort Order</label>
                <input v-model.number="form.sortOrder" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
              </div>
              <div class="flex items-center gap-2 mt-8">
                <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <label for="isActive" class="text-sm font-semibold text-slate-700">Active</label>
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ editMode ? 'Save Changes' : 'Create Category' }}
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
        <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Category?</h3>
        <p class="text-slate-500 text-sm mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
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
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
        <p class="text-sm text-slate-500 mt-1">Manage product categories to organize your store.</p>
      </div>
      <button @click="openCreateModal" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        <PlusIcon class="w-4 h-4" />
        New Category
      </button>
    </div>
    
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-semibold border-b border-slate-200 w-16 text-center">Order</th>
              <th class="p-4 font-semibold border-b border-slate-200">Category</th>
              <th class="p-4 font-semibold border-b border-slate-200">Slug</th>
              <th class="p-4 font-semibold border-b border-slate-200">Status</th>
              <th class="p-4 font-semibold border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <template v-if="loading">
              <tr v-for="i in 3" :key="`loading-${i}`" class="animate-pulse">
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-8 mx-auto"></div></td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
                    <div class="h-4 bg-slate-200 rounded w-32"></div>
                  </div>
                </td>
                <td class="p-4"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="p-4"><div class="h-6 bg-slate-200 rounded-full w-20"></div></td>
                <td class="p-4"><div class="h-8 bg-slate-200 rounded w-16 float-right"></div></td>
              </tr>
            </template>
            <template v-else-if="categories.length > 0">
              <tr class="transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50/50" v-for="category in categories" :key="category._id">
                <td class="p-4 text-center font-medium text-slate-400">{{ category.sortOrder }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border" :style="{ backgroundColor: category.color + '20', borderColor: category.color + '40' }">
                      {{ category.icon || '📁' }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-900">{{ category.name }}</div>
                      <div class="text-xs text-slate-500 truncate w-48">{{ category.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 font-mono text-xs text-slate-500">{{ category.slug }}</td>
                <td class="p-4">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                    category.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  ]">
                    <span :class="['w-1.5 h-1.5 rounded-full', category.isActive ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(category)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Category">
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button @click="handleDelete(category._id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Category">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="5" class="p-12 text-center text-slate-500">
                  <FolderTreeIcon class="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p class="text-lg font-medium text-slate-700">No categories found</p>
                  <p class="text-sm mt-1">Create your first category to get started.</p>
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
import { ref, onMounted } from 'vue';
import { PlusIcon, EditIcon, TrashIcon, XIcon, FolderTreeIcon } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { showToast } = useCustomToast();

const loading = ref(true);
const categories = ref<any[]>([]);

const showModal = ref(false);
const editMode = ref(false);
const isSubmitting = ref(false);
const form = ref({
  _id: '',
  name: '',
  slug: '',
  description: '',
  icon: '🥤',
  color: '#10b981',
  isActive: true,
  sortOrder: 0
});

const showConfirmModal = ref(false);
const isDeleting = ref(false);
const categoryToDelete = ref('');

const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/categories');
    categories.value = res.data;
  } catch (error) {
    console.error('Failed to fetch categories', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});

const openCreateModal = () => {
  editMode.value = false;
  form.value = { 
    _id: '', name: '', slug: '', description: '', icon: '🥤', color: '#10b981', isActive: true, sortOrder: 0
  };
  showModal.value = true;
};

const openEditModal = (category: any) => {
  editMode.value = true;
  form.value = { ...category };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = { ...form.value };
    if (!payload.slug) delete payload.slug;
    
    if (editMode.value) {
      await GATEWAY_ENDPOINT_WITH_AUTH.put(`/categories/${payload._id}`, payload);
      showToast({ title: 'Success', message: 'Category updated successfully', type: 'success' });
    } else {
      await GATEWAY_ENDPOINT_WITH_AUTH.post('/categories', payload);
      showToast({ title: 'Success', message: 'Category created successfully', type: 'success' });
    }
    closeModal();
    await fetchCategories();
  } catch (e: any) {
    showToast({ title: 'Error', message: 'Failed to save category', type: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = (id: string) => {
  categoryToDelete.value = id;
  showConfirmModal.value = true;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    await GATEWAY_ENDPOINT_WITH_AUTH.delete(`/categories/${categoryToDelete.value}`);
    showConfirmModal.value = false;
    showToast({ title: 'Deleted', message: 'Category has been removed', type: 'success' });
    await fetchCategories();
  } catch (e: any) {
    showToast({ title: 'Error', message: 'Failed to delete category', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};
</script>
