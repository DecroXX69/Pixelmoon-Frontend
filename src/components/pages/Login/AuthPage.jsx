import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../../Auth/Login';
import Register from '../../Auth/Register';
import Promotions from '../../home/Promotions/Promotions';
import Footer from '../../Footer/Footer';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authContentWrapper}>
        {isLoginPage ? <Login /> : <Register />}
      </div>
      
      {/* Promotions section */}
      <div className={styles.promotionSection}>
        <Promotions />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthPage;