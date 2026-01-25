# Polymino Level Editor

A web-based level editor for designing Puzzle Mode levels for Polymino, an indie
puzzle game available on Steam. Learn more about Polymino at
[polymino.net](https://polymino.net)

This project uses unplugin-vue-components to automatically import all components
when editing a .vue file. Components are imported by concatenating their file
paths in kebab-case relative to `src/components`.
For example, a component in a file called
`src/components/pdx/some-folder/my-component.vue` can be referenced as
`<pdx-some-folder-my-component>` without importing it. The plugin automatically
generates this list while running the dev environment in the `components.d.ts`
file in the repo's root directory.

This project also uses unpluigin-auto-import to automatically import all `vue`
and `@vueuse/core` functions and types. The file produced by this plugin is
generated at `auto-imports.d.ts` in the repo's root directory.

This project also uses Biome as its linter. Biome also offers additional tools
such as code formatting, but it is currently only set up for linting.

The following information is mostly unchanged from the default Vue readme and is
helpful for editing and running the project:

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Linting with Biome

```sh
yarn lint
```
