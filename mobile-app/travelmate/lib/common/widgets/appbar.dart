import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:travelmate/features/Navigation/navigation_utils.dart';
import 'package:travelmate/utils/constants/colors.dart';
import 'package:travelmate/utils/device/device_utility.dart';

class TAppBar extends StatelessWidget implements PreferredSizeWidget {
  const TAppBar({
    super.key,
    this.title,
    this.actions,
    this.leadingIcon,
    this.leadingOnPressed,
    required this.showBackArrow,
    this.backgroundColor = TColors.darkContainer,
    this.titleColor = TColors.white,
  });

  final Widget? title;
  final bool showBackArrow;
  final IconData? leadingIcon;
  final List<Widget>? actions;
  final VoidCallback? leadingOnPressed;
  final Color? backgroundColor;
  final Color titleColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 200,
      height: 102,
      child: AppBar(
        automaticallyImplyLeading: false,
        leading: showBackArrow
            ? null // Leading is handled in the title row
            : leadingIcon != null
                ? IconButton(
                    onPressed: leadingOnPressed,
                    icon: Icon(leadingIcon, color: Colors.white),
                  )
                : null,
        title: Row(
          children: [
            if (showBackArrow)
              IconButton(
                onPressed: () => NavigationUtils.goBack(),
                icon: const Icon(Iconsax.arrow_left, color: Colors.white),
              ),
            DefaultTextStyle(
              style: TextStyle(
                color: titleColor,
                fontWeight: FontWeight.w600,
                fontSize: 20,
                height: 1.0,
                letterSpacing: -0.17,
              ),
              textAlign: TextAlign.center,
              child: title ?? Container(),
            ),
            const Spacer(),
            if (actions != null) ...actions!,
          ],
        ),
        backgroundColor: backgroundColor,
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(TDeviceUtils.getAppBarHeight());
}
