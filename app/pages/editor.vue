<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'

const content = ref({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to Tiptap' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a ',
        },
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'bold',
        },
        {
          type: 'text',
          text: ' and ',
        },
        {
          type: 'text',
          marks: [{ type: 'italic' }],
          text: 'italic',
        },
        {
          type: 'text',
          text: ' and ',
        },
        {
          type: 'text',
          marks: [{ type: 'underline' }],
          text: 'underline',
        },
        {
          type: 'text',
          text: ' and ',
        },
        {
          type: 'text',
          marks: [{ type: 'strike' }],
          text: 'strike',
        },
        {
          type: 'text',
          text: ' text example.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The cool kids can apply monospace fonts aswell.',
          marks: [{ type: 'textStyle', attrs: { fontFamily: 'monospace', fontSize: '1.5em' } }],
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First bullet point' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Second bullet point' }],
            },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      attrs: { start: 1 },
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First numbered item' }],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'This is a block quote' }],
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [{ type: 'text', text: 'console.log(\'Hello, World!\');' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: 'https://example.com', target: '_blank' } }],
          text: 'This is a link',
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 1' }] }],
              attrs: { colspan: 1, rowspan: 1, colwidth: null },
            },
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header2' }] }],
              attrs: { colspan: 1, rowspan: 1, colwidth: null },
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell 1' }] }],
              attrs: { colspan: 1, rowspan: 1, colwidth: null },
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell 2' }] }],
              attrs: { colspan: 1, rowspan: 1, colwidth: null },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            { type: 'textStyle', attrs: { color: '#FF0000' } },
            { type: 'highlight', attrs: { color: '#FFFF00' } },
          ],
          text: 'Colored text with background',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://upload-bbs.miyoushe.com/upload/2024/06/18/5556092/73b7bae28fded7a72d93a35d5559b24c_3979852353547906724.png',
        alt: 'Example image',
        title: 'Image title',
      },
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Completed task' }],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Pending task' }],
            },
          ],
        },
      ],
    },
  ],
})
const limit = 2000
const { editor, editorCountPercentage } = useTiptap({
  content,
  autofocus: false,
  placeholder: ref('Write something here...'),
  limit,
})

const tools = [
  {
    name: 'bold',
    handler: () => {
      editor.value?.chain().focus().toggleBold().run()
    },
  },
  {
    name: 'italic',
    handler: () => {
      editor.value?.chain().focus().toggleItalic().run()
    },
  },
  {
    name: 'size',
    handler: () => {
      editor.value?.commands.toggleFontSize('20px')
    },
  },
  {
    name: 'lineHeight',
    handler: () => {
      editor.value?.commands.toggleLineHeight('20px')
    },
  },
]
</script>

<template>
  <div>
    <div>
      <UButton v-for="item in tools" :key="item.name" @click="item.handler">
        {{ item.name }}
      </UButton>

      {{ editor?.storage.characterCount.characters() }} / {{ limit }} - {{ editorCountPercentage }}%
    </div>
    <EditorContent text-start :editor="editor" />
  </div>
</template>

<style>
.tiptap:focus {
  outline: none;
}

.tiptap ul {
  list-style: disc;
  margin: 8px 0;
  padding-left: 12px;
}

.tiptap ul ul {
  list-style: circle;
  margin: 4px 0;
  padding-left: 12px;
}

.tiptap ul ul ul {
  list-style: square;
}

.tiptap ol {
  list-style: decimal;
  margin: 8px 0;
  padding-left: 12px;
}

.tiptap ol ol {
  list-style: lower-alpha;
  margin: 4px 0;
  padding-left: 12px;
}

.tiptap ol ol ol {
  list-style: lower-roman;
}

.tiptap blockquote {
  border-left: 4px solid #ccc;
  margin: 8px 0;
  padding-left: 16px;
}

.tiptap .ProseMirror-selectednode {
  box-shadow: 0 0 0 6px rgba(0, 193, 106);
}

.tiptap a {
  color: #1a73e8;
  text-decoration: underline;
  cursor: pointer;
}
.tiptap a:hover {
  background-color: rgba(0, 193, 106, 0.1);
}
</style>
