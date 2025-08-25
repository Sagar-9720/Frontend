// Frontend User model for admin panel - maps to backend API responses

export interface User {
  userId?: number;
  name: string;
  email: string;
  phone: string;
  password?: string; // Optional for security - not always returned from API
  dob: string; // ISO date string from API
  gender: GenderType;
  profileImg?: string;
  emailVerified?: boolean;
  roles?: string; // User roles for authorization
  createdAt?: string; // ISO datetime string from API (backend uses this format)
  updatedAt?: string; // ISO datetime string from API (backend uses this format)
}



// Gender options for forms
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
] as const;

export type GenderType = typeof GENDER_OPTIONS[number]['value'];

// User statistics for admin dashboard
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersByGender: Record<GenderType, number>;
  usersByRole: Record<string, number>;
  recentRegistrations: User[];
  topActiveUsers: User[];
}

// For search and filtering
export interface UserSearchParams {
  name?: string;
  email?: string;
  gender?: GenderType;
  emailVerified?: boolean;
  roleId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
