import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:travelmate/common/widgets/appbar.dart';
import 'package:travelmate/features/Personalization/Setting/Controller/settings_controller.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/constants/sizes.dart';
import 'package:travelmate/utils/constants/text_strings.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  final controller = Get.put(SettingsController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TAppBar(
        title: Text(TTexts.settings),
        showBackArrow: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(TSizes.defaultSpace),
          child: Column(
            children: [
              /// User Profile Section
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(TSizes.md),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 30,
                        backgroundColor: TColors.primary,
                        child: Text(
                          'U',
                          style:
                              Theme.of(context).textTheme.headlineSmall?.apply(
                                    color: TColors.white,
                                  ),
                        ),
                      ),
                      const SizedBox(width: TSizes.spaceBtwItems),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome User',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            Text(
                              'user@travelmate.com',
                              style:
                                  Theme.of(context).textTheme.bodyMedium?.apply(
                                        color: TColors.grey,
                                      ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: controller.editProfile,
                        icon: const Icon(Icons.edit),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: TSizes.spaceBtwSections),

              /// Account Settings
              _buildSettingsSection(
                context,
                'Account',
                [
                  _buildSettingsTile(
                    context,
                    Icons.person_outline,
                    'Profile Information',
                    'Update your personal details',
                    () => controller.editProfile(),
                  ),
                  _buildSettingsTile(
                    context,
                    Icons.lock_outline,
                    'Privacy & Security',
                    'Manage your privacy settings',
                    () => controller.openPrivacySettings(),
                  ),
                  _buildSettingsTile(
                    context,
                    Icons.notifications_outlined,
                    'Notifications',
                    'Configure notification preferences',
                    () => controller.openNotificationSettings(),
                  ),
                ],
              ),

              const SizedBox(height: TSizes.spaceBtwSections),

              /// App Settings
              _buildSettingsSection(
                context,
                'App',
                [
                  _buildSettingsTile(
                    context,
                    Icons.palette_outlined,
                    'Theme',
                    'Choose your preferred theme',
                    () => controller.changeTheme(),
                  ),
                  _buildSettingsTile(
                    context,
                    Icons.language_outlined,
                    'Language',
                    'Select your language',
                    () => controller.changeLanguage(),
                  ),
                  _buildSettingsTile(
                    context,
                    Icons.storage_outlined,
                    'Storage',
                    'Manage app storage',
                    () => controller.manageStorage(),
                  ),
                ],
              ),

              const SizedBox(height: TSizes.spaceBtwSections),

              /// Help & Support
              _buildSettingsSection(
                context,
                'Help & Support',
                [
                  _buildSettingsTile(
                    context,
                    Icons.help_outline,
                    'Help Center',
                    'Get help and support',
                    () => controller.openHelpCenter(),
                  ),
                  _buildSettingsTile(
                    context,
                    Icons.feedback_outlined,
                    'Send Feedback',
                    'Share your feedback with us',
                    () => controller.sendFeedback(),
                  ),
                  _buildSettingsTile(
                    context,
                    Icons.info_outline,
                    'About',
                    'App version and information',
                    () => controller.showAbout(),
                  ),
                ],
              ),

              const SizedBox(height: TSizes.spaceBtwSections),

              /// Logout Button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: controller.logout,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red),
                  ),
                  child: const Text('Logout'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSettingsSection(
      BuildContext context, String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.apply(
                fontWeightDelta: 2,
                color: TColors.primary,
              ),
        ),
        const SizedBox(height: TSizes.spaceBtwItems),
        Card(
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsTile(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Icon(icon, color: TColors.primary),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }
}
