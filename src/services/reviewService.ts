import api from './api';
import { Review, CreateReviewDto } from '../types/review.types';
import { PaginatedResponse } from '../types/api.types';

export const reviewService = {
  getReviewsByArtist: async (
    artistId: string, 
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Review>> => {
    const { data } = await api.get<PaginatedResponse<Review>>(`/reviews/artist/${artistId}`, { params });
    return data;
  },

  createReview: async (dto: CreateReviewDto): Promise<Review> => {
    const { data } = await api.post<{data: Review}>('/reviews', dto);
    return data.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  }
};
