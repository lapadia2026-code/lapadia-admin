import { ref } from 'vue';
import { productsApi } from '@/api_factory/modules/products';

export const useGetProducts = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const products = ref<any[]>([]);

  const getProducts = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await productsApi.getProducts(params);
      products.value = data?.data || data || [];
      return products.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch products';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, products, getProducts };
};
