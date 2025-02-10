import type { Editor } from '@tiptap/vue-3'
import type { InjectionKey, ShallowRef } from 'vue'

export interface TiptapContext {
  editor: ShallowRef<Editor | undefined, Editor | undefined>
}

export const tiptapContextKey: InjectionKey<TiptapContext> = Symbol('tiptapContextKey')
