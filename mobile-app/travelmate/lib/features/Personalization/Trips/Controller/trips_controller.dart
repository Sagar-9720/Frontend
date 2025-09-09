import 'package:get/get.dart';
import 'package:travelmate/utils/logging/logger.dart';

class TripsController extends GetxController {
  static TripsController get instance => Get.find();

  // Observable variables
  final RxBool isLoading = false.obs;
  final RxList<Map<String, dynamic>> trips = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> filteredTrips = <Map<String, dynamic>>[].obs;
  final RxString selectedStatus = 'All'.obs;

  // Trip statuses for filtering
  final List<String> tripStatuses = [
    'All',
    'Planning',
    'Ongoing',
    'Completed'
  ];

  @override
  void onInit() {
    super.onInit();
    TLoggerHelper.info('TripsController initialized');
    loadTrips();
  }

  /// Load trips data
  void loadTrips() {
    try {
      isLoading(true);

      // Mock trips data
      trips.assignAll([
        {
          'id': '1',
          'title': 'Paris Adventure',
          'destination': 'Paris, France',
          'dates': 'Dec 15-22, 2024',
          'status': 'Planning',
          'budget': 2500,
          'description': 'Romantic getaway to the city of love',
        },
        {
          'id': '2',
          'title': 'Tokyo Experience',
          'destination': 'Tokyo, Japan',
          'dates': 'Jan 10-20, 2025',
          'status': 'Planning',
          'budget': 3000,
          'description': 'Cultural immersion in modern Japan',
        },
      ]);

      filteredTrips.assignAll(trips);

      TLoggerHelper.info('Trips loaded successfully');
    } catch (e) {
      TLoggerHelper.error('Error loading trips: $e');
    } finally {
      isLoading(false);
    }
  }

  /// Select status filter
  void selectStatus(String status) {
    selectedStatus.value = status;

    if (status == 'All') {
      filteredTrips.assignAll(trips);
    } else {
      filteredTrips.assignAll(
        trips.where((trip) => trip['status'] == status).toList()
      );
    }

    TLoggerHelper.info('Selected status: $status');
  }

  /// Create new trip
  void createNewTrip() {
    TLoggerHelper.info('Creating new trip');
    // Navigate to trip creation screen
    Get.snackbar(
      'New Trip',
      'Trip creation feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Edit trip
  void editTrip(Map<String, dynamic> trip) {
    TLoggerHelper.info('Editing trip: ${trip['title']}');
    // Navigate to trip edit screen
    Get.snackbar(
      'Edit Trip',
      'Trip editing feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// View trip details
  void viewTripDetails(Map<String, dynamic> trip) {
    TLoggerHelper.info('Viewing trip details: ${trip['title']}');
    // Navigate to trip details screen
    Get.snackbar(
      'Trip Details',
      'Trip details feature coming soon!',
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  /// Delete trip
  void deleteTrip(String tripId) {
    trips.removeWhere((trip) => trip['id'] == tripId);
    filteredTrips.removeWhere((trip) => trip['id'] == tripId);

    TLoggerHelper.info('Trip deleted: $tripId');
    Get.snackbar(
      'Trip Deleted',
      'Trip has been removed successfully',
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}
