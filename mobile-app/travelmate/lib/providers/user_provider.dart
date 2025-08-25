import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/trip.dart';
import '../models/interaction.dart';
import '../services/user_service.dart';
import '../services/auth_service.dart';
import '../utils/logger.dart';

class UserProvider with ChangeNotifier {
  final UserService _userService = UserService();
  final AuthService _authService = AuthService();

  // User state
  User? _user;
  bool _isLoading = false;
  String? _error;

  // User bookings state
  List<TripBooking> _userBookings = [];
  bool _isLoadingBookings = false;
  String? _bookingsError;
  int _bookingsCurrentPage = 1;
  bool _bookingsHasMore = true;
  final int _pageSize = 10;

  // User saved trips state
  List<SavedTrip> _savedTrips = [];
  bool _isLoadingSavedTrips = false;
  String? _savedTripsError;
  int _savedTripsCurrentPage = 1;
  bool _savedTripsHasMore = true;

  // User reviews state
  List<Review> _userReviews = [];
  bool _isLoadingReviews = false;
  String? _reviewsError;
  int _reviewsCurrentPage = 1;
  bool _reviewsHasMore = true;

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<TripBooking> get userBookings => _userBookings;
  bool get isLoadingBookings => _isLoadingBookings;
  String? get bookingsError => _bookingsError;
  bool get hasMoreBookings => _bookingsHasMore;

  List<SavedTrip> get savedTrips => _savedTrips;
  bool get isLoadingSavedTrips => _isLoadingSavedTrips;
  String? get savedTripsError => _savedTripsError;
  bool get hasMoreSavedTrips => _savedTripsHasMore;

  List<Review> get userReviews => _userReviews;
  bool get isLoadingReviews => _isLoadingReviews;
  String? get reviewsError => _reviewsError;
  bool get hasMoreReviews => _reviewsHasMore;

  // User profile methods
  Future<void> loadUserProfile() async {
    _setLoading(true);
    _setError(null);

    try {
      // Get current user from auth service
      final response = await _authService.getCurrentUser();
      if (response.success && response.data != null) {
        _user = response.data;
        AppLogger.info('User profile loaded successfully');
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError(e.toString());
      AppLogger.error('Failed to load user profile: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> uploadProfileImage(String imagePath) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _userService.uploadProfileImage(imagePath);
      if (response.success && response.data != null) {
        final imageUrl = response.data!;
        if (_user != null) {
          _user = _user!.copyWith(avatar: imageUrl);
        }
        AppLogger.info('Profile image uploaded successfully');
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      AppLogger.error('Failed to upload profile image: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // User bookings methods
  Future<void> loadUserBookings({bool refresh = false, String? status}) async {
    if (refresh) {
      _bookingsCurrentPage = 1;
      _bookingsHasMore = true;
      _userBookings.clear();
    }

    if (_isLoadingBookings || !_bookingsHasMore) return;

    _setBookingsLoading(true);
    _setBookingsError(null);

    try {
      final response = await _userService.getUserBookings(
        status: status,
        page: _bookingsCurrentPage,
        limit: _pageSize,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;

        if (refresh) {
          _userBookings = paginatedData.data;
        } else {
          _userBookings.addAll(paginatedData.data);
        }

        _bookingsCurrentPage = paginatedData.currentPage + 1;
        _bookingsHasMore = paginatedData.hasNextPage;

        AppLogger.debug('User bookings loaded', {
          'count': paginatedData.data.length,
          'total': paginatedData.totalItems,
          'hasMore': _bookingsHasMore,
        });
      } else {
        _setBookingsError(response.message);
      }
    } catch (e) {
      _setBookingsError(e.toString());
      AppLogger.error('Failed to load user bookings: $e');
    } finally {
      _setBookingsLoading(false);
    }
  }

  Future<bool> cancelBooking(String bookingId, {String? reason}) async {
    _setBookingsLoading(true);
    _setBookingsError(null);

    try {
      final response =
          await _userService.cancelBooking(bookingId, reason: reason);

      if (response.success) {
        // Update the booking status in the local list by replacing the item
        final index =
            _userBookings.indexWhere((booking) => booking.id == bookingId);
        if (index != -1) {
          final currentBooking = _userBookings[index];
          _userBookings[index] = TripBooking(
            id: currentBooking.id,
            tripId: currentBooking.tripId,
            userId: currentBooking.userId,
            numberOfTravelers: currentBooking.numberOfTravelers,
            totalPrice: currentBooking.totalPrice,
            currency: currentBooking.currency,
            status: 'CANCELLED',
            bookingDate: currentBooking.bookingDate,
            startDate: currentBooking.startDate,
            endDate: currentBooking.endDate,
            additionalInfo: currentBooking.additionalInfo,
            cancellationReason: reason,
            cancellationDate: DateTime.now(),
            createdAt: currentBooking.createdAt,
            updatedAt: DateTime.now(),
          );
          notifyListeners();
        }
        AppLogger.info(
            'Booking cancelled successfully', {'bookingId': bookingId});
        return true;
      } else {
        _setBookingsError(response.message);
        return false;
      }
    } catch (e) {
      _setBookingsError(e.toString());
      AppLogger.error('Failed to cancel booking: $e');
      return false;
    } finally {
      _setBookingsLoading(false);
    }
  }

  // Saved trips methods
  Future<void> loadSavedTrips({bool refresh = false}) async {
    if (refresh) {
      _savedTripsCurrentPage = 1;
      _savedTripsHasMore = true;
      _savedTrips.clear();
    }

    if (_isLoadingSavedTrips || !_savedTripsHasMore) return;

    _setSavedTripsLoading(true);
    _setSavedTripsError(null);

    try {
      final response = await _userService.getSavedTrips(
        page: _savedTripsCurrentPage,
        limit: _pageSize,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;

        if (refresh) {
          _savedTrips = paginatedData.data;
        } else {
          _savedTrips.addAll(paginatedData.data);
        }

        _savedTripsCurrentPage = paginatedData.currentPage + 1;
        _savedTripsHasMore = paginatedData.hasNextPage;

        AppLogger.debug('Saved trips loaded', {
          'count': paginatedData.data.length,
          'total': paginatedData.totalItems,
          'hasMore': _savedTripsHasMore,
        });
      } else {
        _setSavedTripsError(response.message);
      }
    } catch (e) {
      _setSavedTripsError(e.toString());
      AppLogger.error('Failed to load saved trips: $e');
    } finally {
      _setSavedTripsLoading(false);
    }
  }

  Future<bool> saveTrip(String tripId, {String? notes}) async {
    try {
      final response = await _userService.saveTrip(tripId, notes: notes);

      if (response.success && response.data != null) {
        _savedTrips.insert(0, response.data!);
        notifyListeners();
        AppLogger.info('Trip saved successfully', {'tripId': tripId});
        return true;
      } else {
        AppLogger.error('Failed to save trip: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to save trip: $e');
      return false;
    }
  }

  Future<bool> unsaveTrip(String tripId) async {
    try {
      final response = await _userService.unsaveTrip(tripId);

      if (response.success) {
        _savedTrips.removeWhere((saved) => saved.tripId == tripId);
        notifyListeners();
        AppLogger.info('Trip unsaved successfully', {'tripId': tripId});
        return true;
      } else {
        AppLogger.error('Failed to unsave trip: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to unsave trip: $e');
      return false;
    }
  }

  // Reviews methods
  Future<void> loadUserReviews({bool refresh = false}) async {
    if (refresh) {
      _reviewsCurrentPage = 1;
      _reviewsHasMore = true;
      _userReviews.clear();
    }

    if (_isLoadingReviews || !_reviewsHasMore) return;

    _setReviewsLoading(true);
    _setReviewsError(null);

    try {
      final response = await _userService.getUserReviews(
        page: _reviewsCurrentPage,
        limit: _pageSize,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;

        if (refresh) {
          _userReviews = paginatedData.data;
        } else {
          _userReviews.addAll(paginatedData.data);
        }

        _reviewsCurrentPage = paginatedData.currentPage + 1;
        _reviewsHasMore = paginatedData.hasNextPage;

        AppLogger.debug('User reviews loaded', {
          'count': paginatedData.data.length,
          'total': paginatedData.totalItems,
          'hasMore': _reviewsHasMore,
        });
      } else {
        _setReviewsError(response.message);
      }
    } catch (e) {
      _setReviewsError(e.toString());
      AppLogger.error('Failed to load user reviews: $e');
    } finally {
      _setReviewsLoading(false);
    }
  }

  Future<bool> addReview({
    required String tripId,
    required double rating,
    String? title,
    String? comment,
    List<String>? images,
  }) async {
    try {
      final response = await _userService.addReview(
        tripId: tripId,
        rating: rating,
        title: title,
        comment: comment,
        images: images,
      );

      if (response.success && response.data != null) {
        _userReviews.insert(0, response.data!);
        notifyListeners();
        AppLogger.info('Review added successfully', {'tripId': tripId});
        return true;
      } else {
        AppLogger.error('Failed to add review: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to add review: $e');
      return false;
    }
  }

  Future<bool> updateReview({
    required String reviewId,
    double? rating,
    String? title,
    String? comment,
    List<String>? images,
  }) async {
    try {
      final response = await _userService.updateReview(
        reviewId: reviewId,
        rating: rating,
        title: title,
        comment: comment,
        images: images,
      );

      if (response.success && response.data != null) {
        final index =
            _userReviews.indexWhere((review) => review.id == reviewId);
        if (index != -1) {
          _userReviews[index] = response.data!;
          notifyListeners();
        }
        AppLogger.info('Review updated successfully', {'reviewId': reviewId});
        return true;
      } else {
        AppLogger.error('Failed to update review: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to update review: $e');
      return false;
    }
  }

  Future<bool> deleteReview(String reviewId) async {
    try {
      final response = await _userService.deleteReview(reviewId);

      if (response.success) {
        _userReviews.removeWhere((review) => review.id == reviewId);
        notifyListeners();
        AppLogger.info('Review deleted successfully', {'reviewId': reviewId});
        return true;
      } else {
        AppLogger.error('Failed to delete review: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to delete review: $e');
      return false;
    }
  }

  // Like/Unlike methods
  Future<bool> likeEntity({
    required String entityType,
    required String entityId,
  }) async {
    try {
      final response = await _userService.likeEntity(
        entityType: entityType,
        entityId: entityId,
      );

      if (response.success) {
        AppLogger.info('Entity liked successfully', {'entityId': entityId});
        return true;
      } else {
        AppLogger.error('Failed to like entity: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to like entity: $e');
      return false;
    }
  }

  Future<bool> unlikeEntity({
    required String entityType,
    required String entityId,
  }) async {
    try {
      final response = await _userService.unlikeEntity(
        entityType: entityType,
        entityId: entityId,
      );

      if (response.success) {
        AppLogger.info('Entity unliked successfully', {'entityId': entityId});
        return true;
      } else {
        AppLogger.error('Failed to unlike entity: ${response.message}');
        return false;
      }
    } catch (e) {
      AppLogger.error('Failed to unlike entity: $e');
      return false;
    }
  }

  // Utility methods
  void clearUserData() {
    _user = null;
    _userBookings.clear();
    _savedTrips.clear();
    _userReviews.clear();
    _bookingsCurrentPage = 1;
    _bookingsHasMore = true;
    _savedTripsCurrentPage = 1;
    _savedTripsHasMore = true;
    _reviewsCurrentPage = 1;
    _reviewsHasMore = true;
    _clearErrors();
    notifyListeners();
    AppLogger.info('User data cleared');
  }

  void refreshAll() {
    loadUserProfile();
    loadUserBookings(refresh: true);
    loadSavedTrips(refresh: true);
    loadUserReviews(refresh: true);
  }

  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void _setBookingsLoading(bool loading) {
    _isLoadingBookings = loading;
    notifyListeners();
  }

  void _setBookingsError(String? error) {
    _bookingsError = error;
    notifyListeners();
  }

  void _setSavedTripsLoading(bool loading) {
    _isLoadingSavedTrips = loading;
    notifyListeners();
  }

  void _setSavedTripsError(String? error) {
    _savedTripsError = error;
    notifyListeners();
  }

  void _setReviewsLoading(bool loading) {
    _isLoadingReviews = loading;
    notifyListeners();
  }

  void _setReviewsError(String? error) {
    _reviewsError = error;
    notifyListeners();
  }

  void _clearErrors() {
    _error = null;
    _bookingsError = null;
    _savedTripsError = null;
    _reviewsError = null;
  }
}
