import 'package:get/get.dart';
import 'package:travelmate/utils/logging/logger.dart';

class HomeController extends GetxController {
  static HomeController get instance => Get.find();

  // Observable variables
  final RxBool isLoading = false.obs;
  final RxList<Map<String, dynamic>> popularDestinations =
      <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> recentTrips = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> featuredContent =
      <Map<String, dynamic>>[].obs;
  final RxString searchQuery = ''.obs;
  final RxString userName = 'Travel Enthusiast'.obs;

  @override
  void onInit() {
    super.onInit();
    TLoggerHelper.info('HomeController initialized');
    loadData();
  }

  /// Load initial data for home screen
  void loadData() {
    try {
      isLoading(true);

      // Load popular destinations with details
      popularDestinations.assignAll([
        {
          'id': '1',
          'name': 'Paris',
          'country': 'France',
          'image': 'assets/images/destinations/paris.jpg',
          'rating': 4.8,
          'price': 1200,
          'description': 'City of Light and Romance'
        },
        {
          'id': '2',
          'name': 'Tokyo',
          'country': 'Japan',
          'image': 'assets/images/destinations/tokyo.jpg',
          'rating': 4.7,
          'price': 1500,
          'description': 'Modern culture meets tradition'
        },
        {
          'id': '3',
          'name': 'Bali',
          'country': 'Indonesia',
          'image': 'assets/images/destinations/bali.jpg',
          'rating': 4.9,
          'price': 800,
          'description': 'Tropical paradise with rich culture'
        },
        {
          'id': '4',
          'name': 'New York',
          'country': 'USA',
          'image': 'assets/images/destinations/newyork.jpg',
          'rating': 4.6,
          'price': 1800,
          'description': 'The city that never sleeps'
        },
        {
          'id': '5',
          'name': 'London',
          'country': 'UK',
          'image': 'assets/images/destinations/london.jpg',
          'rating': 4.5,
          'price': 1400,
          'description': 'Historic charm with modern attractions'
        }
      ]);

      // Load recent trips (empty for new users)
      recentTrips.assignAll([]);

      // Load featured content
      featuredContent.assignAll([
        {
          'id': '1',
          'type': 'tip',
          'title': 'Best Time to Visit Paris',
          'content':
              'Spring (April-June) offers mild weather and blooming gardens',
          'image': 'assets/images/tips/paris_tip.jpg'
        },
        {
          'id': '2',
          'type': 'deal',
          'title': '30% Off Bali Packages',
          'content': 'Limited time offer on tropical getaway packages',
          'image': 'assets/images/deals/bali_deal.jpg'
        }
      ]);

      TLoggerHelper.info('Home data loaded successfully');
    } catch (e) {
      TLoggerHelper.error('Error loading home data: $e');
    } finally {
      isLoading(false);
    }
  }

  /// Refresh home data
  Future<void> refreshData() async {
    TLoggerHelper.info('Refreshing home data');
    await Future.delayed(const Duration(seconds: 2)); // Simulate API call
    loadData();

    Get.snackbar(
      'Refreshed',
      'Home content updated successfully',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Search destinations and trips
  void searchContent(String query) {
    searchQuery.value = query;
    TLoggerHelper.info('Searching content: $query');

    if (query.isNotEmpty) {
      // Navigate to search results or filter content
      Get.snackbar(
        'Search',
        'Searching for "$query"...',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  /// Get destination details
  void viewDestination(Map<String, dynamic> destination) {
    TLoggerHelper.info('Viewing destination: ${destination['name']}');

    Get.snackbar(
      'Destination Details',
      'More details about ${destination['name']}, ${destination['country']} coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Start planning a new trip
  void startNewTrip() {
    TLoggerHelper.info('Starting new trip planning');

    Get.snackbar(
      'New Trip',
      'Trip planning feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// View recent trip details
  void viewRecentTrip(Map<String, dynamic> trip) {
    TLoggerHelper.info('Viewing recent trip: ${trip['title']}');

    Get.snackbar(
      'Trip Details',
      'Trip details for ${trip['title']} coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Book a destination
  void bookDestination(Map<String, dynamic> destination) {
    TLoggerHelper.info('Booking destination: ${destination['name']}');

    Get.snackbar(
      'Booking',
      'Booking ${destination['name']} for \$${destination['price']}. Feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Add destination to wishlist
  void addToWishlist(Map<String, dynamic> destination) {
    TLoggerHelper.info('Adding to wishlist: ${destination['name']}');

    Get.snackbar(
      'Added to Wishlist',
      '${destination['name']} has been added to your wishlist',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Handle notification tap
  void handleNotificationTap() {
    TLoggerHelper.info('Notification tapped');

    Get.snackbar(
      'Notifications',
      'Notification center coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Get user statistics
  Map<String, dynamic> getUserStats() {
    return {
      'totalDestinations': popularDestinations.length,
      'totalTrips': recentTrips.length,
      'wishlistCount': 0,
      'journalEntries': 0,
    };
  }

  /// Load more destinations
  void loadMoreDestinations() {
    TLoggerHelper.info('Loading more destinations');

    // Simulate loading more destinations
    final moreDestinations = [
      {
        'id': '6',
        'name': 'Dubai',
        'country': 'UAE',
        'image': 'assets/images/destinations/dubai.jpg',
        'rating': 4.4,
        'price': 1100,
        'description': 'Modern luxury in the desert'
      },
      {
        'id': '7',
        'name': 'Rome',
        'country': 'Italy',
        'image': 'assets/images/destinations/rome.jpg',
        'rating': 4.7,
        'price': 1000,
        'description': 'Eternal city of history and culture'
      }
    ];

    popularDestinations.addAll(moreDestinations);

    Get.snackbar(
      'Loaded',
      '${moreDestinations.length} more destinations loaded',
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}
