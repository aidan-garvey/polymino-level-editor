/**
 * Type guard helper to skip the first three steps for objects with a `kind`
 * discriminator.
 */
export const isSomeKind = (data: unknown): data is { kind: unknown } => {
  return typeof data === 'object'
    && data !== null
    && 'kind' in data
}
