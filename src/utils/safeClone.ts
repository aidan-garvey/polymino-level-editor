/**
 * Wrapper around `structuredClone` which also works for Vue reactive proxies,
 * by first passing the input to `toRaw`.
 */
export const safeClone = <T>(obj: T): T => {
  return structuredClone(toRaw(obj))
}
