import { useState, useCallback } from 'react';
import { TattooArtistProfile, CreateArtistProfileDto, UpdateArtistProfileDto } from '../types/artist.types';
import { artistService } from '../services/artistService';

export const useArtistProfile = () => {
  const [profile, setProfile] = useState<TattooArtistProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.getArtistById(id);
      setProfile(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }, message?: string } }; message?: string };
      setError(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.getMyProfile();
      setProfile(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }, message?: string } }; message?: string };
      setError(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (dto: CreateArtistProfileDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.createProfile(dto);
      setProfile(data);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error creating profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (id: string, dto: UpdateArtistProfileDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.updateProfile(id, dto);
      setProfile(data);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error updating profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await artistService.deleteProfile(id);
      setProfile(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error deleting profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPortfolioImage = useCallback(async (artistId: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.addPortfolioImage(artistId, formData);
      setProfile(prev => prev ? { 
        ...prev, 
        portfolioImages: [...(prev.portfolioImages || []), data] 
      } : null);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }, message?: string } }; message?: string };
      setError(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error adding image');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removePortfolioImage = useCallback(async (artistId: string, imageId: string) => {
    setLoading(true);
    setError(null);
    try {
      await artistService.removePortfolioImage(artistId, imageId);
      setProfile(prev => prev ? { 
        ...prev, 
        portfolioImages: (prev.portfolioImages || []).filter(img => img.id !== imageId) 
      } : null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }, message?: string } }; message?: string };
      setError(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error removing image');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile, fetchMyProfile, createProfile, updateProfile, deleteProfile, addPortfolioImage, removePortfolioImage };
};
