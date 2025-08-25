export interface TokenValidationResponse {
  valid: boolean;
  userId: string;
  username: string;
  email: string;
  role: string;
  message: string;
}
