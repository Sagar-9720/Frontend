import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  // API Configuration
  static String get apiBaseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'http://localhost:8080';
  static String get authServiceUrl =>
      dotenv.env['AUTH_SERVICE_URL'] ?? 'http://localhost:8081';
  static String get tripServiceUrl =>
      dotenv.env['TRIP_SERVICE_URL'] ?? 'http://localhost:8082';
  static String get userServiceUrl =>
      dotenv.env['USER_SERVICE_URL'] ?? 'http://localhost:8083';

  // API Keys
  static String get googleMapsApiKey => dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';
  static String get weatherApiKey => dotenv.env['WEATHER_API_KEY'] ?? '';
  static String get currencyApiKey => dotenv.env['CURRENCY_API_KEY'] ?? '';
  static String get firebaseApiKey => dotenv.env['FIREBASE_API_KEY'] ?? '';

  // OAuth Configuration
  static String get googleClientId => dotenv.env['GOOGLE_CLIENT_ID'] ?? '';
  static String get facebookAppId => dotenv.env['FACEBOOK_APP_ID'] ?? '';
  static String get appleTeamId => dotenv.env['APPLE_TEAM_ID'] ?? '';

  // App Configuration
  static String get appName => dotenv.env['APP_NAME'] ?? 'TravelMate';
  static String get appVersion => dotenv.env['APP_VERSION'] ?? '1.0.0';
  static String get environment => dotenv.env['ENVIRONMENT'] ?? 'development';

  // Feature Flags
  static bool get enablePushNotifications =>
      dotenv.env['ENABLE_PUSH_NOTIFICATIONS']?.toLowerCase() == 'true';
  static bool get enableAnalytics =>
      dotenv.env['ENABLE_ANALYTICS']?.toLowerCase() == 'true';
  static bool get enableCrashReporting =>
      dotenv.env['ENABLE_CRASH_REPORTING']?.toLowerCase() == 'true';
  static bool get enableOfflineMode =>
      dotenv.env['ENABLE_OFFLINE_MODE']?.toLowerCase() == 'true';

  // Storage Configuration
  static int get cacheDurationHours =>
      int.tryParse(dotenv.env['CACHE_DURATION_HOURS'] ?? '24') ?? 24;
  static int get maxCacheSizeMB =>
      int.tryParse(dotenv.env['MAX_CACHE_SIZE_MB'] ?? '100') ?? 100;

  // Debug Settings
  static bool get debugMode =>
      dotenv.env['DEBUG_MODE']?.toLowerCase() == 'true';
  static String get logLevel => dotenv.env['LOG_LEVEL'] ?? 'debug';

  // Computed properties
  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';
  static bool get isStaging => environment == 'staging';

  // API Endpoints
  static String get authLoginUrl => '$authServiceUrl/auth/login';
  static String get authRegisterUrl => '$authServiceUrl/auth/register';
  static String get authRefreshUrl => '$authServiceUrl/auth/refresh';
  static String get authLogoutUrl => '$authServiceUrl/auth/logout';
  static String get authProfileUrl => '$authServiceUrl/auth/profile';

  static String get tripsUrl => '$tripServiceUrl/trips';
  static String get destinationsUrl => '$tripServiceUrl/destinations';
  static String get bookingsUrl => '$tripServiceUrl/bookings';

  static String get userProfileUrl => '$userServiceUrl/profile';
  static String get userBookingsUrl => '$userServiceUrl/bookings';
  static String get userReviewsUrl => '$userServiceUrl/reviews';
  static String get userSavedTripsUrl => '$userServiceUrl/saved-trips';

  // Initialize configuration
  static Future<void> initialize() async {
    await dotenv.load(fileName: ".env");
  }
}
