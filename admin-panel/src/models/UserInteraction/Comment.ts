// Frontend Comment model for admin panel - maps to backend API responses

import { User } from "../entity/User";
import { Trip } from "../entity/Trip";
import { Itinerary } from "../entity/Itinerary";
import { Destination } from "../entity/Destination";

export interface Comment {
  id?: string;
  userId?: number;
  itinerary_id?: number;
  trip_id?: number;
  destination_id?: number;
  comment?: string;
  createdAt?: string; // ISO datetime string from API
  updatedAt?: string; // ISO datetime string from API
}

export interface CommentPayLoad {
  user: User;
  itinerary?: Itinerary;
  trip?: Trip;
  destination?: Destination;
  comment?: string;
}

// API response when fetching comments list
export interface CommentsListResponse {
  comments: Comment[];
  totalCount: number;
  page: number;
  limit: number;
}

// For moderation and analytics
export interface CommentStats {
  totalComments: number;
  totalCommentsByTrips: number;
  totalCommentsByItineraries: number;
  totalCommentsByDestinations: number;
  pendingApproval: number;
  reportedComments: number;
  mostCommentedTrip?: Trip & { commentCount: number };
  mostCommentedDestination?: Destination & { commentCount: number };
  recentComments: Comment[];
  activeUsers: Array<User & { commentCount: number }>;
}

// For search and filtering
export interface CommentSearchParams {
  userId?: number;
  tripId?: number;
  itineraryId?: number;
  destinationId?: number;
  isApproved?: boolean;
  isReported?: boolean;
  keyword?: string; // Search in comment text
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "user" | "reportCount";
  sortOrder?: "asc" | "desc";
}

// For moderation actions
export interface CommentModerationAction {
  commentId: string;
  action: "approve" | "reject" | "flag" | "unflag" | "delete";
  reason?: string;
  moderatorId: number;
}

// // Comment status for admin interface
// export enum CommentStatus {
//   PENDING = "pending",
//   APPROVED = "approved",
//   REJECTED = "rejected",
//   REPORTED = "reported",
//   FLAGGED = "flagged",
// }

// For engagement analytics
export interface CommentEngagement {
  itemId: number;
  itemType: "trip" | "itinerary" | "destination";
  commentCount: number;
  averageCommentLength: number;
  sentimentScore?: number; // If sentiment analysis is implemented
}
