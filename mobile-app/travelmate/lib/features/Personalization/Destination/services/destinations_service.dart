import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/utils/helpers/env_file_reader.dart';
import 'package:travelmate/utils/http/http_client.dart';
import 'package:travelmate/utils/logging/logger.dart';

class DestinationsService {

  /// Get API endpoint
  static Future<String> _getApiEndpoint() async {
    final endpoint = await TEnvFileReader.fetchTripServiceEndpoint();
    if (endpoint == null || endpoint.isEmpty) {
      throw Exception('API endpoint is not set in the environment file.');
    }
    return endpoint;
  }

  /// Get all destinations with enhanced filtering and pagination
  static Future<Map<String, dynamic>> getAllDestinations({
    int page = 1,
    int limit = 20,
    String? search,
    String? category,
    String? country,
    String? region,
  }) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations';

    Map<String, dynamic> queryParams = {
      'page': page,
      'limit': limit,
    };

    if (search != null && search.isNotEmpty) {
      queryParams['search'] = search;
    }

    if (category != null && category.isNotEmpty && category != 'All') {
      queryParams['category'] = category;
    }

    if (country != null && country.isNotEmpty && country != 'All') {
      queryParams['country'] = country;
    }

    if (region != null && region.isNotEmpty && region != 'All') {
      queryParams['region'] = region;
    }

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Destinations loaded: ${destinations.length} items');
    return {
      'destinations': destinations,
      'totalPages': response['totalPages'] ?? 1,
      'currentPage': response['currentPage'] ?? page,
      'totalItems': response['totalItems'] ?? destinations.length,
    };
  }

  /// Get destination by ID
  static Future<Map<String, dynamic>?> getDestinationById(String id) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/$id';

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint, token: token);

    TLoggerHelper.info('Destination details loaded for ID: $id');
    return response['destination'];
  }

  /// Get popular destinations
  static Future<List<Map<String, dynamic>>> getPopularDestinations({int limit = 10}) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/popular';

    Map<String, dynamic> queryParams = {'limit': limit};

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Popular destinations loaded: ${destinations.length} items');
    return destinations;
  }

  /// Search destinations
  static Future<List<Map<String, dynamic>>> searchDestinations({
    required String query,
    String? category,
    double? minRating,
    double? maxPrice,
    int page = 1,
    int limit = 20,
  }) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/search';

    Map<String, dynamic> queryParams = {
      'query': query,
      'page': page,
      'limit': limit,
    };

    if (category != null && category.isNotEmpty && category != 'All') {
      queryParams['category'] = category;
    }

    if (minRating != null) {
      queryParams['min_rating'] = minRating;
    }

    if (maxPrice != null) {
      queryParams['max_price'] = maxPrice;
    }

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Search results for "$query": ${destinations.length} items');
    return destinations;
  }

  /// Get destinations by category
  static Future<List<Map<String, dynamic>>> getDestinationsByCategory({
    required String category,
    int page = 1,
    int limit = 20,
  }) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/category/$category';

    Map<String, dynamic> queryParams = {
      'page': page,
      'limit': limit,
    };

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Destinations for category "$category": ${destinations.length} items');
    return destinations;
  }

  /// Add destination to favorites
  static Future<bool> addToFavorites(String destinationId) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/$destinationId/favorite';

    String? token = await AuthService.getToken();
    if (token == null) {
      throw Exception('User not authenticated');
    }

    final response = await THttpHelper.post(endpoint, {}, token: token);

    TLoggerHelper.info('Destination added to favorites: $destinationId');
    return response['success'] ?? false;
  }

  /// Remove destination from favorites
  static Future<bool> removeFromFavorites(String destinationId) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/$destinationId/favorite';

    String? token = await AuthService.getToken();
    if (token == null) {
      throw Exception('User not authenticated');
    }

    final response = await THttpHelper.delete(endpoint, token: token);

    TLoggerHelper.info('Destination removed from favorites: $destinationId');
    return response['success'] ?? false;
  }

  /// Get user's favorite destinations
  static Future<List<Map<String, dynamic>>> getFavoriteDestinations() async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/favorites';

    String? token = await AuthService.getToken();
    if (token == null) {
      throw Exception('User not authenticated');
    }

    final response = await THttpHelper.get(endpoint, token: token);

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Favorite destinations loaded: ${destinations.length} items');
    return destinations;
  }

  /// Rate a destination
  static Future<bool> rateDestination({
    required String destinationId,
    required double rating,
    String? review,
  }) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/$destinationId/rate';

    Map<String, dynamic> data = {'rating': rating};
    if (review != null && review.isNotEmpty) {
      data['review'] = review;
    }

    String? token = await AuthService.getToken();
    if (token == null) {
      throw Exception('User not authenticated');
    }

    final response = await THttpHelper.post(endpoint, data, token: token);

    TLoggerHelper.info('Destination rated: $destinationId, Rating: $rating');
    return response['success'] ?? false;
  }

  /// Get destination reviews
  static Future<List<Map<String, dynamic>>> getDestinationReviews(String destinationId) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/$destinationId/reviews';

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint, token: token);

    List<dynamic> reviewsData = response['reviews'] ?? [];
    List<Map<String, dynamic>> reviews = reviewsData
        .map((review) => Map<String, dynamic>.from(review))
        .toList();

    TLoggerHelper.info('Reviews loaded for destination: $destinationId');
    return reviews;
  }

  /// Get destination categories
  static Future<List<String>> getCategories() async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/categories';

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint, token: token);

    List<dynamic> categoriesData = response['categories'] ?? [];
    List<String> categories = categoriesData.map((cat) => cat.toString()).toList();

    TLoggerHelper.info('Categories loaded: ${categories.length} items');
    return categories;
  }

  /// Get destinations by region
  static Future<List<Map<String, dynamic>>> getDestinationsByRegion({
    required String region,
    int page = 1,
    int limit = 20,
  }) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/region/$region';

    Map<String, dynamic> queryParams = {
      'page': page,
      'limit': limit,
    };

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Destinations for region "$region": ${destinations.length} items');
    return destinations;
  }

  /// Get regions by country
  static Future<List<Map<String, dynamic>>> getRegionsByCountry(String country) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/regions/country/$country';

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint, token: token);

    List<dynamic> regionsData = response['regions'] ?? [];
    List<Map<String, dynamic>> regions = regionsData
        .map((region) => Map<String, dynamic>.from(region))
        .toList();

    TLoggerHelper.info('Regions for country "$country": ${regions.length} items');
    return regions;
  }

  /// Search destinations by name with suggestions
  static Future<List<Map<String, dynamic>>> searchDestinationsByName({
    required String query,
    int page = 1,
    int limit = 20,
  }) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/search';

    Map<String, dynamic> queryParams = {
      'query': query,
      'page': page,
      'limit': limit,
    };

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> destinationsData = response['destinations'] ?? [];
    List<Map<String, dynamic>> destinations = destinationsData
        .map((destination) => Map<String, dynamic>.from(destination))
        .toList();

    TLoggerHelper.info('Search results for "$query": ${destinations.length} items');
    return destinations;
  }

  /// Get destination suggestions for autocomplete
  static Future<List<Map<String, dynamic>>> suggestDestinations(String query) async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/destinations/suggest';

    Map<String, dynamic> queryParams = {
      'query': query,
      'limit': 10, // Limit suggestions to 10 items
    };

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint,
      queryParams: queryParams,
      token: token
    );

    List<dynamic> suggestionsData = response['suggestions'] ?? [];
    List<Map<String, dynamic>> suggestions = suggestionsData
        .map((suggestion) => Map<String, dynamic>.from(suggestion))
        .toList();

    TLoggerHelper.info('Suggestions for "$query": ${suggestions.length} items');
    return suggestions;
  }

  /// Get all countries
  static Future<List<Map<String, dynamic>>> getAllCountries() async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/countries';

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint, token: token);

    List<dynamic> countriesData = response['countries'] ?? [];
    List<Map<String, dynamic>> countries = countriesData
        .map((country) => Map<String, dynamic>.from(country))
        .toList();

    TLoggerHelper.info('Countries loaded: ${countries.length} items');
    return countries;
  }

  /// Get all regions
  static Future<List<Map<String, dynamic>>> getAllRegions() async {
    String apiEndpoint = await _getApiEndpoint();
    String endpoint = '$apiEndpoint/regions';

    String? token = await AuthService.getToken();
    final response = await THttpHelper.get(endpoint, token: token);

    List<dynamic> regionsData = response['regions'] ?? [];
    List<Map<String, dynamic>> regions = regionsData
        .map((region) => Map<String, dynamic>.from(region))
        .toList();

    TLoggerHelper.info('Regions loaded: ${regions.length} items');
    return regions;
  }
}
