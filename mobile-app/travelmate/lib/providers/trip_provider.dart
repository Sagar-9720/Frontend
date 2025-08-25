import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/services.dart';
import '../utils/utils.dart';

class TripProvider extends ChangeNotifier {
  final TripService _tripService = TripService();

  // State
  List<Trip> _trips = [];
  List<Trip> _featuredTrips = [];
  List<Destination> _destinations = [];
  List<Destination> _popularDestinations = [];
  List<String> _categories = [];
  List<String> _recentSearches = [];

  Trip? _selectedTrip;
  Destination? _selectedDestination;

  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasMore = true;
  String? _error;

  // Pagination
  int _currentPage = 1;

  // Filters
  SearchFilters? _currentFilters;
  SortOptions? _currentSort;
  String? _currentSearchQuery;

  // Getters
  List<Trip> get trips => _trips;
  List<Trip> get featuredTrips => _featuredTrips;
  List<Destination> get destinations => _destinations;
  List<Destination> get popularDestinations => _popularDestinations;
  List<String> get categories => _categories;
  List<String> get recentSearches => _recentSearches;

  Trip? get selectedTrip => _selectedTrip;
  Destination? get selectedDestination => _selectedDestination;

  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get hasMore => _hasMore;
  String? get error => _error;

  SearchFilters? get currentFilters => _currentFilters;
  SortOptions? get currentSort => _currentSort;
  String? get currentSearchQuery => _currentSearchQuery;

  // Initialize provider
  Future<void> initialize() async {
    try {
      _setLoading(true);

      await Future.wait([
        loadFeaturedTrips(),
        loadPopularDestinations(),
        loadCategories(),
        loadRecentSearches(),
      ]);

      AppLogger.debug('Trip provider initialized successfully');
    } catch (e) {
      AppLogger.error('Failed to initialize trip provider', e);
      _setError('Failed to initialize: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Load trips with filters
  Future<void> loadTrips({
    SearchFilters? filters,
    SortOptions? sort,
    bool refresh = false,
  }) async {
    try {
      if (refresh) {
        _currentPage = 1;
        _hasMore = true;
        _trips.clear();
      }

      if (_isLoading || _isLoadingMore || !_hasMore) return;

      if (_currentPage == 1) {
        _setLoading(true);
      } else {
        _setLoadingMore(true);
      }

      _currentFilters = filters;
      _currentSort = sort;
      _clearError();

      final response = await _tripService.getTrips(
        filters: filters,
        sort: sort,
        page: _currentPage,
        limit: 10,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;

        if (_currentPage == 1) {
          _trips = paginatedData.data;
        } else {
          _trips.addAll(paginatedData.data);
        }

        _currentPage = paginatedData.currentPage + 1;
        _hasMore = paginatedData.hasNextPage;

        AppLogger.debug('Trips loaded successfully', {
          'page': _currentPage - 1,
          'total': paginatedData.totalItems,
          'hasMore': _hasMore,
        });
      } else {
        _setError(response.error ?? 'Failed to load trips');
      }
    } catch (e) {
      AppLogger.error('Failed to load trips', e);
      _setError('Failed to load trips: ${e.toString()}');
    } finally {
      _setLoading(false);
      _setLoadingMore(false);
    }
  }

  // Load more trips (for pagination)
  Future<void> loadMoreTrips() async {
    if (!_hasMore || _isLoadingMore) return;
    await loadTrips();
  }

  // Search trips
  Future<void> searchTrips({
    required String query,
    SearchFilters? filters,
    SortOptions? sort,
    bool refresh = true,
  }) async {
    try {
      if (refresh) {
        _currentPage = 1;
        _hasMore = true;
        _trips.clear();
      }

      if (_isLoading || _isLoadingMore) return;

      if (_currentPage == 1) {
        _setLoading(true);
      } else {
        _setLoadingMore(true);
      }

      _currentSearchQuery = query;
      _currentFilters = filters;
      _currentSort = sort;
      _clearError();

      final response = await _tripService.searchTrips(
        query: query,
        filters: filters,
        sort: sort,
        page: _currentPage,
        limit: 10,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;

        if (_currentPage == 1) {
          _trips = paginatedData.data;
        } else {
          _trips.addAll(paginatedData.data);
        }

        _currentPage = paginatedData.currentPage + 1;
        _hasMore = paginatedData.hasNextPage;

        // Update recent searches
        await loadRecentSearches();

        AppLogger.userAction('Trip search completed', {
          'query': query,
          'results': paginatedData.totalItems,
        });
      } else {
        _setError(response.error ?? 'Search failed');
      }
    } catch (e) {
      AppLogger.error('Search failed', e);
      _setError('Search failed: ${e.toString()}');
    } finally {
      _setLoading(false);
      _setLoadingMore(false);
    }
  }

  // Load featured trips
  Future<void> loadFeaturedTrips() async {
    try {
      final response = await _tripService.getFeaturedTrips(limit: 5);

      if (response.success && response.data != null) {
        _featuredTrips = response.data!;
        AppLogger.debug(
            'Featured trips loaded', {'count': _featuredTrips.length});
        notifyListeners();
      }
    } catch (e) {
      AppLogger.error('Failed to load featured trips', e);
    }
  }

  // Load trips by category
  Future<void> loadTripsByCategory(String category) async {
    try {
      _setLoading(true);
      _currentPage = 1;
      _hasMore = true;
      _trips.clear();
      _clearError();

      final response = await _tripService.getTripsByCategory(
        category: category,
        page: _currentPage,
        limit: 10,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;
        _trips = paginatedData.data;
        _currentPage = paginatedData.currentPage + 1;
        _hasMore = paginatedData.hasNextPage;

        AppLogger.debug('Category trips loaded', {
          'category': category,
          'count': _trips.length,
        });
      } else {
        _setError(response.error ?? 'Failed to load category trips');
      }
    } catch (e) {
      AppLogger.error('Failed to load category trips', e);
      _setError('Failed to load category trips: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Get trip by ID
  Future<void> getTripById(String tripId) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _tripService.getTripById(tripId);

      if (response.success && response.data != null) {
        _selectedTrip = response.data;
        AppLogger.debug('Trip details loaded', {'tripId': tripId});
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load trip details');
      }
    } catch (e) {
      AppLogger.error('Failed to load trip details', e);
      _setError('Failed to load trip details: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Load destinations
  Future<void> loadDestinations({String? query}) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _tripService.getDestinations(
        query: query,
        page: 1,
        limit: 20,
      );

      if (response.success && response.data != null) {
        _destinations = response.data!.data;
        AppLogger.debug('Destinations loaded', {'count': _destinations.length});
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load destinations');
      }
    } catch (e) {
      AppLogger.error('Failed to load destinations', e);
      _setError('Failed to load destinations: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Load popular destinations
  Future<void> loadPopularDestinations() async {
    try {
      final response = await _tripService.getPopularDestinations(limit: 8);

      if (response.success && response.data != null) {
        _popularDestinations = response.data!;
        AppLogger.debug('Popular destinations loaded',
            {'count': _popularDestinations.length});
        notifyListeners();
      }
    } catch (e) {
      AppLogger.error('Failed to load popular destinations', e);
    }
  }

  // Get destination by ID
  Future<void> getDestinationById(String destinationId) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _tripService.getDestinationById(destinationId);

      if (response.success && response.data != null) {
        _selectedDestination = response.data;
        AppLogger.debug(
            'Destination details loaded', {'destinationId': destinationId});
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load destination details');
      }
    } catch (e) {
      AppLogger.error('Failed to load destination details', e);
      _setError('Failed to load destination details: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Load trips by destination
  Future<void> loadTripsByDestination(String destinationId) async {
    try {
      _setLoading(true);
      _currentPage = 1;
      _hasMore = true;
      _trips.clear();
      _clearError();

      final response = await _tripService.getTripsByDestination(
        destinationId: destinationId,
        page: _currentPage,
        limit: 10,
      );

      if (response.success && response.data != null) {
        final paginatedData = response.data!;
        _trips = paginatedData.data;
        _currentPage = paginatedData.currentPage + 1;
        _hasMore = paginatedData.hasNextPage;

        AppLogger.debug('Destination trips loaded', {
          'destinationId': destinationId,
          'count': _trips.length,
        });
      } else {
        _setError(response.error ?? 'Failed to load destination trips');
      }
    } catch (e) {
      AppLogger.error('Failed to load destination trips', e);
      _setError('Failed to load destination trips: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Load categories
  Future<void> loadCategories() async {
    try {
      final response = await _tripService.getTripCategories();

      if (response.success && response.data != null) {
        _categories = response.data!;
        AppLogger.debug('Categories loaded', {'count': _categories.length});
        notifyListeners();
      }
    } catch (e) {
      AppLogger.error('Failed to load categories', e);
    }
  }

  // Load recent searches
  Future<void> loadRecentSearches() async {
    try {
      _recentSearches = await _tripService.getRecentSearches();
      notifyListeners();
    } catch (e) {
      AppLogger.error('Failed to load recent searches', e);
    }
  }

  // Clear recent searches
  Future<void> clearRecentSearches() async {
    try {
      await _tripService.clearRecentSearches();
      _recentSearches.clear();
      notifyListeners();
    } catch (e) {
      AppLogger.error('Failed to clear recent searches', e);
    }
  }

  // Apply filters
  void applyFilters(SearchFilters filters) {
    _currentFilters = filters;
    loadTrips(filters: filters, sort: _currentSort, refresh: true);
  }

  // Apply sorting
  void applySorting(SortOptions sort) {
    _currentSort = sort;
    loadTrips(filters: _currentFilters, sort: sort, refresh: true);
  }

  // Clear filters
  void clearFilters() {
    _currentFilters = null;
    _currentSort = null;
    _currentSearchQuery = null;
    loadTrips(refresh: true);
  }

  // Set selected trip
  void setSelectedTrip(Trip? trip) {
    _selectedTrip = trip;
    notifyListeners();
  }

  // Set selected destination
  void setSelectedDestination(Destination? destination) {
    _selectedDestination = destination;
    notifyListeners();
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setLoadingMore(bool loading) {
    _isLoadingMore = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  // Utility methods
  bool isTripLiked(String tripId) {
    // This would typically check against user's liked trips
    // Implementation depends on UserProvider integration
    return false;
  }

  bool isTripSaved(String tripId) {
    // This would typically check against user's saved trips
    // Implementation depends on UserProvider integration
    return false;
  }

  List<Trip> getTripsByCategory(String category) {
    return _trips
        .where((trip) => trip.category.toLowerCase() == category.toLowerCase())
        .toList();
  }

  List<Trip> getAvailableTrips() {
    return _trips.where((trip) => trip.isAvailable).toList();
  }

  // Refresh all data
  Future<void> refresh() async {
    await initialize();
  }
}
