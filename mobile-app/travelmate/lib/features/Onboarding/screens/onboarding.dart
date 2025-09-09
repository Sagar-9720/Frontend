import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/features/Onboarding/controller/onboarding_controller.dart';
import 'package:travelmate/features/Onboarding/screens/widgets/onboarding_dot_navigation.dart';
import 'package:travelmate/features/Onboarding/screens/widgets/onboarding_next_button.dart';
import 'package:travelmate/features/Onboarding/screens/widgets/onboarding_page.dart';
import 'package:travelmate/features/Onboarding/screens/widgets/onboarding_skip.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(OnBoardingController());

    return Scaffold(
      body: Stack(
        children: [
          /// Horizontal Scrollable Pages
          PageView(
            controller: controller.pageController,
            onPageChanged: controller.updatePageIndicator,
            children: [
              OnBoardingPage(
                image: TImages.onBoardingNetworkImage1,
                title: TTexts.onBoardingTitle1,
                subTitle: TTexts.onBoardingSubTitle1,
                icon: Icons.location_on,
              ),
              OnBoardingPage(
                image: TImages.onBoardingNetworkImage2,
                title: TTexts.onBoardingTitle2,
                subTitle: TTexts.onBoardingSubTitle2,
                icon: Icons.camera_alt,
              ),
              OnBoardingPage(
                image: TImages.onBoardingNetworkImage3,
                title: TTexts.onBoardingTitle3,
                subTitle: TTexts.onBoardingSubTitle3,
                icon: Icons.people,
              ),
            ],
          ),

          /// Skip Button
          const OnBoardingSkip(),

          /// Dot Navigation SmoothPageIndicator
          const OnBoardingDotNavigation(),

          /// Circular Next Button
          const OnBoardingNextButton(),
        ],
      ),
    );
  }
}
