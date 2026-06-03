'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';
import Button from '@/components/ui/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthContext();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/">Stencil</Link>
        </div>

        <div className={styles.links}>
          {isAuthenticated && user ? (
            <>
              <Link href="/artists" className={styles.link}>Artistas</Link>
              {user.role === UserRole.CLIENT && (
                <Link href="/dashboard/client" className={styles.link}>Mis Citas</Link>
              )}
              {user.role === UserRole.TATTOO_ARTIST && (
                <>
                  <Link href="/dashboard/artist" className={styles.link}>Mis Citas</Link>
                  <Link href="/dashboard/artist/profile" className={styles.link}>Mi Perfil</Link>
                </>
              )}
              <Button variant="secondary" onClick={logout} className={styles.logoutBtn}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.link}>Iniciar sesión</Link>
              <Link href="/register">
                <Button variant="primary">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
