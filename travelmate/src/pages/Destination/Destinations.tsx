import React, { useState } from "react";
import Banner from "../../components/Layout/Banner";
import SectionTitle from "../../components/Layout/Section";
import Grid from "../../components/Layout/Grid";
import Pagination from "../../components/common/Pagination";
import { useDestinations } from "../../DataManagers/destinationDataManager";
import { Layout } from "../../components/Layout/Layout";

const Destinations: React.FC = () => {
  const { destinations, loading, error } = useDestinations();
  // Use createDestination, updateDestination for sending data
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(destinations.length / pageSize);
  const paginatedDestinations = destinations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Banner props
  const bannerProps = {
    title: "Explore Destinations",
    subtitle: "Discover amazing places around the world",
    searchPlaceholder: "Search destinations...",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    filters: [
      {
        label: "Country",
        options: [
          "All",
          ...Array.from(new Set(destinations.map((d: any) => d.country || ""))),
        ],
      },
      {
        label: "Type",
        options: ["All", "Beach", "Mountain", "City", "Adventure"],
      },
    ],
  };

  // Prepare grid items
  const gridItems = paginatedDestinations.map((d: any) => ({
    image: d.images?.[0] || "https://via.placeholder.com/400x200?text=No+Image",
    name: d.name,
    subtitle:
      d.description?.substring(0, 80) +
      (d.description?.length > 80 ? "..." : ""),
  }));

  // Example: createDestination({ name: "New", subtitle: "desc", image: "url" })

  return (
    <Layout>
      <Banner {...bannerProps} />
      <SectionTitle title="Destinations" />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
            >
              <div className="h-64 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No destinations found
          </h3>
          <p className="text-gray-600">
            Try searching for a different location
          </p>
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
};

export default Destinations;
