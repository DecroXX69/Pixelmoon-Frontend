// src/components/pages/Dashboard/DashboardLayout.jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, CreditCard, Wallet, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Import all dashboard pages
import { DashboardHome } from './DashboardHome';
import { OrdersPage } from './OrdersPage';
import { PaymentsPage } from './PaymentsPage';
import { WalletPage } from './WalletPage';
import { AccountDetailsPage } from './AccountDetailsPage';

import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/user-dashboard' },
    { icon: ShoppingBag,      label: 'Orders',    path: '/user-dashboard/orders' },
    { icon: CreditCard,       label: 'Payments',  path: '/user-dashboard/payments' },
    { icon: Wallet,           label: 'Wallet',    path: '/user-dashboard/wallet' },
    { icon: User,             label: 'Account Details', path: '/user-dashboard/my-account' }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Gaming Hub</h3>
          <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1>Dashboard</h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>
        <main className={styles.dashboardMain}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="orders"     element={<OrdersPage />} />
            <Route path="payments"   element={<PaymentsPage />} />
            <Route path="wallet"     element={<WalletPage />} />
            <Route path="my-account" element={<AccountDetailsPage />} />
          </Routes>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;
