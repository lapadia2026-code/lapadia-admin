<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Add-ons Management</h1>
        <p class="text-sm text-slate-500 mt-1">Manage categories (e.g. Nuts) and specific items (e.g. Groundnut) for products.</p>
      </div>
      <div class="flex bg-slate-100 p-1 rounded-lg">
        <button 
          @click="activeTab = 'categories'" 
          :class="['px-4 py-2 text-sm font-medium rounded-md transition-all', activeTab === 'categories' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900']"
        >
          Categories
        </button>
        <button 
          @click="activeTab = 'addons'" 
          :class="['px-4 py-2 text-sm font-medium rounded-md transition-all', activeTab === 'addons' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900']"
        >
          Add-ons
        </button>
      </div>
    </div>

    <!-- Categories Tab -->
    <div v-if="activeTab === 'categories'" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-6 border-b border-slate-200">
        <form @submit.prevent="handleCreateCategory" class="flex gap-4">
          <input 
            v-model="newCategoryName" 
            required 
            placeholder="New Category Name (e.g. Nuts)" 
            class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button type="submit" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Add Category
          </button>
        </form>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ cat.name }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="handleDeleteCategory(cat._id)" class="text-rose-500 hover:text-rose-700 text-sm font-medium transition-colors">Delete</button>
              </td>
            </tr>
            <tr v-if="categories.length === 0 && !loading">
              <td colspan="2" class="px-6 py-8 text-center text-slate-500 text-sm">No categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add-ons Tab -->
    <div v-if="activeTab === 'addons'" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-6 border-b border-slate-200">
        <form @submit.prevent="handleCreateAddon" class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input 
            v-model="newAddon.name" 
            required 
            placeholder="Addon Name (e.g. Cashew)" 
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <input 
            v-model.number="newAddon.price" 
            type="number" 
            required 
            placeholder="Price (₦)" 
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <select 
            v-model="newAddon.categoryId" 
            required
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          >
            <option value="" disabled>Select Category</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
          <button type="submit" :disabled="loading || !newAddon.categoryId" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Add Addon
          </button>
        </form>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="addon in addons" :key="addon._id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ addon.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">₦{{ addon.price }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ addon.categoryId?.name || 'Unknown' }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="handleDeleteAddon(addon._id)" class="text-rose-500 hover:text-rose-700 text-sm font-medium transition-colors">Delete</button>
              </td>
            </tr>
            <tr v-if="addons.length === 0 && !loading">
              <td colspan="4" class="px-6 py-8 text-center text-slate-500 text-sm">No add-ons found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAddons } from '~/composables/modules/addons/useAddons';
import { useCustomToast } from '~/composables/core/useCustomToast';

const activeTab = ref('categories');

const { loading, categories, addons, getCategories, createCategory, deleteCategory, getAddons, createAddon, deleteAddon } = useAddons();
const { showToast } = useCustomToast();

const newCategoryName = ref('');
const newAddon = ref({ name: '', price: null as number | null, categoryId: '' });

onMounted(async () => {
  await getCategories();
  await getAddons();
});

const handleCreateCategory = async () => {
  try {
    await createCategory(newCategoryName.value);
    newCategoryName.value = '';
    showToast({ title: 'Success', message: 'Category added successfully', type: 'success' });
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to add category', type: 'error' });
  }
};

const handleDeleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    await deleteCategory(id);
    await getAddons(); // Refresh addons as some might have been deleted/orphaned
    showToast({ title: 'Success', message: 'Category deleted successfully', type: 'success' });
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to delete category', type: 'error' });
  }
};

const handleCreateAddon = async () => {
  if (!newAddon.value.categoryId) return;
  try {
    await createAddon(newAddon.value);
    newAddon.value = { name: '', price: null, categoryId: '' };
    showToast({ title: 'Success', message: 'Add-on created successfully', type: 'success' });
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to create add-on', type: 'error' });
  }
};

const handleDeleteAddon = async (id: string) => {
  if (!confirm('Are you sure you want to delete this add-on?')) return;
  try {
    await deleteAddon(id);
    showToast({ title: 'Success', message: 'Add-on deleted successfully', type: 'success' });
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to delete add-on', type: 'error' });
  }
};
</script>
