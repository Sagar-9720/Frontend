// Image Constants and Enums
export enum ImageFormats {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
  SVG = 'svg'
}

export enum ImageSizes {
  THUMBNAIL = 'thumbnail', // 150x150
  SMALL = 'small',         // 300x300
  MEDIUM = 'medium',       // 600x600
  LARGE = 'large',         // 1200x1200
  ORIGINAL = 'original'    // Original size
}

export const IMAGE_SIZE_DIMENSIONS = {
  [ImageSizes.THUMBNAIL]: { width: 150, height: 150 },
  [ImageSizes.SMALL]: { width: 300, height: 300 },
  [ImageSizes.MEDIUM]: { width: 600, height: 600 },
  [ImageSizes.LARGE]: { width: 1200, height: 1200 },
  [ImageSizes.ORIGINAL]: { width: null, height: null }
} as const;

export const IMAGE_MAX_FILE_SIZE = {
  [ImageSizes.THUMBNAIL]: 500 * 1024,      // 500KB
  [ImageSizes.SMALL]: 1 * 1024 * 1024,     // 1MB
  [ImageSizes.MEDIUM]: 3 * 1024 * 1024,    // 3MB
  [ImageSizes.LARGE]: 5 * 1024 * 1024,     // 5MB
  [ImageSizes.ORIGINAL]: 10 * 1024 * 1024  // 10MB
} as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const IMAGE_UPLOAD_ENDPOINTS = {
  PROFILE: '/upload/profile',
  DESTINATION: '/upload/destination',
  TRIP: '/upload/trip',
  JOURNAL: '/upload/journal',
  GENERAL: '/upload/general'
} as const;

// Default image URLs
export const DEFAULT_IMAGES = {
  PROFILE_AVATAR: '/assets/images/default-avatar.png',
  DESTINATION_PLACEHOLDER: '/assets/images/destination-placeholder.jpg',
  TRIP_PLACEHOLDER: '/assets/images/trip-placeholder.jpg',
  JOURNAL_PLACEHOLDER: '/assets/images/journal-placeholder.jpg',
  LOGO: '/assets/images/logo.png',
  LOGO_DARK: '/assets/images/logo-dark.png',
  NO_IMAGE: '/assets/images/no-image.svg'
} as const;

// Image quality settings
export const IMAGE_QUALITY = {
  LOW: 0.6,
  MEDIUM: 0.8,
  HIGH: 0.9,
  ORIGINAL: 1.0
} as const;

export type ImageFormat = keyof typeof ImageFormats;
export type ImageSize = keyof typeof ImageSizes;
export type DefaultImageKey = keyof typeof DEFAULT_IMAGES;
