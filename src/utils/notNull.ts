export const notNull = <T>(value: T | undefined | null): NonNullable<T> => {
  if (value === undefined || value === null) {
    throw new Error(`Value is null or undefined: ${value}`)
  }
  return value
}
