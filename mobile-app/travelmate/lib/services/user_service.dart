import '../models/models.dart';
import '../utils/utils.dart';

class UserService {
  static const String _baseUrl = '/user';
  final HttpClient _httpClient = HttpClient.instance;

  // Get user bookings
  Future<ApiResponse<PaginatedResponse<TripBooking>>> getUserBookings({
    String? status,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (status != null) {
        queryParams['status'] = status;
      }

      final response = await _httpClient.getPaginated<TripBooking>(
        '$_baseUrl/bookings',
        queryParameters: queryParams,
        fromJson: (json) => TripBooking.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('User bookings fetched successfully', {
          'page': page,
          'status': status,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch user bookings', e);
      return ApiResponse.error('Failed to fetch bookings: ${e.toString()}');
    }
  }

  // Get booking by ID
  Future<ApiResponse<TripBooking>> getBookingById(String bookingId) async {
    try {
      final response = await _httpClient.get<Map<String, dynamic>>(
        '$_baseUrl/bookings/$bookingId',
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final booking = TripBooking.fromJson(response.data!);
        AppLogger.debug(
            'Booking fetched successfully', {'bookingId': bookingId});
        return ApiResponse.success(booking);
      } else {
        AppLogger.error('Failed to fetch booking', response.error);
        return ApiResponse.error(response.error ?? 'Failed to fetch booking');
      }
    } catch (e) {
      AppLogger.error('Failed to fetch booking', e);
      return ApiResponse.error('Failed to fetch booking: ${e.toString()}');
    }
  }

  // Cancel booking
  Future<ApiResponse<bool>> cancelBooking(String bookingId,
      {String? reason}) async {
    try {
      final requestData = <String, dynamic>{};
      if (reason != null) {
        requestData['reason'] = reason;
      }

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/bookings/$bookingId/cancel',
        data: requestData,
      );

      if (response.success) {
        AppLogger.userAction('Booking cancelled', {
          'bookingId': bookingId,
          'reason': reason,
        });
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to cancel booking', response.error);
        return ApiResponse.error(response.error ?? 'Failed to cancel booking');
      }
    } catch (e) {
      AppLogger.error('Failed to cancel booking', e);
      return ApiResponse.error('Failed to cancel booking: ${e.toString()}');
    }
  }

  // Get saved trips
  Future<ApiResponse<PaginatedResponse<SavedTrip>>> getSavedTrips({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _httpClient.getPaginated<SavedTrip>(
        '$_baseUrl/saved-trips',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => SavedTrip.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Saved trips fetched successfully', {
          'page': page,
          'total': response.data?.totalItems,
        });

        // Cache saved trips locally
        if (response.data?.data != null) {
          await StorageService.saveSavedTrips(response.data!.data);
        }
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch saved trips', e);
      return ApiResponse.error('Failed to fetch saved trips: ${e.toString()}');
    }
  }

  // Save a trip
  Future<ApiResponse<SavedTrip>> saveTrip(String tripId,
      {String? notes}) async {
    try {
      final requestData = {
        'tripId': tripId,
        'notes': notes,
      };

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/saved-trips',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final savedTrip = SavedTrip.fromJson(response.data!);

        AppLogger.userAction('Trip saved', {
          'tripId': tripId,
          'savedTripId': savedTrip.id,
        });

        return ApiResponse.success(savedTrip);
      } else {
        AppLogger.error('Failed to save trip', response.error);
        return ApiResponse.error(response.error ?? 'Failed to save trip');
      }
    } catch (e) {
      AppLogger.error('Failed to save trip', e);
      return ApiResponse.error('Failed to save trip: ${e.toString()}');
    }
  }

  // Unsave a trip
  Future<ApiResponse<bool>> unsaveTrip(String tripId) async {
    try {
      final response = await _httpClient.delete<Map<String, dynamic>>(
        '$_baseUrl/saved-trips/$tripId',
      );

      if (response.success) {
        AppLogger.userAction('Trip unsaved', {'tripId': tripId});
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to unsave trip', response.error);
        return ApiResponse.error(response.error ?? 'Failed to unsave trip');
      }
    } catch (e) {
      AppLogger.error('Failed to unsave trip', e);
      return ApiResponse.error('Failed to unsave trip: ${e.toString()}');
    }
  }

  // Get user reviews
  Future<ApiResponse<PaginatedResponse<Review>>> getUserReviews({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _httpClient.getPaginated<Review>(
        '$_baseUrl/reviews',
        queryParameters: {'page': page, 'limit': limit},
        fromJson: (json) => Review.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('User reviews fetched successfully', {
          'page': page,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch user reviews', e);
      return ApiResponse.error('Failed to fetch reviews: ${e.toString()}');
    }
  }

  // Add a review
  Future<ApiResponse<Review>> addReview({
    required String tripId,
    required double rating,
    String? title,
    String? comment,
    List<String>? images,
  }) async {
    try {
      final requestData = {
        'tripId': tripId,
        'rating': rating,
        'title': title,
        'comment': comment,
        'images': images ?? [],
      };

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/reviews',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final review = Review.fromJson(response.data!);

        AppLogger.userAction('Review added', {
          'tripId': tripId,
          'reviewId': review.id,
          'rating': rating,
        });

        return ApiResponse.success(review);
      } else {
        AppLogger.error('Failed to add review', response.error);
        return ApiResponse.error(response.error ?? 'Failed to add review');
      }
    } catch (e) {
      AppLogger.error('Failed to add review', e);
      return ApiResponse.error('Failed to add review: ${e.toString()}');
    }
  }

  // Update a review
  Future<ApiResponse<Review>> updateReview({
    required String reviewId,
    double? rating,
    String? title,
    String? comment,
    List<String>? images,
  }) async {
    try {
      final requestData = <String, dynamic>{};
      if (rating != null) requestData['rating'] = rating;
      if (title != null) requestData['title'] = title;
      if (comment != null) requestData['comment'] = comment;
      if (images != null) requestData['images'] = images;

      final response = await _httpClient.put<Map<String, dynamic>>(
        '$_baseUrl/reviews/$reviewId',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final review = Review.fromJson(response.data!);

        AppLogger.userAction('Review updated', {
          'reviewId': reviewId,
          'rating': rating,
        });

        return ApiResponse.success(review);
      } else {
        AppLogger.error('Failed to update review', response.error);
        return ApiResponse.error(response.error ?? 'Failed to update review');
      }
    } catch (e) {
      AppLogger.error('Failed to update review', e);
      return ApiResponse.error('Failed to update review: ${e.toString()}');
    }
  }

  // Delete a review
  Future<ApiResponse<bool>> deleteReview(String reviewId) async {
    try {
      final response = await _httpClient.delete<Map<String, dynamic>>(
        '$_baseUrl/reviews/$reviewId',
      );

      if (response.success) {
        AppLogger.userAction('Review deleted', {'reviewId': reviewId});
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to delete review', response.error);
        return ApiResponse.error(response.error ?? 'Failed to delete review');
      }
    } catch (e) {
      AppLogger.error('Failed to delete review', e);
      return ApiResponse.error('Failed to delete review: ${e.toString()}');
    }
  }

  // Get user trip requests
  Future<ApiResponse<PaginatedResponse<TripRequest>>> getTripRequests({
    String? status,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (status != null) {
        queryParams['status'] = status;
      }

      final response = await _httpClient.getPaginated<TripRequest>(
        '$_baseUrl/trip-requests',
        queryParameters: queryParams,
        fromJson: (json) => TripRequest.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('Trip requests fetched successfully', {
          'page': page,
          'status': status,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch trip requests', e);
      return ApiResponse.error(
          'Failed to fetch trip requests: ${e.toString()}');
    }
  }

  // Create a trip request
  Future<ApiResponse<TripRequest>> createTripRequest({
    required String destination,
    required DateTime preferredStartDate,
    required DateTime preferredEndDate,
    required int numberOfTravelers,
    double? budget,
    String? budgetCurrency,
    String? description,
    List<String>? preferences,
  }) async {
    try {
      final requestData = {
        'destination': destination,
        'preferredStartDate': preferredStartDate.toIso8601String(),
        'preferredEndDate': preferredEndDate.toIso8601String(),
        'numberOfTravelers': numberOfTravelers,
        'budget': budget,
        'budgetCurrency': budgetCurrency,
        'description': description,
        'preferences': preferences ?? [],
      };

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/trip-requests',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final tripRequest = TripRequest.fromJson(response.data!);

        AppLogger.userAction('Trip request created', {
          'requestId': tripRequest.id,
          'destination': destination,
          'travelers': numberOfTravelers,
        });

        return ApiResponse.success(tripRequest);
      } else {
        AppLogger.error('Failed to create trip request', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to create trip request');
      }
    } catch (e) {
      AppLogger.error('Failed to create trip request', e);
      return ApiResponse.error(
          'Failed to create trip request: ${e.toString()}');
    }
  }

  // Update trip request
  Future<ApiResponse<TripRequest>> updateTripRequest({
    required String requestId,
    String? destination,
    DateTime? preferredStartDate,
    DateTime? preferredEndDate,
    int? numberOfTravelers,
    double? budget,
    String? budgetCurrency,
    String? description,
    List<String>? preferences,
    String? status,
  }) async {
    try {
      final requestData = <String, dynamic>{};

      if (destination != null) requestData['destination'] = destination;
      if (preferredStartDate != null)
        requestData['preferredStartDate'] =
            preferredStartDate.toIso8601String();
      if (preferredEndDate != null)
        requestData['preferredEndDate'] = preferredEndDate.toIso8601String();
      if (numberOfTravelers != null)
        requestData['numberOfTravelers'] = numberOfTravelers;
      if (budget != null) requestData['budget'] = budget;
      if (budgetCurrency != null)
        requestData['budgetCurrency'] = budgetCurrency;
      if (description != null) requestData['description'] = description;
      if (preferences != null) requestData['preferences'] = preferences;
      if (status != null) requestData['status'] = status;

      final response = await _httpClient.put<Map<String, dynamic>>(
        '$_baseUrl/trip-requests/$requestId',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final tripRequest = TripRequest.fromJson(response.data!);

        AppLogger.userAction('Trip request updated', {
          'requestId': requestId,
        });

        return ApiResponse.success(tripRequest);
      } else {
        AppLogger.error('Failed to update trip request', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to update trip request');
      }
    } catch (e) {
      AppLogger.error('Failed to update trip request', e);
      return ApiResponse.error(
          'Failed to update trip request: ${e.toString()}');
    }
  }

  // Delete trip request
  Future<ApiResponse<bool>> deleteTripRequest(String requestId) async {
    try {
      final response = await _httpClient.delete<Map<String, dynamic>>(
        '$_baseUrl/trip-requests/$requestId',
      );

      if (response.success) {
        AppLogger.userAction('Trip request deleted', {'requestId': requestId});
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to delete trip request', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to delete trip request');
      }
    } catch (e) {
      AppLogger.error('Failed to delete trip request', e);
      return ApiResponse.error(
          'Failed to delete trip request: ${e.toString()}');
    }
  }

  // Get user likes
  Future<ApiResponse<PaginatedResponse<Like>>> getUserLikes({
    String? entityType,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (entityType != null) {
        queryParams['entityType'] = entityType;
      }

      final response = await _httpClient.getPaginated<Like>(
        '$_baseUrl/likes',
        queryParameters: queryParams,
        fromJson: (json) => Like.fromJson(json),
        page: page,
        limit: limit,
      );

      if (response.success) {
        AppLogger.debug('User likes fetched successfully', {
          'page': page,
          'entityType': entityType,
          'total': response.data?.totalItems,
        });
      }

      return response;
    } catch (e) {
      AppLogger.error('Failed to fetch user likes', e);
      return ApiResponse.error('Failed to fetch likes: ${e.toString()}');
    }
  }

  // Like an entity
  Future<ApiResponse<Like>> likeEntity({
    required String entityType,
    required String entityId,
  }) async {
    try {
      final requestData = {
        'entityType': entityType,
        'entityId': entityId,
      };

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/likes',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final like = Like.fromJson(response.data!);

        AppLogger.userAction('Entity liked', {
          'entityType': entityType,
          'entityId': entityId,
          'likeId': like.id,
        });

        return ApiResponse.success(like);
      } else {
        AppLogger.error('Failed to like entity', response.error);
        return ApiResponse.error(response.error ?? 'Failed to like entity');
      }
    } catch (e) {
      AppLogger.error('Failed to like entity', e);
      return ApiResponse.error('Failed to like entity: ${e.toString()}');
    }
  }

  // Unlike an entity
  Future<ApiResponse<bool>> unlikeEntity({
    required String entityType,
    required String entityId,
  }) async {
    try {
      final response = await _httpClient.delete<Map<String, dynamic>>(
        '$_baseUrl/likes',
        data: {
          'entityType': entityType,
          'entityId': entityId,
        },
      );

      if (response.success) {
        AppLogger.userAction('Entity unliked', {
          'entityType': entityType,
          'entityId': entityId,
        });
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to unlike entity', response.error);
        return ApiResponse.error(response.error ?? 'Failed to unlike entity');
      }
    } catch (e) {
      AppLogger.error('Failed to unlike entity', e);
      return ApiResponse.error('Failed to unlike entity: ${e.toString()}');
    }
  }

  // Add comment
  Future<ApiResponse<Comment>> addComment({
    required String entityType,
    required String entityId,
    required String content,
    String? parentId,
  }) async {
    try {
      final requestData = {
        'entityType': entityType,
        'entityId': entityId,
        'content': content,
        'parentId': parentId,
      };

      final response = await _httpClient.post<Map<String, dynamic>>(
        '$_baseUrl/comments',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final comment = Comment.fromJson(response.data!);

        AppLogger.userAction('Comment added', {
          'entityType': entityType,
          'entityId': entityId,
          'commentId': comment.id,
          'isReply': parentId != null,
        });

        return ApiResponse.success(comment);
      } else {
        AppLogger.error('Failed to add comment', response.error);
        return ApiResponse.error(response.error ?? 'Failed to add comment');
      }
    } catch (e) {
      AppLogger.error('Failed to add comment', e);
      return ApiResponse.error('Failed to add comment: ${e.toString()}');
    }
  }

  // Update comment
  Future<ApiResponse<Comment>> updateComment({
    required String commentId,
    required String content,
  }) async {
    try {
      final requestData = {
        'content': content,
      };

      final response = await _httpClient.put<Map<String, dynamic>>(
        '$_baseUrl/comments/$commentId',
        data: requestData,
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final comment = Comment.fromJson(response.data!);

        AppLogger.userAction('Comment updated', {
          'commentId': commentId,
        });

        return ApiResponse.success(comment);
      } else {
        AppLogger.error('Failed to update comment', response.error);
        return ApiResponse.error(response.error ?? 'Failed to update comment');
      }
    } catch (e) {
      AppLogger.error('Failed to update comment', e);
      return ApiResponse.error('Failed to update comment: ${e.toString()}');
    }
  }

  // Delete comment
  Future<ApiResponse<bool>> deleteComment(String commentId) async {
    try {
      final response = await _httpClient.delete<Map<String, dynamic>>(
        '$_baseUrl/comments/$commentId',
      );

      if (response.success) {
        AppLogger.userAction('Comment deleted', {'commentId': commentId});
        return ApiResponse.success(true);
      } else {
        AppLogger.error('Failed to delete comment', response.error);
        return ApiResponse.error(response.error ?? 'Failed to delete comment');
      }
    } catch (e) {
      AppLogger.error('Failed to delete comment', e);
      return ApiResponse.error('Failed to delete comment: ${e.toString()}');
    }
  }

  // Upload profile image
  Future<ApiResponse<String>> uploadProfileImage(String imagePath) async {
    try {
      final response = await _httpClient.upload<Map<String, dynamic>>(
        '$_baseUrl/profile/image',
        File(imagePath),
        fieldName: 'avatar',
        fromJson: (data) => data,
      );

      if (response.success && response.data != null) {
        final imageUrl = response.data!['imageUrl'] as String;

        AppLogger.userAction('Profile image uploaded', {
          'imageUrl': imageUrl,
        });

        return ApiResponse.success(imageUrl);
      } else {
        AppLogger.error('Failed to upload profile image', response.error);
        return ApiResponse.error(
            response.error ?? 'Failed to upload profile image');
      }
    } catch (e) {
      AppLogger.error('Failed to upload profile image', e);
      return ApiResponse.error(
          'Failed to upload profile image: ${e.toString()}');
    }
  }

  // Get cached saved trips
  Future<List<SavedTrip>> getCachedSavedTrips() async {
    return await StorageService.getSavedTrips();
  }
}
