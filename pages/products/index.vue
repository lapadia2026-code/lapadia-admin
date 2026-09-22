<template>
  <div class="space-y-6 relative">
    <!-- Overlay & Modal for Product -->
    <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
      <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 class="text-xl font-bold text-slate-900">{{ editMode ? 'Edit Product' : 'Add New Product' }}</h2>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <form class="flex flex-col flex-1 overflow-hidden" @submit.prevent="handleSubmit">
          <div class="p-6 overflow-y-auto flex-1 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input v-model="form.name" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. Fresh Tomatoes" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea v-model="form.description" rows="3" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="Product details..."></textarea>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Variants (Measurements, Prices & Stock)</label>
                <div class="space-y-3">
                  <div v-for="(variant, idx) in form.variants" :key="idx" class="flex gap-3 items-center">
                    <select v-model="variant.measurement" class="flex-1 px-4 py-2 border border-slate-300 rounded-lg" required>
                      <option value="" disabled>Select Measurement</option>
                      <option v-for="m in settings.possibleMeasurements || ['250CL', '500CL', '1 Litre']" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <input v-model.number="variant.price" type="number" required class="flex-1 px-4 py-2 border border-slate-300 rounded-lg" placeholder="Price (₦)" />
                    <input v-model.number="variant.stock" type="number" required class="w-24 px-4 py-2 border border-slate-300 rounded-lg" placeholder="Stock" />
                    <button type="button" @click="form.variants.splice(idx, 1)" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                  <button type="button" @click="form.variants.push({ measurement: '', price: 0, stock: 0 })" class="text-sm font-medium text-blue-600 hover:text-blue-800">
                    + Add Variant
                  </button>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Available Add-on Categories</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="cat in addonCategories" :key="cat._id" class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="checkbox" :value="cat._id" v-model="form.availableAddonCategories" class="rounded text-blue-600" />
                    <span class="text-sm font-medium text-slate-700">{{ cat.name }}</span>
                  </label>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Purchase Frequencies (For Subscription)</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="freq in (settings.subscriptionFrequencies || [])" :key="freq" class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="checkbox" :value="freq" v-model="form.purchaseFrequencies" class="rounded text-blue-600" />
                    <span class="text-sm font-medium text-slate-700">{{ freq }}</span>
                  </label>
                  <p v-if="!settings.subscriptionFrequencies || settings.subscriptionFrequencies.length === 0" class="text-sm text-slate-500 italic">No global subscription frequencies configured in settings.</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select v-model="form.category" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                  <option value="" disabled>Select category...</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Type</label>
                <select v-model="form.productType" required class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
                  <option value="regular">Regular Product</option>
                  <option value="subscription">Subscription Product</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Icon (Emoji)</label>
                <input v-model="form.icon" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="🍅" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Images</label>
                <div class="flex flex-wrap items-center gap-4">
                  <!-- Existing / Uploaded Images Preview -->
                  <div v-for="(img, idx) in imagePreviews" :key="idx" class="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                    <img :src="img" class="w-full h-full object-cover" />
                    <button type="button" @click="removeImage(idx)" class="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white text-rose-500 rounded-lg shadow-sm transition-colors">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div class="flex-1 min-w-[200px]">
                    <input type="file" accept="image/*" multiple @change="handleMultipleImagesChange" class="hidden" ref="fileInput" />
                    <button type="button" @click="$refs.fileInput?.click()" class="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                      Add Images
                    </button>
                    <p class="text-xs text-slate-500 mt-2">Upload high-quality images (JPG, PNG). You can select multiple files.</p>
                  </div>
                </div>
              </div>

              <!-- Nutritional Information Section -->
              <div class="sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                <h3 class="text-md font-bold text-slate-800 mb-4">Nutritional Information & Ingredients</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Ingredients (Comma separated)</label>
                    <textarea v-model="form.ingredientsStr" rows="2" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. Water, Tomatoes, Salt"></textarea>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Allergens (Comma separated)</label>
                    <input v-model="form.allergensStr" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="e.g. Nuts, Dairy" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Calories</label>
                    <input v-model.number="form.nutritionalInfo.calories" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Protein (g)</label>
                    <input v-model.number="form.nutritionalInfo.protein" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Carbs (g)</label>
                    <input v-model.number="form.nutritionalInfo.carbs" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Fat (g)</label>
                    <input v-model.number="form.nutritionalInfo.fat" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Fiber (g)</label>
                    <input v-model.number="form.nutritionalInfo.fiber" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Sugar (g)</label>
                    <input v-model.number="form.nutritionalInfo.sugar" type="number" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" placeholder="0" />
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ editMode ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Teleport>

    <!-- Confirmation Modal -->
    <Teleport to="body">
    <div v-if="showConfirmModal" class="fixed inset-0 z-[110] flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
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
    </Teleport>

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
        <div class="relative">
          <button @click="showFilterMenu = !showFilterMenu" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shrink-0">
            <FilterIcon class="w-4 h-4" />
            Filter
          </button>
          
          <Teleport to="body">
          <div v-if="showFilterMenu" @click="showFilterMenu = false" class="fixed inset-0 z-40"></div>
          </Teleport>
          <div v-if="showFilterMenu" class="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select v-model="filterCategory" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">All Categories</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Stock Status</label>
                <select v-model="filterStock" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">All Statuses</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </div>
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
              <tr class="transition-colors border-b border-slate-50 last:border-0" v-for="product in filteredProducts" :key="product._id">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      <img v-if="product.imageUrl" :src="product.imageUrl" class="w-full h-full object-cover" />
                      <span v-else>{{ product.icon || '📦' }}</span>
                    </div>
                    <div>
                      <div class="font-medium text-slate-900 flex items-center gap-2">
                        {{ product.name }}
                        <span v-if="product.productType === 'subscription'" class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full uppercase font-bold tracking-wider">Subscription</span>
                        <span v-else class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full uppercase font-bold tracking-wider">Regular</span>
                      </div>
                      <div class="text-xs text-slate-500 truncate w-48">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-slate-600">{{ product.category }}</td>
                <td class="p-4 font-semibold text-emerald-600">
                  <span v-if="product.variants && product.variants.length > 0">
                    From ₦{{ Math.min(...product.variants.map(v => v.price || 0)).toLocaleString() }}
                  </span>
                  <span v-else>₦{{ (product.price || 0).toLocaleString() }}</span>
                </td>
                <td class="p-4 text-slate-600">
                  <span :class="(product.variants ? product.variants.reduce((a, b) => a + (b.stock || 0), 0) : product.stock) > 10 ? 'text-slate-600' : 'text-rose-600 font-medium'">
                    {{ product.variants ? product.variants.reduce((a, b) => a + (b.stock || 0), 0) : product.stock }}
                  </span>
                </td>
                <td class="p-4">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                    (product.variants ? product.variants.reduce((a, b) => a + (b.stock || 0), 0) : product.stock) > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  ]">
                    <span :class="['w-1.5 h-1.5 rounded-full', (product.variants ? product.variants.reduce((a, b) => a + (b.stock || 0), 0) : product.stock) > 0 ? 'bg-emerald-500' : 'bg-rose-500']"></span>
                    {{ (product.variants ? product.variants.reduce((a, b) => a + (b.stock || 0), 0) : product.stock) > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
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
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, PackageIcon, ImageIcon } from 'lucide-vue-next';
import { useGetProducts } from '~/composables/modules/products/useGetProducts';
import { useDeleteProduct } from '~/composables/modules/products/useDeleteProduct';
import { useCreateProduct } from '~/composables/modules/products/useCreateProduct';
import { useUpdateProduct } from '~/composables/modules/products/useUpdateProduct';
import { useCustomToast } from '~/composables/core/useCustomToast';
import { useUploadImage } from '~/composables/modules/upload/useUploadImage';
import { useSettings } from '~/composables/modules/settings/useSettings';
import { addonsApi } from '~/api_factory/modules/addons';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';

const { loading, products, getProducts } = useGetProducts();
const { deleteProduct } = useDeleteProduct();
const { createProduct } = useCreateProduct();
const { updateProduct } = useUpdateProduct();
const { showToast } = useCustomToast();
const { uploadImage, isUploading } = useUploadImage();
const { settings, getSettings } = useSettings();

const addonCategories = ref<any[]>([]);
const fetchAddonCategories = async () => {
  try {
    const res = await addonsApi.$_get_categories();
    addonCategories.value = res.data;
  } catch (err) {
    console.error('Failed to load addon categories', err);
  }
};

const categories = ref<any[]>([]);
const fetchCategories = async () => {
  try {
    const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/categories/active');
    categories.value = res.data;
  } catch (error) {
    console.error('Failed to load categories', error);
  }
};

const searchQuery = ref('');
const showFilterMenu = ref(false);
const filterCategory = ref('');
const filterStock = ref('');

const showModal = ref(false);
const editMode = ref(false);
const isSubmitting = ref(false);
const form = ref({
  _id: '',
  name: '',
  description: '',
  variants: [] as { measurement: string; price: number; stock: number }[],
  availableAddonCategories: [] as string[],
  purchaseFrequencies: [] as string[],
  category: '',
  categoryId: '',
  icon: '',
  imageUrl: '',
  images: [] as string[],
  ingredientsStr: '',
  allergensStr: '',
  productType: 'regular',
  nutritionalInfo: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    servingSize: '450ml'
  }
});

const showConfirmModal = ref(false);
const isDeleting = ref(false);
const productToDelete = ref('');

const fileInput = ref<HTMLInputElement | null>(null);
const imagePreviews = ref<string[]>([]);
const selectedFiles = ref<File[]>([]);

const handleMultipleImagesChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const filesArray = Array.from(target.files);
    filesArray.forEach(file => {
      selectedFiles.value.push(file);
      imagePreviews.value.push(URL.createObjectURL(file));
    });
  }
};

const removeImage = (index: number) => {
  // If the image being removed is already uploaded (has a remote URL in form.images)
  if (index < form.value.images.length) {
    form.value.images.splice(index, 1);
  } else {
    // If it's a newly selected local file
    const localIndex = index - form.value.images.length;
    selectedFiles.value.splice(localIndex, 1);
  }
  imagePreviews.value.splice(index, 1);
  if (fileInput.value) fileInput.value.value = '';
};

const clearImages = () => {
  selectedFiles.value = [];
  imagePreviews.value = [];
  form.value.imageUrl = '';
  form.value.images = [];
  if (fileInput.value) fileInput.value.value = '';
};

const openCreateModal = () => {
  editMode.value = false;
  form.value = { 
    _id: '', name: '', description: '', 
    variants: [{ measurement: '', price: 0, stock: 0 }], 
    availableAddonCategories: [], 
    purchaseFrequencies: [],
    category: '', categoryId: '', icon: '', imageUrl: '', images: [],
    ingredientsStr: '',
    allergensStr: '',
    productType: 'regular',
    nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, servingSize: '450ml' }
  };
  clearImages();
  showModal.value = true;
};

const openEditModal = (product: any) => {
  editMode.value = true;
  form.value = { 
    ...product,
    variants: product.variants?.length ? JSON.parse(JSON.stringify(product.variants)) : [{ measurement: '', price: 0, stock: 0 }],
    availableAddonCategories: product.availableAddonCategories ? [...product.availableAddonCategories] : [],
    purchaseFrequencies: product.purchaseFrequencies ? [...product.purchaseFrequencies] : [],
    images: product.images || [],
    ingredientsStr: product.ingredients ? product.ingredients.join(', ') : '',
    allergensStr: product.allergens ? product.allergens.join(', ') : '',
    nutritionalInfo: product.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, servingSize: '450ml' }
  };
  clearImages();
  // Preserve existing images
  if (product.images && product.images.length > 0) {
    form.value.images = [...product.images];
    imagePreviews.value = [...product.images];
  } else if (product.imageUrl) {
    form.value.images = [product.imageUrl];
    imagePreviews.value = [product.imageUrl];
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Upload newly selected files
    if (selectedFiles.value.length > 0) {
      for (const file of selectedFiles.value) {
        const uploadedUrl = await uploadImage(file);
        form.value.images.push(uploadedUrl);
      }
    }
    
    // Set imageUrl to the first image for backward compatibility
    if (form.value.images.length > 0) {
      form.value.imageUrl = form.value.images[0];
    }
    
    // Parse strings to arrays
    const selectedCategory = categories.value.find(c => c.name === form.value.category);
    
    const payload = {
      ...form.value,
      categoryId: selectedCategory ? selectedCategory._id : null,
      ingredients: form.value.ingredientsStr ? form.value.ingredientsStr.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      allergens: form.value.allergensStr ? form.value.allergensStr.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      productType: form.value.productType,
      price: form.value.variants && form.value.variants.length > 0 ? form.value.variants[0].price : 0
    };

    if (!editMode.value) {
      delete payload._id;
    }

    if (editMode.value) {
      await updateProduct(form.value._id, payload);
      showToast({ title: 'Success', message: 'Product updated successfully', type: 'success' });
    } else {
      await createProduct(payload);
      showToast({ title: 'Success', message: 'Product created successfully', type: 'success' });
    }
    closeModal();
    await getProducts({ type: 'regular' });
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to save product', type: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};

const filteredProducts = computed(() => {
  let result = products.value || [];
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p: any) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  
  if (filterCategory.value) {
    result = result.filter((p: any) => p.category === filterCategory.value || (p.category.includes('Meat') && filterCategory.value === 'Meat') || (p.category.includes('Dairy') && filterCategory.value === 'Dairy'));
  }
  
  if (filterStock.value === 'in-stock') {
    result = result.filter((p: any) => (p.variants ? p.variants.reduce((a: number, b: any) => a + (b.stock || 0), 0) : p.stock) > 0);
  } else if (filterStock.value === 'out-of-stock') {
    result = result.filter((p: any) => (p.variants ? p.variants.reduce((a: number, b: any) => a + (b.stock || 0), 0) : p.stock) <= 0);
  }
  
  // Strict separation: only show regular products
  result = result.filter((p: any) => p.productType !== 'subscription');
  
  return result;
});

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    getProducts({ type: 'regular' }),
    fetchAddonCategories(),
    getSettings()
  ]);
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
    await getProducts({ type: 'regular' });
  } catch (e: any) {
    showToast({ title: 'Error', message: 'Failed to delete product', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};
</script>
