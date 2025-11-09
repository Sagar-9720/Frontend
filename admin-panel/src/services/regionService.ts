import { API_ENDPOINTS, buildTripUrl } from "./api";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient("RegionService");

export const regionService = {
  getRegions: (params?: Record<string, string | number | boolean>) =>
    client.get(withQuery(buildTripUrl(API_ENDPOINTS.REGION.REGIONS), params)),
  getRegionById: (id: string) =>
    client.get(buildTripUrl(API_ENDPOINTS.REGION.REGION_BY_ID, { id })),
  createRegion: (payload: unknown) =>
    client.post(buildTripUrl(API_ENDPOINTS.REGION.REGION_CREATE), payload),
  updateRegion: (id: string, payload: unknown) =>
    client.put(buildTripUrl(API_ENDPOINTS.REGION.REGION_UPDATE, { id }), payload),
};
