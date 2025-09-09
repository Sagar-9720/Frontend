import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:travelmate/features/Personalization/Destination/services/destinations_service.dart';
import 'package:travelmate/utils/logging/logger.dart';

class DestinationsController extends GetxController {
  static DestinationsController get instance => Get.find();

  // Observable variables
  final RxBool isLoading = false.obs;
  final RxBool isLoadingMore = false.obs;
  final RxBool isSearching = false.obs;
  final RxList<Map<String, dynamic>> destinations = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> filteredDestinations = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> searchSuggestions = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> allCountries = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> allRegions = <Map<String, dynamic>>[].obs;
  final RxString selectedCategory = 'All'.obs;
  final RxString selectedCountry = 'All'.obs;
  final RxString selectedRegion = 'All'.obs;
  final RxString searchQuery = ''.obs;
  final RxBool showSuggestions = false.obs;

  // Pagination
  final RxInt currentPage = 1.obs;
  final RxInt totalPages = 1.obs;
  final RxBool hasMoreData = true.obs;
  final int itemsPerPage = 20;

  // Categories loaded from API
  final RxList<String> categories = <String>['All'].obs;

  // Controllers
  final TextEditingController searchController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    TLoggerHelper.info('DestinationsController initialized');
    _initializeData();
  }

  @override
 60 onClose() {
    searchController.dispose();
    super.onClose();
  }

  /// Initialize all required data
  Future<void> _initializeData() async {
    await Future.wait([
      loadCategories(),
      getAllCountries(),
      getAllRegions(),
      getAllDestinations(refresh: true),
    ]);
  }

  /// Load categories from API
  Future<void> loadCategories() async {
    try {
      final apiCategories = await DestinationsService.getCategories();
      categories.assignAll(['All', ...apiCategories]);
      TLoggerHelper.info('Categories loaded: ${categories.length} categories');
    } catch (e) {
      TLoggerHelper.error('Error loading categories: $e');
      // Keep only 'All' if API fails
      categories.assignAll(['All']);
    }
  }

  /// Get all destinations with pagination
  Future<void> getAllDestinations({
    bool refresh = false,
    int? page,
    String? search,
    String? category,
    String? country,
    String? region,
  }) async {
    try {
      if (refresh) {
        isLoading(true);
        currentPage.value = 1;
        destinations.clear();
        filteredDestinations.clear();
        hasMoreData.value = true;
      } else {
        isLoadingMore(true);
      }

      final response = await DestinationsService.getAllDestinations(
        page: page ?? currentPage.value,
        limit: itemsPerPage,
        search: search,
        category: category,
        country: country,
        region: region,
      );

      if (refresh) {
        destinations.assignAll(response['destinations'] ?? []);
        filteredDestinations.assignAll(response['destinations'] ?? []);
      } else {
        destinations.addAll(response['destinations'] ?? []);
        filteredDestinations.addAll(response['destinations'] ?? []);
      }

      totalPages.value = response['totalPages'] ?? 1;
      hasMoreData.value = currentPage.value < totalPages.value;
      
      if (!refresh) {
        currentPage.value++;
      }

      TLoggerHelper.info(
        'Destinations loaded: ${destinations.length} total destinations'
      );
    } catch (e) {
      TLoggerHelper.error('Error loading destinations: $e');
      _handleError('Failed to load destinations');
    } finally {
      isLoading(false);
      isLoadingMore(false);
    }
  }

  /// Get destination by ID
  Future<Map<String, dynamic>?> getDestinationById(String id) async {
    try {
      isLoading(true);
      final destination = await DestinationsService.getDestinationById(id);
      TLoggerHelper.info('Destination details loaded for ID: $id');
      return destination;
    } catch (e) {
      TLoggerHelper.error('Error loading destination details: $e');
      _handleError('Failed to load destination details');
      return null;
    } finally {
      isLoading(false);
    }
  }

  /// Get destinations by region
  Future<void> getDestinationsByRegion(String region, {bool refresh = true}) async {
    try {
      selectedRegion.value = region;
      await getAllDestinations(
        refresh: refresh,
        region: region == 'All' ? null : region,
      );
      TLoggerHelper.info('Destinations loaded for region: $region');
    } catch (e) {
      TLoggerHelper.error('Error loading destinations by region: $e');
      _handleError('Failed to load destinations for region');
    }
  }

  /// Get destinations by country
  Future<void> getDestinationsByCountry(String country, {bool refresh = true}) async {
    try {
      selectedCountry.value = country;
      // Reset region when country changes
      if (country != 'All') {
        selectedRegion.value = 'All';
        await getRegionsByCountry(country);
      }
      
      await getAllDestinations(
        refresh: refresh,
        country: country == 'All' ? null : country,
      );
      TLoggerHelper.info('Destinations loaded for country: $country');
    } catch (e) {
      TLoggerHelper.error('Error loading destinations by country: $e');
      _handleError('Failed to load destinations for country');
    }
  }

  /// Get regions by country
  Future<void> getRegionsByCountry(String country) async {
    try {
      final regions = await DestinationsService.getRegionsByCountry(country);
      allRegions.assignAll([
        {'id': 'all', 'name': 'All', 'country': country},
        ...regions
      ]);
      TLoggerHelper.info('Regions loaded for country: $country');
    } catch (e) {
      TLoggerHelper.error('Error loading regions by country: $e');
    }
  }

  /// Search destinations by name
  Future<void> searchDestinationsByName(String query, {bool refresh = true}) async {
    try {
      searchQuery.value = query;
      await getAllDestinations(
        refresh: refresh,
        search: query.isEmpty ? null : query,
        category: selectedCategory.value == 'All' ? null : selectedCategory.value,
        country: selectedCountry.value == 'All' ? null : selectedCountry.value,
        region: selectedRegion.value == 'All' ? null : selectedRegion.value,
      );
      TLoggerHelper.info('Search completed for: "$query"');
    } catch (e) {
      TLoggerHelper.error('Error searching destinations: $e');
      _handleError('Search failed');
    }
  }

  /// Get search suggestions
  Future<void> suggestDestinations(String query) async {
    if (query.isEmpty) {
      searchSuggestions.clear();
      showSuggestions.value = false;
      return;
    }

    try {
      isSearching(true);
      showSuggestions.value = true;
      
      final suggestions = await DestinationsService.suggestDestinations(query);
      searchSuggestions.assignAll(suggestions);
      
      TLoggerHelper.info('Suggestions loaded for: "$query", ${suggestions.length} results');
    } catch (e) {
      TLoggerHelper.error('Error getting suggestions: $e');
      searchSuggestions.clear();
    } finally {
      isSearching(false);
    }
  }

  /// Get all countries
  Future<void> getAllCountries() async {
    try {
      final countries = await DestinationsService.getAllCountries();
      allCountries.assignAll([
        {'id': 'all', 'name': 'All', 'code': 'ALL'},
        ...countries
      ]);
      TLoggerHelper.info('Countries loaded: ${countries.length} countries');
    } catch (e) {
      TLoggerHelper.error('Error loading countries: $e');
    }
  }

  /// Get all regions
  Future<void> getAllRegions() async {
    try {
      final regions = await DestinationsService.getAllRegions();
      allRegions.assignAll([
        {'id': 'all', 'name': 'All'},
        ...regions
      ]);
      TLoggerHelper.info('Regions loaded: ${regions.length} regions');
    } catch (e) {
      TLoggerHelper.error('Error loading regions: $e');
    }
  }

  /// Select category filter
  void selectCategory(String category) {
    selectedCategory.value = category;
    _applyFilters();
    TLoggerHelper.info('Selected category: $category');
  }

  /// Select country filter
  void selectCountry(String country) {
    getDestinationsByCountry(country);
  }

  /// Select region filter
  void selectRegion(String region) {
    getDestinationsByRegion(region);
  }

  /// Apply current filters
  void _applyFilters() {
    searchDestinationsByName(searchQuery.value);
  }

  /// Handle suggestion selection
  void onSuggestionSelected(Map<String, dynamic> suggestion) {
    searchController.text = suggestion['name'] ?? '';
    searchQuery.value = suggestion['name'] ?? '';
    showSuggestions.value = false;
    searchDestinationsByName(suggestion['name'] ?? '');
  }

  /// Load more data for pagination
  Future<void> loadMoreDestinations() async {
    if (!hasMoreData.value || isLoadingMore.value) return;
    
    await getAllDestinations(
      refresh: false,
      search: searchQuery.value.isEmpty ? null : searchQuery.value,
      category: selectedCategory.value == 'All' ? null : selectedCategory.value,
      country: selectedCountry.value == 'All' ? null : selectedCountry.value,
      region: selectedRegion.value == 'All' ? null : selectedRegion.value,
    );
  }

  /// Refresh all data
  Future<void> refreshData() async {
    await _initializeData();
    Get.snackbar(
      'Refreshed',
      'Destinations updated successfully',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green,
      colorText: Colors.white,
    );
  }

  /// Clear all filters
  void clearFilters() {
    selectedCategory.value = 'All';
    selectedCountry.value = 'All';
    selectedRegion.value = 'All';
    searchQuery.value = '';
    searchController.clear();
    showSuggestions.value = false;
    getAllDestinations(refresh: true);
  }

  /// Navigate to destination details
  void navigateToDestination(String destinationId, String destinationName) {
    Get.toNamed('/destination-details', arguments: {
      'id': destinationId,
      'name': destinationName,
    });
  }

  /// Add destination to favorites
  Future<void> addToFavorites(String destinationId) async {
    try {
      final success = await DestinationsService.addToFavorites(destinationId);
      if (success) {
        // Update the destination in the list
        _updateDestinationFavoriteStatus(destinationId, true);
        Get.snackbar(
          'Added to Favorites',
          'Destination added to your favorites',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      TLoggerHelper.error('Error adding to favorites: $e');
      _handleError('Failed to add to favorites');
    }
  }

  /// Remove destination from favorites
  Future<void> removeFromFavorites(String destinationId) async {
    try {
      final success = await DestinationsService.removeFromFavorites(destinationId);
      if (success) {
        // Update the destination in the list
        _updateDestinationFavoriteStatus(destinationId, false);
        Get.snackbar(
          'Removed from Favorites',
          'Destination removed from your favorites',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.orange,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      TLoggerHelper.error('Error removing from favorites: $e');
      _handleError('Failed to remove from favorites');
    }
  }

  /// Update destination favorite status in the list
  void _updateDestinationFavoriteStatus(String destinationId, bool isFavorite) {
    final destIndex = destinations.indexWhere((dest) => dest['id'] == destinationId);
    if (destIndex != -1) {
      destinations[destIndex]['isFavorite'] = isFavorite;
      destinations.refresh();
    }
    
    final filteredIndex = filteredDestinations.indexWhere((dest) => dest['id'] == destinationId);
    if (filteredIndex != -1) {
      filteredDestinations[filteredIndex]['isFavorite'] = isFavorite;
      filteredDestinations.refresh();
    }
  }

  /// Handle errors
  void _handleError(String message) {
    Get.snackbar(
      'Error',
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.red,
      colorText: Colors.white,
    );
  }
}
