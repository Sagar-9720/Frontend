import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/helpers/env_file_reader.dart';
import 'package:travelmate/utils/http/http_client.dart';
import 'package:travelmate/utils/logging/logger.dart';

class TravelJournalService {

  /// Get API endpoint
  static Future<String> _getApiEndpoint() async {
    final endpoint = await TEnvFileReader.fetchTripServiceEndpoint();
    if (endpoint == null || endpoint.isEmpty) {
      throw Exception('API endpoint is not set in the environment file.');
    }
    return endpoint;
  }

  /// Get all journals with pagination and filters
  static Future<Map<String, dynamic>> getAllJournals({
    int page = 1,
    int limit = 20,
    String? search,
    String? tag,
    String? userId,
    bool isPublic = false,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (tag != null && tag.isNotEmpty) {
        queryParams['tag'] = tag;
      }
      if (userId != null && userId.isNotEmpty) {
        queryParams['userId'] = userId;
      }
      if (isPublic) {
        queryParams['isPublic'] = true;
      }

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> journalsData = response['journals'] ?? [];
      List<Map<String, dynamic>> journals = journalsData
          .map((journal) => Map<String, dynamic>.from(journal))
          .toList();

      TLoggerHelper.info('Journals loaded: ${journals.length} items');
      return {
        'journals': journals,
        'totalPages': response['totalPages'] ?? 1,
        'currentPage': response['currentPage'] ?? page,
        'totalItems': response['totalItems'] ?? journals.length,
      };
    } catch (e) {
      TLoggerHelper.error('Error loading journals: $e');
      rethrow;
    }
  }

  /// Create a new journal
  static Future<Map<String, dynamic>?> createJournal({
    required String title,
    required String content,
    required String location,
    String? tripId,
    String? date,
    String? mood,
    String? weather,
    List<String>? photos,
    List<String>? tags,
    bool isPublic = false,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals';

      Map<String, dynamic> journalData = {
        'title': title,
        'content': content,
        'location': location,
        'date': date ?? DateTime.now().toIso8601String(),
        'isPublic': isPublic,
      };

      if (tripId != null && tripId.isNotEmpty) journalData['tripId'] = tripId;
      if (mood != null && mood.isNotEmpty) journalData['mood'] = mood;
      if (weather != null && weather.isNotEmpty) journalData['weather'] = weather;
      if (photos != null && photos.isNotEmpty) journalData['photos'] = photos;
      if (tags != null && tags.isNotEmpty) journalData['tags'] = tags;

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.post(endpoint, journalData, token: token);

      TLoggerHelper.info('Journal created successfully: $title');
      return response['journal'];
    } catch (e) {
      TLoggerHelper.error('Error creating journal: $e');
      rethrow;
    }
  }

  /// Update an existing journal
  static Future<Map<String, dynamic>?> updateJournal({
    required String journalId,
    String? title,
    String? content,
    String? location,
    String? tripId,
    String? date,
    String? mood,
    String? weather,
    List<String>? photos,
    List<String>? tags,
    bool? isPublic,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/$journalId';

      Map<String, dynamic> updateData = {};

      if (title != null) updateData['title'] = title;
      if (content != null) updateData['content'] = content;
      if (location != null) updateData['location'] = location;
      if (tripId != null) updateData['tripId'] = tripId;
      if (date != null) updateData['date'] = date;
      if (mood != null) updateData['mood'] = mood;
      if (weather != null) updateData['weather'] = weather;
      if (photos != null) updateData['photos'] = photos;
      if (tags != null) updateData['tags'] = tags;
      if (isPublic != null) updateData['isPublic'] = isPublic;

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.put(endpoint, updateData, token: token);

      TLoggerHelper.info('Journal updated successfully: $journalId');
      return response['journal'];
    } catch (e) {
      TLoggerHelper.error('Error updating journal: $e');
      rethrow;
    }
  }

  /// Delete a journal
  static Future<bool> deleteJournal(String journalId) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/$journalId';

      String? token = await AuthService.getToken();
      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await THttpHelper.delete(endpoint, token: token);

      TLoggerHelper.info('Journal deleted successfully: $journalId');
      return response['success'] ?? false;
    } catch (e) {
      TLoggerHelper.error('Error deleting journal: $e');
      rethrow;
    }
  }

  /// Get journal by ID
  static Future<Map<String, dynamic>?> getJournalById(String journalId) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/$journalId';

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint, token: token);

      TLoggerHelper.info('Journal details loaded for ID: $journalId');
      return response['journal'];
    } catch (e) {
      TLoggerHelper.error('Error loading journal details: $e');
      rethrow;
    }
  }

  /// Get journals by user
  static Future<List<Map<String, dynamic>>> getJournalsByUser({
    required String userId,
    int page = 1,
    int limit = 20,
    bool publicOnly = false,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/user/$userId';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      if (publicOnly) {
        queryParams['publicOnly'] = true;
      }

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> journalsData = response['journals'] ?? [];
      List<Map<String, dynamic>> journals = journalsData
          .map((journal) => Map<String, dynamic>.from(journal))
          .toList();

      TLoggerHelper.info('User journals loaded: ${journals.length} items');
      return journals;
    } catch (e) {
      TLoggerHelper.error('Error loading user journals: $e');
      rethrow;
    }
  }

  /// Get journals by trip
  static Future<List<Map<String, dynamic>>> getJournalsByTrip({
    required String tripId,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/trip/$tripId';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> journalsData = response['journals'] ?? [];
      List<Map<String, dynamic>> journals = journalsData
          .map((journal) => Map<String, dynamic>.from(journal))
          .toList();

      TLoggerHelper.info('Trip journals loaded: ${journals.length} items');
      return journals;
    } catch (e) {
      TLoggerHelper.error('Error loading trip journals: $e');
      rethrow;
    }
  }

  /// Get public journals
  static Future<List<Map<String, dynamic>>> getPublicJournals({
    int page = 1,
    int limit = 20,
    String? search,
    String? tag,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/public';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (tag != null && tag.isNotEmpty) {
        queryParams['tag'] = tag;
      }

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> journalsData = response['journals'] ?? [];
      List<Map<String, dynamic>> journals = journalsData
          .map((journal) => Map<String, dynamic>.from(journal))
          .toList();

      TLoggerHelper.info('Public journals loaded: ${journals.length} items');
      return journals;
    } catch (e) {
      TLoggerHelper.error('Error loading public journals: $e');
      rethrow;
    }
  }

  /// Get journals by tag
  static Future<List<Map<String, dynamic>>> getJournalsByTag({
    required String tag,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/tag/$tag';

      Map<String, dynamic> queryParams = {
        'page': page,
        'limit': limit,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> journalsData = response['journals'] ?? [];
      List<Map<String, dynamic>> journals = journalsData
          .map((journal) => Map<String, dynamic>.from(journal))
          .toList();

      TLoggerHelper.info('Journals by tag "$tag" loaded: ${journals.length} items');
      return journals;
    } catch (e) {
      TLoggerHelper.error('Error loading journals by tag: $e');
      rethrow;
    }
  }

  /// Get all tags
  static Future<List<Map<String, dynamic>>> getAllTags({
    int limit = 50,
    String? search,
  }) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/tags';

      Map<String, dynamic> queryParams = {
        'limit': limit,
      };

      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> tagsData = response['tags'] ?? [];
      List<Map<String, dynamic>> tags = tagsData
          .map((tag) => Map<String, dynamic>.from(tag))
          .toList();

      TLoggerHelper.info('Tags loaded: ${tags.length} items');
      return tags;
    } catch (e) {
      TLoggerHelper.error('Error loading tags: $e');
      rethrow;
    }
  }

  /// Suggest tags based on query
  static Future<List<Map<String, dynamic>>> suggestTags(String query) async {
    try {
      String apiEndpoint = await _getApiEndpoint();
      String endpoint = '$apiEndpoint/journals/tags/suggest';

      Map<String, dynamic> queryParams = {
        'query': query,
        'limit': 10,
      };

      String? token = await AuthService.getToken();
      final response = await THttpHelper.get(endpoint,
        queryParams: queryParams,
        token: token
      );

      List<dynamic> tagsData = response['suggestions'] ?? [];
      List<Map<String, dynamic>> tags = tagsData
          .map((tag) => Map<String, dynamic>.from(tag))
          .toList();

      TLoggerHelper.info('Tag suggestions loaded: ${tags.length} items');
      return tags;
    } catch (e) {
      TLoggerHelper.error('Error loading tag suggestions: $e');
      rethrow;
    }
  }
}
