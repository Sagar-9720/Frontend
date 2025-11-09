import { buildJournalUrl, API_ENDPOINTS } from "./api";
import type { Tag } from "../models";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient("TagService");

export class TagService {
  getAllTags(): Promise<Tag[]> {
    return client.get(buildJournalUrl(API_ENDPOINTS.TAG.TAGS));
  }
  suggestTags(query: string): Promise<string[]> {
    return client.get(
      withQuery(buildJournalUrl(API_ENDPOINTS.TAG.TAG_SUGGEST), { q: query })
    );
  }
}
