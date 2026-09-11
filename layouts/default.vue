<template>
  <div class="min-h-screen bg-slate-50 flex overflow-hidden">
    <!-- Mobile Sidebar Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-slate-900/50 z-20 md:hidden" @click="isMobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-30 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 md:relative md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        isSidebarCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-4 font-bold text-xl tracking-wider border-b border-slate-800 text-white">
        <div class="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <img src="@/assets/img/logo.jpg" class="h-10 w-10 shrink-0 rounded-full object-cover" />
          <span v-if="!isSidebarCollapsed" class="text-sm">Lapadia Fresh</span>
        </div>
        <button @click="isMobileMenuOpen = false" class="md:hidden text-slate-400 hover:text-white">
          <XIcon class="w-6 h-6" />
        </button>
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        <NuxtLink to="/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Dashboard' : ''">
          <LayoutDashboardIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/orders" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Orders' : ''">
          <ShoppingCartIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Orders</span>
        </NuxtLink>
        <NuxtLink to="/subscriptions" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Subscription Plans' : ''">
          <RepeatIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Subscription Plans</span>
        </NuxtLink>
        <NuxtLink to="/user-subscriptions" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'User Subscriptions' : ''">
          <UsersIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">User Subscriptions</span>
        </NuxtLink>
        <NuxtLink to="/products" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Products' : ''">
          <PackageIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Products</span>
        </NuxtLink>
        <NuxtLink to="/categories" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Categories' : ''">
          <FolderTreeIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Categories</span>
        </NuxtLink>
        <NuxtLink to="/promos" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Promo Codes' : ''">
          <TagIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Promo Codes</span>
        </NuxtLink>
        <NuxtLink to="/blogs" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Blogs' : ''">
          <NewspaperIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Blogs</span>
        </NuxtLink>
        <NuxtLink to="/events" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Events' : ''">
          <CalendarIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Events</span>
        </NuxtLink>
        <NuxtLink to="/finances" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Finances' : ''">
          <BanknoteIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Finances</span>
        </NuxtLink>
        <NuxtLink to="/settings" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Settings' : ''">
          <SettingsIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Settings</span>
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-slate-800">
        <button @click="showLogoutModal = true" class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors" :title="isSidebarCollapsed ? 'Logout' : ''">
          <LogOutIcon class="w-5 h-5 shrink-0" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Logout</span>
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
          <button @click="isSidebarCollapsed = !isSidebarCollapsed" class="hidden md:block text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-lg transition-colors">
            <ChevronLeftIcon v-if="!isSidebarCollapsed" class="w-5 h-5" />
            <ChevronRightIcon v-else class="w-5 h-5" />
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
  FolderTreeIcon,
  TagIcon, 
  NewspaperIcon, 
  CalendarIcon, 
  SettingsIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon,
  RefreshCwIcon,
  BanknoteIcon,
  BoxIcon,
  RepeatIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-vue-next';

const isMobileMenuOpen = ref(false);
const isSidebarCollapsed = ref(false);
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
