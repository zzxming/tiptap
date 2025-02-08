import { Extension } from '@tiptap/vue-3'

export interface FontSizeOptions {
  /**
   * A list of node names where the font size can be applied.
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
   */
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       * @param fontSize The font size
       * @example editor.commands.setFontSize('20px')
       */
      setFontSize: (fontSize: string) => ReturnType
      /**
       * Set the font size. If the font size is already set, replace it.
       * @param fontSize The font size
       * @example editor.commands.toggleFontSize('20px')
       */
      toggleFontSize: (fontSize: string) => ReturnType
      /**
       * Unset the font size
       * @example editor.commands.unsetFontSize()
       */
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .focus()
          .setMark('textStyle', { fontSize })
          .run()
      },
      toggleFontSize: value => ({ chain, editor }) => {
        const currentFontSize = editor.getAttributes('textStyle').fontSize
        const fontSize = currentFontSize === value ? null : value
        return chain()
          .focus()
          .setMark('textStyle', { fontSize })
          .removeEmptyTextStyle()
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .focus()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})
