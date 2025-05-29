import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <footer className={`${styles.footer} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className="container">
        <div className="row">
          <div className={`col-md-4 ${styles.footerColumn}`}>
            <h4>About Us</h4>
            <p>
              Game Topup is your trusted platform for instant digital top-ups for your 
              favorite games, gift cards, and subscriptions with secure payment options 
              and 24/7 customer support.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" aria-label="Facebook" className={styles.socialIcon}>
                <FaFacebook />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className={styles.socialIcon}>
                <FaTwitter />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className={styles.socialIcon}>
                <FaLinkedin />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className={styles.socialIcon}>
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div className={`col-md-2 ${styles.footerColumn}`}>
            <h4>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/games">Games</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          
          <div className={`col-md-3 ${styles.footerColumn}`}>
            <h4>Popular Games</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/games/mobile-legends">Mobile Legends</Link></li>
              <li><Link to="/games/pubg">PUBG Mobile</Link></li>
              <li><Link to="/games/free-fire">Free Fire</Link></li>
              <li><Link to="/games/call-of-duty">Call of Duty Mobile</Link></li>
              <li><Link to="/games/valorant">Valorant</Link></li>
            </ul>
          </div>
          
          <div className={`col-md-3 ${styles.footerColumn}`}>
            <h4>Contact Us</h4>
            <ul className={styles.contactInfo}>
              <li>Email: support@gametopup.com</li>
              <li>Phone: +91 9876543210</li>
              <li>Working Hours: 24/7 Support</li>
            </ul>
            
            <div className={styles.paymentMethods}>
              <h5>Payment Methods</h5>
              <div className={styles.paymentIcons}>
                <span className={styles.paymentIcon}>Visa</span>
                <span className={styles.paymentIcon}>MasterCard</span>
                <span className={styles.paymentIcon}>PayTM</span>
                <span className={styles.paymentIcon}>UPI</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Game Topup. All Rights Reserved.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/refund">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;