import api from './api';
import { ApiResponse } from '@/types/api.types';
import { TattooArtistProfile } from '@/types/artist.types';
import { ToggleFavoriteResponse } from '@/types/favorite.types';

export const favoriteService = {
  toggleFavorite: async (artistProfileId: string): Promise<ToggleFavoriteResponse> => {
    const { data } = await api.post<ApiResponse<ToggleFavoriteResponse>>('/favorites', { artistProfileId });
    return data.data;
  },

  getMyFavorites: async (): Promise<TattooArtistProfile[]> => {
    const { data } = await api.get<ApiResponse<TattooArtistProfile[]>>('/favorites/me');
    return data.data;
  }
};
