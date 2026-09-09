import { ref } from 'vue';
import { productsApi } from '@/api_factory/modules/products';

export const useCreateProduct = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createProduct = async (productData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await productsApi.createProduct(productData);
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to create product';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, createProduct };
};
