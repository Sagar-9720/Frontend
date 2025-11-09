// Core Utils Barrel - consolidated exports with clearer naming
// This replaces the previous index.ts barrel. All code should import from 'utils/core-utils'.
// Deprecated: importing from 'utils' (index.ts) will continue to work temporarily but should be migrated.

// Re-export constant groups
export * from './constants';

// Environment & device/navigation helpers
export * from './env-helper';
export * from './device-utility';
export * from './navigation-utils';

// HTTP + storage + logging
export * from './http-client';
export * from './storage-utility';
export * from './logger';

// Themes & validation & general helpers
export * from './custom-themes';
export * from './validity';
export * from './helpers';
export * from './formatters'; // delegating wrappers (no duplication now)

// Types passthrough (explicit for discoverability)
export type { RequestConfig, ApiResponse, ApiError } from './http-client';
export type { StorageOptions } from './storage-utility';
export type { LogEntry } from './logger';
export type { Theme, ThemeColors } from './custom-themes';
export type { ValidationResult, ValidationRule, ValidationSchema } from './validity';
export type { NavigationItem, BreadcrumbItem } from './navigation-utils';

// Initialization helper to force eager singleton setup if desired
export const initializeCoreUtils = async () => {
  const [device, env, nav, http, storage, log, themes, val] = await Promise.all([
    import('./device-utility'),
    import('./env-helper'),
    import('./navigation-utils'),
    import('./http-client'),
    import('./storage-utility'),
    import('./logger'),
    import('./custom-themes'),
    import('./validity')
  ]);

  // Touch basic methods to ensure any lazy init logic runs
  device.deviceUtility.getScreenDimensions();
  env.environmentHelper.getApiBaseUrl();
  nav.navigationUtils.getCurrentPath();
  http.httpClient.clearCache();
  storage.storageUtility.isStorageAvailable('localStorage');
  log.logger.info('Core utils initialized');
  themes.customThemes.getCurrentTheme();
  val.validity.validateEmail('init@example.com');
};

