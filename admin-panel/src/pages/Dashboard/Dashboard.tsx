import React from "react";
import DashboardStats from "./components/DashboardStats";
import DashboardCharts from "./components/DashboardCharts";
import DashboardRecentActivity from "./components/DashboardRecentActivity";
import {
  Users,
  MapPin,
  Route,
  BookOpen,
  Calendar,
  MessageCircle,
  Heart,
  Bookmark,
  CheckCircle,
} from "lucide-react";
import { DashboardStatsItem, ContentItem, DashboardData } from "../../models/Dashboard";
import { useDashboardData } from "../../DataManagers/dashboardDataManager";
import { logger } from "../../utils";

const log = logger.forSource('DashboardPage');

export const Dashboard: React.FC = () => {
  const { dashboardData, loading, error, refetch } = useDashboardData();

  const renderContentList = (
    items: ContentItem[] | undefined,
    type: "trips" | "itineraries" | "destinations",
    metric: "comments" | "likes" | "saves"
  ) => {
    try {
      if (!items || !Array.isArray(items)) {
        return <div className="text-gray-500 text-sm">No data available</div>;
      }

      const IconComponent = metric === 'comments' ? MessageCircle : metric === 'likes' ? Heart : Bookmark;

      return (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item?.id || Math.random()}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">
                  {item?.title || item?.name || "Unknown"}
                </h4>
                <p className="text-sm text-gray-500 capitalize">
                  {type.slice(0, -1)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {item?.[metric] || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      log.error("Error rendering content list", error as unknown);
      return (
        <div className="text-red-500 text-sm">Error loading content</div>
      );
    }
  };

  // Remove early returns; show inline banners instead
  const errorBanner = error ? (
    <div className="mb-4 p-4 rounded border border-red-200 bg-red-50 flex items-center justify-between">
      <span className="text-red-700 text-sm font-medium">{error}</span>
      <button
        onClick={() => refetch()}
        className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  ) : null;

  const loadingBanner = loading ? (
    <div className="mb-4 p-4 rounded border border-yellow-200 bg-yellow-50 text-yellow-700 text-sm">
      Loading latest dashboard data...
    </div>
  ) : null;

  const safeData = dashboardData || {
    stats: [],
    mostCommented: { trips: [], itineraries: [], destinations: [] },
    mostLiked: { trips: [], itineraries: [], destinations: [] },
    mostSaved: { trips: [], itineraries: [], destinations: [] },
    recentActivities: [],
  } as DashboardData;

  try {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your travel platform.
          </p>
        </div>
        {errorBanner}
        {loadingBanner}
        {/* Stats Grid */}
        <DashboardStats
          stats={safeData?.stats?.map((stat: DashboardStatsItem) => ({
            label: stat?.name || "Unknown",
            value: stat?.value || 0,
            icon: React.createElement(
              {
                Users,
                MapPin,
                Route,
                BookOpen,
              }[stat?.icon] || Users
            ),
            color: stat?.color?.replace("bg-", "").replace("-600", "") || "blue",
          })) || []}
        />
        {/* Analytics Section */}
        <DashboardCharts>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Most Commented */}
            <div
              className={`bg-white shadow rounded-lg ${
                loading ? "opacity-70 animate-pulse" : ""
              }`}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Most Commented
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Trips
                  </h3>
                  {renderContentList(
                    safeData.mostCommented.trips,
                    "trips",
                    "comments"
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Itineraries
                  </h3>
                  {renderContentList(
                    safeData.mostCommented.itineraries,
                    "itineraries",
                    "comments"
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Destinations
                  </h3>
                  {renderContentList(
                    safeData.mostCommented.destinations,
                    "destinations",
                    "comments"
                  )}
                </div>
              </div>
            </div>
            {/* Most Liked */}
            <div
              className={`bg-white shadow rounded-lg ${
                loading ? "opacity-70 animate-pulse" : ""
              }`}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Most Liked
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Trips
                  </h3>
                  {renderContentList(
                    safeData.mostLiked.trips,
                    "trips",
                    "likes"
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Itineraries
                  </h3>
                  {renderContentList(
                    safeData.mostLiked.itineraries,
                    "itineraries",
                    "likes"
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Destinations
                  </h3>
                  {renderContentList(
                    safeData.mostLiked.destinations,
                    "destinations",
                    "likes"
                  )}
                </div>
              </div>
            </div>
            {/* Most Saved */}
            <div
              className={`bg-white shadow rounded-lg ${
                loading ? "opacity-70 animate-pulse" : ""
              }`}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Bookmark className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Most Saved
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Trips
                  </h3>
                  {renderContentList(
                    safeData.mostSaved.trips,
                    "trips",
                    "saves"
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Itineraries
                  </h3>
                  {renderContentList(
                    safeData.mostSaved.itineraries,
                    "itineraries",
                    "saves"
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Destinations
                  </h3>
                  {renderContentList(
                    safeData.mostSaved.destinations,
                    "destinations",
                    "saves"
                  )}
                </div>
              </div>
            </div>
          </div>
        </DashboardCharts>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardRecentActivity
            activities={safeData.recentActivities.map((activity: { id: number; action: string; user: string; time: string; }) => ({
              id: activity.id,
              description: `${activity.action} by ${activity.user}`,
              timestamp: activity.time,
            }))}
          />
          {/* Quick Actions */}
          <div
            className={`bg-white shadow rounded-lg ${
              loading ? "opacity-70 animate-pulse" : ""
            }`}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Approve Trips Requested
                    </h3>
                    <p className="text-sm text-gray-500">
                      Review and approve pending trip requests
                    </p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-emerald-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Add Destination</h3>
                    <p className="text-sm text-gray-500">
                      Create a new travel destination
                    </p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Create Itinerary
                    </h3>
                    <p className="text-sm text-gray-500">
                      Plan a new travel itinerary
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    log.error("Error rendering dashboard", error as unknown);
    return (
      <div className="flex justify-center items-center py-8 text-red-500">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Dashboard Error</h2>
          <p>Something went wrong while loading the dashboard.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};
