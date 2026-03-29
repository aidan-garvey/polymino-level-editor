/**
 * Definitions of attributes that aren't yet implemented in `@vue/runtime-dom`,
 * so Vue doesn't emit errors due to unrecognized props/attributes.
 */

declare module '@vue/runtime-dom' {
  interface DialogHTMLAttributes {
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby | MDN Reference}
     */
    closedby?: 'any' | 'closerequest' | 'none'
  }
}

export {}
