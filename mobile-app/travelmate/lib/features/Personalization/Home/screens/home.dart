import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/appbar.dart';
import 'package:travelmate/features/Personalization/Home/Controller/home_controller.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/image_strings.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(HomeController());

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            /// Header Section
            Container(
              color: TColors.primary,
              padding: const EdgeInsets.only(bottom: TSizes.spaceBtwSections),
              child: Column(
                children: [
                  /// AppBar
                  TAppBar(
                    title: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          TTexts.homeTitle,
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.apply(color: TColors.white),
                        ),
                        Text(
                          TTexts.homeSubtitle,
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.apply(color: TColors.white),
                        ),
                      ],
                    ),
                    actions: [
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(Icons.notifications_outlined,
                            color: TColors.white),
                      ),
                    ],
                    showBackArrow: false,
                  ),

                  /// Search Bar
                  Container(
                    margin: const EdgeInsets.symmetric(
                        horizontal: TSizes.defaultSpace),
                    padding: const EdgeInsets.all(TSizes.sm),
                    decoration: BoxDecoration(
                      color: TColors.white,
                      borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search, color: TColors.grey),
                        const SizedBox(width: TSizes.spaceBtwItems),
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Search destinations, trips...',
                              border: InputBorder.none,
                              hintStyle: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            /// Body
            Padding(
              padding: const EdgeInsets.all(TSizes.defaultSpace),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Travel Banner
                  Container(
                    width: double.infinity,
                    height: 180,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
                      image: const DecorationImage(
                        image: AssetImage(TImages.homeBanner),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius:
                            BorderRadius.circular(TSizes.cardRadiusLg),
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withOpacity(0.7),
                          ],
                        ),
                      ),
                      padding: const EdgeInsets.all(TSizes.defaultSpace),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Start Your Next Adventure',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.apply(color: TColors.white),
                          ),
                          const SizedBox(height: TSizes.xs),
                          Text(
                            'Discover new places and create memories',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.apply(color: TColors.white),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: TSizes.spaceBtwSections),

                  /// Popular Destinations Section
                  Text(
                    TTexts.popularDestinations,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: TSizes.spaceBtwItems),

                  SizedBox(
                    height: 200,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: 3,
                      separatorBuilder: (context, index) =>
                          const SizedBox(width: TSizes.spaceBtwItems),
                      itemBuilder: (context, index) {
                        final destinations = [
                          {
                            'name': 'Paris',
                            'image': TImages.popularDestination1
                          },
                          {
                            'name': 'Tokyo',
                            'image': TImages.popularDestination2
                          },
                          {
                            'name': 'Bali',
                            'image': TImages.popularDestination3
                          },
                        ];

                        return Container(
                          width: 150,
                          decoration: BoxDecoration(
                            borderRadius:
                                BorderRadius.circular(TSizes.cardRadiusLg),
                            image: DecorationImage(
                              image: AssetImage(destinations[index]['image']!),
                              fit: BoxFit.cover,
                            ),
                          ),
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius:
                                  BorderRadius.circular(TSizes.cardRadiusLg),
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Colors.black.withOpacity(0.7),
                                ],
                              ),
                            ),
                            padding: const EdgeInsets.all(TSizes.md),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  destinations[index]['name']!,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium
                                      ?.apply(color: TColors.white),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: TSizes.spaceBtwSections),

                  /// Recent Trips Section
                  Text(
                    TTexts.recentTrips,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: TSizes.spaceBtwItems),

                  Container(
                    padding: const EdgeInsets.all(TSizes.md),
                    decoration: BoxDecoration(
                      color: TColors.grey.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(TSizes.cardRadiusLg),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.flight_takeoff,
                          size: 48,
                          color: TColors.grey.withOpacity(0.5),
                        ),
                        const SizedBox(height: TSizes.spaceBtwItems),
                        Text(
                          'No trips yet',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: TSizes.xs),
                        Text(
                          'Start planning your first adventure',
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.apply(color: TColors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
