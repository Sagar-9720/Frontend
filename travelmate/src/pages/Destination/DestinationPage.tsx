import React from "react";
import CommonPageLayout from "../../components/Layout/CommonPageLayout";
import { useDestinations } from "../../DataManagers/destinationDataManager";
import { useParams } from "react-router-dom";

const DestinationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { destinations, loading, error } = useDestinations();
  const destination = destinations.find((d: any) => String(d.id) === id);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (!destination) {
    return <div className="text-center py-12">Destination not found</div>;
  }

  return (
    <CommonPageLayout
      headerTitle={destination.name}
      heroImage={destination.images?.[0]}
      intro={destination.description}
      author={destination.country}
      date={destination.bestTimeToVisit}
      days={destination.days}
      engagement={{
        likes: destination.likes || 0,
        comments: destination.comments || 0,
        shares: destination.shares || 0,
      }}
      relatedJournals={destination.related || []}
    >
      {/* You can add more destination-specific content here */}
    </CommonPageLayout>
  );
};

export default DestinationPage;
