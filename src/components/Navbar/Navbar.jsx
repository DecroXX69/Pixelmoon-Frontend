import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Import the auth context
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth(); // Use the auth context
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`${styles.navbar} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoContainer}>
          <img 
            src="/src/assets/logo2.png" 
            alt="Digital Topup Logo" 
            className={styles.logo}
          />
        </Link>

        <button 
          className={styles.toggleButton} 
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          <span className={styles.toggleBar}></span>
          <span className={styles.toggleBar}></span>
          <span className={styles.toggleBar}></span>
        </button>

        <div className={`${styles.navLinks} ${expanded ? styles.expanded : ''}`}>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <Link to="/games" className={styles.navLink}>Games</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/blogs" className={styles.navLink}>Blogs</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/contact-us" className={styles.navLink}>Contact Us</Link>
            </li>
            {isAuthenticated && (
              <li className={styles.navItem}>
                <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
              </li>
            )}
          </ul>

          <div className={styles.navRight}>
            <div className={styles.searchIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </div>
            
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className={styles.userDropdown}>
                <div className={styles.userIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                </div>
                <div className={styles.dropdownContent}>
                  <Link to="/profile" className={styles.dropdownItem}>Profile</Link>
                  <Link to="/dashboard" className={styles.dropdownItem}>Dashboard</Link>
                  <button onClick={handleLogout} className={styles.dropdownItem}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={styles.loginButton}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;