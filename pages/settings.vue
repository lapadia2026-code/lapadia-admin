<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
      <p class="text-sm text-slate-500 mt-1">Configure global application settings and fees.</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
      <form @submit.prevent="saveSettings" class="space-y-6">
        <div>
          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Delivery Configurations</h2>
          <div class="max-w-md space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Express Delivery Fee (₦)</label>
            <input 
              v-model.number="form.expressDeliveryFee" 
              type="number" 
              required 
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
              placeholder="1500" 
            />
            <p class="text-xs text-slate-500">This fee is added to the user's cart total when they select Express Delivery at checkout.</p>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">WhatsApp Support Settings</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Support Contact 1</label>
              <input 
                v-model="form.whatsappNumber1" 
                type="text" 
                required 
                class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                placeholder="2348099431789" 
              />
              <p class="text-xs text-slate-500">First WhatsApp number to show for customer support.</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Support Contact 2</label>
              <input 
                v-model="form.whatsappNumber2" 
                type="text" 
                required 
                class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                placeholder="2348099431790" 
              />
              <p class="text-xs text-slate-500">Second WhatsApp number for alternative support.</p>
            </div>
          </div>
        </div>

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
import { ref, onMounted } from 'vue';
import { useSettings } from '~/composables/modules/settings/useSettings';
import { useCustomToast } from '~/composables/core/useCustomToast';

const { loading, settings, getSettings, updateSettings } = useSettings();
const { showToast } = useCustomToast();

const form = ref({
  expressDeliveryFee: 1500,
  whatsappNumber1: '',
  whatsappNumber2: ''
});

onMounted(async () => {
  await getSettings();
  form.value.expressDeliveryFee = settings.value.expressDeliveryFee;
  form.value.whatsappNumber1 = settings.value.whatsappNumber1 || '';
  form.value.whatsappNumber2 = settings.value.whatsappNumber2 || '';
});

const saveSettings = async () => {
  try {
    await updateSettings({ 
      expressDeliveryFee: form.value.expressDeliveryFee,
      whatsappNumber1: form.value.whatsappNumber1,
      whatsappNumber2: form.value.whatsappNumber2
    });
    showToast({ title: 'Success', message: 'Settings updated successfully.', type: 'success' });
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to update settings.', type: 'error' });
  }
};
</script>
