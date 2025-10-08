/**
 * localStorage utilities with versioning and migration support
 * Prevents data loss when form schema changes
 */

const STORAGE_KEY = 'consultation-form';
const CURRENT_VERSION = 1;

export interface StorageData<T = any> {
  version: number;
  timestamp: number;
  data: T;
}

/**
 * Save form data to localStorage with versioning
 */
export function saveFormData<T>(data: T): void {
  try {
    const storageData: StorageData<T> = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load form data from localStorage with migration if needed
 */
export function loadFormData<T>(): T | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsedData: StorageData<T> = JSON.parse(stored);

    // Check version and migrate if needed
    if (parsedData.version !== CURRENT_VERSION) {
      const migrated = migrateData(parsedData);
      if (migrated) {
        saveFormData(migrated.data);
        return migrated.data;
      }
      return null;
    }

    return parsedData.data;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Clear form data from localStorage
 */
export function clearFormData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Check if there is saved data
 */
export function hasSavedData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Migrate data from old versions to current version
 * Add migration logic when version changes
 */
function migrateData<T>(oldData: StorageData): StorageData<T> | null {
  // Example migration from v0 to v1
  // if (oldData.version === 0) {
  //   return {
  //     version: 1,
  //     timestamp: oldData.timestamp,
  //     data: transformV0ToV1(oldData.data),
  //   };
  // }

  // If no migration path exists, return null to clear old data
  console.warn(`No migration path from version ${oldData.version} to ${CURRENT_VERSION}`);
  return null;
}

/**
 * Get storage info (for debugging)
 */
export function getStorageInfo(): {
  hasData: boolean;
  version?: number;
  timestamp?: number;
  age?: string;
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { hasData: false };

    const parsed: StorageData = JSON.parse(stored);
    const ageMs = Date.now() - parsed.timestamp;
    const ageMinutes = Math.floor(ageMs / 60000);
    const ageHours = Math.floor(ageMinutes / 60);

    return {
      hasData: true,
      version: parsed.version,
      timestamp: parsed.timestamp,
      age: ageHours > 0 ? `${ageHours}h` : `${ageMinutes}min`,
    };
  } catch {
    return { hasData: false };
  }
}

