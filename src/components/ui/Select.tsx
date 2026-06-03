import React, { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css'; // Reusing Input styles since they share the same base structure

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  id: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className = '', ...rest }, ref) => {
    return (
      <div className={`${styles.container} ${className}`.trim()}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...rest}
        >
          <option value="" disabled>Seleccione una opción</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
