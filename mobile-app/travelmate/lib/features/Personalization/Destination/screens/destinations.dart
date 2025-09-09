import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/appbar.dart';
import 'package:travelmate/features/Personalization/Destination/Controller/destinations_controller.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class DestinationsScreen extends StatelessWidget {
  const DestinationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(DestinationsController());

    return Scaffold(
      appBar: const TAppBar(
        title: Text(TTexts.destinations),
        showBackArrow: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(TSizes.defaultSpace),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Search Bar with Suggestions
            Stack(
              children: [
                TextField(
                  controller: controller.searchController,
                  decoration: InputDecoration(
                    hintText: 'Search destinations...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: Obx(() => controller.searchQuery.value.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              controller.searchController.clear();
                              controller.searchQuery.value = '';
                              controller.showSuggestions.value = false;
                              controller.getAllDestinations(refresh: true);
                            },
                          )
                        : const SizedBox.shrink()),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                  ),
                  onChanged: (query) {
                    controller.searchQuery.value = query;
                    if (query.isNotEmpty) {
                      controller.suggestDestinations(query);
                    } else {
                      controller.showSuggestions.value = false;
                    }
                  },
                  onSubmitted: (query) {
                    controller.showSuggestions.value = false;
                    controller.searchDestinationsByName(query);
                  },
                ),

                /// Search Suggestions Dropdown
                Obx(() => controller.showSuggestions.value && controller.searchSuggestions.isNotEmpty
                    ? Positioned(
                        top: 60,
                        left: 0,
                        right: 0,
                        child: Material(
                          elevation: 4,
                          borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                          child: Container(
                            constraints: const BoxConstraints(maxHeight: 200),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: ListView.builder(
                              shrinkWrap: true,
                              itemCount: controller.searchSuggestions.length,
                              itemBuilder: (context, index) {
                                final suggestion = controller.searchSuggestions[index];
                                return ListTile(
                                  leading: const Icon(Icons.location_on, color: TColors.primary),
                                  title: Text(suggestion['name'] ?? ''),
                                  subtitle: Text(suggestion['country'] ?? ''),
                                  onTap: () => controller.onSuggestionSelected(suggestion),
                                );
                              },
                            ),
                          ),
                        ),
                      )
                    : const SizedBox.shrink()),
              ],
            ),

            const SizedBox(height: TSizes.spaceBtwSections),

            /// Filters Row
            Row(
              children: [
                /// Country Filter
                Expanded(
                  child: Obx(() => DropdownButtonFormField<String>(
                    value: controller.selectedCountry.value,
                    decoration: InputDecoration(
                      labelText: 'Country',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: TSizes.md, vertical: TSizes.sm),
                    ),
                    items: controller.allCountries.map((country) {
                      return DropdownMenuItem<String>(
                        value: country['name'],
                        child: Text(country['name'] ?? ''),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        controller.selectCountry(value);
                      }
                    },
                  )),
                ),

                const SizedBox(width: TSizes.spaceBtwItems),

                /// Region Filter
                Expanded(
                  child: Obx(() => DropdownButtonFormField<String>(
                    value: controller.selectedRegion.value,
                    decoration: InputDecoration(
                      labelText: 'Region',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(TSizes.inputFieldRadius),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: TSizes.md, vertical: TSizes.sm),
                    ),
                    items: controller.allRegions.map((region) {
                      return DropdownMenuItem<String>(
                        value: region['name'],
                        child: Text(region['name'] ?? ''),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        controller.selectRegion(value);
                      }
                    },
                  )),
                ),
              ],
            ),

            const SizedBox(height: TSizes.spaceBtwSections),

            /// Clear Filters Button
            Obx(() => (controller.selectedCategory.value != 'All' ||
                       controller.selectedCountry.value != 'All' ||
                       controller.selectedRegion.value != 'All' ||
                       controller.searchQuery.value.isNotEmpty)
                ? TextButton.icon(
                    onPressed: controller.clearFilters,
                    icon: const Icon(Icons.clear_all),
                    label: const Text('Clear Filters'),
                    style: TextButton.styleFrom(
                      foregroundColor: TColors.primary,
                    ),
                  )
                : const SizedBox.shrink()),

            /// Categories
            Text(
              'Categories',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: TSizes.spaceBtwItems),

            SizedBox(
              height: 50,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: controller.categories.length,
                separatorBuilder: (context, index) => const SizedBox(width: TSizes.spaceBtwItems),
                itemBuilder: (context, index) {
                  return Obx(() => FilterChip(
                    label: Text(controller.categories[index]),
                    selected: controller.selectedCategory.value == controller.categories[index],
                    onSelected: (selected) => controller.selectCategory(controller.categories[index]),
                    selectedColor: TColors.primary.withValues(alpha: 0.2),
                    checkmarkColor: TColors.primary,
                  ));
                },
              ),
            ),

            const SizedBox(height: TSizes.spaceBtwSections),

            /// Results Header
            Obx(() => Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  controller.searchQuery.value.isNotEmpty
                      ? 'Search Results (${controller.filteredDestinations.length})'
                      : 'Popular Destinations (${controller.filteredDestinations.length})',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                IconButton(
                  onPressed: controller.refreshData,
                  icon: const Icon(Icons.refresh),
                  tooltip: 'Refresh',
                ),
              ],
            )),
            const SizedBox(height: TSizes.spaceBtwItems),

            /// Destinations Grid with Pagination
            Expanded(
              child: Obx(() => controller.isLoading.value && controller.filteredDestinations.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : controller.filteredDestinations.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.location_off,
                            size: 64,
                            color: Colors.grey.withValues(alpha: 0.5),
                          ),
                          const SizedBox(height: TSizes.spaceBtwItems),
                          Text(
                            'No destinations found',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: TSizes.sm),
                          Text(
                            'Try adjusting your search or filters',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: controller.refreshData,
                      child: NotificationListener<ScrollNotification>(
                        onNotification: (ScrollNotification scrollInfo) {
                          if (scrollInfo is ScrollEndNotification &&
                              scrollInfo.metrics.extentAfter < 200 &&
                              controller.hasMoreData.value &&
                              !controller.isLoadingMore.value) {
                            controller.loadMoreDestinations();
                          }
                          return false;
                        },
                        child: GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.8,
                            crossAxisSpacing: TSizes.spaceBtwItems,
                            mainAxisSpacing: TSizes.spaceBtwItems,
                          ),
                          itemCount: controller.filteredDestinations.length +
                                    (controller.isLoadingMore.value ? 2 : 0),
                          itemBuilder: (context, index) {
                            if (index >= controller.filteredDestinations.length) {
                              return const Card(
                                child: Center(child: CircularProgressIndicator()),
                              );
                            }

                            final destination = controller.filteredDestinations[index];
                            return _buildDestinationCard(context, destination, controller);
                          },
                        ),
                      ),
                    )),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDestinationCard(BuildContext context, Map<String, dynamic> destination, DestinationsController controller) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
      ),
      child: InkWell(
        onTap: () => controller.navigateToDestination(
          destination['id']?.toString() ?? '',
          destination['name']?.toString() ?? '',
        ),
        borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Image Container
            Expanded(
              flex: 3,
              child: Stack(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(TSizes.cardRadiusLg),
                      ),
                      gradient: LinearGradient(
                        colors: [
                          TColors.primary.withValues(alpha: 0.1),
                          TColors.primary.withValues(alpha: 0.3),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.location_on,
                        size: 48,
                        color: TColors.primary,
                      ),
                    ),
                  ),

                  /// Favorite Button
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: IconButton(
                        icon: Icon(
                          destination['isFavorite'] == true
                              ? Icons.favorite
                              : Icons.favorite_border,
                          color: destination['isFavorite'] == true
                              ? Colors.red
                              : Colors.grey,
                          size: 20,
                        ),
                        onPressed: () {
                          if (destination['isFavorite'] == true) {
                            controller.removeFromFavorites(destination['id']?.toString() ?? '');
                          } else {
                            controller.addToFavorites(destination['id']?.toString() ?? '');
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),

            /// Destination Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(TSizes.sm),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      destination['name'] ?? '',
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      destination['country'] ?? '',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 2),
                        Text(
                          destination['rating']?.toString() ?? '-',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
