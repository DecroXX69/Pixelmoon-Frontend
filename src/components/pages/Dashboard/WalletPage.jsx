import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  RefreshCw,
  Search 
} from 'lucide-react';
import { FilterPanel } from './Filter';
import styles from './WalletPage.module.css';

export const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transaction');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });
const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';
  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // Fetch user balance
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setWalletData(prev => ({
          ...prev,
          balance: userData.user?.balance || 0
        }));
      }

      // Fetch wallet history
      const historyResponse = await fetch(`${API_URL}/wallet/history?type=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setWalletData(prev => ({ 
          ...prev, 
          history: historyData.transactions || [] 
        }));
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [activeTab]);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wallet/add-money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: parseFloat(addMoneyAmount) })
      });

      if (response.ok) {
        setShowAddMoney(false);
        setAddMoneyAmount('');
        fetchWalletData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add money');
      }
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.walletPage}>
      <div className={styles.pageHeader}>
        <h2>My Wallet</h2>
        <p>Manage your wallet balance and transaction history</p>
      </div>

      <div className={styles.walletBalanceCard}>
        <div className={styles.balanceInfo}>
          <h3>Current Balance</h3>
          <p className={styles.balanceAmount}>₹{walletData.balance.toFixed(2)}</p>
        </div>
        <div className={styles.walletActions}>
          <button 
            className={styles.addMoneyBtn}
            onClick={() => setShowAddMoney(true)}
          >
            <Plus size={16} />
            Add Money
          </button>
        </div>
      </div>

      <div className={styles.walletTabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'transaction' ? styles.active : ''}`}
          onClick={() => setActiveTab('transaction')}
        >
          Transaction History
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'cashback' ? styles.active : ''}`}
          onClick={() => setActiveTab('cashback')}
        >
          Cashback History
        </button>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        togglePanel={() => setFilterOpen(!filterOpen)}
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchWalletData}
        onClear={() => {
          setFilters({ period: '', from: '', to: '' });
          fetchWalletData();
        }}
      />

      <div className={styles.walletHistoryContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <RefreshCw size={24} />
            <span>Loading wallet history...</span>
          </div>
        ) : walletData.history.length === 0 ? (
          <div className={styles.emptyState}>
            <Wallet size={48} />
            <h3>No {activeTab} History</h3>
            <p>Your {activeTab} history will appear here.</p>
          </div>
        ) : (
          <div className={styles.historyList}>
            {walletData.history.map((item) => (
              <div key={item._id} className={styles.historyItem}>
                <div className={styles.historyIcon}>
                  {item.type === 'credit' ? 
                    <ArrowUpRight className={styles.creditIcon} size={20} /> : 
                    <ArrowDownRight className={styles.debitIcon} size={20} />
                  }
                </div>
                <div className={styles.historyDetails}>
                  <h4>{item.description}</h4>
                  <p>{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className={`${styles.historyAmount} ${styles[item.type]}`}>
                  {item.type === 'credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddMoney && (
        <div className={styles.modalOverlay} onClick={() => setShowAddMoney(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Money to Wallet</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowAddMoney(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMoney} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Amount</label>
                <input
                  type="number"
                  className={styles.formControl}
                  placeholder="Enter amount"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>
              <div className={styles.quickAmounts}>
                {[100, 500, 1000, 2000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={styles.quickAmountBtn}
                    onClick={() => setAddMoneyAmount(amount.toString())}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className={styles.modalFooter}>
                <button 
                  type="button"
                  className={styles.btnOutline}
                  onClick={() => setShowAddMoney(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0 || loading}
                >
                  {loading ? 'Processing...' : 'Add Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};