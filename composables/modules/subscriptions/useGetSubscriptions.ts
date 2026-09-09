import { ref } from 'vue';
import { subscriptionsApi } from '@/api_factory/modules/subscriptions';

export const useGetSubscriptions = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const subscriptions = ref<any[]>([]);

  const getSubscriptions = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await subscriptionsApi.getSubscriptions(params);
      subscriptions.value = data?.data || data || [];
      return subscriptions.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch subscriptions';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, subscriptions, getSubscriptions };
};
