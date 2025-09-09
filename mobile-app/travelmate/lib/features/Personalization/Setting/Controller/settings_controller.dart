import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:travelmate/features/Authentication/screens/login/login.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/logging/logger.dart';

class SettingsController extends GetxController {
  static SettingsController get instance => Get.find();

  // Observable variables
  final RxBool isDarkMode = false.obs;
  final RxString currentLanguage = 'English'.obs;
  final RxBool notificationsEnabled = true.obs;
  final RxString currentTheme = 'System'.obs;
  final RxMap<String, dynamic> userProfile = <String, dynamic>{}.obs;
  final RxBool isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    TLoggerHelper.info('SettingsController initialized');
    loadUserPreferences();
  }

  /// Load user preferences and profile data
  void loadUserPreferences() {
    try {
      isLoading(true);

      // Load user profile data
      userProfile.assignAll({
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
          'theme': 'System',
        },
      });

      // Load app preferences
      notificationsEnabled.value = userProfile['preferences']['notifications'] ?? true;
      currentLanguage.value = userProfile['preferences']['language'] ?? 'English';
      currentTheme.value = userProfile['preferences']['theme'] ?? 'System';

      TLoggerHelper.info('User preferences loaded successfully');
    } catch (e) {
      TLoggerHelper.error('Error loading user preferences: $e');
    } finally {
      isLoading(false);
    }
  }

  /// Edit user profile
  void editProfile() {
    TLoggerHelper.info('Opening profile editor');
    Get.snackbar(
      'Profile',
      'Profile editing feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Open privacy settings
  void openPrivacySettings() {
    TLoggerHelper.info('Opening privacy settings');
    Get.snackbar(
      'Privacy & Security',
      'Privacy settings feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Open notification settings
  void openNotificationSettings() {
    TLoggerHelper.info('Opening notification settings');

    Get.bottomSheet(
      Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Notification Settings',
              style: Get.textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            Obx(() => SwitchListTile(
              title: const Text('Push Notifications'),
              subtitle: const Text('Receive travel updates and reminders'),
              value: notificationsEnabled.value,
              onChanged: toggleNotifications,
            )),
            ListTile(
              title: const Text('Email Notifications'),
              subtitle: const Text('Receive newsletters and offers'),
              trailing: Switch(
                value: true,
                onChanged: (value) => toggleEmailNotifications(value),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Get.back(),
              child: const Text('Done'),
            ),
          ],
        ),
      ),
    );
  }

  /// Toggle push notifications
  void toggleNotifications(bool value) {
    notificationsEnabled.value = value;
    userProfile['preferences']['notifications'] = value;

    TLoggerHelper.info('Push notifications ${value ? 'enabled' : 'disabled'}');
    Get.snackbar(
      'Notifications',
      'Push notifications ${value ? 'enabled' : 'disabled'}',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Toggle email notifications
  void toggleEmailNotifications(bool value) {
    TLoggerHelper.info('Email notifications ${value ? 'enabled' : 'disabled'}');
    Get.snackbar(
      'Email Notifications',
      'Email notifications ${value ? 'enabled' : 'disabled'}',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Change app theme
  void changeTheme() {
    TLoggerHelper.info('Changing app theme');
    Get.bottomSheet(
      Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Choose Theme',
              style: Get.textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            ListTile(
              leading: const Icon(Icons.light_mode),
              title: const Text('Light Mode'),
              trailing: currentTheme.value == 'Light'
                ? const Icon(Icons.check, color: Colors.blue)
                : null,
              onTap: () => setTheme('Light'),
            ),
            ListTile(
              leading: const Icon(Icons.dark_mode),
              title: const Text('Dark Mode'),
              trailing: currentTheme.value == 'Dark'
                ? const Icon(Icons.check, color: Colors.blue)
                : null,
              onTap: () => setTheme('Dark'),
            ),
            ListTile(
              leading: const Icon(Icons.settings_system_daydream),
              title: const Text('System Default'),
              trailing: currentTheme.value == 'System'
                ? const Icon(Icons.check, color: Colors.blue)
                : null,
              onTap: () => setTheme('System'),
            ),
          ],
        ),
      ),
    );
  }

  /// Set theme
  void setTheme(String theme) {
    currentTheme.value = theme;
    userProfile['preferences']['theme'] = theme;

    switch (theme) {
      case 'Light':
        Get.changeThemeMode(ThemeMode.light);
        break;
      case 'Dark':
        Get.changeThemeMode(ThemeMode.dark);
        break;
      case 'System':
      default:
        Get.changeThemeMode(ThemeMode.system);
        break;
    }

    Get.back();
    TLoggerHelper.info('Theme changed to: $theme');
    Get.snackbar(
      'Theme Changed',
      'App theme changed to $theme mode',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Change app language
  void changeLanguage() {
    TLoggerHelper.info('Changing app language');

    Get.bottomSheet(
      Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Select Language',
              style: Get.textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            ...['English', 'Spanish', 'French', 'German', 'Japanese'].map(
              (lang) => ListTile(
                title: Text(lang),
                trailing: currentLanguage.value == lang
                  ? const Icon(Icons.check, color: Colors.blue)
                  : null,
                onTap: () => setLanguage(lang),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Set language
  void setLanguage(String language) {
    currentLanguage.value = language;
    userProfile['preferences']['language'] = language;

    Get.back();
    TLoggerHelper.info('Language changed to: $language');
    Get.snackbar(
      'Language Changed',
      'App language changed to $language',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Manage storage
  void manageStorage() {
    TLoggerHelper.info('Opening storage management');
    Get.snackbar(
      'Storage',
      'Storage management feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Open help center
  void openHelpCenter() {
    TLoggerHelper.info('Opening help center');
    Get.snackbar(
      'Help Center',
      'Help center feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Send feedback
  void sendFeedback() {
    TLoggerHelper.info('Opening feedback form');
    Get.snackbar(
      'Feedback',
      'Feedback feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Show about dialog
  void showAbout() {
    TLoggerHelper.info('Showing about dialog');
    Get.dialog(
      AlertDialog(
        title: const Text('About TravelMate'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Version: 1.0.0'),
            SizedBox(height: 10),
            Text('TravelMate - Your perfect travel companion'),
            SizedBox(height: 10),
            Text('Plan trips, explore destinations, and create amazing travel memories.'),
            SizedBox(height: 10),
            Text('© 2024 TravelMate. All rights reserved.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  /// Save user preferences
  Future<void> savePreferences() async {
    try {
      // Save preferences to local storage or API
      TLoggerHelper.info('Saving user preferences');
      await Future.delayed(const Duration(milliseconds: 500)); // Simulate save

      Get.snackbar(
        'Saved',
        'Preferences saved successfully',
        snackPosition: SnackPosition.BOTTOM,
      );
    } catch (e) {
      TLoggerHelper.error('Error saving preferences: $e');
      Get.snackbar(
        'Error',
        'Failed to save preferences',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  /// Logout user
  void logout() {
    TLoggerHelper.info('User logging out');
    Get.dialog(
      AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Get.back();

              try {
                // Clear authentication tokens
                await AuthService.removeToken();
                await AuthService.removeRefreshToken();

                // Clear user data
                userProfile.clear();

                // Navigate to login screen
                Get.offAll(() => const LoginScreen());

                TLoggerHelper.info('User logged out successfully');
                Get.snackbar(
                  'Logged Out',
                  'You have been successfully logged out',
                  snackPosition: SnackPosition.BOTTOM,
                );
              } catch (e) {
                TLoggerHelper.error('Error during logout: $e');
                Get.snackbar(
                  'Error',
                  'An error occurred during logout',
                  snackPosition: SnackPosition.BOTTOM,
                );
              }
            },
            child: const Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  /// Update user profile
  Future<void> updateUserProfile(Map<String, dynamic> updates) async {
    try {
      isLoading(true);

      userProfile.addAll(updates);

      // Save to API or local storage
      await Future.delayed(const Duration(seconds: 1)); // Simulate API call

      TLoggerHelper.info('User profile updated successfully');
      Get.snackbar(
        'Profile Updated',
        'Your profile has been updated successfully',
        snackPosition: SnackPosition.BOTTOM,
      );
    } catch (e) {
      TLoggerHelper.error('Error updating profile: $e');
      Get.snackbar(
        'Update Failed',
        'Failed to update profile',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading(false);
    }
  }
}
