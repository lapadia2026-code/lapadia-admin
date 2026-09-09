<template>
  <div class="min-h-screen bg-slate-50 flex overflow-hidden">
    <!-- Mobile Sidebar Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-slate-900/50 z-20 md:hidden" @click="isMobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 md:relative md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-6 font-bold text-xl tracking-wider border-b border-slate-800 text-white">
        <span>Lapadia</span>
        <button @click="isMobileMenuOpen = false" class="md:hidden text-slate-400 hover:text-white">
          <XIcon class="w-6 h-6" />
        </button>
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NuxtLink to="/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <LayoutDashboardIcon class="w-5 h-5" />
          Dashboard
        </NuxtLink>
        <NuxtLink to="/orders" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <ShoppingCartIcon class="w-5 h-5" />
          Orders
        </NuxtLink>
        <NuxtLink to="/subscriptions" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <RepeatIcon class="w-5 h-5" />
          Subscriptions
        </NuxtLink>
        <NuxtLink to="/products" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <PackageIcon class="w-5 h-5" />
          Products
        </NuxtLink>
        <NuxtLink to="/finances" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <BanknoteIcon class="w-5 h-5" />
          Finances
        </NuxtLink>
        <NuxtLink to="/settings" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <SettingsIcon class="w-5 h-5" />
          Settings
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-slate-800">
        <button @click="showLogoutModal = true" class="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors">
          <LogOutIcon class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
        <div class="flex items-center gap-4">
          <button @click="isMobileMenuOpen = true" class="md:hidden text-slate-500 hover:text-slate-900">
            <MenuIcon class="w-6 h-6" />
          </button>
          <h2 class="text-lg font-semibold text-slate-800 hidden sm:block">Overview</h2>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            A
          </div>
          <span class="text-sm font-medium text-slate-600 hidden sm:block">Admin User</span>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto p-4 sm:p-8">
        <slot />
      </div>
    </main>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="showLogoutModal = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-100">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <LogOutIcon class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold text-center text-slate-900 mb-2">Confirm Logout</h3>
        <p class="text-slate-500 text-center mb-6 text-sm">Are you sure you want to log out of the admin panel?</p>
        <div class="flex gap-3">
          <button @click="showLogoutModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">Cancel</button>
          <button @click="logout" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-rose-600/30">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  LayoutDashboardIcon, 
  ShoppingCartIcon, 
  PackageIcon, 
  BanknoteIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  RepeatIcon,
  SettingsIcon
} from 'lucide-vue-next';

const isMobileMenuOpen = ref(false);
const showLogoutModal = ref(false);
const router = useRouter();

const logout = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
  showLogoutModal.value = false;
  router.push('/auth/login');
};
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-600 text-white hover:bg-blue-600;
}
</style>
