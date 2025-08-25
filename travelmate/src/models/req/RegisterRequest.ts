import { GenderType } from "../entity/User";
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  dob: string; // Date string in YYYY-MM-DD format
  gender: GenderType;
}
