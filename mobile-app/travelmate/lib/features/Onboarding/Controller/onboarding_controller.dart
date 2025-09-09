import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/features/Authentication/screens/login/login.dart';
import 'package:travelmate/utils/logging/logger.dart';

class OnBoardingController extends GetxController {
  static OnBoardingController get instance => Get.find();

  /// Variables
  final pageController = PageController();
  Rx<int> currentPageIndex = 0.obs;
  final RxBool isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    TLoggerHelper.info('OnBoardingController initialized');
  }

  /// Update Current Index when Page Scroll
  void updatePageIndicator(int index) {
    currentPageIndex.value = index;
    TLoggerHelper.info('Onboarding page changed to: $index');
  }

  /// Jump to the specific dot selected page
  void dotNavigationClick(int index) {
    currentPageIndex.value = index;
    pageController.jumpToPage(index);
    TLoggerHelper.info('Dot navigation clicked for page: $index');
  }

  /// Update Current Index & jump to next page
  void nextPage() {
    TLoggerHelper.info('Next button pressed on page: ${currentPageIndex.value}');

    if (currentPageIndex.value == 2) {
      // Last page - navigate to login
      completeOnboarding();
    } else {
      // Move to next page
      int page = currentPageIndex.value + 1;
      pageController.animateToPage(
        page,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  /// Skip onboarding and go to login
  void skipPage() {
    TLoggerHelper.info('Skip button pressed from page: ${currentPageIndex.value}');
    completeOnboarding();
  }

  /// Complete onboarding process
  void completeOnboarding() {
    try {
      isLoading(true);
      TLoggerHelper.info('Completing onboarding process');

      // Save onboarding completion status (could be saved to local storage)
      // await LocalStorage.setBool('onboarding_completed', true);

      // Navigate to login screen
      Get.offAll(() => const LoginScreen());

      TLoggerHelper.info('Onboarding completed successfully');
    } catch (e) {
      TLoggerHelper.error('Error completing onboarding: $e');
    } finally {
      isLoading(false);
    }
  }

  /// Go to previous page
  void previousPage() {
    if (currentPageIndex.value > 0) {
      int page = currentPageIndex.value - 1;
      pageController.animateToPage(
        page,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      TLoggerHelper.info('Navigated to previous page: $page');
    }
  }

  /// Get onboarding progress percentage
  double get progress => (currentPageIndex.value + 1) / 3;

  /// Check if it's the last page
  bool get isLastPage => currentPageIndex.value == 2;

  /// Check if it's the first page
  bool get isFirstPage => currentPageIndex.value == 0;

  /// Get current page title for accessibility
  String get currentPageTitle {
    switch (currentPageIndex.value) {
      case 0:
        return 'Explore Destinations';
      case 1:
        return 'Plan Your Trips';
      case 2:
        return 'Create Travel Journal';
      default:
        return 'Onboarding';
    }
  }

  /// Handle system back button on Android
  Future<bool> onWillPop() async {
    if (currentPageIndex.value > 0) {
      previousPage();
      return false; // Don't exit the app
    }
    return true; // Allow exit on first page
  }

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }
}
