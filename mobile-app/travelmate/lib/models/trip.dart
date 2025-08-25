class Trip {
  final String id;
  final String title;
  final String description;
  final String destination;
  final DateTime startDate;
  final DateTime endDate;
  final double price;
  final String currency;
  final int maxCapacity;
  final int currentBookings;
  final List<String> images;
  final String difficulty;
  final List<String> activities;
  final List<String> included;
  final List<String> excluded;
  final String? meetingPoint;
  final String category;
  final String status;
  final String providerId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final double? rating;
  final int? reviewCount;

  Trip({
    required this.id,
    required this.title,
    required this.description,
    required this.destination,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.currency,
    required this.maxCapacity,
    required this.currentBookings,
    required this.images,
    required this.difficulty,
    required this.activities,
    required this.included,
    required this.excluded,
    this.meetingPoint,
    required this.category,
    required this.status,
    required this.providerId,
    required this.createdAt,
    required this.updatedAt,
    this.rating,
    this.reviewCount,
  });

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      destination: json['destination'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      price: json['price'].toDouble(),
      currency: json['currency'] ?? 'USD',
      maxCapacity: json['maxCapacity'],
      currentBookings: json['currentBookings'] ?? 0,
      images: List<String>.from(json['images'] ?? []),
      difficulty: json['difficulty'] ?? 'Medium',
      activities: List<String>.from(json['activities'] ?? []),
      included: List<String>.from(json['included'] ?? []),
      excluded: List<String>.from(json['excluded'] ?? []),
      meetingPoint: json['meetingPoint'],
      category: json['category'] ?? 'Adventure',
      status: json['status'] ?? 'ACTIVE',
      providerId: json['providerId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      rating: json['rating']?.toDouble(),
      reviewCount: json['reviewCount'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'destination': destination,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'price': price,
      'currency': currency,
      'maxCapacity': maxCapacity,
      'currentBookings': currentBookings,
      'images': images,
      'difficulty': difficulty,
      'activities': activities,
      'included': included,
      'excluded': excluded,
      'meetingPoint': meetingPoint,
      'category': category,
      'status': status,
      'providerId': providerId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'rating': rating,
      'reviewCount': reviewCount,
    };
  }

  bool get isAvailable =>
      status == 'ACTIVE' &&
      currentBookings < maxCapacity &&
      startDate.isAfter(DateTime.now());

  int get availableSpots => maxCapacity - currentBookings;
}

class Destination {
  final String id;
  final String name;
  final String country;
  final String description;
  final double latitude;
  final double longitude;
  final List<String> images;
  final String? timezone;
  final String? currency;
  final List<String> languages;
  final String? climate;
  final List<String> attractions;
  final double? rating;
  final int? reviewCount;

  Destination({
    required this.id,
    required this.name,
    required this.country,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.images,
    this.timezone,
    this.currency,
    required this.languages,
    this.climate,
    required this.attractions,
    this.rating,
    this.reviewCount,
  });

  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      id: json['id'],
      name: json['name'],
      country: json['country'],
      description: json['description'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
      images: List<String>.from(json['images'] ?? []),
      timezone: json['timezone'],
      currency: json['currency'],
      languages: List<String>.from(json['languages'] ?? []),
      climate: json['climate'],
      attractions: List<String>.from(json['attractions'] ?? []),
      rating: json['rating']?.toDouble(),
      reviewCount: json['reviewCount'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'country': country,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'images': images,
      'timezone': timezone,
      'currency': currency,
      'languages': languages,
      'climate': climate,
      'attractions': attractions,
      'rating': rating,
      'reviewCount': reviewCount,
    };
  }
}

class TripBooking {
  final String id;
  final String tripId;
  final String userId;
  final int numberOfTravelers;
  final double totalPrice;
  final String currency;
  final String status;
  final DateTime bookingDate;
  final DateTime startDate;
  final DateTime endDate;
  final Map<String, dynamic>? additionalInfo;
  final String? cancellationReason;
  final DateTime? cancellationDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  TripBooking({
    required this.id,
    required this.tripId,
    required this.userId,
    required this.numberOfTravelers,
    required this.totalPrice,
    required this.currency,
    required this.status,
    required this.bookingDate,
    required this.startDate,
    required this.endDate,
    this.additionalInfo,
    this.cancellationReason,
    this.cancellationDate,
    required this.createdAt,
    required this.updatedAt,
  });

  factory TripBooking.fromJson(Map<String, dynamic> json) {
    return TripBooking(
      id: json['id'],
      tripId: json['tripId'],
      userId: json['userId'],
      numberOfTravelers: json['numberOfTravelers'],
      totalPrice: json['totalPrice'].toDouble(),
      currency: json['currency'] ?? 'USD',
      status: json['status'],
      bookingDate: DateTime.parse(json['bookingDate']),
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      additionalInfo: json['additionalInfo'],
      cancellationReason: json['cancellationReason'],
      cancellationDate: json['cancellationDate'] != null
          ? DateTime.parse(json['cancellationDate'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tripId': tripId,
      'userId': userId,
      'numberOfTravelers': numberOfTravelers,
      'totalPrice': totalPrice,
      'currency': currency,
      'status': status,
      'bookingDate': bookingDate.toIso8601String(),
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'additionalInfo': additionalInfo,
      'cancellationReason': cancellationReason,
      'cancellationDate': cancellationDate?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  bool get canBeCancelled {
    final cancellationDeadline = startDate.subtract(Duration(hours: 24));
    return status == 'CONFIRMED' &&
        DateTime.now().isBefore(cancellationDeadline);
  }
}

class SavedTrip {
  final String id;
  final String tripId;
  final String userId;
  final String? notes;
  final DateTime savedAt;

  SavedTrip({
    required this.id,
    required this.tripId,
    required this.userId,
    this.notes,
    required this.savedAt,
  });

  factory SavedTrip.fromJson(Map<String, dynamic> json) {
    return SavedTrip(
      id: json['id'],
      tripId: json['tripId'],
      userId: json['userId'],
      notes: json['notes'],
      savedAt: DateTime.parse(json['savedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tripId': tripId,
      'userId': userId,
      'notes': notes,
      'savedAt': savedAt.toIso8601String(),
    };
  }
}
