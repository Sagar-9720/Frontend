import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:travelmate/common/widgets/ButtonWidget.dart';
import 'package:travelmate/features/Authentication/controller/login_controller.dart';
import 'package:travelmate/features/Authentication/screens/password_configuration/forget_password.dart';
import 'package:travelmate/features/Authentication/screens/signup/signup.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class TLoginForm extends StatelessWidget {
  const TLoginForm({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LoginController());

    return Form(
      key: controller.loginFormKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: TSizes.spaceBtwSections),
        child: Column(
          children: [
            /// Email
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: TextFormField(
                controller: controller.emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  prefixIcon:
                      Icon(Iconsax.direct_right, color: Color(0xFF64748B)),
                  labelText: TTexts.email,
                  hintText: TTexts.emailAddress,
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                      horizontal: TSizes.md, vertical: TSizes.md),
                ),
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
            ),
            const SizedBox(height: TSizes.spaceBtwInputFields),

            /// Password
            Obx(() => Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius:
                        BorderRadius.circular(TSizes.inputFieldRadius),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: TextFormField(
                    controller: controller.passwordController,
                    obscureText: controller.hidePassword.value,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Iconsax.password_check,
                          color: Color(0xFF64748B)),
                      suffixIcon: IconButton(
                        onPressed: controller.togglePasswordVisibility,
                        icon: Icon(
                          controller.hidePassword.value
                              ? Iconsax.eye_slash
                              : Iconsax.eye,
                          color: const Color(0xFF64748B),
                        ),
                      ),
                      labelText: TTexts.password,
                      hintText: TTexts.password,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: TSizes.md, vertical: TSizes.md),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return TTexts.pleaseEnterPassword;
                      }
                      return null;
                    },
                  ),
                )),
            const SizedBox(height: TSizes.spaceBtwInputFields / 2),

            /// Remember Me & Forget Password
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                /// Remember Me
                Row(
                  children: [
                    Obx(() => Checkbox(
                          value: controller.rememberMe.value,
                          onChanged: controller.toggleRememberMe,
                        )),
                    const Text(TTexts.rememberMe),
                  ],
                ),

                /// Forget Password
                TextButton(
                  onPressed: () => Get.to(() => const ForgetPassword()),
                  child: const Text(
                    TTexts.forgotPasswordButton,
                    style: TextStyle(
                      color: TColors.primary,
                      fontSize: TSizes.fontSizeSm,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: TSizes.spaceBtwSections),

            /// Sign In Button
            TButtonWidget(
              onPressed: controller.emailAndPasswordSignIn,
              text: TTexts.signIn,
              backgroundColor: TColors.primary,
            ),
            const SizedBox(height: TSizes.spaceBtwItems),

            /// Create Account Button
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  TTexts.dontHaveAccount,
                  style: TextStyle(
                      color: Color(0xFF64748B), fontSize: TSizes.fontSizeMd),
                ),
                GestureDetector(
                  onTap: () => Get.to(() => const SignupScreen()),
                  child: const Text(
                    TTexts.signUp,
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
