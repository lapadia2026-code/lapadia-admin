<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-slate-500">
          Sign in to manage products and orders.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="text-sm font-semibold text-slate-700">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="form.email"
              class="mt-1 appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
              placeholder="admin@lapadia.com" />
          </div>
          <div>
            <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
            <div class="relative mt-1">
              <input id="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required v-model="form.password"
                class="appearance-none relative block w-full px-4 py-3 pr-12 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                placeholder="••••••••" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none z-20">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors shadow-xl disabled:opacity-50">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
        <div v-if="error" class="text-rose-500 text-sm text-center font-medium">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { GATEWAY_ENDPOINT } from '~/api_factory/axios.config';

definePageMeta({
  layout: 'auth'
});

const router = useRouter();
const form = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await GATEWAY_ENDPOINT.post('/auth/login', form.value);
    if (res.data && res.data.access_token) {
      if (res.data.user.role !== 'admin') {
        error.value = 'Unauthorized. You are not an admin.';
        return;
      }
      localStorage.setItem('admin_token', res.data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>
