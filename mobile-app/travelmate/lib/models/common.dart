class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final String? error;
  final int? statusCode;

  ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.error,
    this.statusCode,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: json['success'] ?? false,
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'],
      message: json['message'],
      error: json['error'],
      statusCode: json['statusCode'],
    );
  }

  factory ApiResponse.success(T data, {String? message}) {
    return ApiResponse<T>(
      success: true,
      data: data,
      message: message,
    );
  }

  factory ApiResponse.error(String error, {int? statusCode}) {
    return ApiResponse<T>(
      success: false,
      error: error,
      statusCode: statusCode,
    );
  }
}

class PaginatedResponse<T> {
  final List<T> data;
  final int currentPage;
  final int totalPages;
  final int totalItems;
  final int itemsPerPage;
  final bool hasNextPage;
  final bool hasPreviousPage;

  PaginatedResponse({
    required this.data,
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
    required this.itemsPerPage,
    required this.hasNextPage,
    required this.hasPreviousPage,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    return PaginatedResponse<T>(
      data: (json['data'] as List).map((item) => fromJsonT(item)).toList(),
      currentPage: json['currentPage'] ?? 1,
      totalPages: json['totalPages'] ?? 1,
      totalItems: json['totalItems'] ?? 0,
      itemsPerPage: json['itemsPerPage'] ?? 10,
      hasNextPage: json['hasNextPage'] ?? false,
      hasPreviousPage: json['hasPreviousPage'] ?? false,
    );
  }
}

class SearchFilters {
  final String? query;
  final String? destination;
  final DateTime? startDate;
  final DateTime? endDate;
  final double? minPrice;
  final double? maxPrice;
  final String? currency;
  final String? category;
  final String? difficulty;
  final List<String>? activities;
  final int? minCapacity;
  final double? minRating;

  SearchFilters({
    this.query,
    this.destination,
    this.startDate,
    this.endDate,
    this.minPrice,
    this.maxPrice,
    this.currency,
    this.category,
    this.difficulty,
    this.activities,
    this.minCapacity,
    this.minRating,
  });

  Map<String, dynamic> toJson() {
    return {
      'query': query,
      'destination': destination,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'minPrice': minPrice,
      'maxPrice': maxPrice,
      'currency': currency,
      'category': category,
      'difficulty': difficulty,
      'activities': activities,
      'minCapacity': minCapacity,
      'minRating': minRating,
    }..removeWhere((key, value) => value == null);
  }
}

class SortOptions {
  final String field;
  final String order; // 'asc' or 'desc'

  SortOptions({
    required this.field,
    required this.order,
  });

  Map<String, dynamic> toJson() {
    return {
      'field': field,
      'order': order,
    };
  }

  static SortOptions priceAsc() => SortOptions(field: 'price', order: 'asc');
  static SortOptions priceDesc() => SortOptions(field: 'price', order: 'desc');
  static SortOptions dateAsc() => SortOptions(field: 'startDate', order: 'asc');
  static SortOptions dateDesc() =>
      SortOptions(field: 'startDate', order: 'desc');
  static SortOptions ratingDesc() =>
      SortOptions(field: 'rating', order: 'desc');
  static SortOptions popularityDesc() =>
      SortOptions(field: 'bookings', order: 'desc');
}
