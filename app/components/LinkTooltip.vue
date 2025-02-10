<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { ref, watch } from 'vue'

const props = defineProps<{
  text: string
  href: string
  editor: Editor
  select: () => void
  update: (text: string, href: string) => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const url = ref(props.href)
const text = ref(props.text)

watch(() => [props.href, props.text], () => {
  url.value = props.href
  text.value = props.text
})

function updateLink() {
  props.select()
  props.update(url.value, text.value)
  emit('close')
}

function removeLink() {
  props.select()
  props.editor
    .chain()
    .focus()
    .unsetLink()
    .run()
  emit('close')
}

function enterLink() {
  window.open(url.value, '_blank')
}
</script>

<template>
  <div class="w-60 border rounded bg-white p-2 shadow-lg">
    <input
      v-model="text"
      type="url"
      class="mb-2 w-full border rounded p-1"
      placeholder="Enter Title"
    >
    <input
      v-model="url"
      type="url"
      class="mb-2 w-full border rounded p-1"
      placeholder="Enter URL"
    >
    <div class="flex gap-2">
      <button
        class="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
        @click="updateLink"
      >
        Update
      </button>
      <button
        class="border rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        @click="removeLink"
      >
        Remove
      </button>
      <button
        class="text-block border rounded px-2 py-1 text-sm"
        @click="enterLink"
      >
        访问
      </button>
    </div>
  </div>
</template>
