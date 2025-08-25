import { useState, useEffect } from "react";

export type HomeDestination = {
  name: string;
  subtitle: string;
  image: string;
};

export type HomeTrip = {
  name: string;
  subtitle: string;
  image: string;
};

export type HomeJournal = {
  title: string;
  entries: string[];
};

export const useHomeData = () => {
  const [destinations, setDestinations] = useState<HomeDestination[]>([]);
  const [trips, setTrips] = useState<HomeTrip[]>([]);
  const [travelJournal, setTravelJournal] = useState<HomeJournal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch, replace with real API calls as needed
    setTimeout(() => {
      setDestinations([
        {
          name: "Manali",
          subtitle: "A beautiful hill station in Himachal Pradesh",
          image: "/images/manali.jpg",
        },
        {
          name: "Leh",
          subtitle: "Adventure and stunning landscapes",
          image: "/images/leh.jpg",
        },
        {
          name: "Goa",
          subtitle: "Beaches & nightlife",
          image: "/images/goa.jpg",
        },
        {
          name: "Paris",
          subtitle: "Romantic city with iconic landmarks",
          image: "/images/paris.jpg",
        },
      ]);
      setTrips([
        {
          name: "Himalayan Trek",
          subtitle: "7-10 days adventure",
          image: "/images/trek.jpg",
        },
        {
          name: "Beaches of Thailand",
          subtitle: "Relax by the sea",
          image: "/images/thailand.jpg",
        },
      ]);
      setTravelJournal({
        title: "Travel Journal",
        entries: [
          "My Solo Trip to Japan - April 2024",
          "Best Winter Destinations - March 2024",
        ],
      });
      setLoading(false);
      setError(null);
    }, 500);
  }, []);

  return { destinations, trips, travelJournal, loading, error };
};
