import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:travelmate/utils/local_storage/flutter_storage_utility.dart';

class TEnvFileReader {
  static Future<void> loadEnvFile() async {
    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      throw Exception("Failed to load .env file: $e");
    }
  }

  /// Fetch user token from .env file or storage
  static Future<String?> fetchUserToken() async {
    await loadEnvFile();

    const tokenKey = 'USER_TOKEN';
    final _tokenKey = dotenv.env[tokenKey];

    if (_tokenKey == null || _tokenKey.isEmpty) {
      throw Exception("USER_TOKEN is not defined in the .env file");
    }

    String? token = await TFlutterStorage().readData(_tokenKey);

    if (token == null || token.isEmpty) {
      token = null;
    }

    return token;
  }

  /// Save user token to storage
  static Future<void> saveUserToken(String token) async {
    await loadEnvFile();

    const tokenKey = 'USER_TOKEN';
    final _tokenKey = dotenv.env[tokenKey];

    if (_tokenKey == null || _tokenKey.isEmpty) {
      throw Exception("USER_TOKEN is not defined in the .env file");
    }

    await TFlutterStorage().saveData(_tokenKey, token);
  }

  /// Remove user token from storage
  static Future<void> removeUserToken() async {
    await loadEnvFile();

    const tokenKey = 'USER_TOKEN';
    final _tokenKey = dotenv.env[tokenKey];

    if (_tokenKey == null || _tokenKey.isEmpty) {
      throw Exception("USER_TOKEN is not defined in the .env file");
    }

    await TFlutterStorage().removeData(_tokenKey);
  }

  //save Refresh Token
  static Future<void> saveRefreshToken(String refreshToken) async {
    await loadEnvFile();

    const refreshTokenKey = 'REFRESH_TOKEN';
    final _refreshTokenKey = dotenv.env[refreshTokenKey];
    if (_refreshTokenKey == null || _refreshTokenKey.isEmpty) {
      throw Exception("REFRESH_TOKEN is not defined in the .env file");
    }
    await TFlutterStorage().saveData(_refreshTokenKey, refreshToken);
  }

  //fetch Refresh Token
  static Future<String?> fetchRefreshToken() async {
    await loadEnvFile();

    const refreshTokenKey = 'REFRESH_TOKEN';
    final _refreshTokenKey = dotenv.env[refreshTokenKey];
    if (_refreshTokenKey == null || _refreshTokenKey.isEmpty) {
      throw Exception("REFRESH_TOKEN is not defined in the .env file");
    }
    String? refreshToken = await TFlutterStorage().readData(_refreshTokenKey);
    if (refreshToken == null || refreshToken.isEmpty) {
      refreshToken = null;
    }
    return refreshToken;
  }

  ///remove Refresh Token
  static Future<void> removeRefreshToken() async {
    await loadEnvFile();

    const refreshTokenKey = 'REFRESH_TOKEN';
    final _refreshTokenKey = dotenv.env[refreshTokenKey];
    if (_refreshTokenKey == null || _refreshTokenKey.isEmpty) {
      throw Exception("REFRESH_TOKEN is not defined in the .env file");
    }
    await TFlutterStorage().removeData(_refreshTokenKey);
  }

  ///fetch User info
  static Future<dynamic> fetchUserInfo() async {
    await loadEnvFile();
    const userInfoKey = 'USER_INFO';
    if (userInfoKey.isEmpty) {
      throw Exception("USER_INFO is not defined in the .env file");
    }
    return await TFlutterStorage().readData(userInfoKey);
  }

  ///save User info
  static Future<void> saveUserInfo(dynamic userInfo) async {
    await loadEnvFile();

    const userInfoKey = 'USER_INFO';
    if (userInfoKey.isEmpty) {
      throw Exception("USER_INFO is not defined in the .env file");
    }
    await TFlutterStorage().saveData(userInfoKey, userInfo);
  }

  // Fetch Api Base URL
  static String fetchApiBaseUrl() {
    const apiBaseUrlKey = 'API_BASE_URL';
    final apiBaseUrl = dotenv.env[apiBaseUrlKey];
    if (apiBaseUrl == null || apiBaseUrl.isEmpty) {
      throw Exception("API_BASE_URL is not defined in the .env file");
    }
    return apiBaseUrl;
  }

  //Fetch Auth Endpoint
  static String fetchAuthEndpoint() {
    const authEndpointKey = 'AUTH_SERVICE_URL';
    final authEndpoint = dotenv.env[authEndpointKey];
    if (authEndpoint == null || authEndpoint.isEmpty) {
      throw Exception("AUTH_ENDPOINT is not defined in the .env file");
    }
    return authEndpoint;
  }

  // Fetch User Service Endpoint
  static String fetchUserServiceEndpoint() {
    const userServiceEndpointKey = 'USER_SERVICE_URL';
    final userServiceEndpoint = dotenv.env[userServiceEndpointKey];
    if (userServiceEndpoint == null || userServiceEndpoint.isEmpty) {
      throw Exception("USER_SERVICE_URL is not defined in the .env file");
    }
    return userServiceEndpoint;
  }

  // Fetch Trip Service Endpoint
  static String fetchTripServiceEndpoint() {
    const tripServiceEndpointKey = 'TRIP_SERVICE_URL';
    final tripServiceEndpoint = dotenv.env[tripServiceEndpointKey];
    if (tripServiceEndpoint == null || tripServiceEndpoint.isEmpty) {
      throw Exception("TRIP_SERVICE_URL is not defined in the .env file");
    }
    return tripServiceEndpoint;
  }

  // Fetch Journal Service Endpoint
  static String fetchJournalServiceEndpoint() {
    const journalServiceEndpointKey = 'JOURNAL_SERVICE_URL';
    final journalServiceEndpoint = dotenv.env[journalServiceEndpointKey];
    if (journalServiceEndpoint == null || journalServiceEndpoint.isEmpty) {
      throw Exception("JOURNAL_SERVICE_URL is not defined in the .env file");
    }
    return journalServiceEndpoint;
  }
}
