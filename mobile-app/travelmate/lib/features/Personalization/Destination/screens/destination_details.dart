import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/appbar.dart';
import 'package:travelmate/features/Personalization/Destination/Controller/destinations_controller.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';

class DestinationDetailsScreen extends StatefulWidget {
  const DestinationDetailsScreen({super.key});

  @override
  State<DestinationDetailsScreen> createState() => _DestinationDetailsScreenState();
}

class _DestinationDetailsScreenState extends State<DestinationDetailsScreen> {
  final controller = Get.find<DestinationsController>();
  Map<String, dynamic>? destinationDetails;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDestinationDetails();
  }

  Future<void> _loadDestinationDetails() async {
    final arguments = Get.arguments as Map<String, dynamic>?;
    if (arguments != null && arguments['id'] != null) {
      final details = await controller.getDestinationById(arguments['id']);
      setState(() {
        destinationDetails = details;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (destinationDetails == null) {
      return Scaffold(
        appBar: TAppBar(
          title: const Text('Destination Details'),
          showBackArrow: true,
        ),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: Colors.grey),
              SizedBox(height: TSizes.spaceBtwItems),
              Text('Destination not found'),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          /// App Bar with Hero Image
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                destinationDetails!['name'] ?? '',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(offset: Offset(0, 1), blurRadius: 3, color: Colors.black54),
                  ],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          TColors.primary.withValues(alpha: 0.3),
                          TColors.primary.withValues(alpha: 0.7),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.location_on,
                        size: 100,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.7),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              /// Favorite Button
              Container(
                margin: const EdgeInsets.only(right: TSizes.md),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(25),
                ),
                child: IconButton(
                  icon: Icon(
                    destinationDetails!['isFavorite'] == true
                        ? Icons.favorite
                        : Icons.favorite_border,
                    color: destinationDetails!['isFavorite'] == true
                        ? Colors.red
                        : Colors.white,
                  ),
                  onPressed: () {
                    final destinationId = destinationDetails!['id']?.toString() ?? '';
                    if (destinationDetails!['isFavorite'] == true) {
                      controller.removeFromFavorites(destinationId);
                    } else {
                      controller.addToFavorites(destinationId);
                    }
                    setState(() {
                      destinationDetails!['isFavorite'] = !(destinationDetails!['isFavorite'] ?? false);
                    });
                  },
                ),
              ),
            ],
          ),

          /// Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(TSizes.defaultSpace),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Basic Info Card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(TSizes.defaultSpace),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          /// Location and Rating
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      destinationDetails!['country'] ?? '',
                                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                        color: TColors.primary,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    if (destinationDetails!['region'] != null)
                                      Text(
                                        destinationDetails!['region'] ?? '',
                                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                          color: Colors.grey,
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                              /// Rating
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.orange.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.star, color: Colors.orange, size: 16),
                                    const SizedBox(width: 4),
                                    Text(
                                      destinationDetails!['rating']?.toString() ?? '4.5',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Colors.orange,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: TSizes.spaceBtwItems),

                          /// Category and Price
                          Row(
                            children: [
                              if (destinationDetails!['category'] != null)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: TColors.primary.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    destinationDetails!['category'] ?? '',
                                    style: TextStyle(
                                      color: TColors.primary,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              const Spacer(),
                              if (destinationDetails!['price'] != null)
                                Text(
                                  '\$${destinationDetails!['price']}',
                                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                    color: TColors.primary,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: TSizes.spaceBtwSections),

                  /// Description
                  if (destinationDetails!['description'] != null) ...[
                    Text(
                      'About',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: TSizes.spaceBtwItems),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(TSizes.defaultSpace),
                        child: Text(
                          destinationDetails!['description'] ?? '',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            height: 1.5,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: TSizes.spaceBtwSections),
                  ],

                  /// Best Time to Visit
                  if (destinationDetails!['bestTimeToVisit'] != null) ...[
                    Text(
                      'Best Time to Visit',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: TSizes.spaceBtwItems),
                    Card(
                      child: ListTile(
                        leading: const Icon(Icons.calendar_month, color: TColors.primary),
                        title: Text(destinationDetails!['bestTimeToVisit'] ?? ''),
                        subtitle: const Text('Optimal weather and conditions'),
                      ),
                    ),
                    const SizedBox(height: TSizes.spaceBtwSections),
                  ],

                  /// Coordinates (if available)
                  if (destinationDetails!['coordinates'] != null) ...[
                    Text(
                      'Location',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: TSizes.spaceBtwItems),
                    Card(
                      child: ListTile(
                        leading: const Icon(Icons.place, color: TColors.primary),
                        title: Text(
                          'Lat: ${destinationDetails!['coordinates']['lat']}, '
                          'Lng: ${destinationDetails!['coordinates']['lng']}'
                        ),
                        subtitle: const Text('Geographic coordinates'),
                        trailing: IconButton(
                          icon: const Icon(Icons.map),
                          onPressed: () {
                            // TODO: Open map with coordinates
                            Get.snackbar(
                              'Map',
                              'Map feature coming soon',
                              snackPosition: SnackPosition.BOTTOM,
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: TSizes.spaceBtwSections),
                  ],

                  /// Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            // TODO: Book trip functionality
                            Get.snackbar(
                              'Booking',
                              'Booking feature coming soon',
                              snackPosition: SnackPosition.BOTTOM,
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: TColors.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                            ),
                          ),
                          icon: const Icon(Icons.flight_takeoff),
                          label: const Text('Book Trip'),
                        ),
                      ),
                      const SizedBox(width: TSizes.spaceBtwItems),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            // TODO: Add to wishlist functionality
                            Get.snackbar(
                              'Wishlist',
                              'Added to your travel wishlist',
                              snackPosition: SnackPosition.BOTTOM,
                            );
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: TColors.primary),
                            foregroundColor: TColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                            ),
                          ),
                          icon: const Icon(Icons.bookmark_add),
                          label: const Text('Save'),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: TSizes.spaceBtwSections * 2),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
