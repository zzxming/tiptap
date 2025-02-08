import { Extension } from '@tiptap/vue-3'

export interface LineHeightOptions {
  /**
   * A list of node names where the line height can be applied.
   * @default ['paragraph', 'heading']
   * @example ['paragraph']
   */
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height
       * @param lineHeight The line height
       * @example editor.commands.setLineHeight('20px')
       */
      setLineHeight: (lineHeight: string) => ReturnType
      /**
       * Set the line height. If the line height is already set, it will be removed.
       * @param lineHeight The line height
       * @returns editor.commands.toggleLineHeight('20px')
       */
      toggleLineHeight: (lineHeight: string) => ReturnType
      /**
       * Unset the line height
       * @example editor.commands.unsetLineHeight()
       */
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => ({ commands, chain }) => {
        chain().focus()
        return this.options.types.every(type =>
          commands.updateAttributes(type, { lineHeight }),
        )
      },
      unsetLineHeight: () => ({ commands, chain }) => {
        chain().focus()
        return this.options.types.every(type =>
          commands.resetAttributes(type, 'lineHeight'),
        )
      },
      toggleLineHeight: lineHeight => ({ commands, editor }) => {
        const { selection, doc } = editor.state
        const { from, to } = selection

        let hasLineHeight = true
        doc.nodesBetween(from, to, (node) => {
          if (this.options.types.includes(node.type.name)) {
            const currentLineHeight = node.attrs.lineHeight
            if (currentLineHeight !== lineHeight) {
              hasLineHeight = false
              return false
            }
          }
          return true
        })
        return hasLineHeight
          ? commands.unsetLineHeight()
          : commands.setLineHeight(lineHeight)
      },
    }
  },
})
