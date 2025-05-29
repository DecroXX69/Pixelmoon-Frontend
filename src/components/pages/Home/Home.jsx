import React, { useContext, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Hero from '../../home/Hero/Hero';
import GameShowcase from '../../home/GameShowcase/GameShowcase';
import Promotions from '../../home/Promotions/Promotions';
import Footer from '../../Footer/Footer';
import { ThemeContext } from '../../context/ThemeContext';
import { applyTheme } from '../../utils/themeUtils';
import styles from './Home.module.css';

// Sample game data - in a real application, this would come from an API
const gameData = [
  {
    id: 1,
    name: 'Mobile Legends',
    image: '/src/assets/images/game-banners/mobile-legends.jpg',
    startingPrice: '₹121'
  },
  {
    id: 2,
    name: 'PUBG Mobile',
    image: '/src/assets/images/game-banners/pubg.jpg',
    startingPrice: '₹92'
  },
  {
    id: 3,
    name: 'Free Fire',
    image: '/src/assets/images/game-banners/free-fire.jpg',
    startingPrice: '₹80'
  },
  {
    id: 4,
    name: 'Call of Duty Mobile',
    image: '/src/assets/images/game-banners/cod.jpg',
    startingPrice: '₹75'
  },
  {
    id: 5,
    name: 'Valorant',
    image: '/src/assets/images/game-banners/valorant.jpg',
    startingPrice: '₹120'
  },
  {
    id: 6,
    name: 'MLBB Small Packs',
    image: '/src/assets/images/game-banners/mlbb-small.jpg',
    startingPrice: '₹10'
  }
];

// Sample gift card data
const giftCardData = [
  {
    id: 101,
    name: 'Google Play Gift Card',
    image: '/src/assets/images/game-banners/google-play.jpg',
    startingPrice: '₹135'
  },
  {
    id: 102,
    name: 'Amazon Gift Card',
    image: '/src/assets/images/game-banners/amazon.jpg',
    startingPrice: '₹35'
  },
  {
    id: 103,
    name: 'Visa Gift Card',
    image: '/src/assets/images/game-banners/visa.jpg',
    startingPrice: '₹580'
  },
  {
    id: 104,
    name: 'Razer Gold PIN',
    image: '/src/assets/images/game-banners/razer.jpg',
    startingPrice: '₹64'
  },
  {
    id: 105,
    name: 'Spotify (ID)',
    image: '/src/assets/images/game-banners/spotify.jpg',
    startingPrice: '₹382'
  },
  {
    id: 106,
    name: 'UniPin Voucher Gift Card',
    image: '/src/assets/images/game-banners/unipin.jpg',
    startingPrice: '₹125'
  }
];

// Banner images for hero slider
const heroBanners = [
  {
    id: 1,
    image: '/src/assets/images/hero-banner-1.jpg',
    alt: 'Popular Games Banner'
  },
  {
    id: 2,
    image: '/src/assets/images/hero-banner-2.jpg',
    alt: 'Gift Cards Banner'
  }
];

const Home = () => {
  const { theme } = useContext(ThemeContext);
  
  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className={`${styles.homePage} ${theme === 'dark' ? styles.dark : ''}`}>
      
      
      <main>
        <Hero banners={heroBanners} />
        
        <section className={styles.contentSection}>
          <div className="container">
            <GameShowcase 
              title="Mobile Games" 
              games={gameData} 
            />
            
            {/* <GameShowcase 
              title="Gift Cards & Vouchers" 
              games={giftCardData} 
            /> */}
          </div>
        </section>
        
        <Promotions />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;