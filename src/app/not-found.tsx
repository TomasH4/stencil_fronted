import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.glowBg} />

        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>
          Oops, parece que esta página no existe o fue eliminada.
          Vuelve al inicio para seguir explorando tatuadores.
        </p>

        <Link href="/" className={styles.backBtn}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
