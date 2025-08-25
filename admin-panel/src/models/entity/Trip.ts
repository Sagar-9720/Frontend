// Frontend Trip model for admin panel - maps to backend API responses

import { Destination } from "./Destination";
import { IntineraryPayLoad, Itinerary } from "./Itinerary";

export interface Trip {
  id?: number;
  title: string;
  description: string;
  isActive: boolean; // Indicates if the trip is active or not
  startDate: string; // ISO datetime string from API
  endDate: string; // ISO datetime string from API
  price: number; // Frontend handles as number, backend uses BigDecimal
  mainDestinationId: number;
  createdBy: string;
  itineraries: Itinerary[];
}

export interface TripPayLoad {
  id?: number;
  title: string;
  description: string;
  isActive: boolean; // Indicates if the trip is active or not
  startDate: string; // ISO datetime string from API
  endDate: string; // ISO datetime string from API
  price: number; // Frontend handles as number, backend uses BigDecimal
  destination: Destination; // Full destination object
  createdBy: string;
  itineraries: IntineraryPayLoad[];
}
