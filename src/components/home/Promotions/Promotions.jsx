import React from 'react';
import styles from './Promotions.module.css';

const Promotions = () => {
  const features = [
    {
      id: 1,
      icon: 'lightning',
      title: 'Easy and Fast',
      description: 'Complete your purchase on Digital Topup in just a few seconds.'
    },
    {
      id: 2,
      icon: 'rocket',
      title: 'Instant Delivery',
      description: 'Your top-up is credited to your game account instantly after payment.'
    },
    {
      id: 3,
      icon: 'card',
      title: 'Convenient Payments',
      description: "We've partnered with top providers in India for your convenience."
    },
    {
      id: 4,
      icon: 'phone',
      title: '24/7 Support',
      description: 'Our support team is always ready to assist you.'
    },
    {
      id: 5,
      icon: 'gift',
      title: 'Exciting Promotions',
      description: 'Enjoy the best deals and promotions available.'
    },
    {
      id: 6,
      icon: 'trophy',
      title: 'Earn Rewards',
      description: 'Get rewards for every purchase and redeem them for discounts.'
    }
  ];

  // Function to render icons based on the icon name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'lightning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      case 'rocket':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" />
          </svg>
        );
      case 'card':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'phone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        );
      case 'gift':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        );
      case 'trophy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
            <path d="M13 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z" />
            <path d="M5 13a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2z" />
            <path d="M13 13a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.promotionsContainer}>
      <div className={styles.promotionsContent}>
        <div className={styles.promotionsHeader}>
          <h2 className={styles.promotionsTitle}>Why Choose Digital Topup?</h2>
          <p className={styles.promotionsSubtitle}>
            Join millions of users who trust Digital Topup for fast and secure digital top-ups.
            Whether it's game credits, gift cards, subscription services or digital Services,
            enjoy instant delivery with no wait.
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map(feature => (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.iconContainer}>
                {renderIcon(feature.icon)}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;