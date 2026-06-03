export enum UserRole {
  CLIENT = 'CLIENT',
  TATTOO_ARTIST = 'TATTOO_ARTIST',
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface RegisterDto {
  email: string;
  password?: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
