<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    router.push('/dashboard');
  } else {
    router.push('/auth/login');
  }
});
</script>
