import React from "react";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";

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

export default function CommonJournalPageLayout({
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
    <div className="min-h-screen bg-white">
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
          {journalTitle && (
            <h2 className="text-3xl font-bold">{journalTitle}</h2>
          )}
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
                <Card key={idx}>
                  <img
                    src={day.image}
                    alt={day.title}
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold">{day.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {day.description}
                    </p>
                    <Button className="mt-3">View Details</Button>
                  </CardContent>
                </Card>
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
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold">Journal Actions</h4>
              <Button className="w-full mt-3">Edit Journal</Button>
              <Button variant="outline" className="w-full mt-2">
                Create New Journal
              </Button>
            </CardContent>
          </Card>

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
                    <MessageCircle className="inline w-4 h-4 mr-1" />
                    {engagement.comments}
                  </span>
                  <span>
                    <Share2 className="inline w-4 h-4 mr-1" />
                    {engagement.shares.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {relatedJournals && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold">Related Journals</h4>
                <ul className="space-y-2 mt-2 text-sm text-blue-600">
                  {relatedJournals.map((journal, idx) => (
                    <li key={idx}>{journal}</li>
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
