'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthContext } from '@/context/AuthContext';
import { useArtistProfile } from '@/hooks/useArtistProfile';
import { useReviews } from '@/hooks/useReviews';
import { useAppointments } from '@/hooks/useAppointments';
import { UserRole } from '@/types/auth.types';
import { CreateReviewDto } from '@/types/review.types';
import { CreateAppointmentDto } from '@/types/appointment.types';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { profile, loading: profileLoading, error: profileError, fetchProfile } = useArtistProfile();
  const { reviews, loading: reviewsLoading, error: reviewsError, fetchReviews, submitReview } = useReviews();
  const { createAppointment, loading: apptLoading, error: apptError } = useAppointments();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchReviews(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitReview = async (dto: CreateReviewDto) => {
    try {
      await submitReview({ ...dto, artistProfileId: id });
      setSuccessMsg('¡Reseña publicada con éxito!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      // error shown via hook state
    }
  };

  const handleCreateAppointment = async (dto: CreateAppointmentDto) => {
    try {
      await createAppointment({ ...dto, artistProfileId: id });
      setShowAppointmentForm(false);
      setSuccessMsg('¡Cita agendada con éxito! Puedes verla en tus citas.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      // error shown via hook state
    }
  };

  const isClient = user?.role === UserRole.CLIENT;

  if (profileLoading) {
    return (
      <PrivateRoute>
        <div className={styles.spinnerPage}>
          <Spinner size="lg" />
        </div>
      </PrivateRoute>
    );
  }

  if (profileError || !profile) {
    return (
      <PrivateRoute>
        <div className={styles.errorPage}>
          <ErrorMessage message={profileError || 'Perfil no encontrado'} />
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Artist Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {(profile.name?.[0] || profile.user?.email?.[0] || 'A').toUpperCase()}
              </div>
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.artistName}>
                {profile.name || profile.user?.email || `Tatuador #${profile.id.slice(0, 8)}`}
              </h1>
              <div className={styles.tagRow}>
                <span className={styles.styleTag}>{profile.style}</span>
                <span className={styles.locationTag}>📍 {profile.location}</span>
              </div>
              <p className={styles.priceRange}>
                💰 ${profile.priceMin.toLocaleString()} – ${profile.priceMax.toLocaleString()}
              </p>
            </div>

            {isClient && (
              <Button
                variant="primary"
                onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                className={styles.apptBtn}
              >
                {showAppointmentForm ? 'Cancelar' : '📅 Agendar cita'}
              </Button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className={styles.bioSection}>
              <h2 className={styles.sectionTitle}>Sobre el artista</h2>
              <p className={styles.bioText}>{profile.bio}</p>
            </div>
          )}

          {/* Portfolio */}
          {profile.portfolioImages && profile.portfolioImages.length > 0 && (
            <div className={styles.portfolioSection} style={{ marginTop: 'var(--space-6)' }}>
              <h2 className={styles.sectionTitle}>Portafolio</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: 'var(--space-4)', 
                marginTop: 'var(--space-4)' 
              }}>
                {profile.portfolioImages.map(img => (
                  <div key={img.id} style={{ 
                    position: 'relative', 
                    aspectRatio: '1', 
                    borderRadius: 'var(--radius-lg)', 
                    overflow: 'hidden', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '')}${img.imageUrl}`} 
                      alt={img.description || 'Portfolio item'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                    {img.description && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        color: 'white',
                        padding: 'var(--space-4) var(--space-3) var(--space-2)',
                        fontSize: 'var(--font-size-sm)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}>
                        {img.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className={styles.successAlert}>
              ✅ {successMsg}
            </div>
          )}

          {/* Appointment Form */}
          {showAppointmentForm && isClient && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Agendar una cita</h2>
              <ErrorMessage message={apptError} />
              <AppointmentForm
                onSubmit={handleCreateAppointment}
                isLoading={apptLoading}
              />
            </div>
          )}

          <div className={styles.bottomGrid}>
            {/* Reviews Section */}
            <div className={styles.reviewsSection}>
              <h2 className={styles.sectionTitle}>
                Reseñas
                {reviews.length > 0 && (
                  <span className={styles.reviewCount}>{reviews.length}</span>
                )}
              </h2>

              {reviewsLoading && <Spinner size="md" />}
              <ErrorMessage message={reviewsError} />

              {!reviewsLoading && reviews.length === 0 && (
                <EmptyState
                  message="Este artista aún no tiene reseñas. ¡Sé el primero!"
                  icon={<span style={{ fontSize: '2rem' }}>⭐</span>}
                />
              )}

              <div className={styles.reviewList}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Review Form for Clients */}
              {isClient && (
                <div className={styles.reviewFormWrapper}>
                  <h3 className={styles.subSectionTitle}>Deja tu reseña</h3>
                  <ReviewForm onSubmit={handleSubmitReview} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
