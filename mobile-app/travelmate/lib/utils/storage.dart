import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class StorageService {
  static const _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  // Keys
  static const String _authTokensKey = 'auth_tokens';
  static const String _userKey = 'user_data';
  static const String _userPreferencesKey = 'user_preferences';
  static const String _savedTripsKey = 'saved_trips';
  static const String _recentSearchesKey = 'recent_searches';
  static const String _offlineDataKey = 'offline_data';

  // Auth token storage (secure)
  static Future<void> saveAuthTokens(AuthTokens tokens) async {
    await _secureStorage.write(
      key: _authTokensKey,
      value: jsonEncode(tokens.toJson()),
    );
  }

  static Future<AuthTokens?> getAuthTokens() async {
    final tokenString = await _secureStorage.read(key: _authTokensKey);
    if (tokenString != null) {
      try {
        final tokenMap = jsonDecode(tokenString) as Map<String, dynamic>;
        return AuthTokens.fromJson(tokenMap);
      } catch (e) {
        await clearAuthTokens();
        return null;
      }
    }
    return null;
  }

  static Future<void> clearAuthTokens() async {
    await _secureStorage.delete(key: _authTokensKey);
  }

  // User data storage (secure)
  static Future<void> saveUser(User user) async {
    await _secureStorage.write(
      key: _userKey,
      value: jsonEncode(user.toJson()),
    );
  }

  static Future<User?> getUser() async {
    final userString = await _secureStorage.read(key: _userKey);
    if (userString != null) {
      try {
        final userMap = jsonDecode(userString) as Map<String, dynamic>;
        return User.fromJson(userMap);
      } catch (e) {
        await clearUser();
        return null;
      }
    }
    return null;
  }

  static Future<void> clearUser() async {
    await _secureStorage.delete(key: _userKey);
  }

  // User preferences (shared preferences)
  static Future<void> saveUserPreferences(UserPreferences preferences) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        _userPreferencesKey, jsonEncode(preferences.toJson()));
  }

  static Future<UserPreferences?> getUserPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    final prefsString = prefs.getString(_userPreferencesKey);
    if (prefsString != null) {
      try {
        final prefsMap = jsonDecode(prefsString) as Map<String, dynamic>;
        return UserPreferences.fromJson(prefsMap);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Saved trips cache
  static Future<void> saveSavedTrips(List<SavedTrip> savedTrips) async {
    final prefs = await SharedPreferences.getInstance();
    final tripsJson = savedTrips.map((trip) => trip.toJson()).toList();
    await prefs.setString(_savedTripsKey, jsonEncode(tripsJson));
  }

  static Future<List<SavedTrip>> getSavedTrips() async {
    final prefs = await SharedPreferences.getInstance();
    final tripsString = prefs.getString(_savedTripsKey);
    if (tripsString != null) {
      try {
        final tripsList = jsonDecode(tripsString) as List;
        return tripsList.map((trip) => SavedTrip.fromJson(trip)).toList();
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // Recent searches
  static Future<void> saveRecentSearch(String search) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> searches = await getRecentSearches();

    // Remove if already exists
    searches.remove(search);

    // Add to beginning
    searches.insert(0, search);

    // Keep only last 10 searches
    if (searches.length > 10) {
      searches = searches.take(10).toList();
    }

    await prefs.setStringList(_recentSearchesKey, searches);
  }

  static Future<List<String>> getRecentSearches() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_recentSearchesKey) ?? [];
  }

  static Future<void> clearRecentSearches() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_recentSearchesKey);
  }

  // Offline data cache
  static Future<void> saveOfflineData(
      String key, Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    final offlineData = await getOfflineData();
    offlineData[key] = {
      'data': data,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    };
    await prefs.setString(_offlineDataKey, jsonEncode(offlineData));
  }

  static Future<Map<String, dynamic>?> getOfflineDataByKey(String key,
      {Duration? maxAge}) async {
    final offlineData = await getOfflineData();
    final cached = offlineData[key];

    if (cached != null) {
      final timestamp = cached['timestamp'] as int;
      final cacheTime = DateTime.fromMillisecondsSinceEpoch(timestamp);

      if (maxAge == null || DateTime.now().difference(cacheTime) <= maxAge) {
        return cached['data'] as Map<String, dynamic>;
      }
    }

    return null;
  }

  static Future<Map<String, dynamic>> getOfflineData() async {
    final prefs = await SharedPreferences.getInstance();
    final dataString = prefs.getString(_offlineDataKey);
    if (dataString != null) {
      try {
        return jsonDecode(dataString) as Map<String, dynamic>;
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  static Future<void> clearOfflineData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_offlineDataKey);
  }

  // Clear all data
  static Future<void> clearAllData() async {
    await _secureStorage.deleteAll();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // App settings
  static Future<void> setBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  static Future<bool> getBool(String key, {bool defaultValue = false}) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(key) ?? defaultValue;
  }

  static Future<void> setString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  static Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  static Future<void> setInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(key, value);
  }

  static Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(key);
  }
}
