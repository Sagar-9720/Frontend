import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/appbar_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/bottom_sheet_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/checkbox_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/outlined_button_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/text_field_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/text_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/elevated_button_theme.dart';
import 'package:sura_guide_app/utils/theme/custom_themes/chip_theme.dart';

class SuraAppTheme {
  SuraAppTheme._();

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    // fontFamily: 'OpenSans',
    textTheme: GoogleFonts.openSansTextTheme(SuraTextTheme.lightTextTheme),
    brightness: Brightness.light,
    primaryColor: Colors.blue,
    scaffoldBackgroundColor: Colors.white,
    // textTheme: SuraTextTheme.lightTextTheme,
    elevatedButtonTheme: SuraElevatedButtonTheme.lightElevatedButtonThemeData,
    chipTheme: SuraChipTheme.lightChipTheme,
    appBarTheme: SuraAppBarTheme.lightAppBarTheme,
    checkboxTheme: SuraCheckBoxTheme.lightCheckBoxTheme,
    bottomSheetTheme: SuraBottomSheetTheme.lightBottomSheetTheme,
    outlinedButtonTheme: SuraOutlinedButtonTheme.lightOutlinedButtonTheme,
    inputDecorationTheme: SuraTextFormFieldTheme.lightInputDecorationTheme,
  );
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    // fontFamily: 'OpenSans',
    textTheme: GoogleFonts.openSansTextTheme(SuraTextTheme.darkTextTheme),
    brightness: Brightness.dark,
    primaryColor: Colors.blue,
    scaffoldBackgroundColor: Colors.black,
    // textTheme: SuraTextTheme.darkTextTheme,
    elevatedButtonTheme: SuraElevatedButtonTheme.lightElevatedButtonThemeData,
    chipTheme: SuraChipTheme.darkChipTheme,
    appBarTheme: SuraAppBarTheme.darkAppBarTheme,
    checkboxTheme: SuraCheckBoxTheme.darkCheckBoxTheme,
    bottomSheetTheme: SuraBottomSheetTheme.darkBottomSheetTheme,
    outlinedButtonTheme: SuraOutlinedButtonTheme.darkOutlinedButtonTheme,
    inputDecorationTheme: SuraTextFormFieldTheme.darkInputDecorationTheme,
  );
}
