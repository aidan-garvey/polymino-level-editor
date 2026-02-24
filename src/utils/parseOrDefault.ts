/**
 * Catches errors due to invalid JSON data and returns a fallback value instead.
 */
export const parseOrDefault = (
  data: string,
  fallback: unknown = undefined
): unknown => {
  try {
    return JSON.parse(data)
  } catch {
    return fallback
  }
}
