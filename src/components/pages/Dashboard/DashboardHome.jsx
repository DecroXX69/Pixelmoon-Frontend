import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, User, Wallet, RefreshCw } from 'lucide-react';
import { StatCard } from './StatCard';
import styles from './DashboardHome.module.css';

export const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    walletBalance: 0
  });
  const [loading, setLoading] = useState(true);
 const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userResponse, ordersResponse] = await Promise.all([
          fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const userData = await userResponse.json();
        const ordersData = await ordersResponse.json();

        setStats({
          walletBalance: userData.user?.balance || 0,
          totalOrders: ordersData.orders?.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <RefreshCw className={styles.loadingSpinner} size={32} />
          <p>Loading dashboard...</p>
          
          
        </div>
      );
    }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.pageHeader}>
        <h2>Welcome Back!</h2>
        <p>Here's what's happening with your account</p>
      </div>
      
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={12}
          color="primary"
        />
        <StatCard
          title="Wallet Balance"
          value={`₹${stats.walletBalance.toFixed(2)}`}
          icon={Wallet}
          trend={5}
          color="success"
        />
      </div>
      
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionCards}>
          <Link to="/user-dashboard/wallet" className={styles.actionCard}>
            <Plus size={24} />
            <span>Add Money</span>
          </Link>
          <Link to="/user-dashboard/orders" className={styles.actionCard}>
            <ShoppingBag size={24} />
            <span>New Order</span>
          </Link>
          <Link to="/user-dashboard/my-account" className={styles.actionCard}>
            <User size={24} />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};