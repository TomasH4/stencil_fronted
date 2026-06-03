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
  const { profile, loading, error, fetchMyProfile, createProfile, updateProfile, addPortfolioImage, removePortfolioImage } = useArtistProfile();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the artist profile associated with the logged-in user
    if (user?.id) {
      fetchMyProfile().catch(() => {
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState('');

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (imageDesc) {
        formData.append('description', imageDesc);
      }
      await addPortfolioImage(profile.id, formData);
      setSuccessMsg('Imagen subida con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
      setSelectedFile(null);
      setImageDesc('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setFormError(e.response?.data?.message || e.message || 'Error al subir la imagen');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!profile) return;
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return;
    try {
      await removePortfolioImage(profile.id, imageId);
      setSuccessMsg('Imagen eliminada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setFormError(e.response?.data?.message || e.message || 'Error al eliminar la imagen');
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

            {/* Portfolio */}
            {!loading && profile && (
              <div className={styles.portfolioSection}>
                <div className={styles.portfolioHeader}>
                  <h2 className={styles.previewTitle} style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>Mi Portafolio</h2>
                </div>

                <form className={styles.uploadForm} onSubmit={handleUploadImage}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="text" 
                      placeholder="Descripción (opcional)" 
                      value={imageDesc}
                      onChange={(e) => setImageDesc(e.target.value)}
                      style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                    />
                    <button 
                      type="submit" 
                      disabled={!selectedFile}
                      style={{ padding: '8px 16px', borderRadius: '4px', background: 'var(--color-accent)', color: 'white', border: 'none', cursor: selectedFile ? 'pointer' : 'not-allowed', opacity: selectedFile ? 1 : 0.5 }}
                    >
                      Subir Imagen
                    </button>
                  </div>
                </form>

                {profile.portfolioImages && profile.portfolioImages.length > 0 ? (
                  <div className={styles.portfolioGrid}>
                    {profile.portfolioImages.map(img => (
                      <div key={img.id} className={styles.portfolioItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '')}${img.imageUrl}`} alt={img.description || 'Portfolio item'} />
                        <button 
                          className={styles.deleteImageBtn} 
                          onClick={() => handleDeleteImage(img.id)}
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Aún no has subido imágenes a tu portafolio.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </RoleRoute>
    </PrivateRoute>
  );
}
