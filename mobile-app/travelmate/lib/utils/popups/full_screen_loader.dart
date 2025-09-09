import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/helpers/helper_functions.dart';

/// A utility class for managing a full-screen loading dialog.
class TFullScreenLoader {
  /// Open a full-screen loading dialog with a given text and animation.
  /// This method doesn't return anything.
  ///
  /// Parameters:
  ///   - text: The text to be displayed in the loading dialog.
  ///   - animation: The Lottie animation to be shown.
  static void openLoadingDialog(String text, String animation) {
    showDialog(
      context: Get.overlayContext!, // Use Get.overlayContext for overlay dialogs
      barrierDismissible: false, // The dialog can't be dismissed by tapping outside it
      builder: (_) => PopScope(
        canPop: false, // Disable popping with the back button
        child: Container(
          color: THelperFunctions.isDarkMode(Get.context!) ? TColors.dark : TColors.white,
          width: double.infinity,
          height: double.infinity,
          child: Column(
            children: [
              const SizedBox(height: 250), // Adjust the spacing as needed
              TAnimationLoaderWidget(text: text, animation: animation),
            ],
          ),
        ),
      ),
    );
  }

  /// Stop the currently open loading dialog.
  /// This method doesn't return anything.
  static stopLoading() {
    Navigator.of(Get.overlayContext!).pop(); // Close the dialog using the Navigator
  }
}

/// A widget for displaying an animation with text in a loading dialog.
class TAnimationLoaderWidget extends StatelessWidget {
  /// Default constructor for the TAnimationLoaderWidget.
  ///
  /// Parameters:
  ///   - text: The text to be displayed below the animation.
  ///   - animation: The path to the Lottie animation file.
  ///   - showAction: Whether to show an action button below the text.
  ///   - actionText: The text to be displayed on the action button.
  ///   - onActionPressed: Callback function to be executed when the action button is pressed.
  const TAnimationLoaderWidget({
    super.key,
    required this.text,
    required this.animation,
    this.showAction = false,
    this.actionText,
    this.onActionPressed,
  });

  final String text;
  final String animation;
  final bool showAction;
  final String? actionText;
  final VoidCallback? onActionPressed;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Loading Animation
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: TColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(40),
            ),
            child: const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(TColors.primary),
                strokeWidth: 3,
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Loading Text
          Text(
            text,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: TColors.textSecondary,
              fontSize: 16,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),

          // Optional Action Button
          if (showAction)
            SizedBox(
              width: 250,
              child: OutlinedButton(
                onPressed: onActionPressed,
                style: OutlinedButton.styleFrom(
                  backgroundColor: TColors.dark,
                  side: const BorderSide(color: TColors.darkGrey),
                ),
                child: Text(
                  actionText!,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: TColors.light,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
