import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueAutoImport from 'unplugin-auto-import/vite'
import VueComponents from 'unplugin-vue-components/vite'

/**
 * We auto-import everything from Vue and VueUse, and we auto-import all of our
 * own components by concatenating-their-file-paths-in-kebab-case
 */

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VueAutoImport({
      imports: [
        'vue',
        '@vueuse/core'
      ],
      dts: './auto-imports.d.ts',
    }),
    VueComponents({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: true,
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      allowOverrides: false,
      syncMode: 'overwrite',
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
