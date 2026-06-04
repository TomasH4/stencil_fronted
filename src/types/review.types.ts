export interface Review {
  id: string;
  clientId: string;
  clientName?: string; // May not be provided by backend
  clientEmail?: string; // Provided by backend
  artistProfileId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewDto {
  artistProfileId: string;
  rating: number;
  comment: string;
}
