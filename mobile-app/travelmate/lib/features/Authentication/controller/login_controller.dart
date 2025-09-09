import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/utils/device/device_utility.dart';
import 'package:travelmate/utils/logging/logger.dart';
import 'package:travelmate/utils/popups/full_screen_loader.dart';

class LoginController extends GetxController {
  static LoginController get instance => Get.find();

  /// Variables
  final hidePassword = true.obs;
  final rememberMe = false.obs;
  final localStorage = GetStorage();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  GlobalKey<FormState> loginFormKey = GlobalKey<FormState>();

  /// Email and Password Sign In
  Future<void> emailAndPasswordSignIn() async {
    try {
      // Start Loading
      TFullScreenLoader.openLoadingDialog(
          'Logging you in...', TImages.loadingAnimation);

      // Check Internet Connectivity
      final isConnected = await TDeviceUtils.hasInternetConnection();
      if (!isConnected) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Form Validation
      if (!loginFormKey.currentState!.validate()) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Save Data if Remember Me is selected
      if (rememberMe.value) {
        localStorage.write('REMEMBER_ME_EMAIL', emailController.text.trim());
        localStorage.write(
            'REMEMBER_ME_PASSWORD', passwordController.text.trim());
      }

      // Login user using Email & Password Authentication
      final response = await AuthService.login(
        emailController.text.trim(),
        passwordController.text.trim(),
      );

      // Remove Loader
      TFullScreenLoader.stopLoading();

      if (response['success'] == true) {
        // Success message
        Get.snackbar(
          TTexts.loginSuccess,
          TTexts.loginSuccessMessage,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );

        // Navigate to main app
        Get.offAllNamed('/navigation-menu');
      } else {
        // Show error message
        Get.snackbar(
          TTexts.loginError,
          response['message'] ?? TTexts.somethingWentWrong,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      TFullScreenLoader.stopLoading();
      TLoggerHelper.error('Login Error: $e');
      Get.snackbar(
        TTexts.loginError,
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  /// Toggle Password Visibility
  void togglePasswordVisibility() => hidePassword.value = !hidePassword.value;

  /// Toggle Remember Me
  void toggleRememberMe(bool? value) => rememberMe.value = value ?? false;

  /// Clear Form
  void clearForm() {
    emailController.clear();
    passwordController.clear();
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
