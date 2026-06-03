'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';
import Spinner from '@/components/ui/Spinner';

export default function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === UserRole.CLIENT) {
        router.replace('/artists');
      } else if (user.role === UserRole.TATTOO_ARTIST) {
        router.replace('/dashboard/artist');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
