import { API_ENDPOINTS, buildJournalUrl } from "./api";
import { createServiceClient } from "../utils/serviceFactory";

const client = createServiceClient('TravelJournalService');

export const travelJournalService = {
  getAllJournals: () => client.get(buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS)),
  getJournalById: (id: string) => client.get(buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNAL_BY_ID, { id })),
  getJournalsByUserId: (userId: string) => client.get(buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS_BY_USER, { userId })),
  getJournalsByTripId: (tripId: string) => client.get(buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS_BY_TRIP, { tripId })),
  getPublicJournals: () => client.get(buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.PUBLIC_JOURNALS)),
  searchByTag: (tag: string) => client.get(buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS_BY_TAG, { tag })),
};
