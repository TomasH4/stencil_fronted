import React from 'react';
import { useForm } from 'react-hook-form';
import { GetArtistsParams } from '@/types/artist.types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import styles from './ArtistFilters.module.css';

interface ArtistFiltersProps {
  onFilter: (params: GetArtistsParams) => void;
}

export default function ArtistFilters({ onFilter }: ArtistFiltersProps) {
  const { register, handleSubmit, reset } = useForm<GetArtistsParams>();

  const onSubmit = (data: GetArtistsParams) => {
    // Clean up empty values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v != null && v !== '')
    );
    onFilter(cleanedData);
  };

  const handleClear = () => {
    reset();
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.filtersForm}>
      <Input
        id="location"
        label="Ubicación"
        placeholder="Ej: Madrid, Barcelona"
        {...register('location')}
      />
      
      <Select
        id="style"
        label="Estilo"
        options={[
          { value: 'realismo', label: 'Realismo' },
          { value: 'blackwork', label: 'Blackwork' },
          { value: 'fine line', label: 'Fine Line' },
          { value: 'japonés', label: 'Japonés' },
          { value: 'acuarela', label: 'Acuarela' },
        ]}
        {...register('style')}
      />

      <div className={styles.priceGroup}>
        <Input
          id="priceMin"
          label="Precio Mín ($)"
          type="number"
          {...register('priceMin')}
        />
        <Input
          id="priceMax"
          label="Precio Máx ($)"
          type="number"
          {...register('priceMax')}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit">Buscar</Button>
        <Button type="button" variant="secondary" onClick={handleClear}>
          Limpiar
        </Button>
      </div>
    </form>
  );
}
