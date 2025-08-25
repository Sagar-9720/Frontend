import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class AppHelpers {
  // Date formatters
  static String formatDate(DateTime date, {String pattern = 'MMM dd, yyyy'}) {
    return DateFormat(pattern).format(date);
  }

  static String formatTime(DateTime time, {String pattern = 'HH:mm'}) {
    return DateFormat(pattern).format(time);
  }

  static String formatDateTime(DateTime dateTime,
      {String pattern = 'MMM dd, yyyy HH:mm'}) {
    return DateFormat(pattern).format(dateTime);
  }

  static String formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 365) {
      final years = (difference.inDays / 365).floor();
      return '$years year${years > 1 ? 's' : ''} ago';
    } else if (difference.inDays > 30) {
      final months = (difference.inDays / 30).floor();
      return '$months month${months > 1 ? 's' : ''} ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes > 1 ? 's' : ''} ago';
    } else {
      return 'Just now';
    }
  }

  static String formatDuration(DateTime start, DateTime end) {
    final duration = end.difference(start);

    if (duration.inDays > 0) {
      return '${duration.inDays} day${duration.inDays > 1 ? 's' : ''}';
    } else if (duration.inHours > 0) {
      return '${duration.inHours} hour${duration.inHours > 1 ? 's' : ''}';
    } else {
      return '${duration.inMinutes} minute${duration.inMinutes > 1 ? 's' : ''}';
    }
  }

  // Price formatters
  static String formatPrice(double price, {String currency = 'USD'}) {
    final formatter = NumberFormat.currency(
      locale: _getCurrencyLocale(currency),
      symbol: _getCurrencySymbol(currency),
      decimalDigits: 2,
    );
    return formatter.format(price);
  }

  static String formatPriceCompact(double price, {String currency = 'USD'}) {
    final symbol = _getCurrencySymbol(currency);

    if (price >= 1000000) {
      return '$symbol${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '$symbol${(price / 1000).toStringAsFixed(1)}K';
    } else {
      return '$symbol${price.toStringAsFixed(0)}';
    }
  }

  static String _getCurrencyLocale(String currency) {
    switch (currency.toUpperCase()) {
      case 'USD':
        return 'en_US';
      case 'EUR':
        return 'en_EU';
      case 'GBP':
        return 'en_GB';
      case 'JPY':
        return 'ja_JP';
      case 'INR':
        return 'en_IN';
      default:
        return 'en_US';
    }
  }

  static String _getCurrencySymbol(String currency) {
    switch (currency.toUpperCase()) {
      case 'USD':
        return '\$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      case 'INR':
        return '₹';
      default:
        return '\$';
    }
  }

  // Number formatters
  static String formatNumber(num number) {
    return NumberFormat('#,###').format(number);
  }

  static String formatPercentage(double percentage) {
    return NumberFormat.percentPattern().format(percentage / 100);
  }

  static String formatRating(double rating) {
    return rating.toStringAsFixed(1);
  }

  // String utilities
  static String capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1).toLowerCase();
  }

  static String capitalizeWords(String text) {
    return text.split(' ').map(capitalize).join(' ');
  }

  static String truncate(String text, int maxLength, {String suffix = '...'}) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  static String removeHtmlTags(String htmlText) {
    return htmlText.replaceAll(RegExp(r'<[^>]*>'), '');
  }

  // Validation helpers
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  static bool isValidPhoneNumber(String phone) {
    return RegExp(r'^\+?[\d\s\-\(\)]{10,}$').hasMatch(phone);
  }

  static bool isValidPassword(String password) {
    // At least 8 characters with at least one letter and one number
    return RegExp(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$')
        .hasMatch(password);
  }

  // URL helpers
  static Future<void> launchURL(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  static Future<void> makePhoneCall(String phoneNumber) async {
    final uri = Uri.parse('tel:$phoneNumber');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  static Future<void> sendEmail(String email,
      {String? subject, String? body}) async {
    String emailUrl = 'mailto:$email';
    if (subject != null || body != null) {
      emailUrl += '?';
      if (subject != null)
        emailUrl += 'subject=${Uri.encodeComponent(subject)}';
      if (body != null) {
        if (subject != null) emailUrl += '&';
        emailUrl += 'body=${Uri.encodeComponent(body)}';
      }
    }

    final uri = Uri.parse(emailUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  static Future<void> openMaps(double latitude, double longitude,
      {String? label}) async {
    String url = 'https://maps.google.com/maps?q=$latitude,$longitude';
    if (label != null) {
      url += '($label)';
    }
    await launchURL(url);
  }

  // List utilities
  static List<T> removeDuplicates<T>(List<T> list) {
    return list.toSet().toList();
  }

  static List<T> filterNonNull<T>(List<T?> list) {
    return list.where((item) => item != null).cast<T>().toList();
  }

  // Distance calculation
  static double calculateDistance(
      double lat1, double lon1, double lat2, double lon2) {
    const double earthRadius = 6371; // km

    final dLat = _toRadians(lat2 - lat1);
    final dLon = _toRadians(lon2 - lon1);

    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRadians(lat1)) *
            math.cos(_toRadians(lat2)) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);

    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));

    return earthRadius * c;
  }

  static double _toRadians(double degrees) {
    return degrees * (math.pi / 180);
  }

  static String formatDistance(double distanceKm) {
    if (distanceKm < 1) {
      return '${(distanceKm * 1000).round()}m';
    } else if (distanceKm < 10) {
      return '${distanceKm.toStringAsFixed(1)}km';
    } else {
      return '${distanceKm.round()}km';
    }
  }

  // Color utilities
  static String getInitials(String name) {
    final words = name.trim().split(' ');
    if (words.length >= 2) {
      return '${words[0][0]}${words[1][0]}'.toUpperCase();
    } else if (words.isNotEmpty) {
      return words[0][0].toUpperCase();
    }
    return '';
  }

  // Trip utilities
  static String getTripStatusText(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      default:
        return capitalize(status);
    }
  }

  static String getDifficultyText(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      case 'expert':
        return 'Expert';
      default:
        return capitalize(difficulty);
    }
  }

  // Image utilities
  static String getImageUrl(String? imagePath, {String? fallback}) {
    if (imagePath == null || imagePath.isEmpty) {
      return fallback ?? 'https://via.placeholder.com/300x200?text=No+Image';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Assuming images are served from a base URL
    return 'https://api.travelmate.com/images/$imagePath';
  }

  // Search utilities
  static List<T> searchList<T>(
    List<T> items,
    String query,
    String Function(T) searchField,
  ) {
    if (query.isEmpty) return items;

    final lowercaseQuery = query.toLowerCase();
    return items.where((item) {
      final searchText = searchField(item).toLowerCase();
      return searchText.contains(lowercaseQuery);
    }).toList();
  }

  // Debounce utility
  static Timer? _debounceTimer;

  static void debounce(VoidCallback callback,
      {Duration delay = const Duration(milliseconds: 500)}) {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(delay, callback);
  }
}
