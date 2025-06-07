import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  CreditCard, 
  ShoppingBag, 
  User, 
  Users, 
  HelpCircle, 
  LogOut,
  Plus,
  Filter,
  Search,
  X,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Edit3,
  Save,
  RefreshCw
} from 'lucide-react';

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--background-color', '#0f172a');
      root.style.setProperty('--text-color', '#f8fafc');
      root.style.setProperty('--card-bg-color', '#1e293b');
      root.style.setProperty('--primary-color', '#3b82f6');
      root.style.setProperty('--border-color', '#334155');
      root.style.setProperty('--hover-color', '#475569');
    } else {
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#1e293b');
      root.style.setProperty('--card-bg-color', '#ffffff');
      root.style.setProperty('--primary-color', '#3b82f6');
      root.style.setProperty('--border-color', '#e2e8f0');
      root.style.setProperty('--hover-color', '#f1f5f9');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// API Configuration
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000';

// Mock API calls for payments and wallet
const mockApiCall = (endpoint, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes('/payments')) {
        resolve({
          success: true,
          data: []
        });
      } else if (endpoint.includes('/wallet/history')) {
        resolve({
          success: true,
          data: []
        });
      } else {
        resolve({ success: true, data: [] });
      }
    }, delay);
  });
};

// Sidebar Component
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  const menuItems = [
    { path: '/user-dashboard', icon: Home, label: 'Dashboard' },
    { path: '/user-dashboard/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/user-dashboard/payments', icon: CreditCard, label: 'Payments' },
    { path: '/user-dashboard/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/user-dashboard/my-account', icon: User, label: 'Account Details' },
    { path: '/user-dashboard/refer-earn', icon: Users, label: 'Refer & Earn' },
    { path: '/user-dashboard/query', icon: HelpCircle, label: 'Query' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDark ? 'dark' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!isCollapsed && <span>GameTop</span>}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <IconComponent size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
      
      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: var(--card-bg-color);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
        }
        
        .sidebar.collapsed {
          width: 70px;
        }
        
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
          text-align: center;
        }
        
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: var(--text-color);
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }
        
        .nav-item:hover {
          background: var(--hover-color);
          transform: translateX(4px);
        }
        
        .nav-item.active {
          background: var(--primary-color);
          color: white;
          border-radius: 0 25px 25px 0;
          margin-right: 10px;
        }
        
        .sidebar-footer {
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
        }
        
        .logout-btn {
          color: #ef4444;
        }
        
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

// Header Component
const Header = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1>Dashboard</h1>
      </div>
      
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="user-menu">
          <div className="user-avatar">U</div>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-header {
          height: 70px;
          background: var(--card-bg-color);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .sidebar-toggle {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: var(--text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        
        .sidebar-toggle:hover {
          background: var(--hover-color);
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .theme-toggle {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        
        .theme-toggle:hover {
          background: var(--hover-color);
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        h1 {
          margin: 0;
          color: var(--text-color);
          font-size: 1.5rem;
        }
      `}</style>
    </header>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .stat-card {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--primary-color);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .stat-value {
          margin: 0;
          font-size: 2rem;
          font-weight: bold;
          color: var(--text-color);
        }
        
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        
        .stat-trend.positive {
          color: #10b981;
        }
        
        .stat-trend.negative {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ isOpen, togglePanel, filters, setFilters, onSearch, onClear }) => {
  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <div className="filter-header">
        <h4>Filters</h4>
        <button className="toggle-btn" onClick={togglePanel}>
          <Filter size={16} />
        </button>
      </div>
      
      {isOpen && (
        <div className="filter-content">
          <div className="row g-3">
            <div className="col-md-3">
              <select 
                className="form-control"
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
              >
                <option value="">Select Period</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="From"
                value={filters.from}
                onChange={(e) => setFilters({...filters, from: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="To"
                value={filters.to}
                onChange={(e) => setFilters({...filters, to: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={onSearch}>
                  <Search size={16} />
                  Search
                </button>
                <button className="btn btn-outline-danger" onClick={onClear}>
                  <X size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .filter-panel {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-bottom: 1.5rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .filter-header {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .filter-header h4 {
          margin: 0;
          color: var(--text-color);
        }
        
        .toggle-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .toggle-btn:hover {
          background: var(--hover-color);
        }
        
        .filter-content {
          padding: 0 1.5rem 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        
        .form-control {
          background: var(--background-color);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
        }
        
        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }
        
        .btn-outline-danger {
          background: transparent;
          color: #ef4444;
          border: 1px solid #ef4444;
        }
        
        .btn-outline-danger:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    walletBalance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user data for wallet balance
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setStats(prev => ({
            ...prev,
            walletBalance: userData.user?.balance || 0
          }));
        }

        // Fetch orders to count them
        const ordersResponse = await fetch(`${API_BASE}/orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setStats(prev => ({
            ...prev,
            totalOrders: ordersData.orders?.length || 0
          }));
        }
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
      <div className="loading-container">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Loading dashboard...</p>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            color: var(--text-color);
          }
          
          .loading-spinner {
            animation: spin 1s linear infinite;
            color: var(--primary-color);
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Welcome Back!</h2>
        <p>Here's what's happening with your account</p>
      </div>
      
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            trend={12}
            color="primary"
          />
        </div>
        <div className="col-md-6">
          <StatCard
            title="Wallet Balance"
            value={`₹${stats.walletBalance.toFixed(2)}`}
            icon={Wallet}
            trend={5}
            color="success"
          />
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <Link to="/user-dashboard/wallet" className="action-card">
            <Plus size={24} />
            <span>Add Money</span>
          </Link>
          <Link to="/user-dashboard/orders" className="action-card">
            <ShoppingBag size={24} />
            <span>New Order</span>
          </Link>
          <Link to="/user-dashboard/my-account" className="action-card">
            <User size={24} />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h2 {
          margin: 0;
          color: var(--text-color);
          font-size: 2rem;
          font-weight: bold;
        }
        
        .page-header p {
          margin: 0.5rem 0 0 0;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .quick-actions h3 {
          color: var(--text-color);
          margin-bottom: 1rem;
        }
        
        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .action-card {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-color);
          transition: all 0.3s ease;
        }
        
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
};

// Orders Page
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

      const response = await fetch(`${API_BASE}/orders?${params}`, {
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

  const handleSearch = () => {
    fetchOrders();
  };

  const handleClear = () => {
    setFilters({ period: '', from: '', to: '' });
    setTimeout(fetchOrders, 100);
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h2>Orders History</h2>
        <p>Track all your gaming top-up orders</p>
      </div>
      
      <FilterPanel
        isOpen={filterOpen}
        togglePanel={() => setFilterOpen(!filterOpen)}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      
      <div className="orders-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="loading-spinner" size={24} />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} />
            <h3>No Orders Yet</h3>
            <p>Your order history will appear here once you make your first purchase.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">#{order.orderId}</span>
                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
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
      
      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h2 {
          margin: 0;
          color: var(--text-color);
        }
        
        .page-header p {
          margin: 0.5rem 0 0 0;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .orders-container {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--text-color);
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-state svg {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          margin: 1rem 0 0.5rem 0;
        }
        
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .order-card {
          background: var(--background-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.3s ease;
        }
        
        .order-card:hover {
          transform: translateY(-2px);
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .order-id {
          font-weight: bold;
          color: var(--text-color);
        }
        
        .order-status {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        
        .order-status.pending {
          background: #fbbf24;
          color: #92400e;
        }
        
        .order-status.processing {
          background: #60a5fa;
          color: #1e40af;
        }
        
        .order-status.completed {
          background: #34d399;
          color: #065f46;
        }
        
        .order-status.failed {
          background: #f87171;
          color: #991b1b;
        }
        
        .order-details h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
        }
        
        .order-details p {
          margin: 0.25rem 0;
          color: var(--text-color);
          opacity: 0.8;
          font-size: 0.9rem;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Payments Page (Stubbed)
// Payments Page
const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Stubbed API call
      await mockApiCall('/payments');
      setPayments([]);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSearch = () => {
    fetchPayments();
  };

  const handleClear = () => {
    setFilters({ period: '', from: '', to: '' });
    setTimeout(fetchPayments, 100);
  };

  return (
    <div className="payments-page">
      <div className="page-header">
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
      
      <div className="payments-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="loading-spinner" size={24} />
            <span>Loading payments...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={48} />
            <h3>No Payment History</h3>
            <p>Your payment transactions will appear here once you make your first payment.</p>
          </div>
        ) : (
          <div className="payments-grid">
            {payments.map((payment) => (
              <div key={payment.id} className="payment-card">
                <div className="payment-header">
                  <span className="payment-id">#{payment.id}</span>
                  <span className={`payment-status ${payment.status}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="payment-details">
                  <h4>{payment.method}</h4>
                  <p>Amount: ₹{payment.amount}</p>
                  <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h2 {
          margin: 0;
          color: var(--text-color);
        }
        
        .page-header p {
          margin: 0.5rem 0 0 0;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .payments-container {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--text-color);
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-state svg {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          margin: 1rem 0 0.5rem 0;
        }
        
        .payments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .payment-card {
          background: var(--background-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          transition: transform 0.3s ease;
        }
        
        .payment-card:hover {
          transform: translateY(-2px);
        }
        
        .payment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .payment-id {
          font-weight: bold;
          color: var(--text-color);
        }
        
        .payment-status {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        
        .payment-status.success {
          background: #34d399;
          color: #065f46;
        }
        
        .payment-status.pending {
          background: #fbbf24;
          color: #92400e;
        }
        
        .payment-status.failed {
          background: #f87171;
          color: #991b1b;
        }
        
        .payment-details h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
        }
        
        .payment-details p {
          margin: 0.25rem 0;
          color: var(--text-color);
          opacity: 0.8;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

// Wallet Page
const WalletPage = () => {
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

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // Fetch user balance
      const response = await fetch(`${API_BASE}/auth/me`, {
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

      // Fetch wallet history (stubbed)
      await mockApiCall(`/wallet/history?type=${activeTab}`);
      setWalletData(prev => ({ ...prev, history: [] }));
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [activeTab]);

  const handleSearch = () => {
    fetchWalletData();
  };

  const handleClear = () => {
    setFilters({ period: '', from: '', to: '' });
    setTimeout(fetchWalletData, 100);
  };

  const handleAddMoney = async () => {
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) return;
    
    // Stubbed add money logic
    await mockApiCall('/wallet/add-money', 1000);
    setShowAddMoney(false);
    setAddMoneyAmount('');
    fetchWalletData();
  };

  return (
    <div className="wallet-page">
      <div className="page-header">
        <h2>My Wallet</h2>
        <p>Manage your wallet balance and transaction history</p>
      </div>
      
      <div className="wallet-balance-card">
        <div className="balance-info">
          <h3>Current Balance</h3>
          <p className="balance-amount">₹{walletData.balance.toFixed(2)}</p>
        </div>
        <div className="wallet-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddMoney(true)}
          >
            <Plus size={16} />
            Add Money
          </button>
        </div>
      </div>

      <div className="wallet-tabs">
        <button 
          className={`tab-btn ${activeTab === 'transaction' ? 'active' : ''}`}
          onClick={() => setActiveTab('transaction')}
        >
          Transaction History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cashback' ? 'active' : ''}`}
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
        onSearch={handleSearch}
        onClear={handleClear}
      />
      
      <div className="wallet-history-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="loading-spinner" size={24} />
            <span>Loading wallet history...</span>
          </div>
        ) : walletData.history.length === 0 ? (
          <div className="empty-state">
            <Wallet size={48} />
            <h3>No {activeTab} History</h3>
            <p>Your {activeTab} history will appear here.</p>
          </div>
        ) : (
          <div className="history-list">
            {walletData.history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-icon">
                  {item.type === 'credit' ? 
                    <ArrowUpRight className="credit-icon" size={20} /> : 
                    <ArrowDownRight className="debit-icon" size={20} />
                  }
                </div>
                <div className="history-details">
                  <h4>{item.description}</h4>
                  <p>{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <div className={`history-amount ${item.type}`}>
                  {item.type === 'credit' ? '+' : '-'}₹{item.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="modal-overlay" onClick={() => setShowAddMoney(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Money to Wallet</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddMoney(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                />
              </div>
              <div className="quick-amounts">
                {[100, 500, 1000, 2000].map(amount => (
                  <button
                    key={amount}
                    className="quick-amount-btn"
                    onClick={() => setAddMoneyAmount(amount.toString())}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowAddMoney(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddMoney}
                disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0}
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h2 {
          margin: 0;
          color: var(--text-color);
        }
        
        .page-header p {
          margin: 0.5rem 0 0 0;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .wallet-balance-card {
          background: linear-gradient(135deg, var(--primary-color), #2563eb);
          color: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .balance-info h3 {
          margin: 0 0 0.5rem 0;
          opacity: 0.9;
        }
        
        .balance-amount {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
        }
        
        .wallet-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .tab-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--border-color);
          background: var(--card-bg-color);
          color: var(--text-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tab-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .wallet-history-container {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--text-color);
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-state svg {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          margin: 1rem 0 0.5rem 0;
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .history-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--background-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: transform 0.3s ease;
        }
        
        .history-item:hover {
          transform: translateY(-1px);
        }
        
        .history-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .credit-icon {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        
        .debit-icon {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        
        .history-details {
          flex: 1;
        }
        
        .history-details h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-color);
        }
        
        .history-details p {
          margin: 0;
          color: var(--text-color);
          opacity: 0.7;
          font-size: 0.9rem;
        }
        
        .history-amount {
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .history-amount.credit {
          color: #10b981;
        }
        
        .history-amount.debit {
          color: #ef4444;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: var(--card-bg-color);
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          overflow: hidden;
        }
        
        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--text-color);
        }
        
        .modal-close {
          background: none;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .modal-close:hover {
          background: var(--hover-color);
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-color);
          font-weight: 500;
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--background-color);
          color: var(--text-color);
          font-size: 1rem;
        }
        
        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .quick-amount-btn {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          background: var(--background-color);
          color: var(--text-color);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .quick-amount-btn:hover {
          border-color: var(--primary-color);
          background: rgba(59, 130, 246, 0.1);
        }
        
        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-outline {
          background: transparent;
          color: var(--text-color);
          border: 1px solid var(--border-color);
        }
        
        .btn-outline:hover {
          background: var(--hover-color);
        }
      `}</style>
    </div>
  );
};

// Complete AccountDetailsPage - Replace the existing one
const AccountDetailsPage = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    state: '',
    role: 'user'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          name: data.user.name || '',
          email: data.user.email || '',
          mobile: data.user.mobile || '',
          gender: data.user.gender || '',
          state: data.user.state || '',
          role: data.user.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const updateData = {
        name: userDetails.name,
        gender: userDetails.gender,
        state: userDetails.state
      };

      // Add password if provided
      if (passwords.new && passwords.current) {
        if (passwords.new !== passwords.confirm) {
          alert('New passwords do not match');
          setUpdating(false);
          return;
        }
        updateData.password = passwords.new;
      }

      // Stubbed API call for now
      await mockApiCall('/auth/update-profile', 1000);
      
      alert('Profile updated successfully!');
      setIsEditing(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'reseller': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="loading-spinner" size={32} />
        <p>Loading account details...</p>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            color: var(--text-color);
          }
          
          .loading-spinner {
            animation: spin 1s linear infinite;
            color: var(--primary-color);
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="page-header">
        <h2>Account Details</h2>
        <p>Manage your personal information and security settings</p>
      </div>
      
      <div className="account-container">
        <div className="profile-header">
          <div className="avatar">
            {userDetails.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h3>{userDetails.name}</h3>
            <span 
              className="role-badge"
              style={{ backgroundColor: getRoleColor(userDetails.role) }}
            >
              {userDetails.role.toUpperCase()}
            </span>
          </div>
          <div className="profile-actions">
            <button
              className="btn btn-outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="profile-form">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={userDetails.email}
                  disabled
                />
                <small className="form-text">Email cannot be changed</small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={userDetails.mobile}
                  disabled
                />
                <small className="form-text">Mobile number cannot be changed</small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  value={userDetails.gender}
                  onChange={(e) => setUserDetails({...userDetails, gender: e.target.value})}
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your state"
                  value={userDetails.state}
                  onChange={(e) => setUserDetails({...userDetails, state: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="password-section">
              <h4>Change Password (Optional)</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter new password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm new password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={handleUpdateProfile}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .account-page {
          padding: 2rem;
        }
        
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h2 {
          margin: 0;
          color: var(--text-color);
        }
        
        .page-header p {
          margin: 0.5rem 0 0 0;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .account-container {
          background: var(--card-bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, var(--primary-color), #2563eb);
          color: white;
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          backdrop-filter: blur(10px);
        }
        
        .profile-info {
          flex: 1;
        }
        
        .profile-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }
        
        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
        }
        
        .profile-form {
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-color);
          font-weight: 500;
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--background-color);
          color: var(--text-color);
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .form-control:disabled {
          background: var(--hover-color);
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-text {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.6;
        }
        
        .password-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }
        
        .password-section h4 {
          margin: 0 0 1.5rem 0;
          color: var(--text-color);
          font-size: 1.2rem;
        }
        
        .password-input {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .password-toggle:hover {
          background: var(--hover-color);
        }
        
        .form-actions {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-outline {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -0.75rem;
        }
        
        .col-md-4, .col-md-6, .col-md-12 {
          padding: 0 0.75rem;
        }
        
        .col-md-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }
        
        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }
        
        .col-md-12 {
          flex: 0 0 100%;
          max-width: 100%;
        }
        
        @media (max-width: 768px) {
          .col-md-4, .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          
          .account-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;