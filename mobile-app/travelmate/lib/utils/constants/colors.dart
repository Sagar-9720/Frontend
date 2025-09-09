import 'package:flutter/material.dart';

class TColors {
  TColors._();

  // App Basic Colors
  static const Color primary = Color(0xFF4b68ff);
  static const Color primaryColor = Color(0xFF4b68ff);
  static const Color secondaryColor = Color(0xFFE5BE4D);
  static const Color accent = Color(0xFF5385EC);

  // Gradient Colors
  static const Gradient linearGradient = LinearGradient(
    begin: Alignment(0.0, 0.0),
    end: Alignment(0.707, -0.707),
    colors: [Color(0xffff9a9e), Color(0xfffad0c4), Color(0xfffad0c4)],
  );

  // Text Colors
  static const Color textPrimary = Color(0xFF333333);
  static const Color textSecondary = Color(0xFF6C6C6C);
  static const Color textWhite = Colors.white;

  // Background Colors
  static const Color light = Color(0xFFF6F6F6);
  static const Color dark = Color(0xFF272727);
  static const Color primaryBackground = Color(0xFFF3F5FF);

  // Background Container Colors
  static const Color lightContainer = Color(0xFFFFFFFF);
  static const Color darkContainer = Color(0xFF000000);

  // Default Button Color
  static const Color buttonColor = Color(0xFF1976D2);

  // Standard Colors
  static const Color red = Color(0xFFE57373);
  static const Color green = Color(0xFF81C784);
  static const Color blue = Color(0xFF64B5F6);
  static const Color yellow = Color(0xFFFFD54F);
  static const Color orange = Color(0xFFFFB74D);
  static const Color purple = Color(0xFFBA68C8);
  static const Color pink = Color(0xFFE57373);
  static const Color grey = Color(0xFFBDBDBD);
  static const Color black = Color(0xFF000000);
  static const Color white = Color(0xFFFFFFFF);
  static const Color transparent = Color(0x00000000);
  static const Color lightGrey = Color(0xFFE0E0E0);
  static const Color darkGrey = Color(0xFF9E9E9E);
  static const Color lightBlue = Color(0xFFE3F2FD);
  static const Color darkBlue = Color(0xFF1976D2);
  static const Color lightGreen = Color(0xFFE8F5E9);
  static const Color darkGreen = Color(0xFF388E3C);
}
