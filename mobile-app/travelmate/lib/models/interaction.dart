class Review {
  final String id;
  final String tripId;
  final String userId;
  final double rating;
  final String? title;
  final String? comment;
  final List<String> images;
  final DateTime createdAt;
  final DateTime updatedAt;

  Review({
    required this.id,
    required this.tripId,
    required this.userId,
    required this.rating,
    this.title,
    this.comment,
    required this.images,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'],
      tripId: json['tripId'],
      userId: json['userId'],
      rating: json['rating'].toDouble(),
      title: json['title'],
      comment: json['comment'],
      images: List<String>.from(json['images'] ?? []),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tripId': tripId,
      'userId': userId,
      'rating': rating,
      'title': title,
      'comment': comment,
      'images': images,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class Comment {
  final String id;
  final String entityType;
  final String entityId;
  final String userId;
  final String content;
  final String? parentId;
  final DateTime createdAt;
  final DateTime updatedAt;

  Comment({
    required this.id,
    required this.entityType,
    required this.entityId,
    required this.userId,
    required this.content,
    this.parentId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'],
      entityType: json['entityType'],
      entityId: json['entityId'],
      userId: json['userId'],
      content: json['content'],
      parentId: json['parentId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'entityType': entityType,
      'entityId': entityId,
      'userId': userId,
      'content': content,
      'parentId': parentId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  bool get isReply => parentId != null;
}

class Like {
  final String id;
  final String entityType;
  final String entityId;
  final String userId;
  final DateTime createdAt;

  Like({
    required this.id,
    required this.entityType,
    required this.entityId,
    required this.userId,
    required this.createdAt,
  });

  factory Like.fromJson(Map<String, dynamic> json) {
    return Like(
      id: json['id'],
      entityType: json['entityType'],
      entityId: json['entityId'],
      userId: json['userId'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'entityType': entityType,
      'entityId': entityId,
      'userId': userId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class TripRequest {
  final String id;
  final String userId;
  final String destination;
  final DateTime preferredStartDate;
  final DateTime preferredEndDate;
  final int numberOfTravelers;
  final double? budget;
  final String? budgetCurrency;
  final String? description;
  final List<String> preferences;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  TripRequest({
    required this.id,
    required this.userId,
    required this.destination,
    required this.preferredStartDate,
    required this.preferredEndDate,
    required this.numberOfTravelers,
    this.budget,
    this.budgetCurrency,
    this.description,
    required this.preferences,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory TripRequest.fromJson(Map<String, dynamic> json) {
    return TripRequest(
      id: json['id'],
      userId: json['userId'],
      destination: json['destination'],
      preferredStartDate: DateTime.parse(json['preferredStartDate']),
      preferredEndDate: DateTime.parse(json['preferredEndDate']),
      numberOfTravelers: json['numberOfTravelers'],
      budget: json['budget']?.toDouble(),
      budgetCurrency: json['budgetCurrency'],
      description: json['description'],
      preferences: List<String>.from(json['preferences'] ?? []),
      status: json['status'] ?? 'OPEN',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'destination': destination,
      'preferredStartDate': preferredStartDate.toIso8601String(),
      'preferredEndDate': preferredEndDate.toIso8601String(),
      'numberOfTravelers': numberOfTravelers,
      'budget': budget,
      'budgetCurrency': budgetCurrency,
      'description': description,
      'preferences': preferences,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  bool get isActive => status == 'OPEN';
}
