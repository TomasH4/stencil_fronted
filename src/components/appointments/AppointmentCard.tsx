import React from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment.types';
import { UserRole } from '@/types/auth.types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import styles from './AppointmentCard.module.css';

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
  currentUserRole: UserRole;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

export default function AppointmentCard({ 
  appointment, 
  showActions = false, 
  currentUserRole,
  onCancel,
  onConfirm
}: AppointmentCardProps) {
  const formattedDate = new Date(appointment.date).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  const displayName = currentUserRole === UserRole.CLIENT 
    ? `Artista: ${appointment.artistName || 'Desconocido'}`
    : `Cliente: ${appointment.clientName || 'Desconocido'}`;

  const canCancel = appointment.status !== AppointmentStatus.CANCELLED;
  const canConfirm = currentUserRole === UserRole.TATTOO_ARTIST && appointment.status === AppointmentStatus.PENDING;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>{formattedDate}</h4>
        <Badge status={appointment.status} />
      </div>
      
      <div className={styles.body}>
        <p className={styles.name}>{displayName}</p>
        {appointment.notes && (
          <div className={styles.notes}>
            <strong>Notas:</strong> {appointment.notes}
          </div>
        )}
      </div>

      {showActions && (canCancel || canConfirm) && (
        <div className={styles.actions}>
          {canConfirm && onConfirm && (
            <Button onClick={() => onConfirm(appointment.id)} className={styles.btn}>
              Confirmar
            </Button>
          )}
          {canCancel && onCancel && (
            <Button variant="danger" onClick={() => onCancel(appointment.id)} className={styles.btn}>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
