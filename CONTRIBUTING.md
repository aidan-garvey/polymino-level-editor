# Contributing

Thank you for your interest in contributing to Polymino's level editor!
Please read the project's [readme](README.md) for basic info about running the
project and running the linter, etc.

## Issues

Tasks will be tracked using GitHub Issues. When you begin working on an issue,
please assign yourself to it so everyone knows it is being worked on.

Additionally, when referencing other issues in discussions, commit messages,
etc, please reference the issue number so GitHub will link your post to the
issue. This is very helpful for finding related code, discussions, issues, etc.

## Pull requests

To contribute code to this project, please open a pull request, referencing the
issue it addresses if applicable. If you want to contribute code that doesn't
address an existing issue, it's recommended but not required to create an issue
for it beforehand.

Commits and pull requests that reference or close issues should be marked as
such in the description. For example, including the following in a commit or PR
message will cause the GitHub issue with ID `#1` to close automatically when
merged to the master branch:

```
closes #1
```

If a commit or PR references another issue/PR but doesn't close it, you can use
the issue number (such as `#1`) anywhere in the message to link to it. This
makes it easier to trace the history of work on certain issues, or keep track of
related issues.

## Linting and type-checking

Biome is only used for linting the project, you don't have to use it to format
your code when contributing. However, please use it to lint your code before
opening a pull request. If you disagree with one of the enabled rules, or think
certain disabled rules should be enabled, you are more than welcome to open a PR
which modifies [biome.json](biome.json) to propose changes.

Any rules handled by TypeScript itself rather than the linter should be placed
in the "compilerOptions" object in [tsconfig.base.json](tsconfig.base.json), and
you're once again more than welcome to propose changes by opening a PR which
modifies this file.

## Design style

For the look of this project, I want to consistently use sharp corners on all UI
elements, and not use borders thicker than one pixel.
It should be minimalist and no-nonsense, with small but comfortable amounts of
padding.
The clickable areas of interactive elements should be maximized and extend to
the edges of their parents.
Basically everything Microsoft forgot when designing Windows 11 ;-(

## Code quality and style

In general I'm not picky about code style, but there are some rules I will
enforce due to code maintainability or readability reasons:

- Use two space characters for each level of indentation.

- Use single-file components (.vue files) for components unless it's warranted
to use Vue's `h()` function (this project should ideally be simple enough to not
require it). Don't use jsx/tsx.

- Put all components under `src/components/pdx`. `pdx` is shorthand for the PC
version of Polymino's working title, `polymino-dx`, and is used as a namespace
in the game's source code as well as related projects such as this.
  - Having all components namespaced, in conjunction with this project's use of
  `unplugin-vue-components`, means that all component names will contain at
  least two words (which is common best practice as it distinguishes custom
  components from standard HTML tags).

- Use the Block-Element-Modifier (BEM) naming convention for CSS classes within
a component. The block name should be the same as the component's name
(elaborated on below).
  - [Learn more about BEM here](https://getbem.com/naming/)

- Constant inline style in elements should be used **sparingly.** Using inline
style for computed properties (e.g. style which depends on a component's props)
is 100% fine and encouraged over using `v-bind()` in a component's `<style>`
tag, but if the style is hard-coded, and it contains several properties or it's
repeated multiple times in the component, it should go in a CSS class in the
component's `<style>` tag.

- Don't use Vue's scoped style feature (e.g. `<style scoped>`), as it has a
performance penalty and requires workarounds to apply style to child components.
Scoped style helps prevent CSS class collisions, but following the rule below
will prevent this without relying on scoped style.

- To prevent namespace collisions between CSS classes, the class for the
top-level element in each component should be the same as its component name.
For example, a component under `src/components/pdx/some-folder/my-component.vue`
will be assigned the name `<pdx-some-folder-my-component>` by the auto-import
plugin, so if you need to use style in the component, you should give the
topmost element `class="some-folder-my-component"`, and use BEM names for any
other CSS classes in the same component.
