import { ref } from 'vue';
import { addonsApi } from '@/api_factory/modules/addons';

export const useAddons = () => {
  const loading = ref(false);
  const categories = ref([] as any[]);
  const addons = ref([] as any[]);

  const getCategories = async () => {
    loading.value = true;
    try {
      const { data } = await addonsApi.$_get_categories();
      categories.value = data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (name: string) => {
    loading.value = true;
    try {
      await addonsApi.$_create_category({ name });
      await getCategories();
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    loading.value = true;
    try {
      await addonsApi.$_delete_category(id);
      await getCategories();
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getAddons = async (categoryId?: string) => {
    loading.value = true;
    try {
      const { data } = await addonsApi.$_get_addons(categoryId);
      addons.value = data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const createAddon = async (payload: any) => {
    loading.value = true;
    try {
      await addonsApi.$_create_addon(payload);
      await getAddons();
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteAddon = async (id: string) => {
    loading.value = true;
    try {
      await addonsApi.$_delete_addon(id);
      await getAddons();
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    categories,
    addons,
    getCategories,
    createCategory,
    deleteCategory,
    getAddons,
    createAddon,
    deleteAddon
  };
};
