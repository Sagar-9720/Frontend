import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/features/Authentication/screens/login/widgets/login_form.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

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
                  height: 300,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(TImages.loginBackgroundImage),
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
                          TTexts.loginTitle,
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
                          TTexts.loginSubTitle,
                          style: Theme.of(context)
                              .textTheme
                              .headlineMedium
                              ?.copyWith(
                                fontWeight: FontWeight.normal,
                                color: const Color(0xFF2C3653),
                              ),
                        ),
                        const SizedBox(height: TSizes.sm),
                        Text(
                          TTexts.loginWelcome,
                          style:
                              Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: TColors.textSecondary,
                                  ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),

                    /// Form
                    const TLoginForm(),

                    /// Divider
                    const SizedBox(height: TSizes.spaceBtwSections),

                    ///TLoginDivider(),
                    /// Lateron Implement OAuth
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
