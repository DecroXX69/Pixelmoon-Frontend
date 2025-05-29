import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../GameCard/GameCard';
import styles from './GameShowcase.module.css';

const GameShowcase = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback games data
  const fallbackGames = [
    {
      id: 1,
      name: 'Mobile Legends',
      image: 'https://digitaltopup.in/productImages/1731840396099--1723484864801--mobile.jpg',
      startPrice: '121',
    },
    {
      id: 2,
      name: 'Visa Gift Card',
      image: 'https://digitaltopup.in/productImages/1742662603805--visa-gift-card.jpg',
      startPrice: '580',
    },
    {
      id: 3,
      name: 'MLBB Small Packs',
      image: 'https://digitaltopup.in/productImages/1737378389902--758.webp',
      startPrice: '10',
    },
    {
      id: 4,
      name: 'Google Play Gift Card',
      image: 'https://digitaltopup.in/productImages/1742663435327--google-play-gift-card-in.jpg',
      startPrice: '135',
    },
    {
      id: 5,
      name: 'Amazon Gift Card',
      image: 'https://digitaltopup.in/productImages/1742663677961--Amazon-INR.jpg',
      startPrice: '35',
    },
    {
      id: 6,
      name: 'Razer Gold PIN',
      image: 'https://digitaltopup.in/productImages/1742663820765--INR.jpg',
      startPrice: '64',
    },
    {
      id: 7,
      name: 'UniPin Voucher Gift Card',
      image: 'https://digitaltopup.in/productImages/1742664013379--Unipin-IN.jpg',
      startPrice: '125',
    },
    {
      id: 8,
      name: 'PUBG UC',
      image: 'https://digitaltopup.in/productImages/1731216837472--IMG_3099.png',
      startPrice: '92',
    },
    {
      id: 9,
      name: 'Spotify (ID)',
      image: 'https://digitaltopup.in/productImages/1742664173226--IDR-1.jpg',
      startPrice: '382',
    },
  ];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      // Fixed: Use the correct backend URL with port 5000
      const response = await fetch('https://www.pixelmoonstore.in/api/games?limit=9');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.games && data.games.length > 0) {
        // Transform the API data to match the expected format
        const transformedGames = data.games.slice(0, 9).map(game => ({
          id: game._id,
          name: game.name,
          image: game.image,
          startPrice: game.packs && game.packs.length > 0 
            ? Math.min(...game.packs.map(pack => pack.retailPrice)).toString()
            : '0'
        }));
        setGames(transformedGames);
      } else {
        // Use fallback data if no games from API
        setGames(fallbackGames);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      // Use fallback data if there's an error
      setGames(fallbackGames);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.showcaseContainer}>
      <div className={styles.showcaseHeader}>
        <h2 className={styles.showcaseTitle}>MOBILE GAMES</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className={styles.gamesGrid}>
          {games.map(game => (
            <div key={game.id} className={styles.gameCardWrapper}>
              {/* Removed the Link wrapper - GameCard handles its own navigation */}
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.viewAllContainer}>
        <Link to="/games" className={styles.viewAllButton}>
          View All
          <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default GameShowcase;