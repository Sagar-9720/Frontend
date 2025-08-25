import React from "react";
import { useTravelJournals } from "../../DataManagers/travelJournalDataManager";
import CommonJournalPageLayout from "../../components/Layout/CommonJournalPage";

export default function TravelJournalPage() {
  const { journals, loading, error } = useTravelJournals();
    // Use refetch for sending data (e.g., after create/update/delete)
  const journal = journals[0];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (!journal) {
    return <div className="text-center py-12">No journal entry found</div>;
  }

  return (
    <CommonJournalPageLayout
      headerTitle={journal.title}
      heroImage={journal.images?.[0]}
      intro={journal.content}
      author={journal.userName}
      date={journal.createdAt}
      engagement={{
        likes: journal.likes || 0,
        comments: journal.comments || 0,
        shares: 0,
      }}
      children={null}
    />
  );
}
