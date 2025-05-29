import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    sponsorCode: '',
  });
  const { register, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Create Account</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={styles.formInput}
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
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
              type="tel"
              id="mobile"
              name="mobile"
              className={styles.formInput}
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              id="sponsorCode"
              name="sponsorCode"
              className={styles.formInput}
              placeholder="Enter sponsor code (Optional)"
              value={formData.sponsorCode}
              onChange={handleChange}
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
            {isLoading ? 'Processing...' : 'Register now'}
          </button>
        </form>
        
        <div className={styles.authLinks}>
          <div className={styles.authLinkItem}>
            <span>Already a Customer?</span>
            <Link to="/login" className={styles.authLink}>Click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;