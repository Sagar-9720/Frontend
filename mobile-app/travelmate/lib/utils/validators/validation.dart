import 'package:flutter/material.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/colors.dart';

class TValidation {
  static String? validateEmptyText(String? fieldName, String? value) {
    if (value == null || value.isEmpty) {
      return '$fieldName is required.';
    }
    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required.';
    }

    // Regular expression for email validation
    final emailRegExp = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');

    if (!emailRegExp.hasMatch(value)) {
      return 'Invalid email address.';
    }

    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required.';
    }

    // Check for minimum password length
    if (value.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    // Check for uppercase letters
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain at least one uppercase letter.';
    }

    // Check for numbers
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain at least one number.';
    }

    // Check for special characters
    if (!value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
      return 'Password must contain at least one special character.';
    }

    return null;
  }

  static String? validatePhoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone number is required.';
    }

    // Regular expression for phone number validation (assuming a 10-digit US phone number format)
    final phoneRegExp = RegExp(r'^\d{10}$');

    if (!phoneRegExp.hasMatch(value)) {
      return 'Invalid phone number format (10 digits required).';
    }

    return null;
  }

  static String? validateUrl(String? value) {
    if (value == null || value.isEmpty) {
      return 'URL is required.';
    }

    // Regular expression for URL validation
    final urlRegExp = RegExp(
      r'^(http|https)://[^\s/$.?#].[^\s]*$',
      caseSensitive: false,
    );

    if (!urlRegExp.hasMatch(value)) {
      return 'Invalid URL format.';
    }

    return null;
  }

  static String? validateDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Date is required.';
    }

    try {
      DateTime.parse(value);
      return null;
    } catch (e) {
      return 'Invalid date format.';
    }
  }

  static String? validateNumeric(String? value) {
    if (value == null || value.isEmpty) {
      return 'This field is required.';
    }

    if (double.tryParse(value) == null) {
      return 'Please enter a valid number.';
    }

    return null;
  }

  static String? validateCreditCard(String? value) {
    if (value == null || value.isEmpty) {
      return 'Credit card number is required.';
    }

    // Remove any spaces or hyphens
    final cleanedValue = value.replaceAll(RegExp(r'[\s-]'), '');

    // Check if it contains only digits
    if (!RegExp(r'^\d+$').hasMatch(cleanedValue)) {
      return 'Credit card number should contain only digits.';
    }

    // Check length (most credit cards are 13-19 digits)
    if (cleanedValue.length < 13 || cleanedValue.length > 19) {
      return 'Credit card number should be between 13 and 19 digits.';
    }

    return null;
  }

  static String? validateCVV(String? value) {
    if (value == null || value.isEmpty) {
      return 'CVV is required.';
    }

    // CVV is usually 3 or 4 digits
    if (!RegExp(r'^\d{3,4}$').hasMatch(value)) {
      return 'CVV should be 3 or 4 digits.';
    }

    return null;
  }

  static String? validateExpiryDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Expiry date is required.';
    }

    // Expected format: MM/YY or MM/YYYY
    if (!RegExp(r'^(0[1-9]|1[0-2])\/\d{2,4}$').hasMatch(value)) {
      return 'Invalid expiry date format (MM/YY).';
    }

    final parts = value.split('/');
    final month = int.parse(parts[0]);
    int year = int.parse(parts[1]);

    // If year is 2 digits, assume it's 20XX
    if (year < 100) {
      year += 2000;
    }

    final now = DateTime.now();
    final expiryDate = DateTime(year, month);

    if (expiryDate.isBefore(DateTime(now.year, now.month))) {
      return 'Card has expired.';
    }

    return null;
  }
}

/// Alias for backward compatibility
class TValidator extends TValidation {}
