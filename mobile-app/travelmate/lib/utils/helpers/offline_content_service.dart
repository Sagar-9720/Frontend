import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;

class OfflineContentService {
  static Future<String?> downloadContent(String sectionId, String token) async {
    try {
      final response = await http.get(
        Uri.parse(
          'https://sura.pyramidions.co/api/content/section-content?section_id=$sectionId',
        ),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode != 200) return null;

      final content = json.decode(response.body)['content'] as String;
      final updatedHtml = await _processHtml(content);
      final filePath = await _saveHtmlToFile(sectionId, updatedHtml);
      return filePath;
    } catch (e) {
      print("Download error: $e");
      return null;
    }
  }

  static Future<String> _saveHtmlToFile(String sectionId, String html) async {
    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/sura_section_$sectionId.html');
    await file.writeAsString(html);
    return file.path;
  }

  static Future<String> _processHtml(String html) async {
    final regExp = RegExp(r'src="images\\(.*?)"');
    final matches = regExp.allMatches(html);

    Directory imageDir = await getApplicationDocumentsDirectory();
    String updatedHtml = html;

    for (final match in matches) {
      final imageName = match.group(1);
      final assetPath = 'assets/offline/images/$imageName';
      final byteData = await rootBundle.load(assetPath);
      final imageFile = File('${imageDir.path}/$imageName');
      await imageFile.writeAsBytes(byteData.buffer.asUint8List());

      updatedHtml = updatedHtml.replaceAll(
        'src="images\\$imageName"',
        'src="file://${imageFile.path}"',
      );
    }

    return updatedHtml;
  }
}
