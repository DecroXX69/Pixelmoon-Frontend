import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { FilterPanel } from './Filter';
import styles from './OrdersPage.module.css';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });
const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

      const response = await fetch(`${API_URL}/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.ordersPage}>
      <div className={styles.pageHeader}>
        <h2>Orders History</h2>
        <p>Track all your gaming top-up orders</p>
      </div>
      
      <FilterPanel
        isOpen={filterOpen}
        togglePanel={() => setFilterOpen(!filterOpen)}
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchOrders}
        onClear={() => {
          setFilters({ period: '', from: '', to: '' });
          setTimeout(fetchOrders, 100);
        }}
      />
      
      <div className={styles.ordersContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <RefreshCw size={24} />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingBag size={48} />
            <h3>No Orders Yet</h3>
            <p>Your order history will appear here once you make your first purchase.</p>
          </div>
        ) : (
          <div className={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>#{order.orderId}</span>
                  <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <h4>{order.pack?.name}</h4>
                  <p>Game ID: {order.gameUserInfo?.userId}</p>
                  <p>Amount: ₹{order.pack?.price}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};