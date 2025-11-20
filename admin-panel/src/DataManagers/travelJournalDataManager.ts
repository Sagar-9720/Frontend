import { useResource } from '../utils/dataManagerFactory';
import { DATA_MANAGER } from '../utils/constants/dataManager';
import { travelJournalService } from "../services/travelJournalService";
import { useCallback, useMemo } from 'react';

export interface TravelJournalUI {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  tripId: string;
  tripTitle?: string;
  images: string[];
  rating: number;
  isPublic: boolean;
  isFeatured?: boolean;
  status?: "draft" | "published" | "under_review" | "rejected";
  likes?: number;
  comments?: number;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

const mapJournal = (j: Record<string, unknown>): TravelJournalUI => {
  const imagesRaw = (j?.images as unknown[]) || [];
  const images = imagesRaw
    .map((img: unknown) => (typeof img === 'string' ? img : (img as Record<string, unknown>)?.url as string))
    .filter(Boolean) as string[];
  return {
    id: (j?.id as string) || "",
    title: (j?.title as string) || "",
    content: (j?.note as string) || "",
    userId: (j?.userId as string) || "",
    userName: ((j?.user as Record<string, unknown>)?.name as string) || "",
    tripId: (j?.tripId as string) || "",
    tripTitle: (j?.tripTitle as string) || "",
    images,
    rating: (j?.rating as number) || 0,
    isPublic: Boolean(j?.isPublic),
    isFeatured: Boolean(j?.isFeatured),
    status: (j?.status as TravelJournalUI['status']) || "published",
    likes: (j?.likes as number) || 0,
    comments: (j?.comments as number) || 0,
    views: (j?.views as number) || 0,
    createdAt: (j?.createdAt as string) || undefined,
    updatedAt: (j?.updatedAt as string) || undefined,
  };
};

export const useTravelJournals = () => {
   const fetchFn = useCallback(async () => {
     const data = await travelJournalService.getAllJournals();
     return Array.isArray(data) ? data : [];
   }, []);

   const mapListFn = useCallback((raw: unknown[]) => (raw as Record<string, unknown>[]).map(mapJournal), []);

  const { data, loading, error, refetch, status } = useResource<TravelJournalUI, unknown[]>({
     sourceName: 'TravelJournalDataManager',
     fetchFn,
     mapListFn,
     isList: true,
     errorMessage: DATA_MANAGER.ERRORS.JOURNALS,
   });

   return useMemo(() => ({ journals: (data as TravelJournalUI[]) || [], loading, error, status, refetch }), [data, loading, error, status, refetch]);
 };
