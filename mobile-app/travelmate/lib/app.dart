import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:travelmate/features/personalization/providers/user_provider.dart';
import 'package:travelmate/features/Navigation/navigation_menu.dart';
import 'package:travelmate/features/Onboarding/screens/onboarding.dart';
import 'package:travelmate/utils/constants/text_strings.dart';
import 'package:travelmate/utils/theme/theme.dart';

class TravelMateApp extends StatelessWidget {
  final bool isLoggedIn;

  const TravelMateApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: GetMaterialApp(
        title: TTexts.appName,
        debugShowCheckedModeBanner: false,
        theme: TAppTheme.lightTheme,
        darkTheme: TAppTheme.darkTheme,
        themeMode: ThemeMode.system,
        home: isLoggedIn ? const NavigationMenu() : const OnboardingScreen(),
        builder: (context, child) {
          return GestureDetector(
            onTap: () {
              // Dismiss keyboard when tapping outside
              FocusScope.of(context).unfocus();
            },
            child: child,
          );
        },
      ),
    );
  }
}
