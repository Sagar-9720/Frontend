import 'dart:io';
import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../models/models.dart';
import 'config.dart';
import 'logger.dart';
import 'storage.dart';

class HttpClient {
  late Dio _dio;
  static HttpClient? _instance;

  HttpClient._internal() {
    _dio = Dio(BaseOptions(
      connectTimeout: Duration(seconds: 30),
      receiveTimeout: Duration(seconds: 30),
      sendTimeout: Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _setupInterceptors();
  }

  static HttpClient get instance {
    _instance ??= HttpClient._internal();
    return _instance!;
  }

  void _setupInterceptors() {
    // Request interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Add auth token
        final tokens = await StorageService.getAuthTokens();
        if (tokens != null && !tokens.isExpired) {
          options.headers['Authorization'] = 'Bearer ${tokens.accessToken}';
        }

        // Add device info
        options.headers['User-Agent'] = await _getUserAgent();

        AppLogger.api(
          endpoint: options.path,
          method: options.method,
          request: options.data,
        );

        handler.next(options);
      },
      onResponse: (response, handler) {
        AppLogger.api(
          endpoint: response.requestOptions.path,
          method: response.requestOptions.method,
          response: response.data,
          statusCode: response.statusCode,
        );
        handler.next(response);
      },
      onError: (error, handler) async {
        AppLogger.api(
          endpoint: error.requestOptions.path,
          method: error.requestOptions.method,
          statusCode: error.response?.statusCode,
          error: error.message,
        );

        // Handle token expiry
        if (error.response?.statusCode == 401) {
          final refreshed = await _refreshToken();
          if (refreshed) {
            // Retry the request
            final retryResponse = await _retry(error.requestOptions);
            handler.resolve(retryResponse);
            return;
          } else {
            // Clear auth data and redirect to login
            await _clearAuthAndRedirect();
          }
        }

        handler.next(error);
      },
    ));

    // Network connectivity interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final connectivityResult = await Connectivity().checkConnectivity();
        if (connectivityResult == ConnectivityResult.none) {
          // Try to serve from cache if offline
          final cachedData = await _getCachedResponse(options);
          if (cachedData != null) {
            handler.resolve(Response(
              requestOptions: options,
              data: cachedData,
              statusCode: 200,
            ));
            return;
          }

          handler.reject(DioException(
            requestOptions: options,
            message: 'No internet connection',
            type: DioExceptionType.connectionError,
          ));
          return;
        }
        handler.next(options);
      },
    ));
  }

  Future<String> _getUserAgent() async {
    // You can add device info here
    return '${AppConfig.appName}/${AppConfig.appVersion}';
  }

  Future<bool> _refreshToken() async {
    try {
      final tokens = await StorageService.getAuthTokens();
      if (tokens == null) return false;

      final response = await _dio.post(
        AppConfig.authRefreshUrl,
        data: {'refreshToken': tokens.refreshToken},
        options: Options(
          headers: {'Authorization': 'Bearer ${tokens.refreshToken}'},
        ),
      );

      if (response.statusCode == 200) {
        final newTokens = AuthTokens.fromJson(response.data);
        await StorageService.saveAuthTokens(newTokens);
        AppLogger.auth('Token refreshed successfully');
        return true;
      }
    } catch (e) {
      AppLogger.error('Token refresh failed', e);
    }
    return false;
  }

  Future<void> _clearAuthAndRedirect() async {
    await StorageService.clearAuthTokens();
    await StorageService.clearUser();
    AppLogger.auth('Auth cleared due to token expiry');
    // You can navigate to login screen here
  }

  Future<Response> _retry(RequestOptions requestOptions) async {
    final tokens = await StorageService.getAuthTokens();
    if (tokens != null) {
      requestOptions.headers['Authorization'] = 'Bearer ${tokens.accessToken}';
    }
    return await _dio.request(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: Options(
        method: requestOptions.method,
        headers: requestOptions.headers,
      ),
    );
  }

  Future<dynamic> _getCachedResponse(RequestOptions options) async {
    if (AppConfig.enableOfflineMode) {
      final cacheKey =
          '${options.method}_${options.path}_${options.queryParameters}';
      return await StorageService.getOfflineDataByKey(
        cacheKey,
        maxAge: Duration(hours: AppConfig.cacheDurationHours),
      );
    }
    return null;
  }

  Future<void> _cacheResponse(RequestOptions options, dynamic data) async {
    if (AppConfig.enableOfflineMode && options.method == 'GET') {
      final cacheKey =
          '${options.method}_${options.path}_${options.queryParameters}';
      await StorageService.saveOfflineData(cacheKey, {'data': data});
    }
  }

  // Generic request method
  Future<ApiResponse<T>> request<T>(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
    bool useCache = true,
  }) async {
    try {
      final stopwatch = Stopwatch()..start();

      final response = await _dio.request(
        endpoint,
        data: data,
        queryParameters: queryParameters,
        options: Options(method: method),
      );

      stopwatch.stop();
      AppLogger.performance('HTTP Request', stopwatch.elapsed, {
        'endpoint': endpoint,
        'method': method,
      });

      // Cache GET responses
      if (method == 'GET' && useCache) {
        await _cacheResponse(response.requestOptions, response.data);
      }

      if (response.statusCode! >= 200 && response.statusCode! < 300) {
        final responseData = response.data;

        if (fromJson != null && responseData != null) {
          final parsedData = fromJson(responseData);
          return ApiResponse.success(parsedData);
        } else {
          return ApiResponse.success(responseData);
        }
      } else {
        return ApiResponse.error(
          'Request failed with status ${response.statusCode}',
          statusCode: response.statusCode,
        );
      }
    } on DioException catch (e) {
      String errorMessage = 'An error occurred';

      switch (e.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          errorMessage = 'Connection timeout';
          break;
        case DioExceptionType.connectionError:
          errorMessage = 'No internet connection';
          break;
        case DioExceptionType.badResponse:
          errorMessage = e.response?.data?['message'] ?? 'Server error';
          break;
        case DioExceptionType.cancel:
          errorMessage = 'Request cancelled';
          break;
        default:
          errorMessage = e.message ?? 'Unknown error';
      }

      AppLogger.error('HTTP Request failed', e);
      return ApiResponse.error(errorMessage,
          statusCode: e.response?.statusCode);
    } catch (e) {
      AppLogger.error('Unexpected error in HTTP request', e);
      return ApiResponse.error('Unexpected error occurred');
    }
  }

  // Convenience methods
  Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
    bool useCache = true,
  }) {
    return request<T>(
      endpoint,
      method: 'GET',
      queryParameters: queryParameters,
      fromJson: fromJson,
      useCache: useCache,
    );
  }

  Future<ApiResponse<T>> post<T>(
    String endpoint, {
    Map<String, dynamic>? data,
    T Function(dynamic)? fromJson,
  }) {
    return request<T>(
      endpoint,
      method: 'POST',
      data: data,
      fromJson: fromJson,
      useCache: false,
    );
  }

  Future<ApiResponse<T>> put<T>(
    String endpoint, {
    Map<String, dynamic>? data,
    T Function(dynamic)? fromJson,
  }) {
    return request<T>(
      endpoint,
      method: 'PUT',
      data: data,
      fromJson: fromJson,
      useCache: false,
    );
  }

  Future<ApiResponse<T>> delete<T>(
    String endpoint, {
    Map<String, dynamic>? data,
    T Function(dynamic)? fromJson,
  }) {
    return request<T>(
      endpoint,
      method: 'DELETE',
      data: data,
      fromJson: fromJson,
      useCache: false,
    );
  }

  // Paginated request
  Future<ApiResponse<PaginatedResponse<T>>> getPaginated<T>(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
    required T Function(dynamic) fromJson,
    int page = 1,
    int limit = 10,
  }) async {
    final params = {
      'page': page,
      'limit': limit,
      ...?queryParameters,
    };

    return request<PaginatedResponse<T>>(
      endpoint,
      queryParameters: params,
      fromJson: (data) => PaginatedResponse.fromJson(data, fromJson),
    );
  }

  // Upload file
  Future<ApiResponse<T>> upload<T>(
    String endpoint,
    File file, {
    String fieldName = 'file',
    Map<String, dynamic>? additionalData,
    T Function(dynamic)? fromJson,
    void Function(int, int)? onProgress,
  }) async {
    try {
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(file.path),
        ...?additionalData,
      });

      final response = await _dio.post(
        endpoint,
        data: formData,
        onSendProgress: onProgress,
      );

      if (response.statusCode! >= 200 && response.statusCode! < 300) {
        final responseData = response.data;

        if (fromJson != null && responseData != null) {
          final parsedData = fromJson(responseData);
          return ApiResponse.success(parsedData);
        } else {
          return ApiResponse.success(responseData);
        }
      } else {
        return ApiResponse.error(
          'Upload failed with status ${response.statusCode}',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      AppLogger.error('File upload failed', e);
      return ApiResponse.error('File upload failed');
    }
  }
}
