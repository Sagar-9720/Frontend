# TravelMate Mobile App

This directory contains the Flutter mobile app for TravelMate.

## Overview

A cross-platform mobile app for discovering destinations, managing trips, and travel journaling.

## Structure

- `lib/`: Main Flutter/Dart source code
- `android/`, `ios/`, `web/`: Platform-specific code
- `assets/`: Images and other assets
- `pubspec.yaml`: Project configuration

## Next Steps

- Add more features (booking, notifications)
- Improve UI/UX and performance

---

### Project Summary

This app allows users to explore destinations, book trips, and maintain travel journals on mobile devices. Built with Flutter for Android, iOS, and web support.

## Getting Started

# TravelMate Mobile App

A comprehensive Flutter mobile application for travel planning and management.

## 🏗️ Project Structure

```
lib/
├── app.dart                 # Main app configuration with themes and routing
├── main.dart               # App entry point
├── models/                 # Data models and DTOs
│   ├── models.dart        # Barrel file for all models
│   ├── auth.dart          # Authentication models
│   ├── user.dart          # User models
│   ├── trip.dart          # Trip and booking models
│   ├── interaction.dart   # Reviews, comments, likes
│   └── common.dart        # Common models (API responses, pagination)
├── services/              # API service layer
│   ├── services.dart      # Barrel file for all services
│   ├── auth_service.dart  # Authentication API calls
│   ├── trip_service.dart  # Trip management API calls
│   └── user_service.dart  # User interaction API calls
├── providers/             # State management with Provider pattern
│   ├── providers.dart     # Barrel file for all providers
│   ├── auth_provider.dart # Authentication state management
│   ├── trip_provider.dart # Trip state management
│   └── user_provider.dart # User state management
├── utils/                 # Utility classes and helpers
│   ├── utils.dart         # Barrel file for all utilities
│   ├── config.dart        # Environment configuration
│   ├── storage.dart       # Secure storage wrapper
│   ├── logger.dart        # Logging utility
│   ├── http_client.dart   # HTTP client with caching
│   └── helpers.dart       # Helper functions
├── screens/               # UI screens
│   ├── screens.dart       # Barrel file for all screens
│   ├── auth/              # Authentication screens
│   │   ├── splash_screen.dart
│   │   ├── login_screen.dart
│   │   ├── register_screen.dart
│   │   └── forgot_password_screen.dart
│   ├── home/              # Home screen with tabs
│   │   └── home_screen.dart
│   ├── profile/           # User profile screens
│   │   └── profile_screen.dart
│   ├── trips/             # Trip-related screens
│   │   ├── trip_details_screen.dart
│   │   └── saved_trips_screen.dart
│   ├── bookings/          # Booking management screens
│   │   └── bookings_screen.dart
│   ├── reviews/           # Review management screens
│   │   └── reviews_screen.dart
│   └── search/            # Search functionality screens
│       └── search_screen.dart
└── widgets/               # Reusable UI components
    ├── widgets.dart       # Barrel file for all widgets
    ├── common/            # Common UI widgets
    ├── trip/              # Trip-specific widgets
    └── forms/             # Form-related widgets
```

## 🚀 Features

### Authentication
- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Secure token storage
- ✅ Auto token refresh
- ✅ OAuth integration support
- ✅ Password reset functionality
- ✅ Email verification

### Trip Management
- ✅ Browse and search trips
- ✅ Filter trips by category, price, rating
- ✅ Pagination support for large datasets
- ✅ Trip details with images and descriptions
- ✅ Save/unsave trips for later
- ✅ Trip booking functionality

### User Features
- ✅ User profile management
- ✅ Booking history and management
- ✅ Review and rating system
- ✅ Like/unlike trips
- ✅ Comment system
- ✅ Profile image upload

### Technical Features
- ✅ Offline support with local caching
- ✅ Real-time error handling and logging
- ✅ Responsive UI with Material Design 3
- ✅ Dark/Light theme support
- ✅ Comprehensive state management
- ✅ Type-safe API integration
- ✅ Secure data storage

## 🛠️ Technology Stack

- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: Provider pattern
- **HTTP Client**: Dio with custom caching
- **Local Storage**: Flutter Secure Storage
- **Logging**: Custom logger with multiple levels
- **Architecture**: Clean Architecture with separation of concerns

## 📱 State Management

The app uses the Provider pattern for state management with three main providers:

### AuthProvider
- Manages user authentication state
- Handles login, logout, registration
- Token management and refresh
- User profile updates

### TripProvider
- Manages trip-related state
- Trip listing with pagination
- Search and filtering functionality
- Trip details and interactions

### UserProvider
- Manages user-specific data
- Booking management
- Saved trips
- Reviews and interactions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=https://api.travelmate.com
API_TIMEOUT=30000

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id

# App Configuration
APP_NAME=TravelMate
APP_VERSION=1.0.0
DEBUG_MODE=true
LOG_LEVEL=debug

# Feature Flags
ENABLE_SOCIAL_LOGIN=true
ENABLE_OFFLINE_MODE=true
ENABLE_PUSH_NOTIFICATIONS=true
```

### API Endpoints
The app connects to the following backend services:
- Authentication Service: `/auth`
- Trip Service: `/trips`
- User Service: `/user`

## 🔐 Security Features

- **Secure Storage**: All sensitive data is stored using Flutter Secure Storage
- **Token Management**: JWT tokens with automatic refresh
- **API Security**: Request/response interceptors for authentication
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error messages without exposing sensitive data

## 📦 Dependencies

### Core Dependencies
- `flutter`: SDK
- `provider`: State management
- `dio`: HTTP client
- `flutter_secure_storage`: Secure storage
- `shared_preferences`: Local preferences

### UI Dependencies
- `cupertino_icons`: iOS-style icons
- `iconsax`: Modern icon set
- `google_fonts`: Custom fonts

### Utility Dependencies
- `flutter_dotenv`: Environment variables
- `device_info_plus`: Device information
- `package_info_plus`: App package information
- `connectivity_plus`: Network connectivity
- `path_provider`: File system paths

## 🚦 Getting Started

### Prerequisites
- Flutter SDK (3.x or higher)
- Dart SDK (3.x or higher)
- Android Studio / Xcode for device testing
- Backend API running (see Backend folder)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Frontend/mobile-app/travelmate
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the app**:
   ```bash
   flutter run
   ```

### Development Commands

```bash
# Run app in debug mode
flutter run

# Run app in release mode
flutter run --release

# Run tests
flutter test

# Generate code coverage
flutter test --coverage

# Build APK
flutter build apk

# Build iOS
flutter build ios

# Analyze code
flutter analyze

# Format code
dart format .
```

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/providers/auth_provider_test.dart

# Run tests with coverage
flutter test --coverage
```

## 📱 App Screens

### Authentication Flow
1. **Splash Screen**: App initialization and auth check
2. **Login Screen**: User authentication
3. **Register Screen**: New user registration
4. **Forgot Password**: Password reset functionality

### Main App Flow
1. **Home Screen**: Trip browsing with tabs
2. **Trip Details**: Detailed trip information
3. **Profile Screen**: User profile management
4. **Bookings Screen**: Booking history and management
5. **Search Screen**: Advanced trip search
6. **Reviews Screen**: User review management

## 🔄 Data Flow

```
UI Layer (Screens) 
    ↓
State Management (Providers)
    ↓
Service Layer (API Services)
    ↓
Models (Data Transfer Objects)
    ↓
Backend API
```

## 🎨 UI/UX Features

- **Material Design 3**: Modern, consistent design language
- **Responsive Layout**: Adapts to different screen sizes
- **Dark/Light Theme**: System-based theme switching
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: Screen reader and keyboard navigation support
- **Offline Indicators**: Clear feedback for network status

## 🔧 Customization

### Adding New Screens
1. Create screen file in appropriate folder under `screens/`
2. Add route to `AppRoutes` in `app.dart`
3. Update router in `AppRouter.generateRoute()`
4. Export screen in `screens/screens.dart`

### Adding New Models
1. Create model file in `models/` folder
2. Include proper JSON serialization
3. Export model in `models/models.dart`

### Adding New Services
1. Create service file in `services/` folder
2. Implement API endpoints
3. Add error handling
4. Export service in `services/services.dart`

## 📈 Performance Optimizations

- **Lazy Loading**: Screens and data loaded on demand
- **Image Caching**: Efficient image loading and caching
- **Pagination**: Large datasets loaded in chunks
- **State Optimization**: Minimal rebuilds with Provider
- **Bundle Optimization**: Tree shaking for smaller app size

## 🐛 Debugging

### Logging
The app includes comprehensive logging:
- **Debug**: Development information
- **Info**: General information
- **Warning**: Potential issues
- **Error**: Error conditions
- **User Actions**: User interaction tracking

### Error Handling
- Global error boundary for uncaught exceptions
- Specific error handling for API calls
- User-friendly error messages
- Retry mechanisms for failed operations

## 🚀 Deployment

### Android
```bash
# Build signed APK
flutter build apk --release

# Build App Bundle for Play Store
flutter build appbundle --release
```

### iOS
```bash
# Build for iOS
flutter build ios --release

# Archive for App Store
# Use Xcode to archive and upload
```

## 📚 Additional Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Provider Documentation](https://pub.dev/packages/provider)
- [Material Design 3](https://m3.material.io/)
- [Flutter Best Practices](https://docs.flutter.dev/development/data-and-backend/state-mgmt/intro)

## 🤝 Contributing

1. Follow Flutter/Dart style guidelines
2. Add tests for new features
3. Update documentation
4. Use conventional commit messages
5. Ensure all lint checks pass

## 📄 License

This project is part of the TravelMate application suite.
