// LocalStorage wrapper with error handling and utilities

import { STORAGE_KEYS } from './constants';

// Generic localStorage functions
export const storage = {
    // Get item from localStorage
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage for key "${key}":`, error);
            return defaultValue;
        }
    },

    // Set item in localStorage
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage for key "${key}":`, error);
            return false;
        }
    },

    // Remove item from localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage for key "${key}":`, error);
            return false;
        }
    },

    // Clear all localStorage
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // Check if localStorage is available
    isAvailable: () => {
        try {
            const testKey = '__localStorage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    },

    // Get storage usage info
    getUsage: () => {
        if (!storage.isAvailable()) return null;

        let totalSize = 0;
        const items = {};

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const size = localStorage[key].length;
                totalSize += size;
                items[key] = size;
            }
        }

        return {
            totalSize,
            items,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            availableSpace: 5120 - totalSize, // Assuming 5MB limit
        };
    },
};

// Application-specific storage functions
export const appStorage = {
    // Transactions
    getTransactions: () => storage.get(STORAGE_KEYS.TRANSACTIONS, []),
    setTransactions: (transactions) => storage.set(STORAGE_KEYS.TRANSACTIONS, transactions),
    clearTransactions: () => storage.remove(STORAGE_KEYS.TRANSACTIONS),

    // Categories
    getCategories: () => storage.get(STORAGE_KEYS.CATEGORIES, null),
    setCategories: (categories) => storage.set(STORAGE_KEYS.CATEGORIES, categories),
    clearCategories: () => storage.remove(STORAGE_KEYS.CATEGORIES),

    // User preferences
    getPreferences: () => storage.get(STORAGE_KEYS.USER_PREFERENCES, {}),
    setPreferences: (preferences) => storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences),
    updatePreference: (key, value) => {
        const preferences = appStorage.getPreferences();
        preferences[key] = value;
        return appStorage.setPreferences(preferences);
    },

    // Filters
    getFilters: () => storage.get(STORAGE_KEYS.FILTERS, {}),
    setFilters: (filters) => storage.set(STORAGE_KEYS.FILTERS, filters),
    clearFilters: () => storage.remove(STORAGE_KEYS.FILTERS),

    // Theme
    getTheme: () => storage.get(STORAGE_KEYS.THEME, 'light'),
    setTheme: (theme) => storage.set(STORAGE_KEYS.THEME, theme),

    // Clear all app data
    clearAllData: () => {
        const keys = Object.values(STORAGE_KEYS);
        keys.forEach(key => storage.remove(key));
    },

    // Export all app data
    exportData: () => {
        const data = {};
        Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
            data[name.toLowerCase()] = storage.get(key);
        });
        return data;
    },

    // Import app data
    importData: (data) => {
        try {
            Object.entries(data).forEach(([name, value]) => {
                const key = STORAGE_KEYS[name.toUpperCase()];
                if (key && value !== null && value !== undefined) {
                    storage.set(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // Get app data size
    getDataSize: () => {
        const usage = storage.getUsage();
        if (!usage) return null;

        const appKeys = Object.values(STORAGE_KEYS);
        let appSize = 0;

        appKeys.forEach(key => {
            if (usage.items[key]) {
                appSize += usage.items[key];
            }
        });

        return {
            appSize,
            appSizeKB: (appSize / 1024).toFixed(2),
            totalSize: usage.totalSize,
            totalSizeKB: usage.totalSizeKB,
        };
    },
};

// Data migration utilities
export const migration = {
    // Get current data version
    getVersion: () => storage.get('__data_version__', '1.0.0'),

    // Set data version
    setVersion: (version) => storage.set('__data_version__', version),

    // Run migration if needed
    migrate: (currentVersion, migrations) => {
        const dataVersion = migration.getVersion();

        if (dataVersion === currentVersion) return true;

        try {
            // Run migrations in order
            Object.entries(migrations)
                .sort(([a], [b]) => a.localeCompare(b))
                .forEach(([version, migrationFn]) => {
                    if (version > dataVersion && version <= currentVersion) {
                        console.log(`Running migration to version ${version}`);
                        migrationFn();
                    }
                });

            migration.setVersion(currentVersion);
            return true;
        } catch (error) {
            console.error('Migration failed:', error);
            return false;
        }
    },
};

// Backup and restore utilities
export const backup = {
    // Create backup
    create: () => {
        const data = appStorage.exportData();
        const backupData = {
            version: migration.getVersion(),
            timestamp: new Date().toISOString(),
            data,
        };
        return JSON.stringify(backupData, null, 2);
    },

    // Restore from backup
    restore: (backupString) => {
        try {
            const backup = JSON.parse(backupString);

            if (!backup.data || !backup.version) {
                throw new Error('Invalid backup format');
            }

            // Clear existing data
            appStorage.clearAllData();

            // Import backup data
            const success = appStorage.importData(backup.data);

            if (success) {
                migration.setVersion(backup.version);
            }

            return success;
        } catch (error) {
            console.error('Restore failed:', error);
            return false;
        }
    },

    // Validate backup
    validate: (backupString) => {
        try {
            const backup = JSON.parse(backupString);
            return !!(backup.data && backup.version && backup.timestamp);
        } catch {
            return false;
        }
    },
};

// Compression utilities (for large datasets)
export const compression = {
    // Simple compression using JSON.stringify with reduced precision
    compress: (data) => {
        try {
            // Round numbers to reduce precision and size
            const compressed = JSON.stringify(data, (key, value) => {
                if (typeof value === 'number' && !Number.isInteger(value)) {
                    return Math.round(value * 100) / 100; // 2 decimal places
                }
                return value;
            });
            return compressed;
        } catch (error) {
            console.error('Compression failed:', error);
            return JSON.stringify(data);
        }
    },

    // Decompress (just parse JSON)
    decompress: (compressedData) => {
        try {
            return JSON.parse(compressedData);
        } catch (error) {
            console.error('Decompression failed:', error);
            return null;
        }
    },
};

// Sync utilities (for future cloud sync feature)
export const sync = {
    // Mark data as needing sync
    markForSync: (dataType) => {
        const syncQueue = storage.get('__sync_queue__', []);
        if (!syncQueue.includes(dataType)) {
            syncQueue.push(dataType);
            storage.set('__sync_queue__', syncQueue);
        }
    },

    // Get items needing sync
    getSyncQueue: () => storage.get('__sync_queue__', []),

    // Clear sync queue
    clearSyncQueue: () => storage.remove('__sync_queue__'),

    // Mark data as synced
    markSynced: (dataType) => {
        const syncQueue = sync.getSyncQueue();
        const filtered = syncQueue.filter(item => item !== dataType);
        storage.set('__sync_queue__', filtered);

        // Store last sync timestamp
        const syncTimestamps = storage.get('__sync_timestamps__', {});
        syncTimestamps[dataType] = new Date().toISOString();
        storage.set('__sync_timestamps__', syncTimestamps);
    },

    // Get last sync time
    getLastSyncTime: (dataType) => {
        const syncTimestamps = storage.get('__sync_timestamps__', {});
        return syncTimestamps[dataType] || null;
    },
};

// Performance monitoring
export const performance = {
    // Measure storage operation time
    measure: (operation, fn) => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();

        console.log(`Storage operation "${operation}" took ${end - start} milliseconds`);
        return result;
    },

    // Get storage performance stats
    getStats: () => {
        const usage = storage.getUsage();
        const dataSize = appStorage.getDataSize();

        return {
            isAvailable: storage.isAvailable(),
            usage,
            dataSize,
            lastAccess: new Date().toISOString(),
        };
    },
};