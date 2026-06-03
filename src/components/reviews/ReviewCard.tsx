import React from 'react';
import { Review } from '@/types/review.types';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{review.clientName || 'Usuario'}</h4>
        <div className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className={styles.comment}>{review.comment}</p>
      <span className={styles.date}>{formattedDate}</span>
    </div>
  );
}
