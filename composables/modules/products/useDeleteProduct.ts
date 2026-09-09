import { ref } from 'vue';
import { productsApi } from '~/api_factory/modules/products';

export const useDeleteProduct = () => {
  const loading = ref(false);
  const error = ref('');

  const deleteProduct = async (id: string) => {
    loading.value = true;
    error.value = '';
    try {
      const res = await productsApi.deleteProduct(id);
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete product';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, deleteProduct };
};
