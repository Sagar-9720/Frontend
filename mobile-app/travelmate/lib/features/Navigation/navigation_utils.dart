import 'package:get/get.dart';
import 'package:travelmate/features/Navigation/navigation_menu.dart';

class NavigationUtils {
  static void goBack() {
    if (Get.key.currentState?.canPop() ?? false) {
      Get.back();
    } else {
      final navController = Get.find<NavigationController>();
      navController.popScreen();
    }
  }
}
