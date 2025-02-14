// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
    },
  ),
  {
    rules: {
      'vue/valid-attribute-name': 'off',
    },
  },
)
