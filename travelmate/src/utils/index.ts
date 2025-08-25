// Utils Index - Export all utility functions and classes
export * from './constants';
export * from './device-utility';
export * from './env-helper';
export * from './navigation-utils';
export * from './http-client';
export * from './storage-utility';
export * from './logger';
export * from './custom-themes';
export * from './validity';
export * from './helpers';

// Types
export type {
  RequestConfig,
  ApiResponse,
  ApiError
} from './http-client';

export type {
  StorageOptions
} from './storage-utility';

export type {
  LogEntry
} from './logger';

export type {
  Theme,
  ThemeColors
} from './custom-themes';

export type {
  ValidationResult,
  ValidationRule,
  ValidationSchema
} from './validity';

export type {
  NavigationItem,
  BreadcrumbItem
} from './navigation-utils';

// Utility function to initialize all utilities
export const initializeUtils = async () => {
  // These imports will trigger the singleton initialization
  const { deviceUtility } = await import('./device-utility');
  const { environmentHelper } = await import('./env-helper');
  const { navigationUtils } = await import('./navigation-utils');
  const { httpClient } = await import('./http-client');
  const { storageUtility } = await import('./storage-utility');
  const { logger } = await import('./logger');
  const { customThemes } = await import('./custom-themes');
  const { validity } = await import('./validity');
  
  // Access the instances to ensure they're initialized
  deviceUtility.getScreenDimensions();
  environmentHelper.getApiBaseUrl();
  navigationUtils.getCurrentPath();
  httpClient.clearCache();
  storageUtility.isStorageAvailable('localStorage');
  logger.info('Utils initialized');
  customThemes.getCurrentTheme();
  validity.validateEmail('test@example.com');
  
  console.log('All utilities initialized successfully');
};
