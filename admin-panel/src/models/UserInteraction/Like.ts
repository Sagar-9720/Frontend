// Frontend Like model for admin panel - maps to backend API responses

import { User } from "../entity/User";
import { Trip } from "../entity/Trip";
import { Itinerary } from "../entity/Itinerary";
import { Destination } from "../entity/Destination";

export interface Like {
  id?: number;
  userId?: number;
  itinerary_id?: number;
  trip_id?: number;
  destination_id?: number;
  created_at?: string; // ISO datetime string from API
  updated_at?: string; // ISO datetime string from API
}
export interface LikePayload {
  id?: number;
  user?: User;
  itinerary?: Itinerary;
  trip?: Trip;
  destination?: Destination;
  created_at?: string; // ISO datetime string from API
  updated_at?: string; // ISO datetime string from API
}
// API response when fetching likes list
export interface LikesListResponse {
  likes: Like[];
  totalCount: number;
  page: number;
  limit: number;
}

// API response for single like
export interface LikeResponse {
  like: Like;
  message?: string;
}

// For analytics and reporting
export interface LikeStats {
  totalLikes: number;
  totalLikesByTrips: number;
  totalLikesByItineraries: number;
  totalLikesByDestinations: number;
  mostLikedTrip?: Trip & { likeCount: number };
  mostLikedDestination?: Destination & { likeCount: number };
  recentLikes: Like[];
  topUsers: Array<User & { likeCount: number }>;
}

// For search and filtering
export interface LikeSearchParams {
  userId?: number;
  tripId?: number;
  itineraryId?: number;
  destinationId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "user" | "trip";
  sortOrder?: "asc" | "desc";
}

// For dropdown/select options
export interface LikeOption {
  value: number;
  label: string;
  type: "trip" | "itinerary" | "destination";
}

// For engagement analytics
export interface LikeEngagement {
  itemId: number;
  itemType: "trip" | "itinerary" | "destination";
  likeCount: number;
  engagementRate: number;
  averageLikesPerDay: number;
}
