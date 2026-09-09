import { ref } from 'vue';
import { ordersApi } from '@/api_factory/modules/orders';

export const useGetOrders = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const orders = ref<any[]>([]);

  const getOrders = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await ordersApi.getOrders(params);
      orders.value = data?.data || data || [];
      return orders.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch orders';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, orders, getOrders };
};
