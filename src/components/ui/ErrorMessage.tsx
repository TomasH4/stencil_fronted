import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string | null;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon}>⚠️</span>
      <p className={styles.text}>{message}</p>
    </div>
  );
}
