import 'package:travelmate/utils/helpers/env_file_reader.dart';
import 'package:travelmate/utils/http/http_client.dart';
import 'package:travelmate/utils/logging/logger.dart';

class AuthService {
  /// Map of function keys to endpoint paths
  static const Map<String, String> endpointMap = {
    'login': '/login',
    'register': '/register',
    'refresh': '/refresh',
    'checkEmailExists': '/check-email',
    'logout': '/logout',
    'requestPasswordReset': '/reset-password-request',
    'validateToken': '/validate',
    'getUserProfile': '/user-info',
    'updateUserProfile': '/update-user',
    'changePassword': '/change-password',
    'resendVerificationEmail': '/resend-verification',
    'deleteRequest': '/delete-request',
    'userNameByIds': ' /get-user-name',
  };

  /// Fetch Auth Endpoint from env file
  static Future<String> fetchAuthEndpoint() async {
    final endpoint = await TEnvFileReader.fetchAuthEndpoint();
    if (endpoint == null || endpoint.isEmpty) {
      throw Exception('Auth endpoint is not set in the environment file.');
    }
    return endpoint;
  }

  ///save User info
  static Future<void> saveUserInfo(dynamic userInfo) async {
    await TEnvFileReader.saveUserInfo(userInfo);
    TLoggerHelper.info('User info saved successfully.');
  }

  /// Fetch User info
  static Future<dynamic> fetchUserInfo() async {
    return await TEnvFileReader.fetchUserInfo();
  }

  /// Save token using TEnvFileReader
  static Future<void> saveTokenWithStorage(String token) async {
    await TEnvFileReader.saveUserToken(token);
    TLoggerHelper.info('Token saved successfully.');
  }

  /// Get stored token
  static Future<String?> getToken() async {
    return await TEnvFileReader.fetchUserToken();
  }

  /// Remove stored token
  static Future<void> removeToken() async {
    await TEnvFileReader.removeUserToken();
    TLoggerHelper.info('Token removed successfully.');
  }

  /// Save Refresh token
  static Future<void> saveRefreshToken(String refreshToken) async {
    await TEnvFileReader.saveRefreshToken(refreshToken);
    TLoggerHelper.info('Refresh Token saved successfully.');
  }

  /// Get stored Refresh token
  static Future<String?> getRefreshToken() async {
    return await TEnvFileReader.fetchRefreshToken();
  }

  /// Remove stored Refresh token
  static Future<void> removeRefreshToken() async {
    await TEnvFileReader.removeRefreshToken();
    TLoggerHelper.info('Refresh Token removed successfully.');
  }

  /// Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    final refreshToken = await getRefreshToken();
    TLoggerHelper.info('Refresh Token is present: ${refreshToken != null}');
    TLoggerHelper.info('User is logged in: ${token != null}');
    return (token != null && token.isNotEmpty) ||
        (refreshToken != null && refreshToken.isNotEmpty);
  }

  /// Login
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    TLoggerHelper.info('User login attempt with email: $email');
    try {
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['login']!;
      final response = await THttpHelper.post(endpoint, {
        'email': email,
        'password': password,
      });

      final token = response['token'];
      final refreshToken = response['refresh_token'];
      final user = response['user'];

      if (token != null) {
        await saveTokenWithStorage(token);
        TLoggerHelper.info('Login successful, token saved.');
      } else {
        throw Exception('Token not found in response.');
      }

      if (refreshToken != null) {
        await saveRefreshToken(refreshToken);
        TLoggerHelper.info('Refresh token saved.');
      } else {
        TLoggerHelper.warning('Refresh token not found in response.');
      }

      if (user != null) {
        await saveUserInfo(user);
        TLoggerHelper.info('User info saved.');
      } else {
        TLoggerHelper.warning('User info not found in response.');
      }

      return {
        'success': true,
        'user': user,
        'token': token,
        'refreshToken': refreshToken,
      };
    } catch (e) {
      TLoggerHelper.error('Login failed: $e');
      rethrow;
    }
  }

  /// Register new user
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String dob,
    required String gender,
  }) async {
    TLoggerHelper.info('User registration attempt with email: $email');
    try {
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['register']!;
      final response = await THttpHelper.post(endpoint, {
        'name': name,
        'email': email,
        'password': password,
        'dob': dob,
        'gender': gender,
      });

      final token = response['token'];
      final refreshToken = response['refresh_token'];
      final user = response['user'];

      if (token != null) {
        await saveTokenWithStorage(token);
        TLoggerHelper.info('Registration successful, token saved.');
      }

      if (refreshToken != null) {
        await saveRefreshToken(refreshToken);
        TLoggerHelper.info('Refresh token saved.');
      }

      return {
        'success': true,
        'user': user,
        'token': token,
        'refreshToken': refreshToken,
      };
    } catch (e) {
      TLoggerHelper.error('Registration failed: $e');
      rethrow;
    }
  }

  /// Refresh Token
  static Future<void> refreshToken() async {
    try {
      String? refreshToken = await getRefreshToken();
      if (refreshToken == null || refreshToken.isEmpty) {
        throw Exception('No refresh token found.');
      }
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['refresh']!;
      final response =
          await THttpHelper.post(endpoint, null, token: refreshToken);
      final newToken = response['token'];
      final newRefreshToken = response['refresh_token'];
      if (newToken != null) {
        await saveTokenWithStorage(newToken);
        TLoggerHelper.info('Token refreshed successfully.');
      } else {
        throw Exception('New token not ound in response.');
      }
      if (newRefreshToken != null) {
        await saveRefreshToken(newRefreshToken);
        TLoggerHelper.info('Refresh token updated successfully.');
      } else {
        TLoggerHelper.warning('New refresh token not found in response.');
      }
    } catch (e) {
      TLoggerHelper.error('Token refresh failed: $e');
      rethrow;
    }
  }

  /// Check if email exists
  static Future<bool> checkEmailExists(String email) async {
    try {
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint =
          '$authEndpoint${endpointMap['checkEmailExists']!}/$email';
      final response = await THttpHelper.post(endpoint, null);
      return response['exists'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Email check failed: $e');
      return false;
    }
  }

  /// Logout
  static Future<void> logout() async {
    try {
      String? token = await getToken();
      if (token != null) {
        String authEndpoint = await fetchAuthEndpoint();
        final endpoint = authEndpoint + endpointMap['logout']!;
        await THttpHelper.post(endpoint, null, token: token);
      }

      await removeToken();
      await removeRefreshToken();
      TLoggerHelper.info('Logout successful');
    } catch (e) {
      TLoggerHelper.error('Logout failed: $e');
      // Still remove tokens even if API call fails
      await removeToken();
      await removeRefreshToken();
    }
  }

  /// Request Password Reset
  static Future<bool> requestPasswordReset(String email) async {
    try {
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['requestPasswordReset']!;
      final response = await THttpHelper.post(endpoint, {
        'email': email,
      });

      TLoggerHelper.info('Password reset requested for: $email');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Password reset request failed: $e');
      return false;
    }
  }

  /// Validate Token
  static Future<bool> validateToken() async {
    try {
      String? token = await getToken();
      if (token == null) return false;

      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['validateToken']!;
      final response = await THttpHelper.post(endpoint, null, token: token);

      return response['valid'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Token validation failed: $e');
      return false;
    }
  }

  /// Get User Profile
  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      String? token = await getToken();
      if (token == null) return null;

      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['getUserProfile']!;
      final response = await THttpHelper.get(endpoint, token: token);
      return response['user'];
    } catch (e) {
      TLoggerHelper.error('Get user profile failed: $e');
      return null;
    }
  }

  /// Update User Profile
  static Future<Map<String, dynamic>?> updateUserProfile(
      Map<String, dynamic> profileData) async {
    try {
      String? token = await getToken();
      if (token == null) return null;

      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['updateUserProfile']!;
      final response =
          await THttpHelper.put(endpoint, profileData, token: token);

      TLoggerHelper.info('User profile updated successfully');
      return response['user'];
    } catch (e) {
      TLoggerHelper.error('Update user profile failed: $e');
      return null;
    }
  }

  /// Change Password
  static Future<bool> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    try {
      String? token = await getToken();
      if (token == null) return false;
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['changePassword']!;
      final response = await THttpHelper.post(
          endpoint,
          {
            'old_password': oldPassword,
            'new_password': newPassword,
          },
          token: token);
      TLoggerHelper.info('Password change requested');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Change password failed: $e');
      return false;
    }
  }

  /// Resend Verification Email
  static Future<bool> resendVerificationEmail(String email) async {
    try {
      String authEndpoint = await fetchAuthEndpoint();
      String? token = await getToken();
      final endpoint = authEndpoint + endpointMap['resendVerificationEmail']!;
      final response = await THttpHelper.post(endpoint, null, token: token);
      TLoggerHelper.info('Verification email resend requested');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Resend verification email failed: $e');
      return false;
    }
  }

  /// Delete Account Request
  static Future<bool> deleteRequest() async {
    try {
      String? token = await getToken();
      if (token == null) return false;
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['deleteRequest']!;
      final response = await THttpHelper.post(endpoint, null, token: token);
      TLoggerHelper.info('Delete account request sent');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Delete account request failed: $e');
      return false;
    }
  }

  /// Get User Names by IDs
  static Future<List<String>?> userNameByIds(List<String> userIds) async {
    try {
      String? token = await getToken();
      if (token == null) return null;
      String authEndpoint = await fetchAuthEndpoint();
      final endpoint = authEndpoint + endpointMap['userNameByIds']!;
      final response = await THttpHelper.post(
          endpoint,
          {
            'user_ids': userIds,
          },
          token: token);
      TLoggerHelper.info('Fetched user names by IDs');
      return (response['user_names'] as List<dynamic>?)
          ?.map((e) => e.toString())
          .toList();
    } catch (e) {
      TLoggerHelper.error('Get user names by IDs failed: $e');
      return null;
    }
  }
}
