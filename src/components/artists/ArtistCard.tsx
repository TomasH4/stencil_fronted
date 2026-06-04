import React from 'react';
import Link from 'next/link';
import { TattooArtistProfile } from '@/types/artist.types';
import styles from './ArtistCard.module.css';
import Button from '../ui/Button';

interface ArtistCardProps {
  artist: TattooArtistProfile;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  showFavoriteBtn?: boolean;
}

export default function ArtistCard({ artist, isFavorite, onToggleFavorite, showFavoriteBtn }: ArtistCardProps) {
  // Use email or fallback if name is not set
  const displayName = artist.name || `Tatuador #${artist.id.slice(0, 5)}`;

  return (
    <Link href={`/artists/${artist.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {artist.profilePictureUrl ? (
              <img src={artist.profilePictureUrl} alt={displayName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className={styles.name}>{displayName}</h3>
          </div>
          {showFavoriteBtn && (
            <button 
              onClick={(e) => { e.preventDefault(); if(onToggleFavorite) onToggleFavorite(e); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: isFavorite ? 'red' : 'var(--color-text-secondary)' }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.badge}>{artist.style}</span>
          <span className={styles.location}>📍 {artist.location}</span>
        </div>
        <div className={styles.price}>
          <span>Desde ${artist.priceMin.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
