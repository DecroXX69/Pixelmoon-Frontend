import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, Filter, Search, X } from 'lucide-react';
import { FilterPanel } from './Filter';
import styles from './PaymentsPage.module.css';

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });
const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

      const response = await fetch(`${API_URL}/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return styles.statusSuccess;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSearch = () => {
    fetchPayments();
  };

  const handleClear = () => {
    setFilters({ period: '', from: '', to: '' });
    setTimeout(fetchPayments, 100);
  };

  return (
    <div className={styles.paymentsPage}>
      <div className={styles.pageHeader}>
        <h2>Payment History</h2>
        <p>Track all your payment transactions and wallet top-ups</p>
      </div>
      
      <FilterPanel
        isOpen={filterOpen}
        togglePanel={() => setFilterOpen(!filterOpen)}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      
      <div className={styles.paymentsContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <RefreshCw size={24} />
            <span>Loading payments...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className={styles.emptyState}>
            <CreditCard size={48} />
            <h3>No Payment History</h3>
            <p>Your payment transactions will appear here once you make your first payment.</p>
          </div>
        ) : (
          <div className={styles.paymentsGrid}>
            {payments.map((payment) => (
              <div key={payment._id} className={styles.paymentCard}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentId}>#{payment.transactionId}</span>
                    <span className={`${styles.paymentStatus} ${getStatusBadgeClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <span className={styles.paymentDate}>
                    {formatDate(payment.createdAt)}
                  </span>
                </div>

                <div className={styles.paymentDetails}>
                  <div className={styles.paymentMethod}>
                    <CreditCard size={20} />
                    <span>{payment.method}</span>
                  </div>
                  <div className={styles.paymentAmount}>
                    <span className={styles.amount}>₹{payment.amount.toFixed(2)}</span>
                    <span className={styles.purpose}>{payment.purpose}</span>
                  </div>
                </div>

                {payment.status === 'failed' && payment.failureReason && (
                  <div className={styles.failureReason}>
                    <p>Failure Reason: {payment.failureReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};