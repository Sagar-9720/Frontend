import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTravelJournals, TravelJournalUI } from "../../DataManagers/travelJournalDataManager";
import { GenericLayout } from "../../components/layout/Layout";
import { TravelJournalTable } from "./components/TravelJournalTable";
import TravelJournalViewModal from "./components/TravelJournalViewModal";
import { logger } from "../../utils";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { PAGE_TITLES, PAGE_SUBTITLES } from "../../utils";
import { TravelJournalFilters } from "./sections/TravelJournalFilters";

const log = logger.forSource('TravelJournalsPage');

const TravelJournals: React.FC = () => {
  const { journals = [], loading, error, refetch } = useTravelJournals();

  // State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingJournal, setViewingJournal] = useState<TravelJournalUI | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const MAX_FETCH_ATTEMPTS = 1;
  const fetchAttemptsRef = useRef(0);
  const fetchedOnceRef = useRef(false);

  // One-time retry if hook returned empty but no error
  useEffect(() => {
    if (fetchedOnceRef.current) return;
    if (!loading && !error && journals.length === 0 && fetchAttemptsRef.current < MAX_FETCH_ATTEMPTS) {
      fetchAttemptsRef.current += 1;
      fetchedOnceRef.current = true;
      refetch();
    }
  }, [loading, error, journals, refetch]);

  const filteredJournals = useMemo<TravelJournalUI[]>(() => {
    try {
      if (!Array.isArray(journals)) return [];
      if (!searchTerm.trim()) return journals;
      const search = searchTerm.toLowerCase();
      return journals.filter((j) => {
        try {
          return (
            (j.title || "").toLowerCase().includes(search) ||
            (j.content || "").toLowerCase().includes(search) ||
            (j.userName || "").toLowerCase().includes(search) ||
            (j.tripTitle || "").toLowerCase().includes(search)
          );
        } catch (error) {
          log.error('Error filtering journal item', error as unknown);
          return false;
        }
      });
    } catch {
      return [];
    }
  }, [journals, searchTerm]);

  // Handlers
  const handleView = (journal: TravelJournalUI) => {
    setViewingJournal(journal);
    setIsViewOpen(true);
  };

  // Filters section (only search)
  const filters = (
    <TravelJournalFilters
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      total={journals.length}
      filtered={filteredJournals.length}
    />
  );

  // Buttons section (none needed now)
  const buttons = null;

  // Error section
  const errorSection = error ? (
     <ErrorBanner
       message={error}
       onRetry={() => {
        fetchAttemptsRef.current = 0;
        fetchedOnceRef.current = false;
        refetch();
       }}
       className="mb-4"
     />
   ) : null;

  // Table section
  const table = (
    <TravelJournalTable
      journals={filteredJournals}
      loading={loading && !error}
      onView={handleView}
    />
  );

  return (
    <GenericLayout
      title={PAGE_TITLES.TRAVEL_JOURNAL_MANAGEMENT}
      subtitle={PAGE_SUBTITLES.TRAVEL_JOURNAL_MANAGEMENT}
      filters={filters}
      buttons={buttons}
      errorSection={errorSection}
      table={table}
      modal={
        <TravelJournalViewModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          journal={viewingJournal}
        />
      }
    />
  );
};

export default TravelJournals;
