import { ref } from 'vue';
import { useNuxtApp } from '#app';

export const useSettings = () => {
  const { $api } = useNuxtApp();
  const loading = ref(false);
  const settings = ref({ expressDeliveryFee: 1500 });

  const getSettings = async () => {
    loading.value = true;
    try {
      const response = await $api.get('/settings');
      settings.value = response.data;
    } catch (e: any) {
      console.error('Failed to get settings', e);
    } finally {
      loading.value = false;
    }
  };

  const updateSettings = async (payload: any) => {
    loading.value = true;
    try {
      const response = await $api.put('/settings', payload);
      settings.value = response.data;
      return response.data;
    } catch (e: any) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { loading, settings, getSettings, updateSettings };
};
