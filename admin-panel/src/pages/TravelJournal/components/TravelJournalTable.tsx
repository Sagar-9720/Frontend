import React from "react";
import { Table } from "../../../components/common/Table";
import { Button } from "../../../components/common/Button";
import { TravelJournalUI } from "../../../DataManagers/travelJournalDataManager";
import {
  BookOpen,
  User,
  Star as StarIcon,
  Heart,
  MessageCircle,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { format } from "date-fns";

interface TravelJournalTableProps {
  journals: TravelJournalUI[];
  loading: boolean;
  onView: (journal: TravelJournalUI) => void;
}

export const TravelJournalTable: React.FC<TravelJournalTableProps> = ({
  journals = [],
  loading = false,
  onView,
}) => {
  const renderStars = (rating: number) => {
    try {
      const safeRating = Math.max(0, Math.min(5, rating || 0));
      return (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-4 h-4 ${
                star <= safeRating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />)
          )}
        </div>
      );
    } catch (error) {
      console.error("Error rendering stars:", error);
      return <div className="text-gray-400">Rating error</div>;
    }
  };

  const getStatusColor = (status: string) => {
    try {
      switch (status) {
        case "published":
          return "bg-green-100 text-green-800";
        case "under_review":
          return "bg-yellow-100 text-yellow-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } catch (error) {
      console.error("Error getting status color:", error);
      return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Journal",
      sortable: true,
      render: (value: string, journal: TravelJournalUI) => {
        try {
          return (
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">{value || "Untitled"}</div>
                <div className="text-sm text-gray-500">{journal?.tripTitle || "No trip"}</div>
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error rendering journal title:", error);
          return <div className="text-red-500">Error loading title</div>;
        }
      },
    },
    {
      key: "userName",
      label: "Author",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value || "Unknown"}</span>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (rating: number) => renderStars(rating),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          <span className="capitalize">{(status || "").replace("_", " ")}</span>
        </span>
      ),
    },
    {
      key: "engagement",
      label: "Engagement",
      render: (_: unknown, journal: TravelJournalUI) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Heart className="w-3 h-3 mr-1 text-red-400" />
            {journal.likes}
            <MessageCircle className="w-3 h-3 ml-2 mr-1 text-blue-400" />
            {journal.comments}
          </div>
          <div className="text-xs text-gray-500">{journal.views} views</div>
        </div>
      ),
    },
    {
      key: "visibility",
      label: "Visibility",
      render: (_: unknown, journal: TravelJournalUI) => (
        <div className="flex items-center space-x-1">
          {journal.isPublic ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
          {journal.isFeatured && (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date: string) => {
        try {
          return date ? format(new Date(date), "MMM dd, yyyy") : "-";
        } catch (error) {
          console.error('Date format error:', error);
          return "-";
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, journal: TravelJournalUI) => (
        <div className="flex space-x-1">
          <Button size="sm" variant="outline" onClick={() => onView(journal)} title="View">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (!Array.isArray(journals)) {
    return (
      <div className="text-center py-8 text-red-500">
        <h3 className="text-lg font-medium mb-2">Data Error</h3>
        <p>Invalid journals data format</p>
      </div>
    );
  }

  return <Table columns={columns} data={journals} loading={loading} />;
};
