'use client';

import { useEffect } from 'react';
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

  const pending = appointments.filter(a => a.status === AppointmentStatus.PENDING);
  const confirmed = appointments.filter(a => a.status === AppointmentStatus.CONFIRMED);
  const cancelled = appointments.filter(a => a.status === AppointmentStatus.CANCELLED);

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

            {/* Pending appointments first */}
            {!loading && pending.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.pendingDot} /> Pendientes de confirmación
                </h2>
                <div className={styles.appointmentsList}>
                  {pending.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions
                      currentUserRole={UserRole.TATTOO_ARTIST}
                      onConfirm={handleConfirm}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed */}
            {!loading && confirmed.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.confirmedDot} /> Confirmadas
                </h2>
                <div className={styles.appointmentsList}>
                  {confirmed.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions
                      currentUserRole={UserRole.TATTOO_ARTIST}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled */}
            {!loading && cancelled.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.cancelledDot} /> Canceladas
                </h2>
                <div className={styles.appointmentsList}>
                  {cancelled.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions={false}
                      currentUserRole={UserRole.TATTOO_ARTIST}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </RoleRoute>
    </PrivateRoute>
  );
}
