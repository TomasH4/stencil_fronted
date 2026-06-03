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
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './page.module.css';

const registerSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Selecciona un rol' }),
  }),
});

type RegisterForm = z.infer<typeof registerSchema>;

const roleOptions = [
  { value: UserRole.CLIENT, label: 'Cliente — Quiero encontrar tatuadores' },
  { value: UserRole.TATTOO_ARTIST, label: 'Tatuador — Quiero mostrar mi trabajo' },
];

export default function RegisterPage() {
  const { register: registerUser } = useAuthContext();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: UserRole.CLIENT },
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      await registerUser(data);
      router.push('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setServerError(
        error.response?.data?.message || error.message || 'Error al crear la cuenta'
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
              <h1 className={styles.title}>Crea tu cuenta</h1>
              <p className={styles.subtitle}>Únete a la comunidad de Stencil</p>
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
                placeholder="Mínimo 6 caracteres"
                error={errors.password?.message}
                autoComplete="new-password"
                {...register('password')}
              />

              <Select
                id="role"
                label="¿Cuál es tu rol?"
                options={roleOptions}
                error={errors.role?.message}
                {...register('role')}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className={styles.submitBtn}
              >
                Crear cuenta
              </Button>
            </form>

            {/* Footer */}
            <p className={styles.footer}>
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className={styles.footerLink}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
