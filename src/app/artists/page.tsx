'use client';

import { useEffect, useState } from 'react';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useArtists } from '@/hooks/useArtists';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';
import { GetArtistsParams } from '@/types/artist.types';
import ArtistCard from '@/components/artists/ArtistCard';
import ArtistFilters from '@/components/artists/ArtistFilters';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function ArtistsPage() {
  const { user } = useAuthContext();
  const { artists, meta, loading, error, fetchArtists } = useArtists();
  const { favorites, fetchFavorites, toggleFavorite } = useFavorites();
  const [currentParams, setCurrentParams] = useState<GetArtistsParams>({ page: 1, limit: 9 });

  useEffect(() => {
    fetchArtists(currentParams);
    if (user?.role === UserRole.CLIENT) {
      fetchFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (params: GetArtistsParams) => {
    const newParams = { ...params, page: 1, limit: 9 };
    setCurrentParams(newParams);
    fetchArtists(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = { ...currentParams, page: newPage };
    setCurrentParams(newParams);
    fetchArtists(newParams);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, artistId: string) => {
    e.preventDefault();
    try {
      await toggleFavorite(artistId);
      await fetchFavorites(); // Refresh favorites list
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(meta.total / meta.limit);
  const currentPage = meta.page;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const isClient = user?.role === UserRole.CLIENT;

  return (
    <PrivateRoute>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Descubre Tatuadores</h1>
              <p className={styles.pageSubtitle}>
                Encuentra el artista perfecto para tu próximo tatuaje
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filtersSection}>
            <ArtistFilters onFilter={handleFilter} isLoading={loading} />
          </div>

          {/* Results */}
          <div className={styles.resultsSection}>
            {/* Results count */}
            {!loading && !error && (
              <p className={styles.resultsCount}>
                {meta.total === 0
                  ? 'Sin resultados'
                  : `${meta.total} tatuador${meta.total !== 1 ? 'es' : ''} encontrado${meta.total !== 1 ? 's' : ''}`}
              </p>
            )}

            {/* Error */}
            <ErrorMessage message={error} />

            {/* Loading */}
            {loading && (
              <div className={styles.spinnerWrapper}>
                <Spinner size="lg" />
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && artists.length === 0 && (
              <EmptyState
                message="No encontramos tatuadores con esos filtros. Prueba con otros criterios."
                icon={<span className={styles.emptyIcon}>🔍</span>}
              />
            )}

            {/* Artist grid */}
            {!loading && artists.length > 0 && (
              <div className={styles.grid}>
                {artists.map((artist) => {
                  const isFav = favorites.some((f) => f.id === artist.id);
                  return (
                    <ArtistCard 
                      key={artist.id} 
                      artist={artist} 
                      isFavorite={isFav}
                      showFavoriteBtn={isClient}
                      onToggleFavorite={(e) => handleToggleFavorite(e, artist.id)}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                >
                  ← Anterior
                </Button>
                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
