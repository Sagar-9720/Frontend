import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TFlutterStorage {
  static final TFlutterStorage _instance = TFlutterStorage._internal();

  factory TFlutterStorage() {
    return _instance;
  }

  TFlutterStorage._internal();

  final _storage = const FlutterSecureStorage();

  // Generic method to save data
  Future<void> saveData(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  // Generic method to read data
  Future<String?> readData(String key) async {
    return await _storage.read(key: key);
  }

  // Generic method to remove data
  Future<void> removeData(String key) async {
    await _storage.delete(key: key);
  }

  // Clear all data in storage
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
