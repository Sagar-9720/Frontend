import 'package:flutter/material.dart';
import 'package:travelmate/features/Onboarding/controller/onboarding_controller.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/utils/device/device_utility.dart';

class OnBoardingSkip extends StatelessWidget {
  const OnBoardingSkip({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: TDeviceUtils.getAppBarHeight(),
      right: TSizes.defaultSpace,
      child: TextButton(
        onPressed: () => OnBoardingController.instance.skipPage(),
        child: const Text(
          TTexts.skip,
          style: TextStyle(
            color: Color(0xFF32995E),
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
