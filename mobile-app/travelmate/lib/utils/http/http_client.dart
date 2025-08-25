import 'dart:convert';
import 'dart:io';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

class SuraHttpHelper {
  static final String _baseUrl = "${dotenv.env['SURA_BASE_URL']}";

  // Helper method to make a GET request
  static Future<Map<String, dynamic>> get(
    String endpoint, {
    String? token,
    Map<String, dynamic>? body,
  }) async {
    try {
      final headers = _buildHeaders(token);
      final uri = Uri.parse('$_baseUrl/$endpoint');

      final request = http.Request('GET', uri);
      request.headers.addAll(headers);

      // Attach body if provided
      if (body != null && body.isNotEmpty) {
        request.body = jsonEncode(body);
      }

      // Send request
      final response = await http.Client().send(request);
      final responseBody = await response.stream.bytesToString();

      return _handleResponse(
        http.Response.bytes(utf8.encode(responseBody), response.statusCode),
      );
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> post(
    String endpoint,
    dynamic data, {
    String? token,
  }) async {
    final headers = _buildHeaders(token);
    final response = await http.post(
      Uri.parse('$_baseUrl/$endpoint'),
      headers: headers,
      body: json.encode(data),
    );
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> put(
    String endpoint,
    dynamic data, {
    String? token,
  }) async {
    final headers = _buildHeaders(token);
    final response = await http.put(
      Uri.parse('$_baseUrl/$endpoint'),
      headers: headers,
      body: json.encode(data),
    );
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> delete(
    String endpoint, {
    String? token,
  }) async {
    final headers = _buildHeaders(token);
    final response = await http.delete(
      Uri.parse('$_baseUrl/$endpoint'),
      headers: headers,
    );
    return _handleResponse(response);
  }

  static Map<String, String> _buildHeaders(String? token) {
    final _headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null) {
      return {..._headers, 'Authorization': 'Bearer $token'};
    }
    return _headers;
  }

  static Future<Map<String, dynamic>> uploadImage({
    required String path,
    required File imageFile,
    String fieldName = 'profile_picture',
    Map<String, String>? headers,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/$path');
      final request = http.MultipartRequest('POST', url);

      final extension = imageFile.path.split('.').last.toLowerCase();
      final mimeType = (extension == 'png')
          ? MediaType('image', 'png')
          : MediaType('image', 'jpeg'); // Treat jpeg/jpg the same

      request.files.add(
        await http.MultipartFile.fromPath(
          fieldName,
          imageFile.path,
          contentType: mimeType,
        ),
      );

      if (headers != null) {
        request.headers.addAll(headers);
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      print("🔁 Upload response code: ${response.statusCode}");
      print("📦 Upload response body: ${response.body}");

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
          "Upload failed with status code: ${response.statusCode}",
        );
      }
    } catch (e) {
      print("⛔ Exception during image upload: $e");
      rethrow;
    }
  }

  static dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final decodedBody = json.decode(utf8.decode(response.bodyBytes));
      if (decodedBody is String && decodedBody.startsWith('[')) {
        try {
          final parsedList = json.decode(decodedBody);
          if (parsedList is List<dynamic>) {
            return {'data': parsedList};
          }
        } catch (e) {
          throw Exception('Unexpected response format');
        }
      }
      if (decodedBody is List<dynamic>) {
        return {'data': decodedBody};
      } else if (decodedBody is Map<String, dynamic>) {
        return decodedBody;
      } else {
        throw Exception('Unexpected response format');
      }
    } else {
      final errorBody = json.decode(response.body);
      throw Exception(
        'Failed to Load Data: ${response.statusCode}, Error: $errorBody',
      );
    }
  }
}
