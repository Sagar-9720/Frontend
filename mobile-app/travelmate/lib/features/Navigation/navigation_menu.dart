import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/NoInternetApp.dart';
import 'package:travelmate/features/Personalization/Destination/screens/destinations.dart';
import 'package:travelmate/features/Personalization/Home/screens/home.dart';
import 'package:travelmate/features/Personalization/Journal/screens/travel_journal.dart';
import 'package:travelmate/features/Personalization/Setting/screens/settings.dart';
import 'package:travelmate/features/Personalization/Trips/screens/trips.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/utils/helpers/helper_functions.dart';
import 'package:travelmate/utils/device/device_utility.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:travelmate/utils/logging/logger.dart';

class NavigationMenu extends StatefulWidget {
  const NavigationMenu({super.key});

  @override
  _NavigationMenuState createState() => _NavigationMenuState();
}

class _NavigationMenuState extends State<NavigationMenu> {
  @override
  void initState() {
    super.initState();
    TLoggerHelper.info('🚀 NavigationMenu initialized');
  }

  final controller = Get.put(NavigationController());

  @override
  Widget build(BuildContext context) {
    final darkMode = THelperFunctions.isDarkMode(context);

    return WillPopScope(
      onWillPop: () async => await controller.handleBackPress(),
      child: Scaffold(
        bottomNavigationBar: Obx(
          () => NavigationBarTheme(
            data: NavigationBarThemeData(
              labelTextStyle: WidgetStateProperty.all(
                const TextStyle(fontSize: 10, fontWeight: FontWeight.w500),
              ),
            ),
            child: NavigationBar(
              height: 80,
              elevation: 0,
              selectedIndex: controller.selectedIndex.value,
              onDestinationSelected: controller.changeTab,
              backgroundColor: darkMode ? TColors.black : TColors.white,
              indicatorColor: Colors.transparent,
              destinations: const [
                NavigationItem(
                  imagePath: TImages.homeIcon,
                  activeImagePath: TImages.homeIconActive,
                  label: TTexts.home,
                  index: 0,
                ),
                NavigationItem(
                  imagePath: TImages.destinationsIcon,
                  activeImagePath: TImages.destinationsIconActive,
                  label: TTexts.destinations,
                  index: 1,
                ),
                NavigationItem(
                  imagePath: TImages.tripsIcon,
                  activeImagePath: TImages.tripsIconActive,
                  label: TTexts.trips,
                  index: 2,
                ),
                NavigationItem(
                  imagePath: TImages.journalIcon,
                  activeImagePath: TImages.journalIconActive,
                  label: TTexts.travelJournal,
                  index: 3,
                ),
                NavigationItem(
                  imagePath: TImages.settingsIcon,
                  activeImagePath: TImages.settingsIconActive,
                  label: TTexts.settings,
                  index: 4,
                ),
              ],
            ),
          ),
        ),
        body: Obx(() {
          final screen = controller.currentScreen.value;
          return screen ?? const SizedBox.shrink();
        }),
      ),
    );
  }
}

/// Navigation Controller
class NavigationController extends GetxController {
  final RxBool hasInternet = true.obs;
  final RxInt selectedIndex = 0.obs;
  final List<Widget> screenStack = [];
  final Rxn<Widget> currentScreen = Rxn<Widget>();

  StreamSubscription<ConnectivityResult>? _connectivitySub;

  @override
  void onInit() {
    super.onInit();
    _monitorInternetConnection();
  }

  void _monitorInternetConnection() async {
    hasInternet.value = await TDeviceUtils.hasInternetConnection();

    _connectivitySub = Connectivity().onConnectivityChanged.listen((_) async {
      final status = await TDeviceUtils.hasInternetConnection();
      hasInternet.value = status;
      changeTab(selectedIndex.value); // Refresh screen based on new status
    }) as StreamSubscription<ConnectivityResult>?;
  }

  void changeTab(int index) {
    selectedIndex.value = index;

    if (!hasInternet.value && index != 4) {
      currentScreen.value = const NoInternetApp();
      return;
    }

    switch (index) {
      case 0:
        currentScreen.value = const HomeScreen();
        break;
      case 1:
        currentScreen.value = const DestinationsScreen();
        break;
      case 2:
        currentScreen.value = const TripsScreen();
        break;
      case 3:
        currentScreen.value = const TravelJournalScreen();
        break;
      case 4:
        currentScreen.value = const SettingsScreen();
        break;
    }
  }

  Future<bool> handleBackPress() async {
    if (screenStack.isNotEmpty) {
      popScreen();
      return false;
    } else if (selectedIndex.value != 0) {
      changeTab(0);
      return false;
    } else {
      return true;
    }
  }

  void pushScreen(Widget screen) {
    if (currentScreen.value != null) {
      screenStack.add(currentScreen.value!);
    }
    currentScreen.value = screen;
  }

  void popScreen() {
    if (screenStack.isNotEmpty) {
      currentScreen.value = screenStack.removeLast();
    }
  }

  @override
  void onClose() {
    _connectivitySub?.cancel();
    super.onClose();
  }

  @override
  void onReady() {
    super.onReady();
    changeTab(0);
  }

  void resetToHome() {
    screenStack.clear();
    changeTab(0);
  }
}

/// Navigation Item Widget
class NavigationItem extends StatelessWidget {
  final String imagePath;
  final String activeImagePath;
  final String label;
  final int index;

  const NavigationItem({
    super.key,
    required this.imagePath,
    required this.activeImagePath,
    required this.label,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<NavigationController>();
    return Obx(() {
      final bool isActive = controller.selectedIndex.value == index;
      return NavigationDestination(
        icon: Image.asset(
          isActive ? activeImagePath : imagePath,
          width: 24,
          height: 24,
        ),
        label: label,
      );
    });
  }
}
