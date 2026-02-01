// To prevent collisions, all keys written to local storage begin with one of
// these prefixes, which end in a colon.
export const LEVEL_PREFIX = 'level:' as const
export const FEATURE_TEST_PREFIX = 'featuretest:' as const

type LevelPrefix = typeof LEVEL_PREFIX
type FeatureTestPrefix = typeof FEATURE_TEST_PREFIX

type StorageKeyPrefix =
  | LevelPrefix
  | FeatureTestPrefix

export type LevelKey = `${LevelPrefix}${string}`

export type StorageKey = `${StorageKeyPrefix}${string}`

export const isLevelKey = (str: string): str is LevelKey => {
  return str.startsWith(LEVEL_PREFIX)
}

export const isStorageKey = (str: string): str is StorageKey => {
  return isLevelKey(str) || str.startsWith(FEATURE_TEST_PREFIX)
}
