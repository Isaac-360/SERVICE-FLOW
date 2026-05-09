export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'business' | 'admin';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
