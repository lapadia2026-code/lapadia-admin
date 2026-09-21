<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
      <p class="text-sm text-slate-500 mt-1">Configure global application settings and fees.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 overflow-x-auto pb-2 border-b border-slate-200">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
        class="pb-3 pt-1 px-1 border-b-2 font-medium whitespace-nowrap transition-colors"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
      <form @submit.prevent="saveSettings" class="space-y-6">
        
        <!-- General & Delivery -->
        <div v-show="activeTab === 'general'">
          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Delivery Configurations</h2>
          <div class="max-w-md space-y-2 mt-6 mb-8">
            <label class="block text-sm font-semibold text-slate-700">Standard Delivery Duration</label>
            <input 
              v-model="form.deliveryDuration" 
              type="text" 
              required 
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              placeholder="e.g., 30 - 45 Minutes" 
            />
            <p class="text-xs text-slate-500">This text will be shown to users at checkout.</p>
          </div>
          <div class="max-w-md space-y-2 mt-6 mb-8">
            <label class="block text-sm font-semibold text-slate-700">Business Notification Email</label>
            <input 
              v-model="form.businessNotificationEmail" 
              type="email" 
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              placeholder="e.g., hello@lapadia.com" 
            />
            <p class="text-xs text-slate-500">Order and subscription notifications will be sent to this email address.</p>
          </div>

          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Pickup Location</h2>
          <div class="max-w-2xl space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Store / Pickup Address</label>
            <input 
              v-model="form.pickupLocation" 
              type="text" 
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              placeholder="e.g. 15 Awolowo Road, Ikoyi, Lagos" 
            />
            <p class="text-xs text-slate-500">This address will be shown to users when they select 'Pickup' at checkout.</p>
          </div>
        </div>

        <!-- Products & Subscriptions -->
        <div v-show="activeTab === 'products'">
          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Product Variants Settings</h2>
          <div class="max-w-md space-y-4 mb-8">
            <label class="block text-sm font-semibold text-slate-700">Possible Measurements</label>
            <div class="flex flex-wrap gap-2">
              <div v-for="(item, index) in form.possibleMeasurements" :key="index" class="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span class="text-sm font-medium text-slate-700">{{ item }}</span>
                <button type="button" @click="removeMeasurement(index)" class="text-slate-400 hover:text-rose-500 transition-colors focus:outline-none">&times;</button>
              </div>
            </div>
            <div class="flex gap-2">
              <input 
                v-model="newMeasurement" 
                type="text" 
                @keyup.enter.prevent="addMeasurement"
                class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="e.g. 500CL" 
              />
              <button type="button" @click.prevent="addMeasurement" class="px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors">Add</button>
            </div>
            <p class="text-xs text-slate-500">List of measurements you want to be able to select when creating product variants.</p>
          </div>

          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Subscription Frequencies</h2>
          <div class="max-w-md space-y-4">
            <label class="block text-sm font-semibold text-slate-700">Available Frequencies</label>
            <div class="flex flex-wrap gap-2">
              <div v-for="(item, index) in form.subscriptionFrequencies" :key="index" class="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span class="text-sm font-medium text-slate-700">{{ item }}</span>
                <button type="button" @click="removeFrequency(index)" class="text-slate-400 hover:text-rose-500 transition-colors focus:outline-none">&times;</button>
              </div>
            </div>
            <div class="flex gap-2">
              <input 
                v-model="newFrequency" 
                type="text" 
                @keyup.enter.prevent="addFrequency"
                class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="e.g. Weekly" 
              />
              <button type="button" @click.prevent="addFrequency" class="px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors">Add</button>
            </div>
            <p class="text-xs text-slate-500">List of frequencies available for subscription plans and products.</p>
          </div>
        </div>

        <!-- Support Contacts -->
        <div v-show="activeTab === 'support'">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h2 class="text-lg font-bold text-slate-900">WhatsApp Support Contacts</h2>
            <button type="button" @click="addContact" class="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">+ Add Contact</button>
          </div>
          <div class="space-y-4 max-w-3xl">
            <div v-for="(contact, index) in form.supportContacts" :key="index" class="flex items-start gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50 relative group">
              <button type="button" @click="removeContact(index)" class="absolute -top-2 -right-2 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white">&times;</button>
              
              <div class="flex-1 space-y-2">
                <label class="block text-xs font-semibold text-slate-500 uppercase">Name</label>
                <input v-model="contact.name" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Ruth" />
              </div>
              
              <div class="w-24 space-y-2">
                <label class="block text-xs font-semibold text-slate-500 uppercase">Initials</label>
                <input v-model="contact.initials" type="text" maxlength="2" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase text-center" placeholder="R" />
              </div>
              
              <div class="flex-1 space-y-2">
                <label class="block text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <input v-model="contact.phone" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. 2348099431789" />
              </div>
            </div>
            <p v-if="form.supportContacts.length === 0" class="text-sm text-slate-500 italic">No support contacts added yet.</p>
          </div>
        </div>

        <!-- UI & Modals -->
        <div v-show="activeTab === 'ui'">
          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Welcome Modal Configuration</h2>
          <div class="space-y-4 max-w-2xl">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Modal Title</label>
              <input 
                v-model="form.welcomeModalConfig.title" 
                type="text" 
                class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Modal Subtitle</label>
              <textarea 
                v-model="form.welcomeModalConfig.subtitle" 
                rows="2"
                class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Carousel Title</label>
              <input 
                v-model="form.welcomeModalConfig.carouselTitle" 
                type="text" 
                class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Carousel Subtitle</label>
              <input 
                v-model="form.welcomeModalConfig.carouselSubtitle" 
                type="text" 
                class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              />
            </div>
            <div class="space-y-4">
              <label class="block text-sm font-semibold text-slate-700">Featured Subscriptions / Products</label>
              
              <!-- Currently Selected Items -->
              <div v-if="form.welcomeModalConfig.featuredItems.length > 0" class="space-y-2">
                <div v-for="(itemId, index) in form.welcomeModalConfig.featuredItems" :key="index" class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <img :src="getItemImage(itemId) || 'https://via.placeholder.com/150'" class="w-10 h-10 rounded-lg object-cover bg-slate-200 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-900 truncate">{{ getItemName(itemId) }}</p>
                      <p class="text-xs text-slate-500">{{ getItemType(itemId) }}</p>
                    </div>
                  </div>
                  <button type="button" @click="removeFeaturedItem(index)" class="ml-4 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
              <div v-else class="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                <p class="text-sm text-slate-500">No items featured. The top 5 popular items will be shown by default.</p>
              </div>

              <!-- Add New Item -->
              <div class="flex gap-2">
                <CoreCustomSelect
                  v-model="newFeaturedItem"
                  :options="availableFeaturedOptions"
                  placeholder="-- Select an item to feature --"
                  imageKey="image"
                  subLabelKey="subLabel"
                  class="flex-1"
                />
                <button type="button" @click="addFeaturedItem" :disabled="!newFeaturedItem" class="px-4 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors">
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4 border-t border-slate-100 flex items-center gap-4">
          <button 
            type="submit" 
            :disabled="loading" 
            class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSettings } from '~/composables/modules/settings/useSettings';
import { useCustomToast } from '~/composables/core/useCustomToast';
import { useGetProducts } from '~/composables/modules/products/useGetProducts';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';

const { loading, settings, getSettings, updateSettings } = useSettings();
const { products, getProducts } = useGetProducts();
const { showToast } = useCustomToast();
const allPlans = ref<any[]>([]);

const tabs = [
  { id: 'general', name: 'General & Delivery' },
  { id: 'products', name: 'Products & Subscriptions' },
  { id: 'support', name: 'Support Contacts' },
  { id: 'ui', name: 'UI & Modals' }
];

const activeTab = ref('general');

const form = ref({
  pickupLocation: '',
  deliveryDuration: '30 - 45 Minutes',
  businessNotificationEmail: '',
  possibleMeasurements: [] as string[],
  subscriptionFrequencies: [] as string[],
  supportContacts: [] as { name: string, phone: string, initials: string }[],
  welcomeModalConfig: {
    title: 'Welcome to LapadiaFresh',
    subtitle: 'Elevate your healthy lifestyle with our premium fruit subscriptions. Freshness delivered exactly when you need it.',
    carouselTitle: 'Explore Our Subscriptions',
    carouselSubtitle: 'Swipe to see what\'s trending',
    featuredItems: [] as string[]
  }
});

const newMeasurement = ref('');
const addMeasurement = () => {
  const val = newMeasurement.value.trim();
  if (val && !form.value.possibleMeasurements.includes(val)) {
    form.value.possibleMeasurements.push(val);
    newMeasurement.value = '';
  }
};
const removeMeasurement = (index: number) => {
  form.value.possibleMeasurements.splice(index, 1);
};

const newFrequency = ref('');
const addFrequency = () => {
  const val = newFrequency.value.trim();
  if (val && !form.value.subscriptionFrequencies.includes(val)) {
    form.value.subscriptionFrequencies.push(val);
    newFrequency.value = '';
  }
};
const removeFrequency = (index: number) => {
  form.value.subscriptionFrequencies.splice(index, 1);
};

// Featured Items Management
const newFeaturedItem = ref('');

const allFeaturedOptions = computed(() => {
  const plans = allPlans.value.map(p => ({
    id: p._id,
    label: p.name,
    subLabel: `₦${p.price?.toLocaleString()} • Subscription Plan`,
    image: p.image || (p.images && p.images[0])
  }));
  const prods = products.value.map(p => ({
    id: p._id || p.id,
    label: p.name,
    subLabel: `₦${p.price?.toLocaleString()} • Product`,
    image: p.image || (p.images && p.images[0])
  }));
  return [...plans, ...prods];
});

const availableFeaturedOptions = computed(() => {
  return allFeaturedOptions.value.filter(opt => !form.value.welcomeModalConfig.featuredItems.includes(opt.id));
});

const getItemName = (id: string) => {
  const plan = allPlans.value.find(p => p._id === id);
  if (plan) return plan.name;
  const prod = products.value.find(p => (p._id || p.id) === id);
  if (prod) return prod.name;
  return 'Unknown Item';
};

const getItemImage = (id: string) => {
  const plan = allPlans.value.find(p => p._id === id);
  if (plan) return plan.image || (plan.images && plan.images[0]);
  const prod = products.value.find(p => (p._id || p.id) === id);
  if (prod) return prod.image || (prod.images && prod.images[0]);
  return null;
};

const getItemType = (id: string) => {
  if (allPlans.value.find(p => p._id === id)) return 'Subscription Plan';
  if (products.value.find(p => (p._id || p.id) === id)) return 'Product';
  return '';
};

const addFeaturedItem = () => {
  if (newFeaturedItem.value && !form.value.welcomeModalConfig.featuredItems.includes(newFeaturedItem.value)) {
    form.value.welcomeModalConfig.featuredItems.push(newFeaturedItem.value);
    newFeaturedItem.value = '';
  }
};

const removeFeaturedItem = (index: number) => {
  form.value.welcomeModalConfig.featuredItems.splice(index, 1);
};

const addContact = () => {
  form.value.supportContacts.push({ name: '', phone: '', initials: '' });
};

const removeContact = (index: number) => {
  form.value.supportContacts.splice(index, 1);
};

onMounted(async () => {
  await Promise.all([
    getSettings(),
    getProducts(),
    (async () => {
      try {
        const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/subscriptions/plans');
        allPlans.value = res.data?.data || res.data || [];
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    })()
  ]);
  form.value.pickupLocation = settings.value.pickupLocation || '';
  form.value.deliveryDuration = settings.value.deliveryDuration || '30 - 45 Minutes';
  form.value.businessNotificationEmail = settings.value.businessNotificationEmail || '';
  
  if (settings.value.possibleMeasurements) {
    form.value.possibleMeasurements = [...settings.value.possibleMeasurements];
  }
  if (settings.value.subscriptionFrequencies) {
    form.value.subscriptionFrequencies = [...settings.value.subscriptionFrequencies];
  }
  if (settings.value.supportContacts) {
    form.value.supportContacts = [...settings.value.supportContacts];
  }
  if (settings.value.welcomeModalConfig) {
    form.value.welcomeModalConfig = { ...settings.value.welcomeModalConfig };
  }
});

const saveSettings = async () => {
  try {
    await updateSettings({ 
      supportContacts: form.value.supportContacts,
      subscriptionFrequencies: form.value.subscriptionFrequencies,
      pickupLocation: form.value.pickupLocation,
      deliveryDuration: form.value.deliveryDuration,
      businessNotificationEmail: form.value.businessNotificationEmail,
      possibleMeasurements: form.value.possibleMeasurements,
      welcomeModalConfig: form.value.welcomeModalConfig
    });
    showToast({ title: 'Success', message: 'Settings updated successfully.', type: 'success' });
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to update settings.', type: 'error' });
  }
};
</script>
