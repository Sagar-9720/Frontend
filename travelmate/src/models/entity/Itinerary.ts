import { Destination } from "./Destination";

// Frontend Itinerary model for admin panel - maps to backend API responses
export interface Itinerary {
  id?: number;
  itineraryName: string;
  destinationId?: number;
  dayNumber: number;
  description: string;
  arrivalTime: string; // ISO datetime string from API
  departureTime: string; // ISO datetime string from API
  // Note: trips relationship handled separately to avoid circular dependency
}

export interface IntineraryPayLoad{
  id?: number;
  itineraryName: string;
  destination?:Destination
  dayNumber: number;
  description: string;
  arrivalTime: string; // ISO datetime string from API
  departureTime: string; // ISO datetime string from API
}