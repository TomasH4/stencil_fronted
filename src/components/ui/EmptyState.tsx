import React, { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <p className={styles.message}>{message}</p>
    </div>
  );
}
