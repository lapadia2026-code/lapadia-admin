import { ref } from 'vue';
import { usersApi } from '@/api_factory/modules/users';

export const useGetUsers = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const users = ref<any[]>([]);

  const getUsers = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await usersApi.getUsers(params);
      users.value = data?.data || data || [];
      return users.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch users';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, users, getUsers };
};
