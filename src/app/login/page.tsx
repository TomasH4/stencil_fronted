'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute';
import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const response = await login(data);
      if (response.user.role === UserRole.TATTOO_ARTIST) {
        router.replace('/dashboard/artist');
      } else {
        router.replace('/artists');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setServerError(
        error.response?.data?.message || error.message || 'Credenciales incorrectas'
      );
    }
  };

  return (
    <PublicOnlyRoute>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.card}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.logoMark}>S</div>
              <h1 className={styles.title}>Bienvenido de vuelta</h1>
              <p className={styles.subtitle}>Inicia sesión en tu cuenta de Stencil</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <ErrorMessage message={serverError} />

              <Input
                id="email"
                label="Correo electrónico"
                type="email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
              />

              <Input
                id="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className={styles.submitBtn}
              >
                Iniciar sesión
              </Button>
            </form>

            {/* Footer */}
            <p className={styles.footer}>
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className={styles.footerLink}>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
