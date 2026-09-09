import { ref } from 'vue';
import { useRuntimeConfig } from '#app';

export const useUploadImage = () => {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiBase || 'http://localhost:3000';
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${apiUrl}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (e: any) {
      uploadError.value = e.message || 'An error occurred during upload';
      throw e;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    uploadError,
    uploadImage,
  };
};
