import 'package:logger/logger.dart';
import 'config.dart';

class AppLogger {
  static late Logger _logger;
  static bool _initialized = false;

  static void initialize() {
    if (_initialized) return;

    _logger = Logger(
      level: _getLogLevel(),
      printer: PrettyPrinter(
        methodCount: 2,
        errorMethodCount: 8,
        lineLength: 120,
        colors: true,
        printEmojis: true,
        printTime: true,
      ),
      output: ConsoleOutput(),
    );

    _initialized = true;
  }

  static Level _getLogLevel() {
    if (!AppConfig.debugMode) return Level.off;

    switch (AppConfig.logLevel.toLowerCase()) {
      case 'trace':
        return Level.trace;
      case 'debug':
        return Level.debug;
      case 'info':
        return Level.info;
      case 'warning':
        return Level.warning;
      case 'error':
        return Level.error;
      case 'fatal':
        return Level.fatal;
      default:
        return Level.debug;
    }
  }

  // Debug logs
  static void debug(String message, [dynamic error, StackTrace? stackTrace]) {
    if (!_initialized) initialize();
    _logger.d(message, error: error, stackTrace: stackTrace);
  }

  // Info logs
  static void info(String message, [dynamic error, StackTrace? stackTrace]) {
    if (!_initialized) initialize();
    _logger.i(message, error: error, stackTrace: stackTrace);
  }

  // Warning logs
  static void warning(String message, [dynamic error, StackTrace? stackTrace]) {
    if (!_initialized) initialize();
    _logger.w(message, error: error, stackTrace: stackTrace);
  }

  // Error logs
  static void error(String message, [dynamic error, StackTrace? stackTrace]) {
    if (!_initialized) initialize();
    _logger.e(message, error: error, stackTrace: stackTrace);
  }

  // Fatal logs
  static void fatal(String message, [dynamic error, StackTrace? stackTrace]) {
    if (!_initialized) initialize();
    _logger.f(message, error: error, stackTrace: stackTrace);
  }

  // Network logs
  static void network(
    String method,
    String url, {
    int? statusCode,
    Duration? duration,
    Map<String, dynamic>? requestData,
    dynamic responseData,
    dynamic error,
  }) {
    if (!_initialized) initialize();

    final message = '$method $url';
    final details = {
      'status': statusCode,
      'duration': duration?.inMilliseconds,
      'request': requestData,
      'response': responseData,
      'error': error,
    };

    if (statusCode != null && statusCode >= 400) {
      _logger.e(message, error: details);
    } else {
      _logger.d(message, error: details);
    }
  }

  // User action logs
  static void userAction(String action, [Map<String, dynamic>? data]) {
    if (!_initialized) initialize();
    _logger.i('User Action: $action', error: data);
  }

  // Authentication logs
  static void auth(String action, {String? userId, bool success = true}) {
    if (!_initialized) initialize();
    final message = 'Auth: $action';
    final details = {'userId': userId, 'success': success};

    if (success) {
      _logger.i(message, error: details);
    } else {
      _logger.w(message, error: details);
    }
  }

  // Performance logs
  static void performance(String operation, Duration duration,
      [Map<String, dynamic>? data]) {
    if (!_initialized) initialize();
    final message = 'Performance: $operation took ${duration.inMilliseconds}ms';
    _logger.i(message, error: data);
  }

  // Cache logs
  static void cache(String action, String key,
      {bool hit = false, String? source}) {
    if (!_initialized) initialize();
    final message = 'Cache $action: $key';
    final details = {'hit': hit, 'source': source};
    _logger.d(message, error: details);
  }

  // Navigation logs
  static void navigation(String from, String to,
      [Map<String, dynamic>? params]) {
    if (!_initialized) initialize();
    final message = 'Navigation: $from -> $to';
    _logger.d(message, error: params);
  }

  // API logs with detailed tracking
  static void api({
    required String endpoint,
    required String method,
    Map<String, dynamic>? request,
    dynamic response,
    int? statusCode,
    Duration? duration,
    dynamic error,
    StackTrace? stackTrace,
  }) {
    if (!_initialized) initialize();

    final message = '$method $endpoint';
    final logData = {
      'request': request,
      'response': response,
      'statusCode': statusCode,
      'duration': duration?.inMilliseconds,
      'timestamp': DateTime.now().toIso8601String(),
    };

    if (error != null) {
      _logger.e(message,
          error: logData..['error'] = error, stackTrace: stackTrace);
    } else if (statusCode != null && statusCode >= 400) {
      _logger.w(message, error: logData);
    } else {
      _logger.i(message, error: logData);
    }
  }
}
