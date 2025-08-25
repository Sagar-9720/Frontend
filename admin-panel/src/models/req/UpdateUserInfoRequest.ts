export interface UpdateUserInfoRequest {
  userId: string;
  email?: string;
  name?: string;
  phone?: string;
  dob?: string; // Date string in YYYY-MM-DD format
  profileImage?: string;
  oldPassword?: string;
  password?: string;
}
