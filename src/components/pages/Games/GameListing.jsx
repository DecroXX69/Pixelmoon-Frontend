import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GamesListing.module.css';
import { useTheme } from '../../context/ThemeContext'; // Adjust path as needed
const GamesListing = () => {
  const { theme } = useTheme();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Mobile Games');
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL;

  const categories = [
    'Mobile Games',
    'Pc Games',
    'Game Vouchers',
    'OTT Accounts',
    'Social Media Services'
  ];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE}/games`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const data = await response.json();
      setGames(data.games || data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to load games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGames = () => {
    return games.filter(game => 
      game.category === selectedCategory || 
      (selectedCategory === 'Mobile Games' && game.category === 'Mobile Games') ||
      (selectedCategory === 'Pc Games' && game.category === 'PC Games')
    );
  };

  const getMinPrice = (packs) => {
    if (!packs || packs.length === 0) return 0;
    return Math.min(...packs.map(pack => pack.retailPrice || pack.price || 0));
  };

  const filteredGames = getFilteredGames();

  if (loading) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.darkTheme : ''}`}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-lg-3 col-md-4">
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${
                    selectedCategory === category ? styles.active : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category}</span>
                  <svg 
                    className={styles.arrowIcon}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-md-8">
          <div className={styles.mainContent}>
            {filteredGames.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No products available in this category.</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredGames.map((game) => (
                  <div key={game._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// GameCard Component (inline to match your existing structure)
const GameCard = ({ game }) => {
  const getMinPrice = (packs) => {
    if (!packs || packs.length === 0) return 0;
    return Math.min(...packs.map(pack => pack.retailPrice || pack.price || 0));
  };

  return (
    <Link to={`/games/${game._id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img 
            src={game.image} 
            alt={game.name} 
            className={styles.gameImage} 
          />
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.gameName}>{game.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default GamesListing;