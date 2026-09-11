<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Events</h1>
        <p class="text-slate-500 font-medium mt-1">Manage upcoming and past events.</p>
      </div>
      <NuxtLink to="/events/create" class="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors">
        <PlusIcon class="w-5 h-5" />
        Create Event
      </NuxtLink>
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-slate-200 rounded-xl"></div>
    </div>
    
    <div v-else-if="events.length === 0" class="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
      <CalendarIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-slate-800 mb-2">No events found</h3>
      <p class="text-slate-500 mb-6">Create your first event to invite your community.</p>
      <NuxtLink to="/events/create" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
        Create First Event
      </NuxtLink>
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th class="py-4 px-6 font-semibold">Event Name</th>
              <th class="py-4 px-6 font-semibold">Status</th>
              <th class="py-4 px-6 font-semibold">Date & Time</th>
              <th class="py-4 px-6 font-semibold">Location</th>
              <th class="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="event in events" :key="event._id" class="hover:bg-slate-50 transition-colors group">
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                    <img v-if="event.image" :src="event.image" class="w-full h-full object-cover" />
                    <CalendarIcon v-else class="w-6 h-6 text-slate-400 m-auto mt-3" />
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900">{{ event.title }}</h3>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-bold border capitalize',
                  event.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                  event.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                ]">
                  {{ event.status }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="text-slate-900 font-medium">{{ event.date }}</div>
                <div class="text-slate-500 text-sm">{{ event.time }}</div>
              </td>
              <td class="py-4 px-6 text-slate-600 text-sm">
                {{ event.location }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2 transition-opacity">
                  <NuxtLink :to="`/events/${event._id}`" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <EditIcon class="w-5 h-5" />
                  </NuxtLink>
                  <button @click="confirmDelete(event)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Delete Modal -->
    <div v-if="eventToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="eventToDelete = null">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-100">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangleIcon class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold text-center text-slate-900 mb-2">Delete Event</h3>
        <p class="text-slate-500 text-center mb-6 text-sm">Are you sure you want to delete "{{ eventToDelete.title }}"? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="eventToDelete = null" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">Cancel</button>
          <button @click="deleteEvent" :disabled="isDeleting" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-rose-600/30 flex items-center justify-center">
            <span v-if="isDeleting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusIcon, CalendarIcon, EditIcon, TrashIcon, AlertTriangleIcon } from 'lucide-vue-next';
import { useApi } from '~/composables/useApi';

const { api } = useApi();
const events = ref<any[]>([]);
const loading = ref(true);
const eventToDelete = ref<any>(null);
const isDeleting = ref(false);

const fetchEvents = async () => {
  loading.value = true;
  try {
    const res = await api.get('/events');
    events.value = res.data;
  } catch (error) {
    console.error('Failed to fetch events', error);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (event: any) => {
  eventToDelete.value = event;
};

const deleteEvent = async () => {
  if (!eventToDelete.value) return;
  isDeleting.value = true;
  try {
    await api.delete(`/events/${eventToDelete.value._id}`);
    events.value = events.value.filter(e => e._id !== eventToDelete.value._id);
    eventToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete event', error);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>
