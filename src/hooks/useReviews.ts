import { useState, useCallback } from 'react';
import { Review, CreateReviewDto } from '../types/review.types';
import { reviewService } from '../services/reviewService';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (artistId: string, params?: { page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewService.getReviewsByArtist(artistId, params);
      setReviews(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error fetching reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (dto: CreateReviewDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewService.createReview(dto);
      setReviews(prev => [data, ...prev]);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error submitting review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeReview = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await reviewService.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error deleting review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reviews, meta, loading, error, fetchReviews, submitReview, removeReview };
};
