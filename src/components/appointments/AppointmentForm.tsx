import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateAppointmentDto } from '@/types/appointment.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './AppointmentForm.module.css';

const appointmentSchema = z.object({
  date: z.string().min(1, 'Selecciona una fecha y hora'),
  notes: z.string().optional(),
});

interface AppointmentFormProps {
  artistProfileId: string;
  onSubmit: (dto: CreateAppointmentDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function AppointmentForm({ artistProfileId, onSubmit, onCancel, isLoading }: AppointmentFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<{ date: string; notes?: string }>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: '',
      notes: ''
    }
  });

  const submitHandler = async (data: { date: string; notes?: string }) => {
    // Add :00 if needed for valid Date parsing or keep as is since datetime-local returns YYYY-MM-DDThh:mm
    const dateObj = new Date(data.date);
    await onSubmit({ 
      artistProfileId, 
      date: dateObj.toISOString(), 
      notes: data.notes 
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <h3 className={styles.title}>Agendar Cita</h3>
      
      <Input
        id="date"
        label="Fecha y Hora"
        type="datetime-local"
        error={errors.date?.message}
        {...register('date')}
      />

      <div className={styles.field}>
        <label htmlFor="notes" className={styles.label}>Notas adicionales (opcional)</label>
        <textarea
          id="notes"
          rows={3}
          className={`${styles.textarea} ${errors.notes ? styles.inputError : ''}`}
          placeholder="Ej: Quiero un tatuaje de 10x10cm en el brazo..."
          {...register('notes')}
        />
        {errors.notes && <span className={styles.error}>{errors.notes.message}</span>}
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading || isSubmitting}>
          Confirmar
        </Button>
      </div>
    </form>
  );
}
