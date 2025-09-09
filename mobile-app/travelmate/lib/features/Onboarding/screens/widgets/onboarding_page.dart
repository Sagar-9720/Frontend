import 'package:flutter/material.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/helpers/helper_functions.dart';

class OnBoardingPage extends StatelessWidget {
  const OnBoardingPage({
    super.key,
    required this.image,
    required this.title,
    required this.subTitle,
    required this.icon,
    this.isNetworkImage = true,
  });

  final String image, title, subTitle;
  final IconData icon;
  final bool isNetworkImage;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        /// Image Container with overlay and icon
        SizedBox(
          height: THelperFunctions.screenHeight() * 0.6,
          child: Stack(
            children: [
              /// Background Image
              Container(
                height: double.infinity,
                width: double.infinity,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: isNetworkImage
                        ? NetworkImage(image)
                        : AssetImage(image) as ImageProvider,
                    fit: BoxFit.cover,
                  ),
                ),
              ),

              /// Overlay
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.4),
                      Colors.black.withValues(alpha: 0.4),
                    ],
                  ),
                ),
              ),

              /// Icon Container
              Center(
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(60),
                  ),
                  child: Icon(
                    icon,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),

        /// Content Container
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(TSizes.defaultSpace),
            child: Column(
              children: [
                const SizedBox(height: TSizes.spaceBtwSections),

                /// Title
                Text(
                  title,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1E293B),
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: TSizes.spaceBtwItems),

                /// Subtitle
                Text(
                  subTitle,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: const Color(0xFF64748B),
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
