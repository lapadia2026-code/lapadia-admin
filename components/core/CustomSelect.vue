<template>
  <div class="relative w-full" ref="dropdownRef">
    <button 
      type="button" 
      @click="toggleDropdown" 
      class="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="disabled"
    >
      <span v-if="selectedOption" class="flex items-center gap-3 truncate">
        <img v-if="imageKey && selectedOption[imageKey]" :src="selectedOption[imageKey] || 'https://via.placeholder.com/150'" class="w-6 h-6 rounded-md object-cover flex-shrink-0 bg-slate-100" />
        <span class="text-slate-900 font-medium truncate">{{ getDisplayLabel(selectedOption) }}</span>
      </span>
      <span v-else class="text-slate-500 truncate">{{ placeholder }}</span>
      <svg class="w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </button>
    
    <div v-if="isOpen" class="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col" :class="dropdownClass">
      <!-- Search Input -->
      <div v-if="searchable" class="p-2 border-b border-slate-100 bg-slate-50/50">
        <div class="relative">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            ref="searchInputRef"
            v-model="searchQuery" 
            type="text" 
            placeholder="Search..." 
            class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            @click.stop
          />
        </div>
      </div>
      
      <!-- Options List -->
      <div class="overflow-y-auto max-h-64 p-2 custom-scrollbar">
        <div v-if="filteredOptions.length === 0" class="p-4 text-center text-sm text-slate-500">
          No results found
        </div>
        <button 
          v-else
          v-for="(option, index) in filteredOptions" 
          :key="index" 
          type="button"
          @click="selectOption(option)"
          class="w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors hover:bg-slate-50"
          :class="{ 'bg-blue-50 text-blue-700': isSelected(option) }"
        >
          <img v-if="imageKey && option[imageKey]" :src="option[imageKey] || 'https://via.placeholder.com/150'" class="w-8 h-8 rounded-md object-cover flex-shrink-0 bg-slate-100" />
          <div class="min-w-0 flex-1 flex flex-col justify-center">
            <span class="text-sm font-medium truncate" :class="{ 'text-blue-700': isSelected(option), 'text-slate-900': !isSelected(option) }">
              {{ getDisplayLabel(option) }}
            </span>
            <span v-if="subLabelKey && option[subLabelKey]" class="text-xs truncate text-slate-500">
              {{ option[subLabelKey] }}
            </span>
          </div>
          <svg v-if="isSelected(option)" class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean],
    default: ''
  },
  options: {
    type: Array as () => any[],
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label' // Used if options are objects
  },
  valueKey: {
    type: String,
    default: 'id' // Used if options are objects
  },
  imageKey: {
    type: String,
    default: '' // Used to display an image thumbnail
  },
  subLabelKey: {
    type: String,
    default: '' // Optional secondary text
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  searchable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dropdownClass: {
    type: String,
    default: ''
  },
  returnObject: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
    if (props.searchable) {
      nextTick(() => {
        searchInputRef.value?.focus();
      });
    }
  }
};

const closeDropdown = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const isObject = (val: any) => val !== null && typeof val === 'object';

const getDisplayLabel = (option: any) => {
  if (isObject(option)) {
    return option[props.labelKey] || 'Unknown';
  }
  return option;
};

const getOptionValue = (option: any) => {
  if (props.returnObject) return option;
  if (isObject(option)) {
    return option[props.valueKey];
  }
  return option;
};

const selectedOption = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') return null;
  
  return props.options.find(opt => {
    if (props.returnObject) {
      return opt === props.modelValue || (isObject(opt) && isObject(props.modelValue) && opt[props.valueKey] === (props.modelValue as any)[props.valueKey]);
    }
    const val = getOptionValue(opt);
    return val === props.modelValue;
  });
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(opt => {
    const label = getDisplayLabel(opt).toString().toLowerCase();
    return label.includes(query);
  });
});

const isSelected = (option: any) => {
  if (props.returnObject) {
    if (!props.modelValue) return false;
    if (isObject(option) && isObject(props.modelValue)) {
      return option[props.valueKey] === (props.modelValue as any)[props.valueKey];
    }
    return option === props.modelValue;
  }
  return getOptionValue(option) === props.modelValue;
};

const selectOption = (option: any) => {
  const value = getOptionValue(option);
  emit('update:modelValue', value);
  emit('change', value);
  isOpen.value = false;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
