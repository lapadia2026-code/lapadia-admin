import { ref } from 'vue';
import { productsApi } from '~/api_factory/modules/products';

export const useUpdateProduct = () => {
  const loading = ref(false);
  const error = ref('');

  const updateProduct = async (id: string, payload: any) => {
    loading.value = true;
    error.value = '';
    try {
      const res = await productsApi.updateProduct(id, payload);
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update product';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, updateProduct };
};
