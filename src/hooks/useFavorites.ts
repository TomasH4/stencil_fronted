import { useState, useCallback } from 'react';
import { favoriteService } from '@/services/favoriteService';
import { TattooArtistProfile } from '@/types/artist.types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<TattooArtistProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await favoriteService.getMyFavorites();
      setFavorites(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al obtener favoritos');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = async (artistProfileId: string) => {
    try {
      const { isFavorite } = await favoriteService.toggleFavorite(artistProfileId);
      return isFavorite;
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || 'Error al actualizar favoritos');
    }
  };

  return { favorites, loading, error, fetchFavorites, toggleFavorite };
}
