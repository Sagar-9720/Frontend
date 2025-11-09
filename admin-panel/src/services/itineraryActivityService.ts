import { API_ENDPOINTS, buildTripUrl } from "./api";
import { createServiceClient } from "../utils/serviceFactory";

const client = createServiceClient("ItineraryActivityService");

export const itineraryActivityService = {
  // Get all itinerary activities
  getAllActivities: () =>
    client.get(buildTripUrl(API_ENDPOINTS.ITINERARY_ACTIVITY.ACTIVITIES)),

  // Suggest itinerary activities
  suggestActivities: (keyword: string) =>
    client.get(
      buildTripUrl(
        API_ENDPOINTS.ITINERARY_ACTIVITY.ACTIVITY_SUGGEST.replace(
          ":keyword",
          encodeURIComponent(keyword)
        )
      )
    ),
};
