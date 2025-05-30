import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>My App</div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          {user ? (
            <li className={styles.navItem}>Welcome, {user.name}!</li>
          ) : (
            <>
              <li className={styles.navItem}>
                <Link to="/login" className={styles.navLink}>
                  Login
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/register" className={styles.navLink}>
                  Register
                </Link>
              </li>
            </>
          )}
          <li className={styles.navItem}>
            <Link to="/events" className={styles.navLink}>
              Events
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;