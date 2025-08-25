# Admin Panel Backend Integration

This document outlines the integration between the admin panel frontend and the backend microservices.

## Backend Services

### 1. Auth Service (http://localhost/auth/api/auth)
Handles authentication, user management, and role management.

#### Endpoints:
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /validate` - Validate token
- `POST /refresh` - Refresh token
- `PUT /update-user` - Update user profile
- `PUT /change-password` - Change password
- `GET /verify-email` - Verify email
- `POST /resend-verification` - Resend verification email
- `POST /initiate-password-reset` - Initiate password reset
- `POST /reset-password` - Reset password

#### Admin Endpoints (hypothetical - may need implementation):
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user by ID
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/roles` - Update user roles
- `GET /admin/roles` - Get all roles
- `POST /admin/roles` - Create role
- `PUT /admin/roles/:id` - Update role
- `DELETE /admin/roles/:id` - Delete role

### 2. Trip Service (http://localhost/trip/api/trip)
Handles trips, destinations, itineraries, regions, countries, tags, and travel journals.

#### Endpoints:
- **Destinations**: `/destinations` (GET, POST, PUT, DELETE)
- **Trips**: `/trips` (GET, POST, PUT, DELETE)
- **Itineraries**: `/itineraries` (GET, POST, PUT, DELETE)
- **Regions**: `/regions` (GET, POST, PUT, DELETE)
- **Countries**: `/countries` (GET, POST, PUT, DELETE)
- **Tags**: `/tags` (GET, POST, PUT, DELETE)
- **Travel Journals**: `/travel-journals` (GET, POST, PUT, DELETE)

### 3. User Service (http://localhost/user/api)
Handles user interactions like comments, likes, and saved trips.

#### Endpoints:
- **Comments**: `/comments` (GET, POST, PUT, DELETE)
- **Likes**: `/likes` (GET, POST, DELETE)
- **Saved Trips**: `/saved-trips` (GET, POST, PUT, DELETE)

## Frontend Services

### 1. AuthService (`authService.ts`)
- Handles authentication flows
- Manages user sessions
- Provides admin user management functions

### 2. TripService (`tripService.ts`)
- Manages trips, destinations, itineraries
- Handles region and country data
- Manages tags and travel journals

### 3. UserInteractionService (`userInteractionService.ts`)
- Manages comments moderation
- Handles likes analytics
- Manages saved trips data

### 4. ApiService (`api.ts`)
- Base API service with authentication headers
- Centralized error handling
- Token management

## Authentication Flow

1. **Login**: User logs in through `authService.login()`
2. **Token Storage**: JWT token stored in localStorage
3. **Auto Headers**: All subsequent API calls include Bearer token
4. **Token Refresh**: Automatic token refresh on expiry
5. **Logout**: Clear token and redirect to login

## Error Handling

All services return a standardized response format:
```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
```

## Usage Examples

### Authentication
```typescript
import { authService } from '../services';

// Login
const result = await authService.login(email, password);
if (result.success) {
  // Handle successful login
  console.log('User logged in:', result.data);
} else {
  // Handle error
  console.error('Login failed:', result.error);
}
```

### Trip Management
```typescript
import { tripService } from '../services';

// Get all trips
const trips = await tripService.getTrips();
if (trips.success) {
  console.log('Trips:', trips.data);
}

// Create a trip
const newTrip = await tripService.createTrip({
  title: 'Paris Adventure',
  description: 'A wonderful trip',
  startDate: '2024-06-01',
  endDate: '2024-06-07',
  price: 1200,
  mainDestinationId: 1,
  createdBy: 'admin',
  itineraryIds: [1, 2]
});
```

### User Interactions
```typescript
import { userInteractionService } from '../services';

// Get comments for moderation
const comments = await userInteractionService.getComments();

// Delete inappropriate comment
await userInteractionService.deleteComment(commentId);

// Get analytics
const stats = await userInteractionService.getCommentStats();
```

## Environment Setup

1. Ensure all backend services are running
2. Update API URLs in service files if needed
3. Configure CORS settings in backend
4. Set up authentication middleware

## Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **CORS**: Properly configured for admin panel domain
3. **Authorization**: Bearer tokens sent with all requests
4. **Role-based Access**: Admin-specific endpoints protected
5. **HTTPS**: Use HTTPS in production

## Development Notes

1. Mock data is removed - all services now integrate with actual backend
2. Error handling is consistent across all services
3. TypeScript types are properly imported from models
4. Authentication is handled automatically by base API service
5. Service responses are standardized for easy error handling

## Testing

To test the integration:

1. Start all backend services
2. Verify endpoints are accessible
3. Test authentication flow
4. Test CRUD operations for each entity
5. Verify error handling for network issues
6. Test token refresh functionality

## Future Enhancements

1. **Caching**: Implement response caching for better performance
2. **Retry Logic**: Add automatic retry for failed requests
3. **Offline Support**: Cache data for offline usage
4. **Real-time Updates**: WebSocket integration for live data
5. **Batch Operations**: Support for bulk operations
6. **File Upload**: Enhanced file upload with progress tracking
