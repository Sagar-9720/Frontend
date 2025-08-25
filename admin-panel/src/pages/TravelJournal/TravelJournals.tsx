import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Star,
  Eye,
  EyeOff,
  User,
  Heart,
  MessageCircle,
  BookOpen,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../components/common/Button";
import {
  useTravelJournals,
  TravelJournalUI,
} from "../../DataManagers/travelJournalDataManager";
import { GenericLayout } from "../../components/layout/Layout";

const TravelJournals: React.FC = () => {
  try {
    // Safe hook usage with error handling
    const journalData = useTravelJournals();
    const {
      journals = [],
      loading = false,
      error,
      refetch,
    } = journalData || {};

    const [fetchError, setFetchError] = useState<string | null>(null);
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const MAX_FETCH_ATTEMPTS = 1;
    const [filteredJournals, setFilteredJournals] = useState<TravelJournalUI[]>(
      []
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingJournal, setEditingJournal] =
      useState<TravelJournalUI | null>(null);
    const [viewingJournal, setViewingJournal] =
      useState<TravelJournalUI | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [ratingFilter, setRatingFilter] = useState<string>("all");
    const [formData, setFormData] = useState({
      title: "",
      content: "",
      tripId: "",
      rating: 5,
      isPublic: true,
    });

    useEffect(() => {
      try {
        if (
          Array.isArray(journals) &&
          journals.length === 0 &&
          !loading &&
          !fetchError &&
          fetchAttempts < MAX_FETCH_ATTEMPTS &&
          refetch
        ) {
          setFetchAttempts((prev) => prev + 1);
          refetch().catch((err: any) => {
            console.error("Error fetching travel journals:", err);
            setFetchError(err?.message || "Failed to fetch travel journals.");
          });
        }
      } catch (error) {
        console.error("Error in fetch effect:", error);
        setFetchError("Failed to initialize travel journals.");
      }
    }, [journals.length, loading, fetchError, fetchAttempts, refetch]);

    useEffect(() => {
      try {
        if (!Array.isArray(journals)) {
          setFilteredJournals([]);
          return;
        }

        let filtered = [...journals];

        // Safe text filtering
        if (searchTerm.trim()) {
          filtered = filtered.filter((journal) => {
            try {
              const title = journal?.title?.toLowerCase() || "";
              const content = journal?.content?.toLowerCase() || "";
              const userName = journal?.userName?.toLowerCase() || "";
              const tripTitle = journal?.tripTitle?.toLowerCase() || "";
              const search = searchTerm.toLowerCase();

              return (
                title.includes(search) ||
                content.includes(search) ||
                userName.includes(search) ||
                tripTitle.includes(search)
              );
            } catch (error) {
              console.error("Error filtering journal:", error);
              return false;
            }
          });
        }

        // Safe status filtering
        if (statusFilter !== "all") {
          filtered = filtered.filter((journal) => {
            try {
              return journal?.status === statusFilter;
            } catch (error) {
              console.error("Error filtering by status:", error);
              return false;
            }
          });
        }

        // Safe rating filtering
        if (ratingFilter !== "all") {
          try {
            const minRating = parseInt(ratingFilter);
            if (!isNaN(minRating)) {
              filtered = filtered.filter((journal) => {
                try {
                  return (journal?.rating || 0) >= minRating;
                } catch (error) {
                  console.error("Error filtering by rating:", error);
                  return false;
                }
              });
            }
          } catch (error) {
            console.error("Error parsing rating filter:", error);
          }
        }

        setFilteredJournals(filtered);
      } catch (error) {
        console.error("Error in filtering effect:", error);
        setFilteredJournals([]);
      }
    }, [searchTerm, statusFilter, ratingFilter, journals]);

    // Safe refresh handler
    const handleRefresh = async () => {
      try {
        setFetchError(null);
        setFetchAttempts(0);
        if (refetch) {
          await refetch();
        }
      } catch (error) {
        console.error("Error refreshing journals:", error);
        setFetchError("Failed to refresh travel journals.");
      }
    };

    // Safe add handler
    const handleAdd = () => {
      try {
        setEditingJournal(null);
        setFormData({
          title: "",
          content: "",
          tripId: "",
          rating: 5,
          isPublic: true,
        });
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error opening add journal modal:", error);
      }
    };

    // Safe edit handler
    const handleEdit = (journal: TravelJournalUI) => {
      try {
        if (!journal) {
          console.error("Invalid journal data for editing");
          return;
        }
        setEditingJournal(journal);
        setFormData({
          title: journal.title || "",
          content: journal.content || "",
          tripId: journal.tripId?.toString() || "",
          rating: journal.rating || 5,
          isPublic: journal.isPublic !== false,
        });
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error opening edit journal modal:", error);
      }
    };

    // Safe view handler
    const handleView = (journal: TravelJournalUI) => {
      try {
        if (!journal) {
          console.error("Invalid journal data for viewing");
          return;
        }
        setViewingJournal(journal);
        setIsViewModalOpen(true);
      } catch (error) {
        console.error("Error opening view journal modal:", error);
      }
    };

    // Safe star rating renderer
    const renderStars = (rating: number) => {
      try {
        const safeRating = Math.max(0, Math.min(5, rating || 0));
        return (
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= safeRating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        );
      } catch (error) {
        console.error("Error rendering stars:", error);
        return <div className="text-gray-400">Rating error</div>;
      }
    };

    // Safe status color getter
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
                  <div className="font-medium text-gray-900">
                    {value || "Untitled"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {journal?.tripTitle || "No trip"}
                  </div>
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
        render: (value: string) => {
          try {
            return (
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span>{value || "Unknown"}</span>
              </div>
            );
          } catch (error) {
            console.error("Error rendering author:", error);
            return <span className="text-red-500">Error</span>;
          }
        },
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
            <span className="capitalize">{status.replace("_", " ")}</span>
          </span>
        ),
      },
      {
        key: "engagement",
        label: "Engagement",
        render: (_: any, journal: TravelJournalUI) => (
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
        render: (_: any, journal: TravelJournalUI) => (
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
        render: (date: string) => format(new Date(date), "MMM dd, yyyy"),
      },
      {
        key: "actions",
        label: "Actions",
        render: (_: any, journal: TravelJournalUI) => {
          try {
            return (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    try {
                      handleView(journal);
                    } catch (error) {
                      console.error("Error opening view modal:", error);
                    }
                  }}
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    try {
                      handleEdit(journal);
                    } catch (error) {
                      console.error("Error opening edit modal:", error);
                    }
                  }}
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                {journal?.status === "under_review" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        try {
                          // TODO: Implement approve functionality
                          console.log("Approve journal:", journal.id);
                        } catch (error) {
                          console.error("Error approving journal:", error);
                        }
                      }}
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        try {
                          // TODO: Implement reject functionality
                          console.log("Reject journal:", journal.id);
                        } catch (error) {
                          console.error("Error rejecting journal:", error);
                        }
                      }}
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant={journal?.isFeatured ? "primary" : "outline"}
                  onClick={() => {
                    try {
                      // TODO: Implement feature toggle functionality
                      console.log("Toggle feature for journal:", journal.id);
                    } catch (error) {
                      console.error("Error toggling feature:", error);
                    }
                  }}
                  title={journal?.isFeatured ? "Unfeature" : "Feature"}
                >
                  <Star className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={journal?.isPublic ? "secondary" : "outline"}
                  onClick={() => {
                    try {
                      // TODO: Implement visibility toggle functionality
                      console.log("Toggle visibility for journal:", journal.id);
                    } catch (error) {
                      console.error("Error toggling visibility:", error);
                    }
                  }}
                  title={journal?.isPublic ? "Hide" : "Show"}
                >
                  {journal?.isPublic ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            );
          } catch (error) {
            console.error("Error rendering actions:", error);
            return <div className="text-red-500">Error</div>;
          }
        },
      },
    ];

    // Filters section
    const filters = (
      <>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="under_review">Under Review</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
        {(searchTerm || statusFilter !== "all" || ratingFilter !== "all") && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredJournals.length} of {journals.length} journals
          </div>
        )}
      </>
    );

    // Buttons section
    const buttons = (
      <Button onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" /> Add Journal
      </Button>
    );

    // Error section
    const errorSection = fetchError && (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <span className="text-red-700 font-medium">{fetchError}</span>
        <Button variant="outline" className="ml-4" onClick={handleRefresh}>
          Retry
        </Button>
      </div>
    );

    // Table section
    const table = (
      <div>
        {/* Replace with your Table component if needed */}
        <div className="mt-4">
          {/* Table expects columns and data props */}
          {/* <Table columns={columns} data={filteredJournals} loading={loading} /> */}
        </div>
      </div>
    );

    // Modal section

    return (
      <GenericLayout
        title="Travel Journal Management"
        subtitle="Manage user travel journals and experiences"
        filters={filters}
        buttons={buttons}
        errorSection={errorSection}
        table={table}
      />
    );
  } catch (error) {
    console.error("Error in TravelJournals component:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-lg mb-4">
          Something went wrong while loading travel journals
        </div>
        <Button onClick={() => window.location.reload()} variant="primary">
          Reload Page
        </Button>
      </div>
    );
  }
};

export default TravelJournals;
