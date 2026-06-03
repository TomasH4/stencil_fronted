import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    return (
      <div className={`${styles.container} ${className}`.trim()}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...rest}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
