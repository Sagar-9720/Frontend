import React from "react";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { Button } from "../common/Button";
import JournalDayCard from "./JournalCard";

type JournalDay = {
  image: string;
  title: string;
  description: string;
};

type Comment = {
  author: string;
  text: string;
};

type Engagement = {
  likes: number;
  comments: number;
  shares: number;
};

type CommonPageLayoutProps = {
  headerTitle?: string;
  navLinks?: { label: string; href: string }[];
  heroImage?: string;
  journalTitle?: string;
  author?: string;
  date?: string;
  intro?: string;
  days?: JournalDay[];
  comments?: Comment[];
  engagement?: Engagement;
  relatedJournals?: string[];
  children?: React.ReactNode;
};

export default function CommonPageLayout({
  headerTitle,
  navLinks,
  heroImage,
  journalTitle,
  author,
  date,
  intro,
  days,
  comments,
  engagement,
  relatedJournals,
  children,
}: CommonPageLayoutProps) {
  return (
    <div className="max-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Image */}
      {heroImage && (
        <div className="w-full h-[350px] overflow-hidden">
          <img
            src={heroImage}
            alt="Travel Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 py-10 px-6">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {title && <h2 className="text-3xl font-bold">{title}</h2>}
          {(author || date) && (
            <p className="text-sm text-gray-500">
              {author} {author && date && "·"} {date}
            </p>
          )}
          {intro && <p>{intro}</p>}

          {/* Day cards */}
          {days && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {days.map((day, idx) => (
                <JournalDayCard
                  key={idx}
                  dayTitle={day.title}
                  image={day.image}
                  description={day.description}
                />
              ))}
            </div>
          )}

          {/* Comments */}
          {comments && (
            <div>
              <h3 className="font-bold mb-3">Comments</h3>
              <div className="space-y-3">
                {comments.map((comment, idx) => (
                  <div key={idx}>
                    <p className="font-semibold">{comment.author}</p>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full mt-4 p-2 border rounded-lg"
              />
            </div>
          )}
          {children}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sidebar Section: Place any generic widgets/components here */}
          {/* Sidebar Children */}
          {children}

          {engagement && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold">Engagement</h4>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>
                    <Heart className="inline w-4 h-4 mr-1" />
                    {engagement.likes}
                  </span>
                  <span>
                    <Share2 className="inline w-4 h-4 mr-1" />
                    {engagement.saved.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {related && related.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold">
                  Related{" "}
                  {headerTitle?.includes("Destination")
                    ? "Destinations"
                    : headerTitle?.includes("Trip")
                    ? "Trips"
                    : "Journals"}
                </h4>
                <ul className="space-y-2 mt-2 text-sm text-blue-600">
                  {related.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
