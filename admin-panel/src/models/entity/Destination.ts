// Frontend Destination model for admin panel - maps to backend API responses

import { Region } from "./Region";

export interface Destination {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string; // URL to destination image
  region?: Region;
}
