import { ref } from 'vue';
import { ordersApi } from '~/api_factory/modules/orders';

export const useGetStats = () => {
  const loading = ref(false);
  const stats = ref({ totalOrders: 0, revenue: 0 });
  const error = ref('');

  const getStats = async () => {
    loading.value = true;
    error.value = '';
    try {
      const res = await ordersApi.getStats();
      stats.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch stats';
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, error, getStats };
};
