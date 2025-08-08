export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'admin', 'user'
}