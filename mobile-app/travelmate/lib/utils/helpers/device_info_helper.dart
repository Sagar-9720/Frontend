import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';

import 'package:sura_guide_app/features/authentication/Services/auth_service.dart';

Future<bool> sendUserData(Map<String, dynamic> formData) async {
  try {
    // Get device info
    final deviceInfo = DeviceInfoPlugin();
    String deviceModel = "Unknown";
    String os = "Unknown";
    String osVersion = "Unknown";

    if (Platform.isAndroid) {
      final androidInfo = await deviceInfo.androidInfo;
      deviceModel = androidInfo.model;
      os = "Android";
      osVersion = androidInfo.version.release;
    } else if (Platform.isIOS) {
      final iosInfo = await deviceInfo.iosInfo;
      deviceModel = iosInfo.utsname.machine;
      os = "iOS";
      osVersion = iosInfo.systemVersion;
    }

    // Get app version
    final packageInfo = await PackageInfo.fromPlatform();
    String appVersion = packageInfo.version;

    // Get IP Address
    String ipAddress = "Unknown";
    for (var interface in await NetworkInterface.list()) {
      for (var addr in interface.addresses) {
        if (addr.type == InternetAddressType.IPv4) {
          ipAddress = addr.address;
          break;
        }
      }
      if (ipAddress != "Unknown") break;
    }

    // Transform formData to API format
    final Map<String, dynamic> apiData = {
      "mobile_number": formData["mobileNumber"],
      "full_name": formData["fullName"],
      "gender": formData["gender"] ?? "Other",
      "password": formData["password"],
      "user_type": formData["work"] ?? "other",
      "district": formData["district"] ?? "",
      "school_name": formData["schoolName"] ?? "",
      "referral_code": formData["referralCode"] ?? "",
      "device_model": deviceModel,
      "os": os,
      "os_version": osVersion,
      "app_version": appVersion,
      "ip_address": ipAddress,
    };

    // Use the register function from auth_service.dart
    final bool isRegistered = await AuthService.register(apiData);

    if (isRegistered) {
      print("✅ User registered successfully.");
      return true;
    } else {
      print("❌ Registration failed.");
      return false;
    }
  } catch (e) {
    print("⚠️ Error in sendUserData: $e");
    return false;
  }
}
