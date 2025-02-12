import type { Editor } from '@tiptap/core'
import { computePosition, flip, limitShift, offset, shift } from '@floating-ui/dom'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import { h, render } from 'vue'
import LinkTooltip from '~/components/LinkTooltip.vue'

export interface LinkStorage {
  timer: ReturnType<typeof setTimeout> | null
  target: HTMLElement | null
  element: HTMLElement | null
  cleanup: (() => void) | null
  update: () => void
  show: () => void
  close: () => void
  createTooltip: (options: Omit<CreateTooltipOptions, 'onClose'>) => void
}
export interface CreateTooltipOptions {
  text?: string
  href?: string
  editor: Editor
  select: () => void
  update: (text: string, href: string) => void
  onClose: () => void
}
function createTooltip({
  editor,
  text = '',
  href = '',
  update,
  select,
  onClose,
}: CreateTooltipOptions) {
  const container = document.createElement('div')
  render(h(LinkTooltip, { text, href, editor, update, select, onClose }), container)
  const el = container.firstElementChild! as HTMLElement
  Object.assign(el.style, {
    position: 'absolute',
  })
  return el
}

export const linkHoverPlugin = Extension.create<object, LinkStorage>({
  name: 'linkHover',
  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('link-hover')
    return [
      new Plugin({
        key: pluginKey,
        props: {
          handleDOMEvents: {
            mouseover: (view, event) => {
              if (!view.editable)
                return false

              const target = event.target as HTMLElement
              const anchor = target.closest('a')

              if (anchor) {
                const href = anchor.getAttribute('href')
                const pos = view.posAtDOM(anchor, 0)

                if (pos === null)
                  return false

                // 获取包含此位置的节点的 link mark
                let linkRange = { from: pos, to: pos }
                const { doc } = view.state
                doc.nodesBetween(Math.max(0, pos - 1), Math.min(doc.content.size, pos + 1), (node, pos) => {
                  const mark = node.marks.find(mark => mark.type.name === 'link')
                  if (mark) {
                    linkRange = {
                      from: pos,
                      to: pos + node.nodeSize,
                    }
                    return false
                  }
                })
                const text = doc.textBetween(
                  linkRange.from,
                  linkRange.to,
                  '', // 块级节点之间的分隔符
                  '\n', // 叶子节点之间的分隔符
                )

                this.storage.target = anchor
                this.storage.createTooltip({
                  editor: this.editor,
                  text,
                  href: href || '',
                  select: () => {
                    const { tr } = view.state
                    const selection = TextSelection.create(
                      doc,
                      linkRange.from,
                      linkRange.to,
                    )
                    view.dispatch(tr.setSelection(selection))
                  },
                  update: (href: string, text: string) => {
                    if (text.length <= 0)
                      text = 'link'

                    let tr = view.state.tr
                      .replaceWith(
                        linkRange.from,
                        linkRange.to,
                        view.state.schema.text(text),
                      )
                      .addMark(
                        linkRange.from,
                        linkRange.from + text.length,
                        view.state.schema.marks.link!.create({ href }),
                      )

                    const selection = TextSelection.create(
                      tr.doc,
                      linkRange.from,
                      linkRange.from + text.length,
                    )
                    tr = tr.setSelection(selection)

                    view.dispatch(tr)
                  },
                })
                this.storage.show()
                anchor.addEventListener('mouseleave', this.storage.close)
              }

              return false
            },
            mouseout: (view, event) => {
              if (!view.editable)
                return false

              const target = event.target as HTMLElement
              const anchor = target.closest('a')

              if (anchor) {
                this.storage.close()
                anchor.removeEventListener('mouseleave', this.storage.close)
              }

              return false
            },
          },
        },
      }),
    ]
  },
  addStorage() {
    return {
      timer: null,
      element: null,
      cleanup: null,
      target: null,
      update() {
        if (!this.element || !this.target)
          return

        computePosition(this.target, this.element, {
          placement: 'bottom',
          middleware: [flip(), shift({ padding: 8, limiter: limitShift() }), offset(8)],
        }).then(({ x, y }) => {
          Object.assign(this.element!.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
        })
      },
      createTooltip(options) {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        if (this.element)
          this.element.remove()

        this.element = createTooltip({
          ...options,
          onClose: () => {
            this.close()
          },
        })

        this.element.addEventListener('mouseenter', this.show.bind(this))
        this.element.addEventListener('mouseleave', this.close.bind(this))
      },
      show() {
        if (!this.element || !this.target)
          return

        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        if (this.cleanup)
          this.cleanup()

        if (!document.body.contains(this.element))
          document.body.appendChild(this.element)

        this.update()
      },
      close() {
        this.timer = setTimeout(() => {
          if (this.element)
            this.element.remove()

          this.cleanup?.()
          this.cleanup = null
          this.timer = null
        }, 300)
      },
    }
  },
})
