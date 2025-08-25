import { UserInfoData } from "./UserInfoData";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userInfoData: UserInfoData;
}
