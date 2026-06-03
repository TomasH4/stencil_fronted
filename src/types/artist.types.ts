import { AuthUser } from './auth.types';

export interface PortfolioImage {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface TattooArtistProfile {
  id: string;
  userId: string;
  name?: string;
  bio: string;
  style: string;
  location: string;
  priceMin: number;
  priceMax: number;
  portfolioImages?: PortfolioImage[];
  createdAt: string;
  updatedAt: string;
  user?: AuthUser; // Usually populated by backend for profile with user info
}

export interface CreateArtistProfileDto {
  name?: string;
  bio: string;
  style: string;
  location: string;
  priceMin: number;
  priceMax: number;
}

export type UpdateArtistProfileDto = Partial<CreateArtistProfileDto>;

export interface GetArtistsParams {
  style?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}
