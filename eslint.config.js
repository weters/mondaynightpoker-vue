import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // single-word names like Loading/Toggle and the game components are
            // established; new components should use multi-word names
            'vue/multi-word-component-names': 'off',
            // props here are conventionally optional-without-default; the Vue 3
            // runtime default of undefined is fine
            'vue/require-default-prop': 'off',
        },
    },
]
