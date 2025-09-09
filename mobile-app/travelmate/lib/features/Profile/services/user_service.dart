import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/helpers/env_file_reader.dart';
import 'package:travelmate/utils/http/http_client.dart';
import 'package:travelmate/utils/logging/logger.dart';
import 'package:travelmate/utils/local_storage/storage_utility.dart';

class UserService {
  /// Get API endpoint
  static Future<String> _getApiEndpoint() async {
    final endpoint = await TEnvFileReader.fetchAuthEndpoint();
    if (endpoint == null || endpoint.isEmpty) {
      throw Exception('API endpoint is not set in the environment file.');
    }
    return endpoint;
  }

  /// Get user profile
  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user-info';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('User profile loaded successfully');
      return response['user'];
    } catch (e) {
      TLoggerHelper.error('Error loading user profile: $e');
      // Return mock data as fallback
      return _getMockUserProfile();
    }
  }

  /// Update user profile
  static Future<Map<String, dynamic>?> updateUserProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    String? dateOfBirth,
    String? gender,
    String? nationality,
    String? bio,
    String? profilePicture,
    Map<String, dynamic>? preferences,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/profile';

      Map<String, dynamic> updateData = {};

      if (firstName != null) updateData['first_name'] = firstName;
      if (lastName != null) updateData['last_name'] = lastName;
      if (email != null) updateData['email'] = email;
      if (phoneNumber != null) updateData['phone_number'] = phoneNumber;
      if (dateOfBirth != null) updateData['date_of_birth'] = dateOfBirth;
      if (gender != null) updateData['gender'] = gender;
      if (nationality != null) updateData['nationality'] = nationality;
      if (bio != null) updateData['bio'] = bio;
      if (profilePicture != null)
        updateData['profile_picture'] = profilePicture;
      if (preferences != null) updateData['preferences'] = preferences;

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response =
          await THttpHelper.put(endpoint, updateData, token: token);

      TLoggerHelper.info('User profile updated successfully');
      return response['user'];
    } catch (e) {
      TLoggerHelper.error('Error updating user profile: $e');
      return null;
    }
  }

  /// Upload profile picture
  static Future<String?> uploadProfilePicture(String filePath) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/upload-avatar';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.uploadFile(
          endpoint, filePath, 'avatar',
          token: token);

      String? avatarUrl = response['url'];
      TLoggerHelper.info('Profile picture uploaded successfully: $avatarUrl');
      return avatarUrl;
    } catch (e) {
      TLoggerHelper.error('Error uploading profile picture: $e');
      return null;
    }
  }

  /// Get user statistics
  static Future<Map<String, dynamic>> getUserStatistics() async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/statistics';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('User statistics loaded successfully');
      return response['statistics'] ?? {};
    } catch (e) {
      TLoggerHelper.error('Error loading user statistics: $e');
      return {
        'total_trips': 0,
        'countries_visited': 0,
        'journal_entries': 0,
        'photos_uploaded': 0,
        'total_distance': 0,
        'favorite_destinations': 0,
        'member_since': DateTime.now().toIso8601String(),
      };
    }
  }

  /// Change password
  static Future<bool> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/change-password';

      Map<String, dynamic> passwordData = {
        'current_password': currentPassword,
        'new_password': newPassword,
      };

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response =
          await THttpHelper.post(endpoint, passwordData, token: token);

      TLoggerHelper.info('Password changed successfully');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Error changing password: $e');
      return false;
    }
  }

  /// Delete user account
  static Future<bool> deleteAccount(String password) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/delete-account';

      Map<String, dynamic> deleteData = {'password': password};

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response =
          await THttpHelper.post(endpoint, deleteData, token: token);

      if (response['success'] == true) {
        // Clear local storage
        await AuthService.removeToken();
        await AuthService.removeRefreshToken();
        await TLocalStorage.clearAll();

        TLoggerHelper.info('User account deleted successfully');
        return true;
      }

      return false;
    } catch (e) {
      TLoggerHelper.error('Error deleting user account: $e');
      return false;
    }
  }

  /// Get user preferences
  static Future<Map<String, dynamic>> getUserPreferences() async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/preferences';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('User preferences loaded successfully');
      return response['preferences'] ?? {};
    } catch (e) {
      TLoggerHelper.error('Error loading user preferences: $e');
      // Return default preferences as fallback
      return _getDefaultPreferences();
    }
  }

  /// Update user preferences
  static Future<bool> updateUserPreferences(
      Map<String, dynamic> preferences) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/preferences';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response =
          await THttpHelper.put(endpoint, preferences, token: token);

      // Also store locally for offline access
      await TLocalStorage.saveData('user_preferences', preferences);

      TLoggerHelper.info('User preferences updated successfully');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Error updating user preferences: $e');
      return false;
    }
  }

  /// Get user activity log
  static Future<List<Map<String, dynamic>>> getUserActivityLog({
    int page = 1,
    int limit = 20,
    String? activityType,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/activity-log';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      if (activityType != null) {
        queryParams['type'] = activityType;
      }

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint,
          queryParams: queryParams, token: token);

      List<dynamic> activitiesData = response['activities'] ?? [];
      List<Map<String, dynamic>> activities = activitiesData
          .map((activity) => Map<String, dynamic>.from(activity))
          .toList();

      TLoggerHelper.info(
          'User activity log loaded: ${activities.length} items');
      return activities;
    } catch (e) {
      TLoggerHelper.error('Error loading user activity log: $e');
      return [];
    }
  }

  /// Get user's travel companions
  static Future<List<Map<String, dynamic>>> getTravelCompanions() async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/travel-companions';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint, token: token);

      List<dynamic> companionsData = response['companions'] ?? [];
      List<Map<String, dynamic>> companions = companionsData
          .map((companion) => Map<String, dynamic>.from(companion))
          .toList();

      TLoggerHelper.info(
          'Travel companions loaded: ${companions.length} items');
      return companions;
    } catch (e) {
      TLoggerHelper.error('Error loading travel companions: $e');
      return [];
    }
  }

  /// Add travel companion
  static Future<bool> addTravelCompanion({
    required String email,
    String? name,
    String? relationship,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/travel-companions';

      Map<String, dynamic> companionData = {'email': email};
      if (name != null) companionData['name'] = name;
      if (relationship != null) companionData['relationship'] = relationship;

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response =
          await THttpHelper.post(endpoint, companionData, token: token);

      TLoggerHelper.info('Travel companion added successfully: $email');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Error adding travel companion: $e');
      return false;
    }
  }

  /// Export user data (GDPR compliance)
  static Future<Map<String, dynamic>?> exportUserData() async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/export-data';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.post(endpoint, {}, token: token);

      TLoggerHelper.info('User data export initiated successfully');
      return response;
    } catch (e) {
      TLoggerHelper.error('Error exporting user data: $e');
      return null;
    }
  }

  /// Mock user profile for offline/fallback usage
  static Map<String, dynamic> _getMockUserProfile() {
    return {
      'id': 'user_123',
      'first_name': 'Travel',
      'last_name': 'Enthusiast',
      'email': 'user@travelmate.com',
      'phone_number': '+1234567890',
      'date_of_birth': '1990-01-15',
      'gender': 'Other',
      'nationality': 'Global Citizen',
      'bio':
          'Passionate traveler exploring the world one destination at a time.',
      'profile_picture': null,
      'join_date': '2024-01-15T10:00:00Z',
      'last_active': DateTime.now().toIso8601String(),
      'preferences': _getDefaultPreferences(),
      'verification_status': {
        'email_verified': true,
        'phone_verified': false,
        'identity_verified': false,
      }
    };
  }

  /// Default user preferences
  static Map<String, dynamic> _getDefaultPreferences() {
    return {
      'currency': 'USD',
      'language': 'English',
      'timezone': 'UTC',
      'theme': 'System',
      'notifications': {
        'push_enabled': true,
        'email_enabled': true,
        'trip_reminders': true,
        'journal_reminders': true,
        'promotional': false,
      },
      'privacy': {
        'profile_visibility': 'public',
        'trip_visibility': 'friends',
        'journal_visibility': 'private',
      },
      'travel': {
        'preferred_travel_style': 'adventure',
        'budget_range': 'medium',
        'accommodation_preference': 'hotel',
        'transportation_preference': 'flight',
      }
    };
  }
}
