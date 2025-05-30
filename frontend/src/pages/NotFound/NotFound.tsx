import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className={styles.homeLink}>
        Return Home
      </Link>
    </div>
  );
}