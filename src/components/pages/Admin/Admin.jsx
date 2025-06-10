import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './admin.module.css';
import VoucherManagement from './VoucherManagement'
import UserManagement from './UserManagement';
import BannerManager from './BannerManager';
import { GameManagement } from './GameManagement';

const AdminPanel = () => {
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('games');
  const [balances, setBalances] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // B) On first load (and whenever user changes), fetch list of games and balances
  useEffect(() => {
    if (user?.role === 'admin') {
     
      fetchBalances();
    }
  }, [user]);

  

  // 1) Fetch balances endpoint (aggregate of 3 providers)
  const fetchBalances = async () => {
    try {
      const res = await fetch(`${API_BASE}/balances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        console.error('fetchBalances failed:', await res.text());
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBalances(data.balances);
      }
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

    

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };


  

  

  if (user?.role !== 'admin') {
    return (
      <div className={`${styles.accessDenied} d-flex align-items-center justify-content-center`}>
        <div className="text-center">
          <h2 className="display-6 mb-3">Access Denied</h2>
          <p className="text-muted">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className="container-fluid py-4">
        <div className="mb-4">
          <h1 className="display-5 fw-bold">Admin Panel</h1>
        </div>

        {/* Balance Display */}
        {balances && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">API Balances</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">Smile.one</h6>
                        <h4 className="text-primary">${balances.smileone || '0.00'}</h4>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">Yokcash</h6>
                        <h4 className="text-success">${balances.yokcash || '0.00'}</h4>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">Hopestore</h6>
                        <h4 className="text-warning">${balances.hopestore || '0.00'}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={clearMessages}></button>
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={clearMessages}></button>
          </div>
        )}

       
       {/* Tab Navigation */}
<div className="mb-4">
  <ul className="nav nav-tabs">
    {['games', 'users', 'orders', 'voucher', 'analytics', 'banner'].map((tab) => (
      <li className="nav-item" key={tab}>
        <button
          className={`nav-link text-capitalize ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      </li>
    ))}
  </ul>
</div>

        {/* Games Tab */}
        {activeTab === 'games' && <GameManagement />}

        {/* Users Tab */}
              
{activeTab === 'users' && (
  <div className="row">
    <div className="col-12">
      <UserManagement />
    </div>
  </div>
)}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">Order Management</h2>
              </div>
              <div className="card">
                <div className="card-body">
                  <p className="text-muted">Order management features coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Tab */}
{activeTab === 'voucher' && (
  <div className="row">
    <div className="col-12">
      <VoucherManagement />
    </div>
  </div>
)}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">Analytics</h2>
              </div>
              <div className="card">
                <div className="card-body">
                  <p className="text-muted">Analytics dashboard coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}


{activeTab === 'banner' && (
  <div className="row">
    <div className="col-12">
      <BannerManager />
    </div>
  </div>
)}
    

      </div>
    </div>
  );
};

export default AdminPanel;