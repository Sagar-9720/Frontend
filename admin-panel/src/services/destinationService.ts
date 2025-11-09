import { Destination } from "../models/entity/Destination";
import { buildTripUrl, API_ENDPOINTS } from "./api";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient("DestinationService");

export const destinationService = {
  getDestinations: (): Promise<Destination[]> =>
    client.get(buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATIONS)),
  getDestinationById: (id: string): Promise<Destination> =>
    client.get(
      buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_BY_ID, { id })
    ),
  createDestination: (
    destination: Partial<Destination>
  ): Promise<Destination> =>
    client.post(
      buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_CREATE),
      destination
    ),
  updateDestination: (
    id: string,
    destination: Partial<Destination>
  ): Promise<Destination> =>
    client.put(
      buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_BY_ID, { id }),
      destination
    ),
  searchDestinations: (query: string): Promise<Destination[]> =>
    client.get(
      withQuery(buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_SEARCH), {
        q: query,
      })
    ),
  getDestinationsByCountry: (countryId: string): Promise<Destination[]> =>
    client.get(
      buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_BY_COUNTRY, {
        countryId,
      })
    ),
  getDestinationsByRegion: (regionId: string): Promise<Destination[]> =>
    client.get(
      buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_BY_REGION, {
        regionId,
      })
    ),
};
