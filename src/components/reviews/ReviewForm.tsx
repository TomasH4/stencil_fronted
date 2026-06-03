import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateReviewDto } from '@/types/review.types';
import Button from '@/components/ui/Button';
import styles from './ReviewForm.module.css';

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, 'La calificación mínima es 1').max(5, 'La calificación máxima es 5'),
  comment: z.string().min(5, 'El comentario debe tener al menos 5 caracteres'),
});

interface ReviewFormProps {
  artistProfileId: string;
  onSubmit: (dto: CreateReviewDto) => Promise<void>;
}

export default function ReviewForm({ artistProfileId, onSubmit }: ReviewFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<{ rating: number; comment: string }>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: ''
    }
  });

  const submitHandler = async (data: { rating: number; comment: string }) => {
    await onSubmit({ ...data, artistProfileId });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <h3 className={styles.title}>Deja tu reseña</h3>
      
      <div className={styles.field}>
        <label htmlFor="rating" className={styles.label}>Calificación (1-5)</label>
        <input
          id="rating"
          type="number"
          min="1"
          max="5"
          className={`${styles.input} ${errors.rating ? styles.inputError : ''}`}
          {...register('rating')}
        />
        {errors.rating && <span className={styles.error}>{errors.rating.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="comment" className={styles.label}>Comentario</label>
        <textarea
          id="comment"
          rows={3}
          className={`${styles.textarea} ${errors.comment ? styles.inputError : ''}`}
          {...register('comment')}
        />
        {errors.comment && <span className={styles.error}>{errors.comment.message}</span>}
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Enviar Reseña
      </Button>
    </form>
  );
}
