import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/utils/device/device_utility.dart';
import 'package:travelmate/utils/logging/logger.dart';
import 'package:travelmate/utils/popups/full_screen_loader.dart';

class ForgetPasswordController extends GetxController {
  static ForgetPasswordController get instance => Get.find();

  /// Variables
  final localStorage = GetStorage();
  final emailController = TextEditingController();
  GlobalKey<FormState> forgetPasswordFormKey = GlobalKey<FormState>();

  /// Send Password Reset Email
  Future<void> sendPasswordResetEmail() async {
    try {
      // Start Loading
      TFullScreenLoader.openLoadingDialog('Sending reset link...', TImages.loadingAnimation);

      // Check Internet Connectivity
      final isConnected = await TDeviceUtils.hasInternetConnection();
      if (!isConnected) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Form Validation
      if (!forgetPasswordFormKey.currentState!.validate()) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Send Password Reset Email
      final success = await AuthService.requestPasswordReset(
        emailController.text.trim(),
      );

      // Remove Loader
      TFullScreenLoader.stopLoading();

      if (success) {
        // Success message
        Get.snackbar(
          TTexts.passwordResetSuccess,
          TTexts.passwordResetSuccessMessage,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );

        // Move to Reset Password Screen or back to login
        // TODO: Navigate to ResetPasswordScreen when available
        // Get.to(() => ResetPasswordScreen(email: emailController.text.trim()));
      } else {
        // Show error message
        Get.snackbar(
          TTexts.passwordResetError,
          TTexts.passwordResetErrorMessage,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      // Remove Loader
      TFullScreenLoader.stopLoading();
      TLoggerHelper.error('Password Reset Error: $e');
      Get.snackbar(
        TTexts.passwordResetError,
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  /// Resend Password Reset Email
  Future<void> resendPasswordResetEmail(String email) async {
    try {
      // Start Loading
      TFullScreenLoader.openLoadingDialog('Resending reset link...', TImages.loadingAnimation);

      // Check Internet Connectivity
      final isConnected = await TDeviceUtils.hasInternetConnection();
      if (!isConnected) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Send Password Reset Email
      final success = await AuthService.requestPasswordReset(email);

      // Remove Loader
      TFullScreenLoader.stopLoading();

      if (success) {
        // Success message
        Get.snackbar(
          TTexts.passwordResetSuccess,
          TTexts.passwordResetEmailResent,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      } else {
        // Show error message
        Get.snackbar(
          TTexts.passwordResetError,
          TTexts.passwordResetErrorMessage,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      // Remove Loader
      TFullScreenLoader.stopLoading();
      TLoggerHelper.error('Resend Password Reset Error: $e');
      Get.snackbar(
        TTexts.passwordResetError,
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  /// Clear Form
  void clearForm() {
    emailController.clear();
  }

  @override
  void onClose() {
    emailController.dispose();
    super.onClose();
  }
}
