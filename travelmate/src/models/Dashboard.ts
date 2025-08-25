// Dashboard models for admin panel

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  comments: number;
  likes: number;
  saves: number;
}

export interface DashboardStatsItem {
  name: string;
  value: string;
  change: string;
  icon: string; // icon name, not component
  color: string;
}

export interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
}

export interface DashboardData {
  mostCommented: {
    trips: ContentItem[];
    itineraries: ContentItem[];
    destinations: ContentItem[];
  };
  mostLiked: {
    trips: ContentItem[];
    itineraries: ContentItem[];
    destinations: ContentItem[];
  };
  mostSaved: {
    trips: ContentItem[];
    itineraries: ContentItem[];
    destinations: ContentItem[];
  };
  stats: DashboardStatsItem[];
  recentActivities: RecentActivity[];
}
