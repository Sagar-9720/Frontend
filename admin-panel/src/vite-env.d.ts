/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_SERVICE_URL: string
  readonly VITE_USER_SERVICE_URL: string
  readonly VITE_TRIP_SERVICE_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_JWT_SECRET_KEY: string
  readonly VITE_JWT_EXPIRY: string
  readonly VITE_REFRESH_TOKEN_EXPIRY: string
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  readonly VITE_CLOUDINARY_API_KEY: string
  readonly VITE_CLOUDINARY_API_SECRET: string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_MAX_FILES_PER_UPLOAD: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_MAX_PAGE_SIZE: string
  readonly VITE_ENABLE_EMAIL_NOTIFICATIONS: string
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_REAL_TIME_UPDATES: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_SENDGRID_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_DATABASE_URL: string
  readonly VITE_REDIS_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_FACEBOOK_APP_ID: string
  readonly VITE_TWITTER_API_KEY: string
  readonly VITE_INSTAGRAM_ACCESS_TOKEN: string
  readonly VITE_CORS_ORIGINS: string
  readonly VITE_RATE_LIMIT_REQUESTS: string
  readonly VITE_RATE_LIMIT_WINDOW: string
  readonly VITE_NODE_ENV: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_ENABLE_MOCK_DATA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
