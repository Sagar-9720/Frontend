import 'package:flutter/material.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/device/device_utility.dart';
import 'package:travelmate/app.dart';
import 'package:travelmate/common/widgets/ButtonWidget.dart';

class NoInternetApp extends StatelessWidget {
  const NoInternetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.wifi_off, size: 80, color: Colors.redAccent),
                const SizedBox(height: 20),
                const Text(
                  "No Internet Connection",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                const Text(
                  "Please check your internet settings and try again.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 30),
                TButtonWidget(
                  onPressed: () async {
                    final hasInternet =
                        await TDeviceUtils.hasInternetConnection();
                    if (hasInternet) {
                      final isLoggedIn = await AuthService.isLoggedIn();
                      runApp(TravelMateApp(isLoggedIn: isLoggedIn));
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Still no internet connection"),
                        ),
                      );
                    }
                  },
                  text: "Retry",
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.refresh, color: Colors.white),
                      SizedBox(width: 8),
                      Text("Retry", style: TextStyle(color: Colors.white)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
