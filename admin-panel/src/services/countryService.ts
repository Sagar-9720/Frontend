import { API_ENDPOINTS, buildTripUrl } from "./api";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient("CountryService");

export const countryService = {
  getCountries: (params?: Record<string, string | number | boolean>) =>
    client.get(withQuery(buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRIES), params)),
  getCountryById: (id: string) =>
    client.get(buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRY_BY_ID, { id })),
  createCountry: (data: unknown) =>
    client.post(buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRY_CREATE), data),
  updateCountry: (id: string, data: unknown) =>
    client.put(buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRY_UPDATE, { id }), data),
};
