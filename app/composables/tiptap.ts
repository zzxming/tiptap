import type { Editor } from '@tiptap/core'
import type { JSONContent, Editor as Vue3Editor } from '@tiptap/vue-3'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Color from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import FontFamily from '@tiptap/extension-font-family'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import ListKeymap from '@tiptap/extension-list-keymap'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/vue-3'
import { FontSize } from './tiptap/font-size'
import { LineHeight } from './tiptap/line-height'
import { linkHoverPlugin } from './tiptap/link-hover'
import { TextAlign } from './tiptap/text-align'

export interface UseTiptapOptions {
  content: Ref<string | JSONContent>
  autofocus: boolean
  placeholder: Ref<string | undefined>
  limit: number
  tools?: Tool[]
  mergeDefaultTools?: boolean
}

export interface ToolOptions {
  name: string
  action?: () => void
  tip?: string
  shortcuts?: string[]
}
export interface ButtonTool extends ToolOptions {
  active?: boolean
  checkActive?: (args: { editor: Editor }) => boolean
}
export interface SelectTool extends ToolOptions {
  values: any[]
  active?: any
  checkActive?: (args: { editor: Editor }) => any
}
export type Tool = ButtonTool | SelectTool
export function isSelectTool(tool: Tool): tool is SelectTool {
  return 'values' in tool
}

export function isButtonTool(tool: Tool): tool is ButtonTool {
  return !('values' in tool)
}

const defaultTools: Tool[] = [
  { name: 'bold' },
  { name: 'italic' },
  { name: 'underline' },
  { name: 'strike' },
  { name: 'list:ordered', checkActive: ({ editor }) => editor.isActive('list', 'ordered') },
  { name: 'list:bullet', checkActive: ({ editor }) => editor.isActive('list', 'bullet') },
  { name: 'list:task', checkActive: ({ editor }) => editor.isActive('list', 'task') },
  { name: 'blockquote' },
  { name: 'sub' },
  { name: 'super' },
  { name: 'code' },
  { name: 'code-block' },
  { name: 'highlight' },
  { name: 'align:left', checkActive: ({ editor }) => editor.isActive({ textAlign: 'left' }) },
  { name: 'align:center', checkActive: ({ editor }) => editor.isActive({ textAlign: 'center' }) },
  { name: 'align:right', checkActive: ({ editor }) => editor.isActive({ textAlign: 'right' }) },
  { name: 'align:justify', checkActive: ({ editor }) => editor.isActive({ textAlign: 'justify' }) },
  { name: 'heading:1', checkActive: ({ editor }) => editor.isActive('heading', { level: 1 }) },
  { name: 'heading:2', checkActive: ({ editor }) => editor.isActive('heading', { level: 2 }) },
  { name: 'heading:3', checkActive: ({ editor }) => editor.isActive('heading', { level: 3 }) },
  { name: 'heading:4', checkActive: ({ editor }) => editor.isActive('heading', { level: 4 }) },
  { name: 'heading:5', checkActive: ({ editor }) => editor.isActive('heading', { level: 5 }) },
  { name: 'heading:6', checkActive: ({ editor }) => editor.isActive('heading', { level: 6 }) },
  { name: 'heading', values: [false, 1, 2, 3, 4, 5, 6], checkActive: ({ editor }) => editor.getAttributes('heading').level || false },
]
function mergeTools(a: Tool[], b: Tool[]) {
  const tools: Tool[] = [...a]
  for (const tool of b) {
    const aIndex = a.findIndex(t => t.name === tool.name)
    if (aIndex !== -1) {
      tools[aIndex] = {
        ...tool,
        ...tools[aIndex],
      }
    }
    else {
      tools.push(tool)
    }
  }
  return tools
}

export function useTiptap(options: UseTiptapOptions) {
  let inputTools = defaultTools
  if (options.tools) {
    inputTools = (options.mergeDefaultTools || false) ? mergeTools(defaultTools, options.tools) : options.tools
  }
  const tools = ref<Tool[]>(inputTools)
  if (import.meta.server) {
    return {
      editor: ref<Vue3Editor | undefined>(),
      tools,
      getAllActiveFormats,
    }
  }

  const { content, autofocus, placeholder, limit } = options
  const editor = useEditor({
    content: content.value,
    extensions: [
      Gapcursor,
      Dropcursor,
      Document,
      Paragraph,
      Text,
      TextStyle,
      Bold,
      Italic,
      Blockquote,
      Underline,
      Heading,
      ListItem,
      ListKeymap,
      BulletList,
      OrderedList,
      Subscript,
      Superscript,
      Strike,
      Link,
      Code,
      CodeBlock,
      TaskList,
      TaskItem,
      Image,
      HardBreak,
      HorizontalRule,
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: () => placeholder.value! }),
      History.configure({ depth: 30 }),
      TextAlign.configure({ types: [Heading.name, Paragraph.name] }),
      FontFamily,
      FontSize,
      LineHeight,
      Color,
      Highlight.configure({ multicolor: true }),
      CharacterCount.configure({
        limit,
        mode: 'textSize',
      }),

      linkHoverPlugin,
    ],
    onSelectionUpdate({ editor }) {
      updateToolActive(editor)
    },
    onUpdate({ editor }) {
      content.value = editor.getJSON()
      updateToolActive(editor)
    },
    editorProps: {
      attributes: {
        class: '',
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    autofocus,
    editable: true,
  })
  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  function updateToolActive(editor: Editor) {
    tools.value = tools.value.map((tool) => {
      const name = tool.name.includes(':') ? tool.name.split(':')[0]! : tool.name
      tool.active = tool.checkActive ? tool.checkActive({ editor }) : editor.isActive(name)
      return tool
    })
  }
  function getAllActiveFormats() {
    const formats: Record<string, any> = {}

    if (editor.value) {
      // 检测所有 marks
      for (const markName of Object.keys(editor.value.schema.marks)) {
        formats[markName] = editor.value.isActive(markName)
      };

      // 检测所有 nodes
      for (const nodeName of Object.keys(editor.value.schema.nodes)) {
        formats[nodeName] = editor.value.isActive(nodeName)
      };

      // 获取 attributes（如颜色、字体大小等）
      formats.textColor = editor.value.getAttributes('textStyle').color || '#000'
      formats.highlightColor = editor.value.getAttributes('highlight').color || '#fff'
    }

    return formats
  }

  return {
    editor,
    tools,
    getAllActiveFormats,
  }
}
