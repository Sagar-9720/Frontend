import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/features/Authentication/services/auth_service.dart';
import 'package:travelmate/features/Personalization/Journal/services/travel_journal_service.dart';
import 'package:travelmate/common/services/user_interaction_service.dart';
import 'package:travelmate/utils/logging/logger.dart';

class TravelJournalController extends GetxController {
  static TravelJournalController get instance => Get.find();

  // Observable variables
  final RxBool isLoading = false.obs;
  final RxBool isLoadingMore = false.obs;
  final RxBool isSearching = false.obs;
  final RxList<Map<String, dynamic>> journalEntries = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> filteredEntries = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> allTags = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> suggestedTags = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> userNames = <Map<String, dynamic>>[].obs;
  final RxList<Map<String, dynamic>> tripNames = <Map<String, dynamic>>[].obs;
  final RxString selectedTag = ''.obs;
  final RxString searchQuery = ''.obs;
  final RxBool showPublicOnly = false.obs;
  final RxBool showSuggestions = false.obs;
  final RxString currentUserId = ''.obs;

  // Pagination
  final RxInt currentPage = 1.obs;
  final RxInt totalPages = 1.obs;
  final RxBool hasMoreData = true.obs;
  final int itemsPerPage = 20;

  // Search controller
  final TextEditingController searchController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    TLoggerHelper.info('TravelJournalController initialized');
    _initializeData();
  }

  @override
  void onClose() {
    searchController.dispose();
    super.onClose();
  }

  /// Initialize all required data
  Future<void> _initializeData() async {
    await _getCurrentUserId();
    await Future.wait([
      loadAllTags(),
      loadJournalEntries(refresh: true),
    ]);
  }

  /// Get current user ID
  Future<void> _getCurrentUserId() async {
    try {
      final userId = await AuthService.getCurrentUserId();
      currentUserId.value = userId ?? '';
    } catch (e) {
      TLoggerHelper.error('Error getting current user ID: $e');
    }
  }

  /// Load all journal entries
  Future<void> loadJournalEntries({bool refresh = false}) async {
    try {
      if (refresh) {
        isLoading(true);
        currentPage.value = 1;
        journalEntries.clear();
        filteredEntries.clear();
        hasMoreData.value = true;
      } else {
        isLoadingMore(true);
      }

      Map<String, dynamic> response;

      if (showPublicOnly.value) {
        final publicJournals = await TravelJournalService.getPublicJournals(
          page: currentPage.value,
          limit: itemsPerPage,
          search: searchQuery.value.isEmpty ? null : searchQuery.value,
          tag: selectedTag.value.isEmpty ? null : selectedTag.value,
        );
        response = {
          'journals': publicJournals,
          'totalPages': 1,
          'currentPage': 1,
          'totalItems': publicJournals.length,
        };
      } else if (selectedTag.value.isNotEmpty) {
        final tagJournals = await TravelJournalService.getJournalsByTag(
          tag: selectedTag.value,
          page: currentPage.value,
          limit: itemsPerPage,
        );
        response = {
          'journals': tagJournals,
          'totalPages': 1,
          'currentPage': 1,
          'totalItems': tagJournals.length,
        };
      } else {
        response = await TravelJournalService.getAllJournals(
          page: currentPage.value,
          limit: itemsPerPage,
          search: searchQuery.value.isEmpty ? null : searchQuery.value,
          isPublic: showPublicOnly.value,
        );
      }

      if (refresh) {
        journalEntries.assignAll(response['journals'] ?? []);
        filteredEntries.assignAll(response['journals'] ?? []);
      } else {
        journalEntries.addAll(response['journals'] ?? []);
        filteredEntries.addAll(response['journals'] ?? []);
      }

      totalPages.value = response['totalPages'] ?? 1;
      hasMoreData.value = currentPage.value < totalPages.value;

      if (!refresh) {
        currentPage.value++;
      }

      // Load user and trip names
      await _loadUserAndTripNames();

      TLoggerHelper.info('Journal entries loaded: ${journalEntries.length} items');
    } catch (e) {
      TLoggerHelper.error('Error loading journal entries: $e');
      _handleError('Failed to load journal entries');
    } finally {
      isLoading(false);
      isLoadingMore(false);
    }
  }

  /// Load user and trip names for journals
  Future<void> _loadUserAndTripNames() async {
    try {
      // Extract unique user IDs and trip IDs
      final userIds = journalEntries
          .where((journal) => journal['userId'] != null)
          .map((journal) => journal['userId'].toString())
          .toSet()
          .toList();

      final tripIds = journalEntries
          .where((journal) => journal['tripId'] != null)
          .map((journal) => journal['tripId'].toString())
          .toSet()
          .toList();

      // Load names in parallel
      final futures = <Future<void>>[];

      if (userIds.isNotEmpty) {
        futures.add(_loadUserNames(userIds));
      }

      if (tripIds.isNotEmpty) {
        futures.add(_loadTripNames(tripIds));
      }

      await Future.wait(futures);
    } catch (e) {
      TLoggerHelper.error('Error loading user and trip names: $e');
    }
  }

  /// Load user names
  Future<void> _loadUserNames(List<String> userIds) async {
    try {
      final users = await UserInteractionService.getUserNames(userIds);
      userNames.assignAll(users);
    } catch (e) {
      TLoggerHelper.error('Error loading user names: $e');
    }
  }

  /// Load trip names
  Future<void> _loadTripNames(List<String> tripIds) async {
    try {
      final trips = await UserInteractionService.getTripsNames(tripIds);
      tripNames.assignAll(trips);
    } catch (e) {
      TLoggerHelper.error('Error loading trip names: $e');
    }
  }

  /// Load all tags
  Future<void> loadAllTags() async {
    try {
      final tags = await TravelJournalService.getAllTags(limit: 50);
      allTags.assignAll(tags);
      TLoggerHelper.info('Tags loaded: ${tags.length} items');
    } catch (e) {
      TLoggerHelper.error('Error loading tags: $e');
    }
  }

  /// Suggest tags based on search query
  Future<void> suggestTags(String query) async {
    if (query.isEmpty) {
      suggestedTags.clear();
      showSuggestions.value = false;
      return;
    }

    try {
      isSearching(true);
      showSuggestions.value = true;

      final suggestions = await TravelJournalService.suggestTags(query);
      suggestedTags.assignAll(suggestions);

      TLoggerHelper.info('Tag suggestions loaded for: "$query", ${suggestions.length} results');
    } catch (e) {
      TLoggerHelper.error('Error getting tag suggestions: $e');
      suggestedTags.clear();
    } finally {
      isSearching(false);
    }
  }

  /// Search journals
  void searchJournals(String query) {
    searchQuery.value = query;
    if (query.isNotEmpty) {
      suggestTags(query);
    } else {
      showSuggestions.value = false;
      suggestedTags.clear();
    }
    loadJournalEntries(refresh: true);
  }

  /// Select tag filter
  void selectTag(String tag) {
    selectedTag.value = tag;
    showSuggestions.value = false;
    searchController.clear();
    searchQuery.value = '';
    loadJournalEntries(refresh: true);
    TLoggerHelper.info('Selected tag: $tag');
  }

  /// Toggle public only filter
  void togglePublicOnly() {
    showPublicOnly.value = !showPublicOnly.value;
    loadJournalEntries(refresh: true);
    TLoggerHelper.info('Public only filter: ${showPublicOnly.value}');
  }

  /// Clear all filters
  void clearFilters() {
    selectedTag.value = '';
    searchQuery.value = '';
    showPublicOnly.value = false;
    searchController.clear();
    showSuggestions.value = false;
    loadJournalEntries(refresh: true);
  }

  /// Load more data for pagination
  Future<void> loadMoreEntries() async {
    if (!hasMoreData.value || isLoadingMore.value) return;
    await loadJournalEntries(refresh: false);
  }

  /// Create new journal entry
  void createNewEntry() {
    TLoggerHelper.info('Creating new journal entry');
    Get.toNamed('/journal-form', arguments: {'mode': 'create'});
  }

  /// Edit journal entry
  void editEntry(Map<String, dynamic> entry) {
    TLoggerHelper.info('Editing journal entry: ${entry['title']}');
    Get.toNamed('/journal-form', arguments: {
      'mode': 'edit',
      'journal': entry,
    });
  }

  /// View journal entry details
  void viewEntry(Map<String, dynamic> entry) {
    TLoggerHelper.info('Viewing journal entry: ${entry['title']}');
    Get.toNamed('/journal-details', arguments: {
      'journalId': entry['id'],
      'journal': entry,
    });
  }

  /// Delete journal entry
  Future<void> deleteEntry(String entryId) async {
    try {
      final confirmed = await Get.dialog<bool>(
        AlertDialog(
          title: const Text('Delete Journal'),
          content: const Text('Are you sure you want to delete this journal entry?'),
          actions: [
            TextButton(
              onPressed: () => Get.back(result: false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Get.back(result: true),
              child: const Text('Delete'),
              style: TextButton.styleFrom(foregroundColor: Colors.red),
            ),
          ],
        ),
      );

      if (confirmed == true) {
        final success = await TravelJournalService.deleteJournal(entryId);

        if (success) {
          journalEntries.removeWhere((entry) => entry['id'] == entryId);
          filteredEntries.removeWhere((entry) => entry['id'] == entryId);

          Get.snackbar(
            'Success',
            'Journal entry deleted successfully',
            snackPosition: SnackPosition.BOTTOM,
            backgroundColor: Colors.green,
            colorText: Colors.white,
          );

          TLoggerHelper.info('Journal entry deleted: $entryId');
        } else {
          _handleError('Failed to delete journal entry');
        }
      }
    } catch (e) {
      TLoggerHelper.error('Error deleting journal entry: $e');
      _handleError('Failed to delete journal entry');
    }
  }

  /// Get user name by ID
  String getUserName(String userId) {
    final user = userNames.firstWhereOrNull((user) => user['id'] == userId);
    return user?['name'] ?? user?['fullName'] ?? 'Unknown User';
  }

  /// Get trip name by ID
  String getTripName(String tripId) {
    final trip = tripNames.firstWhereOrNull((trip) => trip['id'] == tripId);
    return trip?['name'] ?? trip?['title'] ?? 'Unknown Trip';
  }

  /// Check if current user owns the journal
  bool isCurrentUserOwner(String journalUserId) {
    return currentUserId.value == journalUserId;
  }

  /// Refresh all data
  Future<void> refreshData() async {
    await _initializeData();
    Get.snackbar(
      'Refreshed',
      'Journal data updated successfully',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green,
      colorText: Colors.white,
    );
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
