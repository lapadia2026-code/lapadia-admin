<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="[
          'px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 w-80 backdrop-blur-md border border-white/20',
          toast.type === 'success' ? 'bg-emerald-500/90 text-white' : '',
          toast.type === 'error' ? 'bg-rose-500/90 text-white' : '',
          toast.type === 'warning' ? 'bg-amber-500/90 text-white' : '',
          toast.type === 'info' || !toast.type ? 'bg-slate-800/90 text-white' : ''
        ]"
      >
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm leading-none mb-1">{{ toast.title }}</p>
          <p class="text-xs text-white/90 leading-snug break-words">{{ toast.message }}</p>
        </div>
        <button @click="removeToast(toast.id)" class="text-white/60 hover:text-white shrink-0 -mt-0.5">
          <XIcon class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useCustomToast } from '~/composables/core/useCustomToast';
import { XIcon } from 'lucide-vue-next';

const { toasts } = useCustomToast();

const removeToast = (id: string) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
