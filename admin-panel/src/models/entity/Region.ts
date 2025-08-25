// Frontend Region model for admin panel - maps to backend API responses

import { Country } from "./Country";

export interface Region {
  id?: number;
  name: string;
  country: Country;
}
