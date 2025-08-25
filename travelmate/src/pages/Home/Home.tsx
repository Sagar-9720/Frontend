import { useHomeData } from "../../DataManagers/homeDataManager";
import { Layout } from "../../components/Layout/Layout";
import Banner from "../../components/Layout/Banner";
import SectionTitle from "../../components/Layout/Section";
import Grid from "../../components/Layout/Grid";
import Card from "../../components/Layout/Card";
import { Button } from "../../components/common/Button";

export default function HomePage() {
  const { destinations, trips, travelJournal, loading, error } = useHomeData();

  const bannerProps = {
    title: "Explore the World, One Trip at a Time",
    subtitle: "Discover destinations, plan trips, and share your travel stories",
    searchPlaceholder: "",
    backgroundImageUrl: "/images/hero.jpg",
    filters: [],
    actions: [
      { label: "Explore Destinations", variant: "primary" },
      { label: "Read Travel Journal", variant: "outline", className: "bg-white text-black" },
    ],
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <Layout>
      <Banner {...bannerProps} />
      <SectionTitle title="Destinations" />
      <Grid items={destinations} />

      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SectionTitle title="Featured Trips" />
          <Grid items={trips} />
        </div>
        <div>
          {travelJournal?.title && (
            <Card name={travelJournal.title} subtitle={travelJournal.entries?.join("\n") || ""} image="/images/journal.jpg" />
          )}
          <Button variant="outline" className="mt-2 p-0 bg-white text-black">
            Read More
          </Button>
        </div>
      </div>
    </Layout>
  );
}
