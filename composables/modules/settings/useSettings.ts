import { ref } from 'vue';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config';

export const useSettings = () => {
  const loading = ref(false);
  const settings = ref({ expressDeliveryFee: 1500 });

  const getSettings = async () => {
    loading.value = true;
    try {
      const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/settings');
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
      const response = await GATEWAY_ENDPOINT_WITH_AUTH.put('/settings', payload);
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
