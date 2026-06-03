import api from './api';
import { 
  TattooArtistProfile, 
  CreateArtistProfileDto, 
  UpdateArtistProfileDto, 
  GetArtistsParams 
} from '../types/artist.types';
import { PaginatedResponse } from '../types/api.types';

export const artistService = {
  getArtists: async (params?: GetArtistsParams): Promise<PaginatedResponse<TattooArtistProfile>> => {
    const { data } = await api.get<PaginatedResponse<TattooArtistProfile>>('/artists', { params });
    return data;
  },

  getArtistById: async (id: string): Promise<TattooArtistProfile> => {
    const { data } = await api.get<{data: TattooArtistProfile}>(`/artists/${id}`);
    return data.data;
  },

  getMyProfile: async (): Promise<TattooArtistProfile> => {
    const { data } = await api.get<{data: TattooArtistProfile}>('/artists/me');
    return data.data;
  },

  createProfile: async (dto: CreateArtistProfileDto): Promise<TattooArtistProfile> => {
    const { data } = await api.post<{data: TattooArtistProfile}>('/artists', dto);
    return data.data;
  },

  updateProfile: async (id: string, dto: UpdateArtistProfileDto): Promise<TattooArtistProfile> => {
    const { data } = await api.put<{data: TattooArtistProfile}>(`/artists/${id}`, dto);
    return data.data;
  },

  deleteProfile: async (id: string): Promise<void> => {
    await api.delete(`/artists/${id}`);
  },

  addPortfolioImage: async (artistId: string, formData: FormData): Promise<any> => {
    const { data } = await api.post(`/artists/${artistId}/portfolio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  removePortfolioImage: async (artistId: string, imageId: string): Promise<void> => {
    await api.delete(`/artists/${artistId}/portfolio/${imageId}`);
  }
};
