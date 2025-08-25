// Frontend SavedTrip model for admin panel - maps to backend API response

import { Destination } from "../entity/Destination";
import { Itinerary } from "../entity/Itinerary";
import { Trip } from "../entity/Trip";
import { User } from "../entity/User";

export interface SavedTrip {
  id?: number;
  userId?: number;
  itinerary_id?: number;
  trip_id?: number;
  destination_id?: number;
  created_at?: string; // ISO datetime string from API
  updated_at?: string; // ISO datetime string from API
}

export interface SavedTripPayload {
  id?: number;
  user?: User;
  itinerary?: Itinerary;
  trip?: Trip;
  destination?: Destination;
  created_at?: string; // ISO datetime string from API
  updated_at?: string; // ISO datetime string from API
}

// API response when fetching saved trips list
export interface SavedTripsListResponse {
  savedTrips: SavedTrip[];
  totalCount: number;
  page: number;
  limit: number;
}

// API response for single saved trip
export interface SavedTripResponse {
  savedTrip: SavedTrip;
  message?: string;
}

// For analytics and reporting
export interface SavedTripStats {
  totalSavedTrips: number;
  totalSavedByTrips: number;
  totalSavedByItineraries: number;
  totalSavedByDestinations: number;
  mostSavedTrip?: Trip;
  mostSavedDestination?: Destination;
  recentSaves: SavedTrip[];
}

// For search and filtering
export interface SavedTripSearchParams {
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
export interface SavedTripOption {
  value: number;
  label: string;
  type: "trip" | "itinerary" | "destination";
}
