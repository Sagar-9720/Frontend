import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:travelmate/features/Authentication/controller/signup_controller.dart';
import 'package:travelmate/features/Authentication/screens/login/login.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/common/widgets/ButtonWidget.dart';

class TSignupForm extends StatelessWidget {
  const TSignupForm({super.key});

  Widget _buildInputField({
    required TextEditingController controller,
    required String hint,
    required String label,
    required IconData icon,
    bool isPassword = false,
    bool isObscure = false,
    VoidCallback? onToggleVisibility,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: TSizes.spaceBtwInputFields),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: TextFormField(
        controller: controller,
        obscureText: isObscure,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: TColors.textSecondary),
          suffixIcon: isPassword
              ? IconButton(
                  onPressed: onToggleVisibility,
                  icon: Icon(
                    isObscure ? Iconsax.eye_slash : Iconsax.eye,
                    color: TColors.textSecondary,
                  ),
                )
              : null,
          labelText: label,
          hintText: hint,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
              horizontal: TSizes.md, vertical: TSizes.md),
        ),
        validator: validator,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(SignupController());

    return Form(
      key: controller.signupFormKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: TSizes.spaceBtwSections),
        child: Column(
          children: [
            /// Full Name
            _buildInputField(
              controller: controller.firstNameController,
              hint: TTexts.fullName,
              label: TTexts.fullName,
              icon: Iconsax.user,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return TTexts.pleaseEnterFullName;
                }
                return null;
              },
            ),

            /// Email
            _buildInputField(
              controller: controller.emailController,
              hint: TTexts.emailAddress,
              label: TTexts.emailAddress,
              icon: Iconsax.direct_right,
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return TTexts.pleaseEnterEmail;
                }
                if (!GetUtils.isEmail(value)) {
                  return TTexts.pleaseEnterValidEmail;
                }
                return null;
              },
            ),

            /// Password
            Obx(() => _buildInputField(
                  controller: controller.passwordController,
                  hint: TTexts.password,
                  label: TTexts.password,
                  icon: Iconsax.password_check,
                  isPassword: true,
                  isObscure: controller.hidePassword.value,
                  onToggleVisibility: controller.togglePasswordVisibility,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return TTexts.pleaseEnterPassword;
                    }
                    if (value.length < 6) {
                      return TTexts.passwordMinLength;
                    }
                    return null;
                  },
                )),

            /// Confirm Password
            Obx(() => _buildInputField(
                  controller: controller.confirmPasswordController,
                  hint: TTexts.confirmPassword,
                  label: TTexts.confirmPassword,
                  icon: Iconsax.password_check,
                  isPassword: true,
                  isObscure: controller.hideConfirmPassword.value,
                  onToggleVisibility:
                      controller.toggleConfirmPasswordVisibility,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return TTexts.pleaseConfirmPassword;
                    }
                    return null;
                  },
                )),

            /// Privacy Policy Checkbox
            Row(
              children: [
                Obx(() => Checkbox(
                      value: controller.privacyPolicy.value,
                      onChanged: controller.togglePrivacyPolicy,
                    )),
                Expanded(
                  child: RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(
                          text: TTexts.iAgreeTo,
                          style: TextStyle(
                            color: TColors.textSecondary,
                            fontSize: TSizes.fontSizeSm,
                          ),
                        ),
                        TextSpan(
                          text: ' ${TTexts.privacyPolicy}',
                          style: TextStyle(
                            color: TColors.primary,
                            fontSize: TSizes.fontSizeSm,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        TextSpan(
                          text: ' ${TTexts.and} ${TTexts.termsOfUse}',
                          style: TextStyle(
                            color: TColors.primary,
                            fontSize: TSizes.fontSizeSm,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: TSizes.spaceBtwItems),

            /// Create Account Button
            TButtonWidget(
              onPressed: controller.signup,
              text: TTexts.createAccount,
              backgroundColor: TColors.primary,
            ),
            const SizedBox(height: TSizes.spaceBtwItems),

            /// Login Link
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  TTexts.alreadyHaveAccount,
                  style: TextStyle(
                    color: TColors.textSecondary,
                    fontSize: TSizes.fontSizeMd,
                  ),
                ),
                GestureDetector(
                  onTap: () => Get.to(() => const LoginScreen()),
                  child: const Text(
                    TTexts.signIn,
                    style: TextStyle(
                      color: TColors.primary,
                      fontSize: TSizes.fontSizeMd,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
