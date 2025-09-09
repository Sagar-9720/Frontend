import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:travelmate/app.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/device/device_utility.dart';
import 'package:travelmate/utils/logging/logger.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (TDeviceUtils.isAndroid()) {
    await InAppWebViewController.setWebContentsDebuggingEnabled(true);
  }

  String path = ".env";
  try {
    await dotenv.load(fileName: path);
    TLoggerHelper.info("✅ .env file loaded successfully!");
  } catch (e) {
    TLoggerHelper.error("❌ Error loading .env file: $e");
  }

  final isLoggedIn = await AuthService.isLoggedIn();

  runApp(TravelMateApp(isLoggedIn: isLoggedIn));
}
