import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className={styles.container}>
      <div 
        className={`${styles.spinner} ${styles[size]}`}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
}
