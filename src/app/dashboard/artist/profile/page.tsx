'use client';

import { useEffect, useState } from 'react';
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleRoute from '@/components/auth/RoleRoute';
import { useAuthContext } from '@/context/AuthContext';
import { useArtistProfile } from '@/hooks/useArtistProfile';
import { UserRole } from '@/types/auth.types';
import { CreateArtistProfileDto, UpdateArtistProfileDto } from '@/types/artist.types';
import ArtistProfileForm from '@/components/artists/ArtistProfileForm';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

export default function ArtistProfilePage() {
  const { user } = useAuthContext();
  const { profile, loading, error, fetchProfile, createProfile, updateProfile } = useArtistProfile();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the artist profile associated with the logged-in user
    // The backend should return the profile by the authenticated user's artistProfile
    // We use the user id to search the profile
    if (user?.id) {
      fetchProfile(user.id).catch(() => {
        // Profile might not exist yet — that's OK
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSubmit = async (dto: CreateArtistProfileDto | UpdateArtistProfileDto) => {
    setFormError(null);
    try {
      if (profile) {
        await updateProfile(profile.id, dto as UpdateArtistProfileDto);
        setSuccessMsg('¡Perfil actualizado con éxito!');
      } else {
        await createProfile(dto as CreateArtistProfileDto);
        setSuccessMsg('¡Perfil creado con éxito! Ya eres visible para los clientes.');
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setFormError(e.response?.data?.message || e.message || 'Error al guardar el perfil');
    }
  };

  return (
    <PrivateRoute>
      <RoleRoute allowedRoles={[UserRole.TATTOO_ARTIST]}>
        <div className={styles.page}>
          <div className={styles.container}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>
                  {profile ? 'Editar mi Perfil' : 'Crear mi Perfil'}
                </h1>
                <p className={styles.pageSubtitle}>
                  {profile
                    ? 'Mantén tu información actualizada para atraer más clientes'
                    : 'Completa tu perfil para que los clientes te encuentren'}
                </p>
              </div>
              {profile && (
                <div className={styles.profileStatusBadge}>
                  <span className={styles.activeDot} />
                  Perfil activo
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className={styles.spinnerWrapper}>
                <Spinner size="lg" />
              </div>
            )}

            {/* Content */}
            {!loading && (
              <div className={styles.formCard}>
                {/* Success */}
                {successMsg && (
                  <div className={styles.successAlert}>✅ {successMsg}</div>
                )}

                {/* Error from fetch */}
                <ErrorMessage message={formError || (error && !profile ? null : error)} />

                {/* Form */}
                <ArtistProfileForm
                  onSubmit={handleSubmit}
                  initialData={profile ?? undefined}
                  isLoading={loading}
                />
              </div>
            )}

            {/* Profile preview */}
            {!loading && profile && (
              <div className={styles.previewCard}>
                <h2 className={styles.previewTitle}>Vista previa de tu perfil</h2>
                <div className={styles.previewGrid}>
                  <div className={styles.previewItem}>
                    <span className={styles.previewLabel}>Estilo</span>
                    <span className={styles.previewValue}>{profile.style}</span>
                  </div>
                  <div className={styles.previewItem}>
                    <span className={styles.previewLabel}>Ubicación</span>
                    <span className={styles.previewValue}>{profile.location}</span>
                  </div>
                  <div className={styles.previewItem}>
                    <span className={styles.previewLabel}>Precio mínimo</span>
                    <span className={styles.previewValue}>${profile.priceMin.toLocaleString()}</span>
                  </div>
                  <div className={styles.previewItem}>
                    <span className={styles.previewLabel}>Precio máximo</span>
                    <span className={styles.previewValue}>${profile.priceMax.toLocaleString()}</span>
                  </div>
                </div>
                {profile.bio && (
                  <div className={styles.previewBio}>
                    <span className={styles.previewLabel}>Biografía</span>
                    <p className={styles.previewBioText}>{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </RoleRoute>
    </PrivateRoute>
  );
}
