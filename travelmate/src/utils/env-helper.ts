// Environment Helper - Handles environment variables and configuration
export class EnvironmentHelper {
  private static instance: EnvironmentHelper;
  private config: Record<string, any> = {};

  private constructor() {
    this.loadEnvironmentVariables();
  }

  public static getInstance(): EnvironmentHelper {
    if (!EnvironmentHelper.instance) {
      EnvironmentHelper.instance = new EnvironmentHelper();
    }
    return EnvironmentHelper.instance;
  }

  private loadEnvironmentVariables(): void {
    // Load all environment variables
    this.config = {
      // API Configuration
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost",
      AUTH_SERVICE_URL:
        import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost/auth/api",
      USER_SERVICE_URL:
        import.meta.env.VITE_USER_SERVICE_URL || "http://localhost/user/api",
      TRIP_SERVICE_URL:
        import.meta.env.VITE_TRIP_SERVICE_URL || "http://localhost/trip/api",
      TRAVEL_JOURNAL_SERVICE_URL:
        import.meta.env.VITE_TRAVEL_JOURNAL_SERVICE_URL ||
        "http://localhost/journal/api",
      API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),

      // App Configuration
      APP_NAME: import.meta.env.VITE_APP_NAME || "Travel Mate Admin",
      APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
      APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || "development",

      // Authentication
      JWT_SECRET: import.meta.env.VITE_JWT_SECRET || "",
      AUTH_COOKIE_NAME: import.meta.env.VITE_AUTH_COOKIE_NAME || "auth_token",
      TOKEN_REFRESH_THRESHOLD: parseInt(
        import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || "300"
      ), // 5 minutes

      // Cloudinary Configuration
      CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
      CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || "",
      CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET || "",
      CLOUDINARY_UPLOAD_PRESET:
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",

      // Database Configuration (for reference)
      DATABASE_URL: import.meta.env.VITE_DATABASE_URL || "",
      REDIS_URL: import.meta.env.VITE_REDIS_URL || "",

      // Email Configuration
      EMAIL_SERVICE: import.meta.env.VITE_EMAIL_SERVICE || "",
      EMAIL_USER: import.meta.env.VITE_EMAIL_USER || "",
      EMAIL_PASSWORD: import.meta.env.VITE_EMAIL_PASSWORD || "",

      // Social Media APIs
      GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || "",
      TWITTER_API_KEY: import.meta.env.VITE_TWITTER_API_KEY || "",

      // Payment Gateway
      STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
      PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || "",

      // Maps and Location
      GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
      MAPBOX_ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "",

      // Analytics
      GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || "",
      MIXPANEL_TOKEN: import.meta.env.VITE_MIXPANEL_TOKEN || "",

      // Feature Flags
      ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
      ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",
      ENABLE_MAINTENANCE_MODE:
        import.meta.env.VITE_ENABLE_MAINTENANCE_MODE === "true",

      // File Upload
      MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "10485760"), // 10MB
      ALLOWED_FILE_TYPES:
        import.meta.env.VITE_ALLOWED_FILE_TYPES || "jpg,jpeg,png,gif,pdf",

      // Pagination
      DEFAULT_PAGE_SIZE: parseInt(
        import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10"
      ),
      MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || "100"),

      // Cache
      CACHE_TTL: parseInt(import.meta.env.VITE_CACHE_TTL || "300"), // 5 minutes

      // Security
      ENABLE_CSP: import.meta.env.VITE_ENABLE_CSP === "true",
      ENABLE_HTTPS_ONLY: import.meta.env.VITE_ENABLE_HTTPS_ONLY === "true",

      // Logging
      LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || "info",
      ENABLE_CONSOLE_LOGS: import.meta.env.VITE_ENABLE_CONSOLE_LOGS !== "false",
    };
  }

  // Get environment variable
  public get(key: string, defaultValue?: any): any {
    return this.config[key] ?? defaultValue;
  }

  // Set environment variable (for runtime configuration)
  public set(key: string, value: any): void {
    this.config[key] = value;
  }

  // Check if running in development
  public isDevelopment(): boolean {
    return this.get("APP_ENVIRONMENT") === "development" || import.meta.env.DEV;
  }

  // Check if running in production
  public isProduction(): boolean {
    return this.get("APP_ENVIRONMENT") === "production" || import.meta.env.PROD;
  }

  // Check if running in staging
  public isStaging(): boolean {
    return this.get("APP_ENVIRONMENT") === "staging";
  }

  // Check if running in test environment
  public isTest(): boolean {
    return this.get("APP_ENVIRONMENT") === "test";
  }

  // Get API base URL
  public getApiBaseUrl(): string {
    return this.get("API_BASE_URL");
  }

  // Get Auth Service URL
  public getAuthServiceUrl(): string {
    return this.get("AUTH_SERVICE_URL");
  }

  // Get User Service URL
  public getUserServiceUrl(): string {
    return this.get("USER_SERVICE_URL");
  }

  // Get Trip Service URL
  public getTripServiceUrl(): string {
    return this.get("TRIP_SERVICE_URL");
  }

  public getJournalServiceUrl(): string {
    return this.get("TRAVEL_JOURNAL_SERVICE_URL");
  }

  // Get API timeout
  public getApiTimeout(): number {
    return this.get("API_TIMEOUT");
  }

  // Get app configuration
  public getAppConfig(): {
    name: string;
    version: string;
    environment: string;
  } {
    return {
      name: this.get("APP_NAME"),
      version: this.get("APP_VERSION"),
      environment: this.get("APP_ENVIRONMENT"),
    };
  }

  // Get Cloudinary configuration
  public getCloudinaryConfig(): {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset: string;
  } {
    return {
      cloudName: this.get("CLOUDINARY_CLOUD_NAME"),
      apiKey: this.get("CLOUDINARY_API_KEY"),
      apiSecret: this.get("CLOUDINARY_API_SECRET"),
      uploadPreset: this.get("CLOUDINARY_UPLOAD_PRESET"),
    };
  }

  // Get authentication configuration
  public getAuthConfig(): {
    jwtSecret: string;
    cookieName: string;
    refreshThreshold: number;
  } {
    return {
      jwtSecret: this.get("JWT_SECRET"),
      cookieName: this.get("AUTH_COOKIE_NAME"),
      refreshThreshold: this.get("TOKEN_REFRESH_THRESHOLD"),
    };
  }

  // Get feature flags
  public getFeatureFlags(): {
    analytics: boolean;
    debug: boolean;
    maintenanceMode: boolean;
    csp: boolean;
    httpsOnly: boolean;
    consoleLogs: boolean;
  } {
    return {
      analytics: this.get("ENABLE_ANALYTICS"),
      debug: this.get("ENABLE_DEBUG"),
      maintenanceMode: this.get("ENABLE_MAINTENANCE_MODE"),
      csp: this.get("ENABLE_CSP"),
      httpsOnly: this.get("ENABLE_HTTPS_ONLY"),
      consoleLogs: this.get("ENABLE_CONSOLE_LOGS"),
    };
  }

  // Get file upload configuration
  public getFileUploadConfig(): {
    maxSize: number;
    allowedTypes: string[];
  } {
    return {
      maxSize: this.get("MAX_FILE_SIZE"),
      allowedTypes: this.get("ALLOWED_FILE_TYPES").split(","),
    };
  }

  // Get pagination configuration
  public getPaginationConfig(): {
    defaultPageSize: number;
    maxPageSize: number;
  } {
    return {
      defaultPageSize: this.get("DEFAULT_PAGE_SIZE"),
      maxPageSize: this.get("MAX_PAGE_SIZE"),
    };
  }

  // Validate required environment variables
  public validateRequiredVariables(requiredVars: string[]): boolean {
    const missing = requiredVars.filter((varName) => !this.get(varName));

    if (missing.length > 0) {
      console.error("Missing required environment variables:", missing);
      return false;
    }

    return true;
  }

  // Get all configuration (for debugging)
  public getAllConfig(): Record<string, any> {
    return { ...this.config };
  }

  // Get masked configuration (hide sensitive data)
  public getMaskedConfig(): Record<string, any> {
    const sensitiveKeys = [
      "JWT_SECRET",
      "CLOUDINARY_API_SECRET",
      "EMAIL_PASSWORD",
      "DATABASE_URL",
      "REDIS_URL",
    ];

    const masked = { ...this.config };
    sensitiveKeys.forEach((key) => {
      if (masked[key]) {
        masked[key] = "***HIDDEN***";
      }
    });

    return masked;
  }
}

// Export singleton instance
export const environmentHelper = EnvironmentHelper.getInstance();

// Helper functions
export const getEnv = (key: string, defaultValue?: any) =>
  environmentHelper.get(key, defaultValue);
export const isDevelopment = () => environmentHelper.isDevelopment();
export const isProduction = () => environmentHelper.isProduction();
export const getApiBaseUrl = () => environmentHelper.getApiBaseUrl();
export const getAppConfig = () => environmentHelper.getAppConfig();
export const getFeatureFlags = () => environmentHelper.getFeatureFlags();
