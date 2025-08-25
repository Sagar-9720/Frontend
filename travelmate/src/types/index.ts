// Base types for the Travel Mate user application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  preferences?: UserPreferences;
  joinDate: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
}

export interface UserPreferences {
  budget?: {
    min: number;
    max: number;
  };
  preferredDestinations?: string[];
  interests?: string[];
  travelStyle?: 'budget' | 'mid-range' | 'luxury';
  groupSize?: 'solo' | 'couple' | 'family' | 'group';
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  images: string[];
  country: Country;
  region: Region;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  attractions: string[];
  activities: string[];
  bestTimeToVisit: string;
  averageCost: number;
  safety: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  weather?: WeatherData;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  continent: string;
  currency: string;
  language: string;
  timezone: string;
  flag?: string;
}

export interface Region {
  id: string;
  name: string;
  country: Country;
  description?: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  mainDestination: Destination;
  price: number;
  duration: number;
  maxPeople: number;
  currentBookings: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tags: Tag[];
  images: string[];
  itineraries: Itinerary[];
  inclusions: string[];
  exclusions: string[];
  rating: number;
  reviewCount: number;
  startDate?: string;
  endDate?: string;
  isFeatureActive: boolean;
  guide: {
    name: string;
    avatar: string;
    rating: number;
  };
  createdAt: Date;
  updatedAt: Date;
  availableDates: string[];
  status: 'active' | 'inactive';
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  color?: string;
}

export interface Itinerary {
  id: string;
  tripId: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  activities: ItineraryActivity[];
  accommodations: Accommodation[];
  meals: Meal[];
  transportation: Transportation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryActivity {
  id: string;
  title: string;
  description: string;
  duration: number;
  cost: number;
  location: string;
  category: string;
  day: number;
  startTime: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'guesthouse';
  location: string;
  rating: number;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  amenities: string[];
  images: string[];
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine: string;
  cost: number;
  location: string;
  description: string;
  day: number;
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'boat' | 'walk';
  from: string;
  to: string;
  duration: number;
  cost: number;
  departure: string;
  arrival: string;
  provider?: string;
  details: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface TravelJournal {
  id: string;
  userId: string;
  title: string;
  content: string;
  destination?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  tripId?: string;
  itineraryId?: string;
  destinationId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  rating?: number;
  images?: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: Date;
  likes: number;
  replies?: Comment[];
}

export interface Like {
  id: string;
  userId: string;
  tripId?: string;
  itineraryId?: string;
  destinationId?: string;
  createdAt: Date;
}

export interface SavedTrip {
  id: string;
  userId: string;
  tripId?: string;
  itineraryId?: string;
  destinationId?: string;
  notes?: string;
  isPlanned: boolean;
  plannedDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Search and Filter Types
export interface SearchFilters {
  destination?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  difficulty?: string[];
  tags?: string[];
  startDate?: string;
  endDate?: string;
  rating?: number;
}

export interface SearchResults {
  trips: Trip[];
  destinations: Destination[];
  totalResults: number;
  page: number;
  totalPages: number;
}

// Booking Types
export interface BookingRequest {
  tripId: string;
  itineraryId?: string;
  travelers: Traveler[];
  contactInfo: ContactInfo;
  specialRequests?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  dietaryRestrictions?: string[];
  emergencyContact: EmergencyContact;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PaymentMethod {
  type: 'credit' | 'debit' | 'paypal' | 'bank_transfer';
  details: any;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Payload types for API requests
export interface CreateCommentPayload {
  tripId?: string;
  itineraryId?: string;
  destinationId?: string;
  content: string;
  rating?: number;
  images?: string[];
}

export interface UpdateCommentPayload {
  content?: string;
  rating?: number;
  images?: string[];
}

export interface CreateSavedTripPayload {
  tripId?: string;
  itineraryId?: string;
  destinationId?: string;
  notes?: string;
  isPlanned?: boolean;
  plannedDate?: string;
}

export interface UpdateSavedTripPayload {
  notes?: string;
  isPlanned?: boolean;
  plannedDate?: string;
}

export interface CreateLikePayload {
  tripId?: string;
  itineraryId?: string;
  destinationId?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  preferences?: UserPreferences;
}

export interface TripRequest {
  id: string;
  userId: string;
  destination: string;
  description: string;
  preferredDates: string[];
  budget: number;
  groupSize: number;
  specialRequirements?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}