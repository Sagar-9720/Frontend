import React, { useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import Banner from "../../components/Layout/Banner";
import SectionTitle from "../../components/Layout/Section";
import Grid from "../../components/Layout/Grid";
import Pagination from "../../components/common/Pagination";
import { useTrips } from "../../DataManagers/tripDataManager";

const Trips: React.FC = () => {
  const { trips, loading, error } = useTrips();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(trips.length / pageSize);
  const paginatedTrips = trips.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const bannerProps = {
    title: "Explore Trips",
    subtitle: "Find your next adventure and plan your journey",
    searchPlaceholder: "Search trips...",
    backgroundImageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
    filters: [
      { label: "Type", options: ["All", ...Array.from(new Set(trips.map((t: any) => t.type || "")))] },
      { label: "Region", options: ["All", ...Array.from(new Set(trips.map((t: any) => t.region || "")))] },
    ],
  };

  const gridItems = paginatedTrips.map((t: any) => ({
    image: t.images?.[0] || "https://via.placeholder.com/400x200?text=No+Image",
    name: t.title,
    subtitle: t.description?.substring(0, 80) + (t.description?.length > 80 ? "..." : ""),
  }));

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
        <p className="text-gray-600">Try searching for a different trip</p>
      </div>
    );
  }

  return (
    <Layout>
      <Banner {...bannerProps} />
      <SectionTitle title="Trips" />
      <Grid items={gridItems} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};

// Removed duplicate export statement

export default Trips;
