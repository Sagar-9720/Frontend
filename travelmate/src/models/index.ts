// Central export file for all admin panel models
// This file exports all models and their related types for easy importing

// Core entity models
export * from './entity/User';
export * from './entity/Role';
export * from './entity/Trip';
export * from './Destination';
export * from './Region';
export * from './entity/Country';
export * from './entity/Itinerary';
export * from './entity/Tag';
export * from './TravelJournal';

// User interaction models
export * from './UserInteraction/Like';
export * from './UserInteraction/Comment';
export * from './UserInteraction/SavedTrip';

// Common API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  message: string;
  error?: string;
  status: number;
  timestamp: string;
}

// Common search and filter types
export interface BaseSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface DateRangeFilter {
  dateFrom?: string;
  dateTo?: string;
}

// Admin dashboard overview types
export interface DashboardStats {
  users: any; // Will be populated with UserStats
  trips: any; // Will be populated with TripStats
  destinations: any; // Will be populated with DestinationStats
  regions: any; // Will be populated with RegionStats
  journals: any; // Will be populated with TravelJournalStats
  likes: any; // Will be populated with LikeStats
  comments: any; // Will be populated with CommentStats
  savedTrips: any; // Will be populated with SavedTripStats
}

// System health and metrics
export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  contentEngagement: number;
  systemLoad: number;
  uptime: string;
  lastUpdated: string;
}
