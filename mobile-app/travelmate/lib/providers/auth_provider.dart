import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/services.dart';
import '../utils/utils.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  User? _user;
  AuthTokens? _tokens;
  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _error;

  // Getters
  User? get user => _user;
  AuthTokens? get tokens => _tokens;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get error => _error;

  // Initialize provider
  Future<void> initialize() async {
    try {
      _setLoading(true);

      // Check for stored tokens and user
      _tokens = await _authService.getStoredTokens();
      _user = await _authService.getStoredUser();

      if (_tokens != null && !_tokens!.isExpired && _user != null) {
        _isAuthenticated = true;
        AppLogger.auth('User session restored', userId: _user!.id);
      } else if (_tokens != null && _tokens!.isExpired) {
        // Try to refresh token
        await _refreshToken();
      }
    } catch (e) {
      AppLogger.error('Failed to initialize auth provider', e);
      await logout();
    } finally {
      _setLoading(false);
    }
  }

  // Login
  Future<bool> login(String email, String password) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.login(email, password);

      if (response.success && response.data != null) {
        _tokens = response.data;

        // Get user profile
        final userResponse = await _authService.getCurrentUser();
        if (userResponse.success && userResponse.data != null) {
          _user = userResponse.data;
          _isAuthenticated = true;

          AppLogger.auth('Login successful', userId: _user!.id, success: true);
          notifyListeners();
          return true;
        }
      }

      _setError(response.error ?? 'Login failed');
      return false;
    } catch (e) {
      AppLogger.error('Login error', e);
      _setError('Login failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Register
  Future<bool> register({
    required String email,
    required String password,
    String? name,
    String? phone,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.register(
        email: email,
        password: password,
        name: name,
        phone: phone,
      );

      if (response.success && response.data != null) {
        _tokens = response.data;

        // Get user profile
        final userResponse = await _authService.getCurrentUser();
        if (userResponse.success && userResponse.data != null) {
          _user = userResponse.data;
          _isAuthenticated = true;

          AppLogger.auth('Registration successful',
              userId: _user!.id, success: true);
          notifyListeners();
          return true;
        }
      }

      _setError(response.error ?? 'Registration failed');
      return false;
    } catch (e) {
      AppLogger.error('Registration error', e);
      _setError('Registration failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // OAuth login
  Future<bool> loginWithOAuth(String provider, String token) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.loginWithOAuth(
        provider: provider,
        token: token,
      );

      if (response.success && response.data != null) {
        _tokens = response.data;

        // Get user profile
        final userResponse = await _authService.getCurrentUser();
        if (userResponse.success && userResponse.data != null) {
          _user = userResponse.data;
          _isAuthenticated = true;

          AppLogger.auth('OAuth login successful',
              userId: _user!.id, success: true);
          notifyListeners();
          return true;
        }
      }

      _setError(response.error ?? 'OAuth login failed');
      return false;
    } catch (e) {
      AppLogger.error('OAuth login error', e);
      _setError('OAuth login failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Update profile
  Future<bool> updateProfile(Map<String, dynamic> userData) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.updateProfile(userData);

      if (response.success && response.data != null) {
        _user = response.data;
        AppLogger.userAction('Profile updated successfully');
        notifyListeners();
        return true;
      }

      _setError(response.error ?? 'Profile update failed');
      return false;
    } catch (e) {
      AppLogger.error('Profile update error', e);
      _setError('Profile update failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Change password
  Future<bool> changePassword(String oldPassword, String newPassword) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.changePassword(
        oldPassword: oldPassword,
        newPassword: newPassword,
      );

      if (response.success) {
        AppLogger.userAction('Password changed successfully');
        return true;
      }

      _setError(response.error ?? 'Password change failed');
      return false;
    } catch (e) {
      AppLogger.error('Password change error', e);
      _setError('Password change failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Forgot password
  Future<bool> forgotPassword(String email) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.forgotPassword(email);

      if (response.success) {
        AppLogger.userAction('Password reset email sent');
        return true;
      }

      _setError(response.error ?? 'Failed to send password reset email');
      return false;
    } catch (e) {
      AppLogger.error('Forgot password error', e);
      _setError('Failed to send password reset email: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Reset password
  Future<bool> resetPassword(String token, String newPassword) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.resetPassword(
        token: token,
        newPassword: newPassword,
      );

      if (response.success) {
        AppLogger.userAction('Password reset successful');
        return true;
      }

      _setError(response.error ?? 'Password reset failed');
      return false;
    } catch (e) {
      AppLogger.error('Password reset error', e);
      _setError('Password reset failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Verify email
  Future<bool> verifyEmail(String token) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.verifyEmail(token);

      if (response.success) {
        // Refresh user data to get updated verification status
        await _refreshUserProfile();
        AppLogger.userAction('Email verified successfully');
        return true;
      }

      _setError(response.error ?? 'Email verification failed');
      return false;
    } catch (e) {
      AppLogger.error('Email verification error', e);
      _setError('Email verification failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Resend verification email
  Future<bool> resendVerificationEmail() async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.resendVerificationEmail();

      if (response.success) {
        AppLogger.userAction('Verification email resent');
        return true;
      }

      _setError(response.error ?? 'Failed to resend verification email');
      return false;
    } catch (e) {
      AppLogger.error('Resend verification email error', e);
      _setError('Failed to resend verification email: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Delete account
  Future<bool> deleteAccount(String password) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authService.deleteAccount(password);

      if (response.success) {
        await logout();
        AppLogger.userAction('Account deleted successfully');
        return true;
      }

      _setError(response.error ?? 'Account deletion failed');
      return false;
    } catch (e) {
      AppLogger.error('Account deletion error', e);
      _setError('Account deletion failed: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      _setLoading(true);

      await _authService.logout();

      _user = null;
      _tokens = null;
      _isAuthenticated = false;
      _clearError();

      AppLogger.auth('Logout successful');
      notifyListeners();
    } catch (e) {
      AppLogger.error('Logout error', e);
    } finally {
      _setLoading(false);
    }
  }

  // Refresh token
  Future<bool> _refreshToken() async {
    try {
      final response = await _authService.refreshToken();

      if (response.success && response.data != null) {
        _tokens = response.data;
        AppLogger.auth('Token refreshed successfully');
        return true;
      }

      // If refresh fails, logout user
      await logout();
      return false;
    } catch (e) {
      AppLogger.error('Token refresh error', e);
      await logout();
      return false;
    }
  }

  // Refresh user profile
  Future<void> _refreshUserProfile() async {
    try {
      final response = await _authService.getCurrentUser();
      if (response.success && response.data != null) {
        _user = response.data;
        notifyListeners();
      }
    } catch (e) {
      AppLogger.error('Failed to refresh user profile', e);
    }
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  // Check if user needs to verify email
  bool get needsEmailVerification => _user != null && !_user!.isEmailVerified;

  // Check if user profile is complete
  bool get isProfileComplete =>
      _user != null && _user!.name != null && _user!.name!.isNotEmpty;
}
