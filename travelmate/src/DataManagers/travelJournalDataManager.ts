import { useState, useEffect } from 'react';
import { TravelJournal as TravelJournalModel } from '../models/TravelJournal';
import { travelJournalService } from '../services/travelJournalService';

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
  status?: 'draft' | 'published' | 'under_review' | 'rejected';
  likes?: number;
  comments?: number;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const useTravelJournals = () => {
  const [journals, setJournals] = useState<TravelJournalUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const data = await travelJournalService.getAllJournals();
      const mapped = data.map((j: any) => ({
        id: j.id || '',
        title: j.title,
        content: j.note || '',
        userId: j.userId,
        userName: j.user?.name || '',
        tripId: j.tripId,
        tripTitle: j.tripTitle || '',
        images: (j.images || []).map((img: any) => typeof img === 'string' ? img : img.url),
        rating: j.rating || 0,
        isPublic: j.isPublic,
        isFeatured: j.isFeatured || false,
        status: j.status || 'published',
        likes: j.likes || 0,
        comments: j.comments || 0,
        views: j.views || 0,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt
      }));
      setJournals(mapped);
      setError(null);
    } catch (err) {
      setError('Failed to load travel journals');
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    debounceTimer = setTimeout(() => {
      fetchJournals();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  // Mutation handlers
  const createTravelJournal = async (payload: Partial<TravelJournalUI>) => {
    await travelJournalService.createJournal(payload);
    await fetchJournals();
  };
  const updateTravelJournal = async (id: string, payload: Partial<TravelJournalUI>) => {
    await travelJournalService.updateJournal(id, payload);
    await fetchJournals();
  };
  const deleteTravelJournal = async (id: string) => {
    await travelJournalService.deleteJournal(id);
    await fetchJournals();
  };

  return {
    journals,
    loading,
    error,
    refetch: fetchJournals,
    createTravelJournal,
    updateTravelJournal,
    deleteTravelJournal,
  };
};
