import React, { useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import Banner from "../../components/Layout/Banner";
import SectionTitle from "../../components/Layout/Section";
import Grid from "../../components/Layout/Grid";
import Pagination from "../../components/common/Pagination";
import { useTravelJournals } from "../../DataManagers/travelJournalDataManager";

const bannerProps = {
  title: "Travel Journal",
  subtitle: "Document your adventures and share your experiences",
  searchPlaceholder: "Search journal entries...",
  backgroundImageUrl: "/images/journal-hero.jpg",
  filters: [
    { label: "Status", options: ["All", "Published", "Draft", "Under Review"] },
    { label: "Visibility", options: ["All", "Public", "Private"] },
  ],
};
export default function TravelJournalMain() {
  const { journals, loading, error } = useTravelJournals();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(journals.length / pageSize);
  const paginatedJournals = journals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const gridItems = paginatedJournals.map((j) => ({
    image: j.images[0] || "/images/journal.jpg",
    name: j.title,
    subtitle: j.content.substring(0, 80) + (j.content.length > 80 ? "..." : ""),
  }));

  return (
    <Layout>
      <Banner {...bannerProps} />
      <SectionTitle title="Journal Entries" />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4">
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : journals.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No journal entries found
          </h3>
          <p className="text-gray-600">Start documenting your adventures!</p>
        </div>
      ) : (
        <>
          <Grid items={gridItems} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Layout>
  );
}
