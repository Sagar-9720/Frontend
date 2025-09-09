import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/login_signup/form_divider.dart';
import 'package:travelmate/features/Authentication/screens/signup/widgets/signup_form.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class SignupScreen extends StatelessWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// Header Image with back button
            Stack(
              children: [
                Container(
                  height: 250,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(TImages.signupBackgroundImage),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.3),
                          TColors.primary.withOpacity(0.7),
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
                      color: Colors.black.withOpacity(0.3),
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
                          TTexts.joinTravelMate,
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
                          TTexts.startYourJourney,
                          style:
                              Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: TColors.textSecondary,
                                  ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),

                    /// Form
                    const TSignupForm(),

                    /// Divider
                    TFormDivider(dividerText: TTexts.orSignUpWith.capitalize!),
                    const SizedBox(height: TSizes.spaceBtwSections),

                    /// Social Button
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        borderRadius:
                            BorderRadius.circular(TSizes.inputFieldRadius),
                      ),
                      child: TextButton(
                        onPressed: () {
                          // TODO: Implement Google Sign Up
                        },
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(TSizes.inputFieldRadius),
                          ),
                        ),
                        child: const Text(
                          TTexts.continueWithGoogle,
                          style: TextStyle(
                            color: TColors.textPrimary,
                            fontSize: TSizes.fontSizeMd,
                            fontWeight: FontWeight.w600,
                          ),
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
