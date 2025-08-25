import React from "react";
import CommonPageLayout from "../../components/Layout/CommonPageLayout";
import { useTrips } from "../../DataManagers/tripDataManager";
import { useParams } from "react-router-dom";

const TripsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, loading, error } = useTrips();
  const trip = trips.find((t: any) => String(t.id) === id);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (!trip) {
    return <div className="text-center py-12">Trip not found</div>;
  }

  return (
    <CommonPageLayout
      headerTitle={trip.title}
      heroImage={trip.images?.[0]}
      intro={trip.description}
      author={trip.region}
      date={trip.startDate}
      days={trip.days}
      engagement={{ likes: trip.likes || 0, comments: trip.comments || 0, shares: trip.shares || 0 }}
      relatedJournals={trip.related || []}
    >
      {/* You can add more trip-specific content here */}
    </CommonPageLayout>
  );
};

export default TripsPage;
