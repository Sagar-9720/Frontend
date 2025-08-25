import '../models/models.dart';
import '../utils/utils.dart';

class AuthService {
  static const String _baseUrl = '/auth';
  final HttpClient _httpClient = HttpClient.instance;

  // Login
  Future<ApiResponse<AuthTokens>> login(String email, String password) async {
    try {
      AppLogger.auth('Login attempt', userId: email);

      final loginRequest = LoginRequest(email: email, password: password);

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/login',
        data: loginRequest.toJson(),
      );

      if (response.success && response.data != null) {
        final tokens = AuthTokens.fromJson(response.data!);
        await StorageService.saveAuthTokens(tokens);

        AppLogger.auth('Login successful', userId: email, success: true);
        return ApiResponse.success(tokens);
      } else {
        AppLogger.auth('Login failed', userId: email, success: false);
        return ApiResponse.error(response.error ?? 'Login failed');
      }
    } catch (e) {
      AppLogger.error('Login error', e);
      return ApiResponse.error('Login failed: ${e.toString()}');
    }
  }

  // Register
  Future<ApiResponse<AuthTokens>> register({
    required String email,
    required String password,
    String? name,
    String? phone,
  }) async {
    try {
      AppLogger.auth('Registration attempt', userId: email);

      final registerRequest = RegisterRequest(
        email: email,
        password: password,
        name: name,
        phone: phone,
      );

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/register',
        data: registerRequest.toJson(),
      );

      if (response.success && response.data != null) {
        final tokens = AuthTokens.fromJson(response.data!);
        await StorageService.saveAuthTokens(tokens);

        AppLogger.auth('Registration successful', userId: email, success: true);
        return ApiResponse.success(tokens);
      } else {
        AppLogger.auth('Registration failed', userId: email, success: false);
        return ApiResponse.error(response.error ?? 'Registration failed');
      }
    } catch (e) {
      AppLogger.error('Registration error', e);
      return ApiResponse.error('Registration failed: ${e.toString()}');
    }
  }

  // OAuth login
  Future<ApiResponse<AuthTokens>> loginWithOAuth({
    required String provider,
    required String token,
  }) async {
    try {
      AppLogger.auth('OAuth login attempt', userId: provider);

      final oauthRequest = OAuthRequest(provider: provider, token: token);

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/oauth',
        data: oauthRequest.toJson(),
      );

      if (response.success && response.data != null) {
        final tokens = AuthTokens.fromJson(response.data!);
        await StorageService.saveAuthTokens(tokens);

        AppLogger.auth('OAuth login successful',
            userId: provider, success: true);
        return ApiResponse.success(tokens);
      } else {
        AppLogger.auth('OAuth login failed', userId: provider, success: false);
        return ApiResponse.error(response.error ?? 'OAuth login failed');
      }
    } catch (e) {
      AppLogger.error('OAuth login error', e);
      return ApiResponse.error('OAuth login failed: ${e.toString()}');
    }
  }

  // Refresh token
  Future<ApiResponse<AuthTokens>> refreshToken() async {
    try {
      final currentTokens = await StorageService.getAuthTokens();
      if (currentTokens == null) {
        return ApiResponse.error('No refresh token available');
      }

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/refresh',
        data: {'refreshToken': currentTokens.refreshToken},
      );

      if (response.success && response.data != null) {
        final newTokens = AuthTokens.fromJson(response.data!);
        await StorageService.saveAuthTokens(newTokens);

        AppLogger.auth('Token refresh successful');
        return ApiResponse.success(newTokens);
      } else {
        AppLogger.auth('Token refresh failed', success: false);
        return ApiResponse.error(response.error ?? 'Token refresh failed');
      }
    } catch (e) {
      AppLogger.error('Token refresh error', e);
      return ApiResponse.error('Token refresh failed: ${e.toString()}');
    }
  }

  // Get current user profile
  Future<ApiResponse<User>> getCurrentUser() async {
    try {
      final response = await _httpClient.get<Map<String, dynamic>>(
        '$_baseUrl/profile',
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final user = User.fromJson(response.data!);
        await StorageService.saveUser(user);

        AppLogger.debug('User profile fetched successfully');
        return ApiResponse.success(user);
      } else {
        AppLogger.error('Failed to fetch user profile', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to fetch user profile');
      }
    } catch (e) {
      AppLogger.error('Get current user error', e);
      return ApiResponse.error('Failed to fetch user: ${e.toString()}');
    }
  }

  // Update profile
  Future<ApiResponse<User>> updateProfile(Map<String, dynamic> userData) async {
    try {
      final response = await _httpClient.put<Map<String, dynamic>>(
        '$_baseUrl/profile',
        data: userData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final user = User.fromJson(response.data!);
        await StorageService.saveUser(user);

        AppLogger.userAction('Profile updated');
        return ApiResponse.success(user);
      } else {
        AppLogger.error('Failed to update profile', response.error);
        return ApiResponse.error(response.error ?? 'Failed to update profile');
      }
    } catch (e) {
      AppLogger.error('Update profile error', e);
      return ApiResponse.error('Failed to update profile: ${e.toString()}');
    }
  }

  // Change password
  Future<ApiResponse<bool>> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    try {
      final changeRequest = PasswordChangeRequest(
        oldPassword: oldPassword,
        newPassword: newPassword,
      );

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/change-password',
        data: changeRequest.toJson(),
      );

      if (response.success) {
        AppLogger.userAction('Password changed successfully');
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to change password', response.error);
        return ApiResponse.error(response.error ?? 'Failed to change password');
      }
    } catch (e) {
      AppLogger.error('Change password error', e);
      return ApiResponse.error('Failed to change password: ${e.toString()}');
    }
  }

  // Forgot password
  Future<ApiResponse<bool>> forgotPassword(String email) async {
    try {
      final forgotRequest = ForgotPasswordRequest(email: email);

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/forgot-password',
        data: forgotRequest.toJson(),
      );

      if (response.success) {
        AppLogger.userAction('Password reset email sent', {'email': email});
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to send password reset email', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to send password reset email');
      }
    } catch (e) {
      AppLogger.error('Forgot password error', e);
      return ApiResponse.error(
          'Failed to send password reset email: ${e.toString()}');
    }
  }

  // Reset password
  Future<ApiResponse<bool>> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      final resetRequest = ResetPasswordRequest(
        token: token,
        newPassword: newPassword,
      );

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/reset-password',
        data: resetRequest.toJson(),
      );

      if (response.success) {
        AppLogger.userAction('Password reset successful');
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to reset password', response.error);
        return ApiResponse.error(response.error ?? 'Failed to reset password');
      }
    } catch (e) {
      AppLogger.error('Reset password error', e);
      return ApiResponse.error('Failed to reset password: ${e.toString()}');
    }
  }

  // Verify email
  Future<ApiResponse<bool>> verifyEmail(String token) async {
    try {
      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/verify-email',
        data: {'token': token},
      );

      if (response.success) {
        AppLogger.userAction('Email verified successfully');
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to verify email', response.error);
        return ApiResponse.error(response.error ?? 'Failed to verify email');
      }
    } catch (e) {
      AppLogger.error('Verify email error', e);
      return ApiResponse.error('Failed to verify email: ${e.toString()}');
    }
  }

  // Resend verification email
  Future<ApiResponse<bool>> resendVerificationEmail() async {
    try {
      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/resend-verification',
        data: {},
      );

      if (response.success) {
        AppLogger.userAction('Verification email resent');
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to resend verification email', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to resend verification email');
      }
    } catch (e) {
      AppLogger.error('Resend verification email error', e);
      return ApiResponse.error(
          'Failed to resend verification email: ${e.toString()}');
    }
  }

  // Delete account
  Future<ApiResponse<bool>> deleteAccount(String password) async {
    try {
      final response = await _httpClient.delete<Map<String, dynamic>>(
        '$_baseUrl/account',
        data: {'password': password},
      );

      if (response.success) {
        await logout();
        AppLogger.userAction('Account deleted');
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to delete account', response.error);
        return ApiResponse.error(response.error ?? 'Failed to delete account');
      }
    } catch (e) {
      AppLogger.error('Delete account error', e);
      return ApiResponse.error('Failed to delete account: ${e.toString()}');
    }
  }

  // Logout
  Future<ApiResponse<bool>> logout() async {
    try {
      final tokens = await StorageService.getAuthTokens();

      if (tokens != null) {
        // Notify backend about logout
        await _httpClient.post<Map<String, dynamic>>(
          '$_baseUrl/logout',
          data: {'refreshToken': tokens.refreshToken},
        );
      }

      // Clear local storage
      await StorageService.clearAuthTokens();
      await StorageService.clearUser();

      AppLogger.auth('Logout successful');
      return ApiResponse.success(true);
    } catch (e) {
      AppLogger.error('Logout error', e);

      // Even if backend call fails, clear local storage
      await StorageService.clearAuthTokens();
      await StorageService.clearUser();

      return ApiResponse.success(true);
    }
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final tokens = await StorageService.getAuthTokens();
    return tokens != null && !tokens.isExpired;
  }

  // Get stored tokens
  Future<AuthTokens?> getStoredTokens() async {
    return await StorageService.getAuthTokens();
  }

  // Get stored user
  Future<User?> getStoredUser() async {
    return await StorageService.getUser();
  }
}
