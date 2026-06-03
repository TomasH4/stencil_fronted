import { useState, useCallback } from 'react';
import { TattooArtistProfile, GetArtistsParams } from '../types/artist.types';
import { artistService } from '../services/artistService';

export const useArtists = () => {
  const [artists, setArtists] = useState<TattooArtistProfile[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async (params?: GetArtistsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await artistService.getArtists(params);
      setArtists(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error fetching artists');
    } finally {
      setLoading(false);
    }
  }, []);

  return { artists, meta, loading, error, fetchArtists };
};
