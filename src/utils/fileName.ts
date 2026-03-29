import type { LevelStorage } from '@/types/Storage/LevelStorage'

export enum NameResult {
  // No issues
  SAFE = 0,
  // Name is empty
  EMPTY = 1,
  // Name contains invalid characters
  INVALID_CHARS = 2,
  // Name matches that of an existing level
  MATCHES_EXISTING = 3,
  // Name contains leading or trailing whitespace
  UNTRIMMED = 4,
}

const validNamePattern = /^[a-zA-Z0-9 ._-]+$/

/**
 * Checks if a file name is valid, returning a code indicating that it is valid
 * or an issue with the name.
 */
export const fileNameValid = (
  name: string | undefined | null,
  levelStorage: LevelStorage,
): NameResult => {
  if (!name) {
    return NameResult.EMPTY
  } else if (name.trim().length !== name.length) {
    return NameResult.UNTRIMMED
  } else if (!validNamePattern.test(name)) {
    return NameResult.INVALID_CHARS
  } else if (levelStorage.getSavedLevels()?.[name]) {
    return NameResult.MATCHES_EXISTING
  } else {
    return NameResult.SAFE
  }
}
