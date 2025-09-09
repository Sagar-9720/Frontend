import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/helpers/env_file_reader.dart';
import 'package:travelmate/utils/http/http_client.dart';
import 'package:travelmate/utils/logging/logger.dart';

class UserInteractionService {

  /// Get API endpoint
  static Future<String> _getApiEndpoint() async {
    final endpoint = await TEnvFileReader.fetchUserServiceEndpoint();
    if (endpoint == null || endpoint.isEmpty) {
      throw Exception('API endpoint is not set in the environment file.');
    }
    return endpoint;
  }

  /// Construct endpoint based on entity type and action
  static String _buildEndpoint(String baseUrl, String entityType, String id, String action) {
    switch (entityType.toLowerCase()) {
      case 'trip':
        return '$baseUrl/trip/$id/$action';
      case 'journal':
        return '$baseUrl/journals/$id/$action';
      case 'destination':
        return '$baseUrl/destinations/$id/$action';
      default:
        throw ArgumentError('Unsupported entity type: $entityType');
    }
  }

  /// Create a comment
  static Future<Map<String, dynamic>?> createComment({
    required String entityType,
    required String id,
    required String content,
    String? parentCommentId,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'comments');

      Map<String, dynamic> data = {
        'content': content,
      };

      if (parentCommentId != null && parentCommentId.isNotEmpty) {
        data['parentId'] = parentCommentId;
      }

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.post(endpoint, data, token: token);

      TLoggerHelper.info('Comment created for $entityType ID: $id');
      return response['comment'];
    } catch (e) {
      TLoggerHelper.error('Error creating comment: $e');
      rethrow;
    }
  }

  /// Get all comments for an entity
  static Future<List<Map<String, dynamic>>> getAllComments({
    required String entityType,
    required String id,
    int page = 1,
    int limit = 20,
    String sortBy = 'createdAt',
    String sortOrder = 'desc',
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'comments');

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> commentsData = response['comments'] ?? [];
      List<Map<String, dynamic>> comments = commentsData
          .map((comment) => Map<String, dynamic>.from(comment))
          .toList();

      TLoggerHelper.info('Comments loaded for $entityType ID: $id, ${comments.length} items');
      return comments;
    } catch (e) {
      TLoggerHelper.error('Error loading comments: $e');
      rethrow;
    }
  }

  /// Delete a comment
  static Future<bool> deleteComment({
    required String entityType,
    required String id,
    required String commentId,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'comments/$commentId');

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.delete(endpoint, token: token);

      TLoggerHelper.info('Comment deleted: $commentId for $entityType ID: $id');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Error deleting comment: $e');
      rethrow;
    }
  }

  /// Get all likes for an entity
  static Future<Map<String, dynamic>> getAllLikes({
    required String entityType,
    required String id,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'likes');

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> likesData = response['likes'] ?? [];
      List<Map<String, dynamic>> likes = likesData
          .map((like) => Map<String, dynamic>.from(like))
          .toList();

      TLoggerHelper.info('Likes loaded for $entityType ID: $id, ${likes.length} items');
      return {
        'likes': likes,
        'totalLikes': response['totalLikes'] ?? likes.length,
        'isLikedByUser': response['isLikedByUser'] ?? false,
      };
    } catch (e) {
      TLoggerHelper.error('Error loading likes: $e');
      rethrow;
    }
  }

  /// Toggle like for an entity (like/unlike)
  static Future<Map<String, dynamic>> toggleLike({
    required String entityType,
    required String id,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'like');

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.post(endpoint, {}, token: token);

      TLoggerHelper.info('Like toggled for $entityType ID: $id');
      return {
        'isLiked': response['isLiked'] ?? false,
        'totalLikes': response['totalLikes'] ?? 0,
        'success': response['success'] ?? false,
      };
    } catch (e) {
      TLoggerHelper.error('Error toggling like: $e');
      rethrow;
    }
  }

  /// Increase views count
  static Future<int> increaseViews({
    required String entityType,
    required String id,
    String? userId,
    String? sessionId,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'views');

      Map<String, dynamic> data = {};
      if (userId != null && userId.isNotEmpty) {
        data['userId'] = userId;
      }
      if (sessionId != null && sessionId.isNotEmpty) {
        data['sessionId'] = sessionId;
      }

      String? token = await AuthService.getToken();
      final response = await THttpHelper.post(endpoint, data, token: token);

      final viewsCount = response['viewsCount'] ?? 0;
      TLoggerHelper.info('Views increased for $entityType ID: $id, total views: $viewsCount');
      return viewsCount;
    } catch (e) {
      TLoggerHelper.error('Error increasing views: $e');
      rethrow;
    }
  }

  /// Get views count
  static Future<Map<String, dynamic>> getViewsCount({
    required String entityType,
    required String id,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'views');

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('Views count loaded for $entityType ID: $id');
      return {
        'viewsCount': response['viewsCount'] ?? 0,
        'uniqueViews': response['uniqueViews'] ?? 0,
        'todayViews': response['todayViews'] ?? 0,
      };
    } catch (e) {
      TLoggerHelper.error('Error loading views count: $e');
      rethrow;
    }
  }

  /// Toggle saved status for an entity
  static Future<Map<String, dynamic>> toggleSaved({
    required String entityType,
    required String id,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'save');

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.post(endpoint, {}, token: token);

      TLoggerHelper.info('Save toggled for $entityType ID: $id');
      return {
        'isSaved': response['isSaved'] ?? false,
        'success': response['success'] ?? false,
      };
    } catch (e) {
      TLoggerHelper.error('Error toggling saved status: $e');
      rethrow;
    }
  }

  /// Get all saved items for the user
  static Future<List<Map<String, dynamic>>> getAllSaved({
    String? entityType,
    int page = 1,
    int limit = 20,
    String sortBy = 'savedAt',
    String sortOrder = 'desc',
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/user/saved';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
      };

      if (entityType != null && entityType.isNotEmpty) {
        queryParams['type'] = entityType;
      }

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> savedData = response['saved'] ?? [];
      List<Map<String, dynamic>> savedItems = savedData
          .map((item) => Map<String, dynamic>.from(item))
          .toList();

      TLoggerHelper.info('Saved items loaded: ${savedItems.length} items');
      return savedItems;
    } catch (e) {
      TLoggerHelper.error('Error loading saved items: $e');
      rethrow;
    }
  }

  /// Get user's interaction summary for an entity
  static Future<Map<String, dynamic>> getUserInteractionSummary({
    required String entityType,
    required String id,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'user-interaction');

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('User interaction summary loaded for $entityType ID: $id');
      return {
        'isLiked': response['isLiked'] ?? false,
        'isSaved': response['isSaved'] ?? false,
        'hasCommented': response['hasCommented'] ?? false,
        'hasViewed': response['hasViewed'] ?? false,
        'totalLikes': response['totalLikes'] ?? 0,
        'totalComments': response['totalComments'] ?? 0,
        'totalViews': response['totalViews'] ?? 0,
      };
    } catch (e) {
      TLoggerHelper.error('Error loading user interaction summary: $e');
      rethrow;
    }
  }

  /// Get interaction statistics for an entity
  static Future<Map<String, dynamic>> getInteractionStats({
    required String entityType,
    required String id,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'stats');

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('Interaction stats loaded for $entityType ID: $id');
      return {
        'totalLikes': response['totalLikes'] ?? 0,
        'totalComments': response['totalComments'] ?? 0,
        'totalViews': response['totalViews'] ?? 0,
        'totalShares': response['totalShares'] ?? 0,
        'totalSaves': response['totalSaves'] ?? 0,
        'engagementRate': response['engagementRate'] ?? 0.0,
      };
    } catch (e) {
      TLoggerHelper.error('Error loading interaction stats: $e');
      rethrow;
    }
  }

  /// Update comment
  static Future<Map<String, dynamic>?> updateComment({
    required String entityType,
    required String id,
    required String commentId,
    required String content,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'comments/$commentId');

      Map<String, dynamic> data = {
        'content': content,
      };

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.put(endpoint, data, token: token);

      TLoggerHelper.info('Comment updated: $commentId for $entityType ID: $id');
      return response['comment'];
    } catch (e) {
      TLoggerHelper.error('Error updating comment: $e');
      rethrow;
    }
  }

  /// Report content (comment, entity, etc.)
  static Future<bool> reportContent({
    required String entityType,
    required String id,
    String? commentId,
    required String reason,
    String? description,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint;

      if (commentId != null && commentId.isNotEmpty) {
        endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'comments/$commentId/report');
      } else {
        endpoint = _buildEndpoint(apiEndpoint, entityType, id, 'report');
      }

      Map<String, dynamic> data = {
        'reason': reason,
      };

      if (description != null && description.isNotEmpty) {
        data['description'] = description;
      }

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.post(endpoint, data, token: token);

      TLoggerHelper.info('Content reported for $entityType ID: $id');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Error reporting content: $e');
      rethrow;
    }
  }

  /// Get trip names by IDs
  static Future<List<Map<String, dynamic>>> getTripsNames(List<String> tripIds) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/trips/names';

      Map<String, dynamic> data = {
        'tripIds': tripIds,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.post(endpoint, data, token: token);

      List<dynamic> tripsData = response['trips'] ?? [];
      List<Map<String, dynamic>> trips = tripsData
          .map((trip) => Map<String, dynamic>.from(trip))
          .toList();

      TLoggerHelper.info('Trip names loaded: ${trips.length} items');
      return trips;
    } catch (e) {
      TLoggerHelper.error('Error loading trip names: $e');
      rethrow;
    }
  }

  /// Get user names by IDs
  static Future<List<Map<String, dynamic>>> getUserNames(List<String> userIds) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/users/names';

      Map<String, dynamic> data = {
        'userIds': userIds,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.post(endpoint, data, token: token);

      List<dynamic> usersData = response['users'] ?? [];
      List<Map<String, dynamic>> users = usersData
          .map((user) => Map<String, dynamic>.from(user))
          .toList();

      TLoggerHelper.info('User names loaded: ${users.length} items');
      return users;
    } catch (e) {
      TLoggerHelper.error('Error loading user names: $e');
      rethrow;
    }
  }
}
