import type { Editor, JSONContent } from '@tiptap/vue-3'
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
}

export function useTiptap(options: UseTiptapOptions) {
  if (import.meta.server) {
    return { editor: ref<Editor | undefined>() }
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
    onUpdate({ editor }) {
      content.value = editor.getJSON()
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

  return {
    editor,
  }
}
