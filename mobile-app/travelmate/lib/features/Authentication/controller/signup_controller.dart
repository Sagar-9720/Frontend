import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/utils/device/device_utility.dart';
import 'package:travelmate/utils/logging/logger.dart';
import 'package:travelmate/utils/popups/full_screen_loader.dart';

class SignupController extends GetxController {
  static SignupController get instance => Get.find();

  /// Variables
  final hidePassword = true.obs;
  final hideConfirmPassword = true.obs;
  final privacyPolicy = false.obs;
  final localStorage = GetStorage();
  final firstNameController = TextEditingController();
  final lastNameController = TextEditingController();
  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneNumberController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  GlobalKey<FormState> signupFormKey = GlobalKey<FormState>();

  /// Signup
  Future<void> signup() async {
    try {
      // Start Loading
      TFullScreenLoader.openLoadingDialog('Creating your account...', TImages.loadingAnimation);

      // Check Internet Connectivity
      final isConnected = await TDeviceUtils.hasInternetConnection();
      if (!isConnected) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Form Validation
      if (!signupFormKey.currentState!.validate()) {
        TFullScreenLoader.stopLoading();
        return;
      }

      // Privacy Policy Check
      if (!privacyPolicy.value) {
        TFullScreenLoader.stopLoading();
        Get.snackbar(
          TTexts.signupError,
          TTexts.privacyPolicyError,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return;
      }

      // Password Confirmation Check
      if (passwordController.text != confirmPasswordController.text) {
        TFullScreenLoader.stopLoading();
        Get.snackbar(
          TTexts.signupError,
          TTexts.passwordMismatchError,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return;
      }

      // Register user in the Backend
      final response = await AuthService.register(
        firstName: firstNameController.text.trim(),
        lastName: lastNameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
        phoneNumber: phoneNumberController.text.trim(),
      );

      // Remove Loader
      TFullScreenLoader.stopLoading();

      if (response['success'] == true) {
        // Success message
        Get.snackbar(
          TTexts.signupSuccess,
          TTexts.signupSuccessMessage,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );

        // Move to Verify Email Screen
        // TODO: Navigate to VerifyEmailScreen when available
        // Get.to(() => VerifyEmailScreen(email: emailController.text.trim()));
      } else {
        // Show error message
        Get.snackbar(
          TTexts.signupError,
          response['message'] ?? TTexts.somethingWentWrong,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      // Remove Loader
      TFullScreenLoader.stopLoading();
      TLoggerHelper.error('Signup Error: $e');
      Get.snackbar(
        TTexts.signupError,
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  /// Toggle Password Visibility
  void togglePasswordVisibility() => hidePassword.value = !hidePassword.value;

  /// Toggle Confirm Password Visibility
  void toggleConfirmPasswordVisibility() =>
      hideConfirmPassword.value = !hideConfirmPassword.value;

  /// Toggle Privacy Policy Acceptance
  void togglePrivacyPolicy(bool? value) => privacyPolicy.value = value ?? false;

  /// Clear Form
  void clearForm() {
    firstNameController.clear();
    lastNameController.clear();
    usernameController.clear();
    emailController.clear();
    phoneNumberController.clear();
    passwordController.clear();
    confirmPasswordController.clear();
  }

  @override
  void onClose() {
    firstNameController.dispose();
    lastNameController.dispose();
    usernameController.dispose();
    emailController.dispose();
    phoneNumberController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
