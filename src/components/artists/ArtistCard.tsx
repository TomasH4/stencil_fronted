import React from 'react';
import Link from 'next/link';
import { TattooArtistProfile } from '@/types/artist.types';
import styles from './ArtistCard.module.css';

interface ArtistCardProps {
  artist: TattooArtistProfile;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  // Use artist.name if populated, otherwise fallback to email or "Artista"
  const name = artist.name || (artist.user?.email ? artist.user.email.split('@')[0] : 'Artista');

  return (
    <Link href={`/artists/${artist.id}`} className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.style}>{artist.style}</p>
        <div className={styles.details}>
          <span className={styles.location}>📍 {artist.location}</span>
          <span className={styles.price}>
            💵 ${artist.priceMin} - ${artist.priceMax}
          </span>
        </div>
      </div>
    </Link>
  );
}
