import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Home.module.scss';
import kuru from '../../img/kururin-kuru-kuru.gif';

export default function Home() {
  const { user } = useAuth() || {}; // Add fallback for null context

  return (
    <div className={styles.homeContainer}>
      <img src={kuru} alt="App Logo" className={styles.logo} />
      <h1>Welcome to Event Manager</h1>
      <p>
        Discover and manage events in your area.
        {user ? ' Browse upcoming events or create your own.' : ' Sign up or login to get started.'}
      </p>

      <div className={styles.ctaButtons}>
        {user ? (
          <Link to="/events" className="primary-button">
            View Events
          </Link>
        ) : (
          <>
          </>
        )}
      </div>
    </div>
  );
}