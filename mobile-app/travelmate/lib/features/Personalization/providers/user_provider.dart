import 'package:flutter/foundation.dart';
import 'package:travelmate/utils/logging/logger.dart';

class UserProvider extends ChangeNotifier {
  String? _userId;
  String? _userName;
  String? _userEmail;
  String? _userAvatar;
  Map<String, dynamic>? _userProfile;
  bool _isLoading = false;

  // Getters
  String? get userId => _userId;
  String? get userName => _userName;
  String? get userEmail => _userEmail;
  String? get userAvatar => _userAvatar;
  Map<String, dynamic>? get userProfile => _userProfile;
  bool get isLoading => _isLoading;

  /// Initialize user provider
  UserProvider() {
    TLoggerHelper.info('UserProvider initialized');
  }

  /// Load user profile
  Future<void> loadUserProfile() async {
    try {
      _isLoading = true;
      notifyListeners();

      // Mock user data
      _userProfile = {
        'id': 'user_123',
        'name': 'Travel Enthusiast',
        'email': 'user@travelmate.com',
        'avatar': null,
        'joinDate': '2024-01-15',
        'totalTrips': 5,
        'countriesVisited': 12,
        'journalEntries': 15,
        'preferences': {
          'currency': 'USD',
          'language': 'English',
          'notifications': true,
        },
      };

      _userId = _userProfile!['id'];
      _userName = _userProfile!['name'];
      _userEmail = _userProfile!['email'];
      _userAvatar = _userProfile!['avatar'];

      TLoggerHelper.info('User profile loaded successfully');
    } catch (e) {
      TLoggerHelper.error('Error loading user profile: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Update user profile
  Future<void> updateProfile(Map<String, dynamic> updates) async {
    try {
      _isLoading = true;
      notifyListeners();

      if (_userProfile != null) {
        _userProfile = {..._userProfile!, ...updates};

        // Update individual fields
        _userName = _userProfile!['name'];
        _userEmail = _userProfile!['email'];
        _userAvatar = _userProfile!['avatar'];
      }

      TLoggerHelper.info('User profile updated successfully');
    } catch (e) {
      TLoggerHelper.error('Error updating user profile: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Clear user data (for logout)
  void clearUserData() {
    _userId = null;
    _userName = null;
    _userEmail = null;
    _userAvatar = null;
    _userProfile = null;

    notifyListeners();
    TLoggerHelper.info('User data cleared');
  }

  /// Set user data from login
  void setUserData({
    required String id,
    required String name,
    required String email,
    String? avatar,
  }) {
    _userId = id;
    _userName = name;
    _userEmail = email;
    _userAvatar = avatar;

    notifyListeners();
    TLoggerHelper.info('User data set for: $name');
  }
}
