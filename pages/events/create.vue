<template>
  <div class="pb-24">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/events" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors">
          <ArrowLeftIcon class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Create Event</h1>
          <p class="text-slate-500 font-medium mt-1">Add a new event to the calendar.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button @click="submitForm" :disabled="isSaving" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 flex items-center gap-2">
          <span v-if="isSaving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Save Event</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Event Title</label>
            <input v-model="form.title" type="text" placeholder="e.g. Summer Tasting Event" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-lg" />
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea v-model="form.description" rows="5" placeholder="Details about the event..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm resize-none"></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Date</label>
              <input v-model="form.date" type="date" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Time</label>
              <input v-model="form.time" type="time" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Location</label>
            <input v-model="form.location" type="text" placeholder="e.g. Ikeja City Mall" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" />
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-4">Event Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select v-model="form.status" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm capitalize">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
              </select>
            </div>

            <div class="pt-2">
              <label class="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
              <div class="flex gap-2">
                <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" ref="fileInput" />
                <button type="button" @click="$refs.fileInput.click()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors border border-slate-200 flex items-center gap-2">
                  <span v-if="isUploading" class="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></span>
                  <ImageIcon v-else class="w-4 h-4" />
                  {{ isUploading ? 'Uploading...' : 'Choose Image' }}
                </button>
              </div>
              <p v-if="uploadError" class="text-xs text-rose-500 mt-1">{{ uploadError }}</p>
              <div v-if="form.image" class="mt-3 aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative group">
                <img :src="form.image" class="w-full h-full object-cover" />
                <button type="button" @click="form.image = ''" class="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-rose-500 rounded-lg shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';
import { useUploadImage } from '~/composables/modules/upload/useUploadImage';
import { ArrowLeftIcon, ImageIcon, TrashIcon } from 'lucide-vue-next';

const { uploadImage, isUploading, uploadError } = useUploadImage();
const fileInput = ref<HTMLInputElement | null>(null);

const router = useRouter();
const { api } = useApi();
const isSaving = ref(false);

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const url = await uploadImage(file);
    form.value.image = url;
  } catch (err) {
    console.error('Failed to upload image:', err);
  } finally {
    if (fileInput.value) fileInput.value.value = '';
  }
};

const form = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  image: '',
  status: 'upcoming'
});

const submitForm = async () => {
  if (!form.value.title || !form.value.date || !form.value.time || !form.value.location) {
    return alert('Please fill in all required fields (Title, Date, Time, Location).');
  }
  
  isSaving.value = true;
  try {
    await api.post('/events', form.value);
    router.push('/events');
  } catch (error) {
    console.error('Failed to create event', error);
    alert('Failed to save event. Please check your connection.');
  } finally {
    isSaving.value = false;
  }
};
</script>
