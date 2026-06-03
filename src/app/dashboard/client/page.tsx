'use client';

import { useEffect } from 'react';
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleRoute from '@/components/auth/RoleRoute';
// unused import removed
import { useAppointments } from '@/hooks/useAppointments';
import { UserRole } from '@/types/auth.types';
// unused import removed
import AppointmentCard from '@/components/appointments/AppointmentCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

export default function ClientDashboardPage() {
  const {
    appointments,
    meta,
    loading,
    error,
    fetchMyAppointments,
    cancelAppointment,
  } = useAppointments();

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
    await cancelAppointment(id);
  };

  return (
    <PrivateRoute>
      <RoleRoute allowedRoles={[UserRole.CLIENT]}>
        <div className={styles.page}>
          <div className={styles.container}>
            {/* Header */}
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Mis Citas</h1>
                <p className={styles.pageSubtitle}>
                  Gestiona tus citas con tatuadores
                </p>
              </div>
              <div className={styles.statsCard}>
                <span className={styles.statNumber}>{meta.total}</span>
                <span className={styles.statLabel}>
                  {meta.total === 1 ? 'cita' : 'citas'} en total
                </span>
              </div>
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
                message="No tienes citas agendadas. Busca tatuadores y agenda tu primera cita."
                icon={<span className={styles.emptyIcon}>📅</span>}
              />
            )}

            {/* Appointments list */}
            {!loading && appointments.length > 0 && (
              <div className={styles.appointmentsList}>
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions
                    currentUserRole={UserRole.CLIENT}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </RoleRoute>
    </PrivateRoute>
  );
}
