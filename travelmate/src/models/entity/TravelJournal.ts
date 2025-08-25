// Frontend TravelJournal model for admin panel - maps to backend API responses

import { Trip } from "./Trip";
import { User } from "./User";

export interface Location {
  lat: number;
  lng: number;
  placeName: string;
}

export interface ImageEntry {
  url: string;
  caption: string;
}

export interface TravelJournal {
  id?: string; // MongoDB ObjectId as string
  userId: string;
  tripId: string;
  title: string;
  note: string;
  entryDate: string; // ISO datetime string from API
  location: Location;
  tags: string[];
  isPublic: boolean;
  images: ImageEntry[];
  createdAt?: string; // ISO datetime string from API
  updatedAt?: string; // ISO datetime string from API
}

export interface TravelJournalPayLoad {
  id?: string;
  user: User;
  trip?: Trip;
  title: string;
  note: string;
  entryDate: string;
  location: Location;
  tags: string[];
  isPublic: boolean;
  images: ImageEntry[];
  createdAt?: string;
  updatedAt?: string;
}
