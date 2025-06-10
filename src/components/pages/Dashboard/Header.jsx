import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

export const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.sidebarToggle} 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <h1>Dashboard</h1>
      </div>
      
      <div className={styles.headerRight}>
        <button 
          className={styles.themeToggle} 
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className={styles.userMenu}>
          <div className={styles.userAvatar}>U</div>
        </div>
      </div>
    </header>
  );
};