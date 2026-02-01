import type { ExportedLevel } from '@/types/Exported/ExportedLevel'
import type { SavedLevel } from '@/types/Saved/SavedLevel'
import type { StorageKey } from '@/types/Storage/StorageKey'
import { isSavedLevel } from '@/types/Saved/SavedLevel'
import { LEVEL_PREFIX, FEATURE_TEST_PREFIX, isLevelKey } from '@/types/Storage/StorageKey'

export type SavedLevelDict = Record<string, SavedLevel>

/**
 * Acts as a wrapper for localStorage as well as a way to export/download levels
 * to JSON files.
 */
export class LevelStorage {
  private storageHandle: Storage | null = null

  readonly currentLevelName = ref<string | null>(null)

  constructor() {
    // Try to access it immediately in case the user has it disabled and it'll
    // trigger a prompt asking the user for permission
    this.getLocalStorage()
  }

  private static read(storage: Storage, key: StorageKey): string | null {
    return storage.getItem(key)
  }

  private static write(storage: Storage, key: StorageKey, value: string): void {
    storage.setItem(key, value)
  }

  private static delete(storage: Storage, key: StorageKey): void {
    storage.removeItem(key)
  }

  /**
   * Attempt to get a reference to local storage, detecting if the browser has
   * disabled it by giving us a local storage object with a quota of 0.
   * Returns true if we were able to get local storage and set this.local to the
   * result, false if we could not get it and wrote 'storage-disabled' to
   * this.error.
   */
  private getLocalStorage(): Storage | null {
    if (this.storageHandle) {
      return this.storageHandle
    }

    try {
      this.storageHandle = window.localStorage
      LevelStorage.write(this.storageHandle, FEATURE_TEST_PREFIX, 'test')
      LevelStorage.delete(this.storageHandle, FEATURE_TEST_PREFIX)
      console.debug('Access to local storage acquired')
      return this.storageHandle
    } catch (e) {
      if (e instanceof DOMException
        && e.name === 'QuotaExceededError'
        && this.storageHandle
        && this.storageHandle.length > 0
      ) {
        // We're legitimately out of room and can still use storage if we free
        // up space
        console.warn('Access to local storage acquired, but storage is full')
        return this.storageHandle
      } else {
        console.error('Access to local storage not successful')
        this.storageHandle = null
        return this.storageHandle
      }
    }
  }

  /**
   * @returns Levels saved in local storage by name, or null if local storage
   * is not available.
   */
  getSavedLevels(): SavedLevelDict | null {
    const storage = this.getLocalStorage()
    if (!storage) {
      return null
    }

    const result: Record<string, SavedLevel> = {}
    for (let i = 0; i < storage.length; ++i) {
      const key = storage.key(i)
      if (key === null) {
        continue
      }

      if (!isLevelKey(key)) {
        // e.g. vue dev tools, no need to panic
        continue
      }

      const name = key.slice(LEVEL_PREFIX.length)

      const str = LevelStorage.read(storage, key)
      if (str === null) {
        console.warn(`No data at key ${key}, deleting...`)
        LevelStorage.delete(storage, key)
      } else {
        const data = JSON.parse(str)
        if (isSavedLevel(data)) {
          result[name] = data
        } else {
          console.warn(`Saved level ${key} is corrupted or outdated`)
          console.warn(data)
          // TODO: a way to update the level data if it's out-of-date, or a way
          // to display corrupted/outdated levels in the UI and download or
          // delete them.
        }
      }
    }
    return result
  }

  /**
   * Saves the level to local storage if available, falls back on downloading.
   * @throws Will throw a DOMException if storage is full
   */
  save(data: SavedLevel): void {
    const storage = this.getLocalStorage()
    if (!this.currentLevelName.value) {
      throw new Error('save() called when no level name was set, call saveAs()')
    } else if (!storage) {
      this.download(data)
    } else {
      LevelStorage.write(
        storage,
        `${LEVEL_PREFIX}${this.currentLevelName.value}`,
        JSON.stringify(data)
      )
    }
  }

  /**
   * Saves the level to local storage if available, falls back on downloading.
   * @throws Will throw a DOMException if storage is full
   */
  saveAs(data: SavedLevel, name: string): void {
    this.currentLevelName.value = name
    this.save(data)
  }

  loadLevel(name: string): SavedLevel | null {
    const storage = this.getLocalStorage()
    if (!storage) {
      return null
    }

    const str = LevelStorage.read(storage, `${LEVEL_PREFIX}${name}`)
    if (str === null) {
      return null
    }

    const data = JSON.parse(str)
    if (isSavedLevel(data)) {
      this.currentLevelName.value = name
      return data
    } else {
      return null
    }
  }

  download(data: SavedLevel): void {
    const name = `${this.currentLevelName.value || 'puzzle'}.json`
    this.downloadFile(JSON.stringify(data), name)
  }

  export(data: ExportedLevel): void {
    const name = `${this.currentLevelName.value || 'puzzle'}.level`
    this.downloadFile(JSON.stringify(data), name)
  }

  private downloadFile(data: string, name: string): void {
    const file = new File([data], name, {
      type: 'application/json'
    })
    const url = URL.createObjectURL(file)

    const link = document.createElement('a')
    link.download = name
    link.href = url

    document.body.appendChild(link)
    link.click()

    URL.revokeObjectURL(url)
  }
}
