import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sura_guide_app/utils/local_storage/flutter_storage_utility.dart';

class SuraEnvFileReader {
  static Future<void> loadEnvFile() async {
    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      throw Exception("Failed to load .env file: $e");
    }
  }

  /// Fetch user token from .env file or storage
  static Future<String?> fetchUserToken() async {
    await loadEnvFile();

    const tokenKey = 'USER_TOKEN';
    final _tokenKey = dotenv.env[tokenKey];

    if (_tokenKey == null || _tokenKey.isEmpty) {
      throw Exception("USER_TOKEN is not defined in the .env file");
    }

    String? token = await SuraFlutterStorage().readData(_tokenKey);

    if (token == null || token.isEmpty) {
      token = null;
    }

    return token;
  }

  /// Save user token to storage
  static Future<void> saveUserToken(String token) async {
    await loadEnvFile();

    const tokenKey = 'USER_TOKEN';
    final _tokenKey = dotenv.env[tokenKey];

    if (_tokenKey == null || _tokenKey.isEmpty) {
      throw Exception("USER_TOKEN is not defined in the .env file");
    }

    await SuraFlutterStorage().saveData(_tokenKey, token);
  }

  /// Remove user token from storage
  static Future<void> removeUserToken() async {
    await loadEnvFile();

    const tokenKey = 'USER_TOKEN';
    final _tokenKey = dotenv.env[tokenKey];

    if (_tokenKey == null || _tokenKey.isEmpty) {
      throw Exception("USER_TOKEN is not defined in the .env file");
    }

    await SuraFlutterStorage().removeData(_tokenKey);
  }
}
