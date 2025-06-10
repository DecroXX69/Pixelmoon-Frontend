import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, ShoppingBag, User, Users, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/user-dashboard', icon: Home, label: 'Dashboard' },
  { path: '/user-dashboard/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/user-dashboard/payments', icon: CreditCard, label: 'Payments' },
  { path: '/user-dashboard/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/user-dashboard/my-account', icon: User, label: 'Account Details' },
  { path: '/user-dashboard/refer-earn', icon: Users, label: 'Refer & Earn' },
  { path: '/user-dashboard/query', icon: HelpCircle, label: 'Query' }
];

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isDark ? styles.dark : ''}`}>  
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          {!isCollapsed && <span>GameTop</span>}
        </div>
      </div>
      
      <nav className={styles.sidebarNav}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={`${styles.navItem} ${styles.logoutBtn}`}>  
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
