import 'package:flutter/material.dart';

class TripCard extends StatelessWidget {
  final String destination;
  final DateTime startDate;
  final DateTime endDate;
  const TripCard({required this.destination, required this.startDate, required this.endDate});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(destination),
        subtitle: Text('From:
${startDate.toLocal()} To: ${endDate.toLocal()}'),
      ),
    );
  }
}

