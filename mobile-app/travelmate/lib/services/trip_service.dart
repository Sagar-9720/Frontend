import '../models/models.dart';
import '../utils/utils.dart';

class TripService {
  static const String _baseUrl = '/trips';
  final HttpClient _httpClient = HttpClient.instance;

  // Get all trips with filters and pagination
  Future<ApiResponse<PaginatedResponse<Trip>>> getTrips({
    SearchFilters? filters,
    SortOptions? sort,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (filters != null) {
        queryParams.addAll(filters.toJson());
      }

      if (sort != null) {
        queryParams.addAll(sort.toJson());
      }

      final response = await _httpClient.getPaginated<Trip>(
        _baseUrl,
        queryParameters: queryParams,
        fromJson: (json) => Trip.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Trips fetched successfully', {
          'page': page,
          'limit': limit,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch trips', e);
      return ApiResponse.error('Failed to fetch trips: ${e.toString()}');
    }
  }

  // Get trip by ID
  Future<ApiResponse<Trip>> getTripById(String tripId) async {
    try {
      final response = await _httpClient.get<Map<String, dynamic>>(
        '$_baseUrl/$tripId',
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final trip = Trip.fromJson(response.data!);
        AppLogger.debug('Trip fetched successfully', {'tripId': tripId});
        return ApiResponse.success(trip);
      } else {
        AppLogger.error('Failed to fetch trip', response.error);
        return ApiResponse.error(response.error ?? 'Failed to fetch trip');
      }
    } catch (e) {
      AppLogger.error('Failed to fetch trip', e);
      return ApiResponse.error('Failed to fetch trip: ${e.toString()}');
    }
  }

  // Search trips
  Future<ApiResponse<PaginatedResponse<Trip>>> searchTrips({
    required String query,
    SearchFilters? filters,
    SortOptions? sort,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      await StorageService.saveRecentSearch(query);

      final queryParams = <String, dynamic>{
        'q': query,
        'page': page,
        'limit': limit,
      };

      if (filters != null) {
        queryParams.addAll(filters.toJson());
      }

      if (sort != null) {
        queryParams.addAll(sort.toJson());
      }

      final response = await _httpClient.getPaginated<Trip>(
        '$_baseUrl/search',
        queryParameters: queryParams,
        fromJson: (json) => Trip.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.userAction('Trip search performed', {
          'query': query,
          'results': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to search trips', e);
      return ApiResponse.error('Failed to search trips: ${e.toString()}');
    }
  }

  // Get featured trips
  Future<ApiResponse<List<Trip>>> getFeaturedTrips({int limit = 5}) async {
    try {
      final response = await _httpClient.get<List<dynamic>>(
        '$_baseUrl/featured',
        queryParameters: {'limit': limit},
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final trips =
            (response.data as List).map((json) => Trip.fromJson(json)).toList();

        AppLogger.debug('Featured trips fetched successfully', {
          'count': trips.length,
        });

        return ApiResponse.success(trips);
      } else {
        AppLogger.error('Failed to fetch featured trips', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to fetch featured trips');
      }
    } catch (e) {
      AppLogger.error('Failed to fetch featured trips', e);
      return ApiResponse.error(
          'Failed to fetch featured trips: ${e.toString()}');
    }
  }

  // Get trips by category
  Future<ApiResponse<PaginatedResponse<Trip>>> getTripsByCategory({
    required String category,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _httpClient.getPaginated<Trip>(
        '$_baseUrl/category/$category',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => Trip.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Category trips fetched successfully', {
          'category': category,
          'page': page,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch category trips', e);
      return ApiResponse.error(
          'Failed to fetch category trips: ${e.toString()}');
    }
  }

  // Get destinations
  Future<ApiResponse<PaginatedResponse<Destination>>> getDestinations({
    String? query,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (query != null && query.isNotEmpty) {
        queryParams['q'] = query;
      }

      final response = await _httpClient.getPaginated<Destination>(
        '/destinations',
        queryParameters: queryParams,
        fromJson: (json) => Destination.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Destinations fetched successfully', {
          'page': page,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch destinations', e);
      return ApiResponse.error('Failed to fetch destinations: ${e.toString()}');
    }
  }

  // Get destination by ID
  Future<ApiResponse<Destination>> getDestinationById(
      String destinationId) async {
    try {
      final response = await _httpClient.get<Map<String, dynamic>>(
        '/destinations/$destinationId',
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final destination = Destination.fromJson(response.data!);
        AppLogger.debug('Destination fetched successfully',
            {'destinationId': destinationId});
        return ApiResponse.success(destination);
      } else {
        AppLogger.error('Failed to fetch destination', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to fetch destination');
      }
    } catch (e) {
      AppLogger.error('Failed to fetch destination', e);
      return ApiResponse.error('Failed to fetch destination: ${e.toString()}');
    }
  }

  // Get trips by destination
  Future<ApiResponse<PaginatedResponse<Trip>>> getTripsByDestination({
    required String destinationId,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _httpClient.getPaginated<Trip>(
        '$_baseUrl/destination/$destinationId',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => Trip.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Destination trips fetched successfully', {
          'destinationId': destinationId,
          'page': page,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch destination trips', e);
      return ApiResponse.error(
          'Failed to fetch destination trips: ${e.toString()}');
    }
  }

  // Get trip reviews
  Future<ApiResponse<PaginatedResponse<Review>>> getTripReviews({
    required String tripId,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _httpClient.getPaginated<Review>(
        '$_baseUrl/$tripId/reviews',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => Review.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Trip reviews fetched successfully', {
          'tripId': tripId,
          'page': page,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch trip reviews', e);
      return ApiResponse.error('Failed to fetch trip reviews: ${e.toString()}');
    }
  }

  // Get trip comments
  Future<ApiResponse<PaginatedResponse<Comment>>> getTripComments({
    required String tripId,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _httpClient.getPaginated<Comment>(
        '$_baseUrl/$tripId/comments',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => Comment.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Trip comments fetched successfully', {
          'tripId': tripId,
          'page': page,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch trip comments', e);
      return ApiResponse.error(
          'Failed to fetch trip comments: ${e.toString()}');
    }
  }

  // Book a trip
  Future<ApiResponse<TripBooking>> bookTrip({
    required String tripId,
    required int numberOfTravelers,
    required Map<String, dynamic> bookingData,
  }) async {
    try {
      final requestData = {
        'tripId': tripId,
        'numberOfTravelers': numberOfTravelers,
        ...bookingData,
      };

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/$tripId/book',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final booking = TripBooking.fromJson(response.data!);
        AppLogger.userAction('Trip booked successfully', {
          'tripId': tripId,
          'bookingId': booking.id,
          'travelers': numberOfTravelers,
        });
        return ApiResponse.success(booking);
      } else {
        AppLogger.error('Failed to book trip', response.error);
        return ApiResponse.error(response.error ?? 'Failed to book trip');
      }
    } catch (e) {
      AppLogger.error('Failed to book trip', e);
      return ApiResponse.error('Failed to book trip: ${e.toString()}');
    }
  }

  // Get popular destinations
  Future<ApiResponse<List<Destination>>> getPopularDestinations(
      {int limit = 10}) async {
    try {
      final response = await _httpClient.get<List<dynamic>>(
        '/destinations/popular',
        queryParameters: {'limit': limit},
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final destinations = (response.data as List)
            .map((json) => Destination.fromJson(json))
            .toList();

        AppLogger.debug('Popular destinations fetched successfully', {
          'count': destinations.length,
        });

        return ApiResponse.success(destinations);
      } else {
        AppLogger.error('Failed to fetch popular destinations', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to fetch popular destinations');
      }
    } catch (e) {
      AppLogger.error('Failed to fetch popular destinations', e);
      return ApiResponse.error(
          'Failed to fetch popular destinations: ${e.toString()}');
    }
  }

  // Get trip categories
  Future<ApiResponse<List<String>>> getTripCategories() async {
    try {
      final response = await _httpClient.get<List<dynamic>>(
        '$_baseUrl/categories',
        fromJson: (data) => data,
        useCache: true,
      );

      if (response.success && response.data != null) {
        final categories = (response.data as List).cast<String>();

        AppLogger.debug('Trip categories fetched successfully', {
          'count': categories.length,
        });

        return ApiResponse.success(categories);
      } else {
        AppLogger.error('Failed to fetch trip categories', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to fetch trip categories');
      }
    } catch (e) {
      AppLogger.error('Failed to fetch trip categories', e);
      return ApiResponse.error(
          'Failed to fetch trip categories: ${e.toString()}');
    }
  }

  // Get recent searches
  Future<List<String>> getRecentSearches() async {
    return await StorageService.getRecentSearches();
  }

  // Clear recent searches
  Future<void> clearRecentSearches() async {
    await StorageService.clearRecentSearches();
    AppLogger.userAction('Recent searches cleared');
  }
}
