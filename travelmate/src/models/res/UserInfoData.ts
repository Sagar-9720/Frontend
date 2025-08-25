import { GenderType } from "../entity/User";

export interface UserInfoData {
  userId: string;
  email: string;
  name: string;
  phone: string;
  dob: string; // Date string in YYYY-MM-DD format
  profileImage?: string;
  gender: GenderType;
}
