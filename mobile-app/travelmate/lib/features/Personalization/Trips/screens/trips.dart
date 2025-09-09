import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/appbar.dart';
import 'package:travelmate/features/Personalization/Trips/Controller/trips_controller.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class TripsScreen extends StatelessWidget {
  const TripsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(TripsController());

    return Scaffold(
      appBar: TAppBar(
        title: const Text(TTexts.trips),
        showBackArrow: false,
        actions: [
          IconButton(
            onPressed: controller.createNewTrip,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(TSizes.defaultSpace),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Trip Status Filters
            SizedBox(
              height: 50,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: controller.tripStatuses.length,
                separatorBuilder: (context, index) => const SizedBox(width: TSizes.spaceBtwItems),
                itemBuilder: (context, index) {
                  return Obx(() => FilterChip(
                    label: Text(controller.tripStatuses[index]),
                    selected: controller.selectedStatus.value == controller.tripStatuses[index],
                    onSelected: (selected) => controller.selectStatus(controller.tripStatuses[index]),
                  ));
                },
              ),
            ),

            const SizedBox(height: TSizes.spaceBtwSections),

            /// Trips List
            Expanded(
              child: Obx(() => controller.isLoading.value
                ? const Center(child: CircularProgressIndicator())
                : controller.filteredTrips.isEmpty
                  ? _buildEmptyState(context)
                  : ListView.separated(
                      itemCount: controller.filteredTrips.length,
                      separatorBuilder: (context, index) => const SizedBox(height: TSizes.spaceBtwItems),
                      itemBuilder: (context, index) {
                        final trip = controller.filteredTrips[index];
                        return _buildTripCard(context, trip);
                      },
                    ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.createNewTrip,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.flight_takeoff,
            size: 64,
            color: TColors.grey.withOpacity(0.5),
          ),
          const SizedBox(height: TSizes.spaceBtwItems),
          Text(
            'No trips yet',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: TSizes.spaceBtwItems),
          Text(
            'Start planning your first adventure!',
            style: Theme.of(context).textTheme.bodyMedium?.apply(color: TColors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: TSizes.spaceBtwSections),
          ElevatedButton(
            onPressed: () => Get.find<TripsController>().createNewTrip(),
            child: const Text('Plan New Trip'),
          ),
        ],
      ),
    );
  }

  Widget _buildTripCard(BuildContext context, Map<String, dynamic> trip) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
      ),
      child: Padding(
        padding: const EdgeInsets.all(TSizes.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    trip['title'] ?? 'Untitled Trip',
                    style: Theme.of(context).textTheme.titleLarge,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: TSizes.sm,
                    vertical: TSizes.xs,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(trip['status']),
                    borderRadius: BorderRadius.circular(TSizes.borderRadiusSm),
                  ),
                  child: Text(
                    trip['status'] ?? 'Planning',
                    style: Theme.of(context).textTheme.bodySmall?.apply(
                      color: TColors.white,
                      fontWeightDelta: 2,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: TSizes.spaceBtwItems),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: TColors.grey),
                const SizedBox(width: TSizes.xs),
                Text(
                  trip['destination'] ?? 'Unknown',
                  style: Theme.of(context).textTheme.bodyMedium?.apply(color: TColors.grey),
                ),
              ],
            ),
            const SizedBox(height: TSizes.xs),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: TColors.grey),
                const SizedBox(width: TSizes.xs),
                Text(
                  trip['dates'] ?? 'TBD',
                  style: Theme.of(context).textTheme.bodyMedium?.apply(color: TColors.grey),
                ),
              ],
            ),
            const SizedBox(height: TSizes.spaceBtwItems),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Get.find<TripsController>().editTrip(trip),
                  child: const Text('Edit'),
                ),
                const SizedBox(width: TSizes.spaceBtwItems),
                ElevatedButton(
                  onPressed: () => Get.find<TripsController>().viewTripDetails(trip),
                  child: const Text('View Details'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return Colors.green;
      case 'ongoing':
        return Colors.blue;
      case 'planning':
      default:
        return Colors.orange;
    }
  }
}
