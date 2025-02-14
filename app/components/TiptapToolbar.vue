<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  tools: Tool[]
  editor?: Editor
}>()

const toolsAction: Record<string, (value: any) => void> = {
  'bold': () => {
    props.editor?.chain().focus().toggleBold().run()
  },
  'italic': () => {
    props.editor?.chain().focus().toggleItalic().run()
  },
  'underline': () => {
    props.editor?.chain().focus().toggleUnderline().run()
  },
  'strike': () => {
    props.editor?.chain().focus().toggleStrike().run()
  },
  'list:ordered': () => {
    props.editor?.chain().focus().toggleOrderedList().run()
  },
  'list:bullet': () => {
    props.editor?.chain().focus().toggleBulletList().run()
  },
  'list:task': () => {
    props.editor?.chain().focus().toggleTaskList().run()
  },
  'blockquote': () => {
    props.editor?.chain().focus().toggleBlockquote().run()
  },
  'sub': () => {
    props.editor?.chain().focus().toggleSubscript().run()
  },
  'super': () => {
    props.editor?.chain().focus().toggleSuperscript().run()
  },
  'code': () => {
    props.editor?.chain().focus().toggleCode().run()
  },
  'code-block': () => {
    props.editor?.chain().focus().toggleCodeBlock().run()
  },
  'highlight': () => {
    props.editor?.chain().focus().toggleHighlight().run()
  },
  'align:left': () => {
    props.editor?.chain().focus().toggleTextAlign('left')
  },
  'align:center': () => {
    props.editor?.chain().focus().toggleTextAlign('center')
  },
  'align:right': () => {
    props.editor?.chain().focus().toggleTextAlign('right')
  },
  'align:justify': () => {
    props.editor?.chain().focus().toggleTextAlign('justify')
  },
  ...([1, 2, 3, 4, 5, 6] as Level[]).reduce((map, level) => {
    map[`heading:${level}`] = () => {
      props.editor?.chain().focus().toggleHeading({ level }).run()
    }
    return map
  }, {} as Record<string, (value: any) => void>),
  'align': (value: string) => {
    if (props.editor?.isActive({ textAlign: value })) {
      props.editor?.chain().focus().unsetTextAlign().run()
    }
    else {
      props.editor?.chain().focus().setTextAlign(value).run()
    }
  },
}
const tips: Record<string, string> = {
  'list:ordered': 'list ordered',
  'list:bullet': 'list bullet',
  'list:task': 'list task',
  'align:left': 'align left',
  'align:center': 'align center',
  'align:right': 'align right',
  'align:justify': 'align justify',
}
const icons: Record<string, string> = {
  'bold': 'i-carbon-text-bold',
  'italic': 'i-carbon-text-italic',
  'underline': 'i-carbon-text-underline',
  'strike': 'i-carbon-text-strikethrough',
  'blockquote': 'i-carbon-quotes',
  'sub': 'i-carbon-text-subscript',
  'super': 'i-carbon-text-superscript',
  'code': 'i-carbon-code',
  'code-block': 'i-carbon-ibm-watsonx-code-assistant-for-z-refactor',
  'highlight': 'i-carbon-text-fill',
  'list:ordered': 'i-carbon-list-numbered',
  'list:bullet': 'i-carbon-list-bulleted',
  'list:task': 'i-carbon-list-checked',
  'align:left': 'i-carbon-text-align-left',
  'align:center': 'i-carbon-text-align-center',
  'align:right': 'i-carbon-text-align-right',
  'align:justify': 'i-carbon-text-align-justify',
  'heading:1': 'i-tabler-h-1',
  'heading:2': 'i-tabler-h-2',
  'heading:3': 'i-tabler-h-3',
  'heading:4': 'i-tabler-h-4',
  'heading:5': 'i-tabler-h-5',
  'heading:6': 'i-tabler-h-6',
}
const shortcuts: Record<string, string[]> = {}
// 添加 select
// 修改 action, 使 action 执行增加参数(当前格式对应值)
// tiptap如何随时获取选区内的所有格式，以用于判断toolbar上对应的按钮是否应该高亮
const tools = computed(() => {
  return props.tools.map((tool) => {
    return {
      ...tool,
      tip: tool.tip ?? tips[tool.name],
      action: tool.action ?? (toolsAction[tool.name] || (() => true)),
      shortcuts: tool.shortcuts ?? shortcuts[tool.name],
    } as Tool
  })
})
</script>

<template>
  <div border="b b-gray-300" flex="~ wrap gap-1 items-center">
    <UTooltip
      v-for="tool in tools"
      :key="tool.name"
      :text="tool.tip"
      :shortcuts="tool.shortcuts"
      :popper="{ placement: 'top' }"
    >
      <USelectMenu
        v-if="isSelectTool(tool)"
        :model-value="tool.active"
        class="w-36" :class="[tool.name]"
        :options="tool.values"
        :disabled="false"
        @change="tool.action"
      >
        <template #option="{ option }">
          <span :class="`${tool.name}-${option}`" />
        </template>
      </USelectMenu>
      <UButton
        v-else-if="isButtonTool(tool)"
        :class="[tool.name]"
        flex="items-center justify-center" h-8 w-8 p-1
        :color="tool.active ? 'indigo' : 'gray'"
        size="xl"
        variant="solid"
        @click="tool.action"
      >
        <span :class="icons[tool.name]" />
      </UButton>
    </UTooltip>
  </div>
</template>

<style scoped lang="postcss">
.heading {
  &-null::before {
    content: 'Text';
  }
  &-1::before {
    content: 'Heading 1';
  }
  &-2::before {
    content: 'Heading 2';
  }
  &-3::before {
    content: 'Heading 3';
  }
  &-4::before {
    content: 'Heading 4';
  }
  &-5::before {
    content: 'Heading 5';
  }
  &-6::before {
    content: 'Heading 6';
  }
}
</style>
