'use client';

import { useEffect, useState } from 'react';
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleRoute from '@/components/auth/RoleRoute';
import { useAppointments } from '@/hooks/useAppointments';
import { useFavorites } from '@/hooks/useFavorites';
import { UserRole } from '@/types/auth.types';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import ArtistCard from '@/components/artists/ArtistCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

export default function ClientDashboardPage() {
  const { appointments, meta, loading: apptLoading, error: apptError, fetchMyAppointments, cancelAppointment } = useAppointments();
  const { favorites, loading: favLoading, error: favError, fetchFavorites, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'appointments' | 'favorites'>('appointments');

  useEffect(() => {
    fetchMyAppointments();
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
    await cancelAppointment(id);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, artistId: string) => {
    e.preventDefault();
    try {
      await toggleFavorite(artistId);
      await fetchFavorites(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PrivateRoute>
      <RoleRoute allowedRoles={[UserRole.CLIENT]}>
        <div className={styles.page}>
          <div className={styles.container}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Mi Panel</h1>
                <p className={styles.pageSubtitle}>Gestiona tus citas y artistas favoritos</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
              <button 
                onClick={() => setActiveTab('appointments')}
                style={{ background: 'none', border: 'none', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'appointments' ? '2px solid var(--color-accent)' : 'none', fontWeight: activeTab === 'appointments' ? 'bold' : 'normal' }}
              >
                Citas ({meta.total})
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                style={{ background: 'none', border: 'none', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'favorites' ? '2px solid var(--color-accent)' : 'none', fontWeight: activeTab === 'favorites' ? 'bold' : 'normal' }}
              >
                Favoritos ({favorites.length})
              </button>
            </div>

            {/* Content: Appointments */}
            {activeTab === 'appointments' && (
              <div>
                <ErrorMessage message={apptError} />
                {apptLoading && <div className={styles.spinnerWrapper}><Spinner size="lg" /></div>}
                {!apptLoading && !apptError && appointments.length === 0 && (
                  <EmptyState message="No tienes citas agendadas." icon={<span className={styles.emptyIcon}>📅</span>} />
                )}
                {!apptLoading && appointments.length > 0 && (
                  <div className={styles.appointmentsList}>
                    {appointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} showActions currentUserRole={UserRole.CLIENT} onCancel={handleCancel} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content: Favorites */}
            {activeTab === 'favorites' && (
              <div>
                <ErrorMessage message={favError} />
                {favLoading && <div className={styles.spinnerWrapper}><Spinner size="lg" /></div>}
                {!favLoading && !favError && favorites.length === 0 && (
                  <EmptyState message="No tienes artistas favoritos." icon={<span className={styles.emptyIcon}>❤️</span>} />
                )}
                {!favLoading && favorites.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                    {favorites.map((artist) => (
                      <ArtistCard 
                        key={artist.id} 
                        artist={artist} 
                        isFavorite={true} 
                        showFavoriteBtn 
                        onToggleFavorite={(e) => handleToggleFavorite(e, artist.id)} 
                      />
                    ))}
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
