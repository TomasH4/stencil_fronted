'use client';

import { useEffect, useState } from 'react';
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleRoute from '@/components/auth/RoleRoute';
import { useAppointments } from '@/hooks/useAppointments';
import { UserRole } from '@/types/auth.types';
import { AppointmentStatus } from '@/types/appointment.types';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

export default function ArtistDashboardPage() {
  const {
    appointments,
    loading,
    error,
    fetchArtistAppointments,
    updateStatus,
  } = useAppointments();

  useEffect(() => {
    fetchArtistAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = async (id: string) => {
    await updateStatus(id, { status: AppointmentStatus.CONFIRMED });
  };

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
    await updateStatus(id, { status: AppointmentStatus.CANCELLED });
  };

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const pending = appointments.filter(a => a.status === AppointmentStatus.PENDING);
  const confirmed = appointments.filter(a => a.status === AppointmentStatus.CONFIRMED);
  const cancelled = appointments.filter(a => a.status === AppointmentStatus.CANCELLED);

  const filteredAppointments = appointments.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return a.status === AppointmentStatus.PENDING;
    if (activeTab === 'confirmed') return a.status === AppointmentStatus.CONFIRMED;
    if (activeTab === 'cancelled') return a.status === AppointmentStatus.CANCELLED;
    return true;
  });

  return (
    <PrivateRoute>
      <RoleRoute allowedRoles={[UserRole.TATTOO_ARTIST]}>
        <div className={styles.page}>
          <div className={styles.container}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Mis Citas Recibidas</h1>
                <p className={styles.pageSubtitle}>
                  Gestiona las citas de tus clientes
                </p>
              </div>

              {/* Stats */}
              {!loading && appointments.length > 0 && (
                <div className={styles.statsRow}>
                  <div className={styles.statCard}>
                    <span className={styles.statNumber} style={{ color: 'var(--color-warning)' }}>
                      {pending.length}
                    </span>
                    <span className={styles.statLabel}>Pendientes</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statNumber} style={{ color: 'var(--color-success)' }}>
                      {confirmed.length}
                    </span>
                    <span className={styles.statLabel}>Confirmadas</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statNumber} style={{ color: 'var(--color-danger)' }}>
                      {cancelled.length}
                    </span>
                    <span className={styles.statLabel}>Canceladas</span>
                  </div>
                </div>
              )}
            </div>

            {/* States */}
            <ErrorMessage message={error} />

            {loading && (
              <div className={styles.spinnerWrapper}>
                <Spinner size="lg" />
              </div>
            )}

            {!loading && !error && appointments.length === 0 && (
              <EmptyState
                message="Aún no tienes citas agendadas. Cuando los clientes te reserven aparecerán aquí."
                icon={<span className={styles.emptyIcon}>🗓️</span>}
              />
            )}

            {/* Tabs Filter */}
            {!loading && !error && appointments.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setActiveTab('all')}
                  style={{ background: 'none', border: 'none', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'all' ? '2px solid var(--color-accent)' : 'none', fontWeight: activeTab === 'all' ? 'bold' : 'normal' }}
                >
                  Todas
                </button>
                <button 
                  onClick={() => setActiveTab('pending')}
                  style={{ background: 'none', border: 'none', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'pending' ? '2px solid var(--color-warning)' : 'none', fontWeight: activeTab === 'pending' ? 'bold' : 'normal', color: 'var(--color-warning)' }}
                >
                  Pendientes ({pending.length})
                </button>
                <button 
                  onClick={() => setActiveTab('confirmed')}
                  style={{ background: 'none', border: 'none', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'confirmed' ? '2px solid var(--color-success)' : 'none', fontWeight: activeTab === 'confirmed' ? 'bold' : 'normal', color: 'var(--color-success)' }}
                >
                  Confirmadas ({confirmed.length})
                </button>
                <button 
                  onClick={() => setActiveTab('cancelled')}
                  style={{ background: 'none', border: 'none', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'cancelled' ? '2px solid var(--color-danger)' : 'none', fontWeight: activeTab === 'cancelled' ? 'bold' : 'normal', color: 'var(--color-danger)' }}
                >
                  Canceladas ({cancelled.length})
                </button>
              </div>
            )}

            {/* Filtered appointments list */}
            {!loading && filteredAppointments.length > 0 && (
              <div className={styles.section}>
                <div className={styles.appointmentsList}>
                  {filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions={appointment.status !== AppointmentStatus.CANCELLED}
                      currentUserRole={UserRole.TATTOO_ARTIST}
                      onConfirm={handleConfirm}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state for filtered tab */}
            {!loading && !error && appointments.length > 0 && filteredAppointments.length === 0 && (
              <EmptyState
                message="No hay citas en este estado."
                icon={<span className={styles.emptyIcon}>🔍</span>}
              />
            )}
          </div>
        </div>
      </RoleRoute>
    </PrivateRoute>
  );
}
