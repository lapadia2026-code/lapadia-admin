<template>
  <div class="pb-24">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/blogs" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors">
          <ArrowLeftIcon class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Create Blog Post</h1>
          <p class="text-slate-500 font-medium mt-1">Draft a new article for your customers.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button @click="saveDraft" :disabled="isSaving" class="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 rounded-lg border border-slate-200 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
          Save Draft
        </button>
        <button @click="publishPost" :disabled="isSaving" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50 flex items-center gap-2">
          <span v-if="isSaving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Publish Post</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content Editor -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Post Title</label>
              <input v-model="form.title" type="text" placeholder="e.g. 5 Health Benefits of Drinking Green Juice" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-lg" />
            </div>

            <!-- Tiptap Editor -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Content</label>
              <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <!-- Toolbar -->
                <div v-if="editor" class="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-white">
                  <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('bold') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <BoldIcon class="w-4 h-4" />
                  </button>
                  <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('italic') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <ItalicIcon class="w-4 h-4" />
                  </button>
                  <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('strike') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <StrikethroughIcon class="w-4 h-4" />
                  </button>
                  <div class="w-px h-6 bg-slate-200 mx-1"></div>
                  <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('heading', { level: 2 }) }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors font-bold text-sm">
                    H2
                  </button>
                  <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('heading', { level: 3 }) }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors font-bold text-sm">
                    H3
                  </button>
                  <div class="w-px h-6 bg-slate-200 mx-1"></div>
                  <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('bulletList') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <ListIcon class="w-4 h-4" />
                  </button>
                  <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('orderedList') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <ListOrderedIcon class="w-4 h-4" />
                  </button>
                  <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('blockquote') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <QuoteIcon class="w-4 h-4" />
                  </button>
                  <div class="w-px h-6 bg-slate-200 mx-1"></div>
                  <button @click="setLink" :class="{ 'bg-slate-200 text-slate-900': editor.isActive('link') }" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <LinkIcon class="w-4 h-4" />
                  </button>
                  <input type="file" accept="image/*" @change="handleTiptapImageUpload" class="hidden" ref="tiptapFileInput" />
                  <button @click="$refs.tiptapFileInput.click()" class="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors">
                    <span v-if="isUploadingTiptap" class="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin block"></span>
                    <ImageIcon v-else class="w-4 h-4" />
                  </button>
                </div>
                <!-- Content Area -->
                <div class="p-4 bg-white min-h-[400px] prose max-w-none focus:outline-none">
                  <editor-content :editor="editor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Metadata -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-4">Post Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
              <div class="flex gap-2">
                <input type="file" accept="image/*" @change="handleCoverImageUpload" class="hidden" ref="coverFileInput" />
                <button type="button" @click="$refs.coverFileInput.click()" class="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-2">
                  <span v-if="isUploadingCover" class="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></span>
                  <ImageIcon v-else class="w-4 h-4" />
                  {{ isUploadingCover ? 'Uploading...' : 'Choose Cover Image' }}
                </button>
              </div>
              <p v-if="uploadError" class="text-xs text-rose-500 mt-1">{{ uploadError }}</p>
              <div v-if="form.coverImage" class="mt-3 aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative group">
                <img :src="form.coverImage" class="w-full h-full object-cover" />
                <button type="button" @click="form.coverImage = ''" class="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-rose-500 rounded-lg shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
              <input v-model="form.authorName" type="text" placeholder="e.g. Lapadia Team" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm" />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Tags (comma separated)</label>
              <input v-model="tagsInput" type="text" placeholder="health, juice, lifestyle" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';
import { 
  ArrowLeftIcon, BoldIcon, ItalicIcon, StrikethroughIcon, 
  ListIcon, ListOrderedIcon, QuoteIcon, LinkIcon, ImageIcon, TrashIcon
} from 'lucide-vue-next';
import { useUploadImage } from '~/composables/modules/upload/useUploadImage';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const router = useRouter();
const { api } = useApi();
const { uploadImage, uploadError } = useUploadImage();
const isUploadingCover = ref(false);
const isUploadingTiptap = ref(false);
const coverFileInput = ref<HTMLInputElement | null>(null);
const tiptapFileInput = ref<HTMLInputElement | null>(null);

const isSaving = ref(false);
const tagsInput = ref('');

const form = ref({
  title: '',
  content: '',
  coverImage: '',
  authorName: 'Lapadia Team',
  tags: [] as string[],
  published: false
});

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    Image,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[350px]',
    },
  },
  onUpdate: ({ editor }) => {
    form.value.content = editor.getHTML();
  },
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);
  if (url === null) return;
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

const handleCoverImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  isUploadingCover.value = true;
  try {
    const url = await uploadImage(file);
    form.value.coverImage = url;
  } catch (err) {
    console.error('Failed to upload cover image:', err);
  } finally {
    isUploadingCover.value = false;
    if (coverFileInput.value) coverFileInput.value.value = '';
  }
};

const handleTiptapImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  isUploadingTiptap.value = true;
  try {
    const url = await uploadImage(file);
    editor.value?.chain().focus().setImage({ src: url }).run();
  } catch (err) {
    console.error('Failed to upload tiptap image:', err);
  } finally {
    isUploadingTiptap.value = false;
    if (tiptapFileInput.value) tiptapFileInput.value.value = '';
  }
};

const prepareForm = () => {
  form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
};

const saveDraft = async () => {
  if (!form.value.title) return alert('Title is required');
  form.value.published = false;
  await submitForm();
};

const publishPost = async () => {
  if (!form.value.title) return alert('Title is required');
  form.value.published = true;
  await submitForm();
};

const submitForm = async () => {
  isSaving.value = true;
  prepareForm();
  try {
    await api.post('/blogs', form.value);
    router.push('/blogs');
  } catch (error) {
    console.error('Failed to save blog', error);
    alert('Failed to save blog. Please check your connection.');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style>
/* TipTap Prose Overrides to match design system */
.ProseMirror p.is-editor-empty:first-child::before {
  color: #94a3b8;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.ProseMirror img {
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
