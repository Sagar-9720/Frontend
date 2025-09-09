import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:iconsax/iconsax.dart';
import 'package:travelmate/features/Authentication/controller/forget_password_controller.dart';
import 'package:travelmate/common/widgets/ButtonWidget.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class ForgetPassword extends StatelessWidget {
  const ForgetPassword({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(ForgetPasswordController());

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// Header Image with back button
            Stack(
              children: [
                Container(
                  height: 300,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image:
                          NetworkImage(TImages.forgotPasswordBackgroundImage),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.3),
                          TColors.primary.withValues(alpha: 0.7),
                        ],
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 60,
                  left: 20,
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back,
                          color: Colors.white, size: TSizes.iconMd),
                      onPressed: () => Get.back(),
                    ),
                  ),
                ),
              ],
            ),

            /// Content Container
            Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              transform: Matrix4.translationValues(0, -30, 0),
              child: Padding(
                padding: const EdgeInsets.all(TSizes.defaultSpace),
                child: Column(
                  children: [
                    const SizedBox(height: TSizes.spaceBtwItems),

                    /// Welcome Text
                    Column(
                      children: [
                        Text(
                          TTexts.forgotPasswordTitle,
                          style: Theme.of(context)
                              .textTheme
                              .headlineLarge
                              ?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: TColors.textPrimary,
                              ),
                        ),
                        const SizedBox(height: TSizes.sm),
                        Text(
                          TTexts.forgotPasswordSubtitle,
                          style:
                              Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: TColors.textSecondary,
                                  ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),

                    /// Form
                    Form(
                      key: controller.forgetPasswordFormKey,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: TSizes.spaceBtwSections),
                        child: Column(
                          children: [
                            /// Email
                            Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(
                                    TSizes.inputFieldRadius),
                                border:
                                    Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: TextFormField(
                                controller: controller.emailController,
                                keyboardType: TextInputType.emailAddress,
                                decoration: const InputDecoration(
                                  prefixIcon: Icon(Iconsax.direct_right,
                                      color: Color(0xFF64748B)),
                                  labelText: TTexts.emailAddress,
                                  hintText: TTexts.enterEmailAddress,
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(
                                      horizontal: TSizes.md,
                                      vertical: TSizes.md),
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
                            const SizedBox(height: TSizes.spaceBtwSections * 2),

                            /// Reset Password Button
                            TButtonWidget(
                              onPressed: controller.sendPasswordResetEmail,
                              text: TTexts.sendResetLink,
                              backgroundColor: TColors.primary,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
