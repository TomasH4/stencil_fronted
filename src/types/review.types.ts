export interface Review {
  id: string;
  clientId: string;
  clientName: string; // From the instructions (Review con campo clientName)
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
