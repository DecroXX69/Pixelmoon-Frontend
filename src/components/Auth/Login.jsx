import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Login</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formInput}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formInput}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>
        
        <div className={styles.authLinks}>
          <div className={styles.authLinkItem}>
            <span>New Customer?</span>
            <Link to="/register" className={styles.authLink}>Sign Up</Link>
          </div>
          <div className={styles.authLinkItem}>
            <span>Forgot Password?</span>
            <Link to="/forgot-password" className={styles.authLink}>Click Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;