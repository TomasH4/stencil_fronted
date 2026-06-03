import React from 'react';
import { AppointmentStatus } from '@/types/appointment.types';
import styles from './Badge.module.css';

interface BadgeProps {
  status: AppointmentStatus;
}

export default function Badge({ status }: BadgeProps) {
  const statusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Pendiente',
    [AppointmentStatus.CONFIRMED]: 'Confirmado',
    [AppointmentStatus.CANCELLED]: 'Cancelado',
  };

  const statusClass = styles[status.toLowerCase()] || styles.default;

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      {statusLabels[status] || status}
    </span>
  );
}
