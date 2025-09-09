import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/appbar.dart';
import 'package:travelmate/features/Personalization/Journal/Controller/travel_journal_controller.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class TravelJournalScreen extends StatelessWidget {
  const TravelJournalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(TravelJournalController());

    return Scaffold(
      appBar: TAppBar(
        title: const Text(TTexts.travelJournal),
        showBackArrow: false,
        actions: [
          IconButton(
            onPressed: controller.createNewEntry,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(TSizes.defaultSpace),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Search Bar
            TextField(
              decoration: InputDecoration(
                hintText: 'Search journal entries...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: TColors.light,
              ),
              onChanged: controller.searchEntries,
            ),

            const SizedBox(height: TSizes.spaceBtwSections),

            /// Journal Entries
            Expanded(
              child: Obx(() => controller.isLoading.value
                ? const Center(child: CircularProgressIndicator())
                : controller.filteredEntries.isEmpty
                  ? _buildEmptyState(context)
                  : ListView.separated(
                      itemCount: controller.filteredEntries.length,
                      separatorBuilder: (context, index) => const SizedBox(height: TSizes.spaceBtwItems),
                      itemBuilder: (context, index) {
                        final entry = controller.filteredEntries[index];
                        return _buildJournalCard(context, entry);
                      },
                    ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.createNewEntry,
        child: const Icon(Icons.edit),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.book,
            size: 64,
            color: TColors.grey.withOpacity(0.5),
          ),
          const SizedBox(height: TSizes.spaceBtwItems),
          Text(
            'No journal entries yet',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: TSizes.spaceBtwItems),
          Text(
            'Start documenting your travel memories!',
            style: Theme.of(context).textTheme.bodyMedium?.apply(color: TColors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: TSizes.spaceBtwSections),
          ElevatedButton(
            onPressed: () => Get.find<TravelJournalController>().createNewEntry(),
            child: const Text('Create First Entry'),
          ),
        ],
      ),
    );
  }

  Widget _buildJournalCard(BuildContext context, Map<String, dynamic> entry) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
      ),
      child: InkWell(
        onTap: () => Get.find<TravelJournalController>().viewEntry(entry),
        borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
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
                      entry['title'] ?? 'Untitled Entry',
                      style: Theme.of(context).textTheme.titleLarge,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  PopupMenuButton<String>(
                    onSelected: (value) {
                      if (value == 'edit') {
                        Get.find<TravelJournalController>().editEntry(entry);
                      } else if (value == 'delete') {
                        Get.find<TravelJournalController>().deleteEntry(entry['id']);
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'edit',
                        child: Text('Edit'),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Text('Delete'),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: TSizes.spaceBtwItems),

              Row(
                children: [
                  const Icon(Icons.location_on, size: 16, color: TColors.grey),
                  const SizedBox(width: TSizes.xs),
                  Text(
                    entry['location'] ?? 'Unknown Location',
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
                    entry['date'] ?? 'No Date',
                    style: Theme.of(context).textTheme.bodyMedium?.apply(color: TColors.grey),
                  ),
                ],
              ),

              if (entry['content'] != null) ...[
                const SizedBox(height: TSizes.spaceBtwItems),
                Text(
                  entry['content'],
                  style: Theme.of(context).textTheme.bodyMedium,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],

              const SizedBox(height: TSizes.spaceBtwItems),

              Row(
                children: [
                  if (entry['photos'] != null && entry['photos'].isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: TSizes.sm,
                        vertical: TSizes.xs,
                      ),
                      decoration: BoxDecoration(
                        color: TColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(TSizes.borderRadiusSm),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.photo, size: 16, color: TColors.primary),
                          const SizedBox(width: TSizes.xs),
                          Text(
                            '${entry['photos'].length} photos',
                            style: Theme.of(context).textTheme.bodySmall?.apply(
                              color: TColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  const Spacer(),
                  Text(
                    'Tap to read more',
                    style: Theme.of(context).textTheme.bodySmall?.apply(
                      color: TColors.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
