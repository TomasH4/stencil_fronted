import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateArtistProfileDto, TattooArtistProfile } from '@/types/artist.types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import styles from './ArtistProfileForm.module.css';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre artístico debe tener al menos 2 caracteres').optional().or(z.literal('')),
  bio: z.string().min(10, 'La biografía debe tener al menos 10 caracteres'),
  style: z.string().min(1, 'Selecciona un estilo'),
  location: z.string().min(3, 'La ubicación es requerida'),
  priceMin: z.coerce.number().min(0, 'Precio mínimo no válido'),
  priceMax: z.coerce.number().min(0, 'Precio máximo no válido'),
  whatsappNumber: z.string().optional(),
  instagramUrl: z.string().url('URL de Instagram inválida').optional().or(z.literal('')),
}).refine(data => (Number(data.priceMin) <= Number(data.priceMax)), {
  message: "El precio mínimo no puede ser mayor al máximo",
  path: ["priceMax"],
});

type ProfileFormValues = {
  name?: string;
  bio: string;
  style: string;
  location: string;
  priceMin: number;
  priceMax: number;
  whatsappNumber?: string;
  instagramUrl?: string;
};

interface ArtistProfileFormProps {
  /** If provided, pre-fills the form with existing profile data */
  initialData?: Partial<TattooArtistProfile>;
  onSubmit: (dto: CreateArtistProfileDto) => void;
  isLoading?: boolean;
}

const STYLE_OPTIONS = [
  { value: 'realismo', label: 'Realismo' },
  { value: 'blackwork', label: 'Blackwork' },
  { value: 'fine line', label: 'Fine Line' },
  { value: 'japonés', label: 'Japonés' },
  { value: 'acuarela', label: 'Acuarela' },
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'neo-tradicional', label: 'Neo-Tradicional' },
  { value: 'geométrico', label: 'Geométrico' },
];

export default function ArtistProfileForm({ initialData, onSubmit, isLoading }: ArtistProfileFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: initialData?.name ?? '',
      bio: initialData?.bio ?? '',
      style: initialData?.style ?? '',
      location: initialData?.location ?? '',
      priceMin: initialData?.priceMin ?? 0,
      priceMax: initialData?.priceMax ?? 0,
      whatsappNumber: initialData?.whatsappNumber ?? '',
      instagramUrl: initialData?.instagramUrl ?? '',
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as CreateArtistProfileDto))} className={styles.form}>
      <Input
        id="name"
        label="Nombre Artístico"
        placeholder="Tu nombre o pseudónimo..."
        error={errors.name?.message}
        {...register('name')}
      />

      <div className={styles.fullWidth}>
        <label className={styles.label} htmlFor="bio">Biografía</label>
        <textarea
          id="bio"
          className={`${styles.textarea} ${errors.bio ? styles.inputError : ''}`}
          rows={4}
          placeholder="Cuéntales a los clientes sobre tu estilo, experiencia y especialidades..."
          {...register('bio')}
        />
        {errors.bio && <span className={styles.errorMessage}>{errors.bio.message}</span>}
      </div>

      <Select
        id="style"
        label="Estilo Principal"
        options={STYLE_OPTIONS}
        error={errors.style?.message}
        {...register('style')}
      />

      <Input
        id="location"
        label="Ubicación (ciudad o barrio)"
        placeholder="ej. Bogotá, Chapinero"
        error={errors.location?.message}
        {...register('location')}
      />

      <div className={styles.priceRow}>
        <Input
          id="priceMin"
          label="Precio Mínimo ($)"
          type="number"
          placeholder="0"
          error={errors.priceMin?.message}
          {...register('priceMin')}
        />
        <Input
          id="priceMax"
          label="Precio Máximo ($)"
          type="number"
          placeholder="0"
          error={errors.priceMax?.message}
          {...register('priceMax')}
        />
      </div>

      <div className={styles.contactRow}>
        <Input
          id="whatsappNumber"
          label="Número de WhatsApp"
          placeholder="ej. +573001234567"
          error={errors.whatsappNumber?.message}
          {...register('whatsappNumber')}
        />
        <Input
          id="instagramUrl"
          label="Perfil de Instagram"
          placeholder="https://instagram.com/tu_perfil"
          error={errors.instagramUrl?.message}
          {...register('instagramUrl')}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
          {initialData ? 'Actualizar Perfil' : 'Crear Perfil'}
        </Button>
      </div>
    </form>
  );
}
