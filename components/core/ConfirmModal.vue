<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="cancel"></div>
    <div class="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
      <div class="mb-5">
        <h3 class="text-lg font-bold text-slate-900 mb-2">{{ title }}</h3>
        <p class="text-slate-500 text-sm leading-relaxed">{{ message }}</p>
      </div>
      
      <div class="flex items-center justify-end gap-3">
        <button 
          @click="cancel" 
          class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="confirm" 
          :class="[
            'px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors',
            isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  isDanger: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => emit('confirm');
const cancel = () => emit('cancel');
</script>
