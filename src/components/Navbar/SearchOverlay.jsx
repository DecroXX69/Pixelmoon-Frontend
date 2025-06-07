import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import GameCard from '../home/GameCard/GameCard';
import styles from './SearchOverlay.module.css';

const SearchOverlay = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const overlayRef = useRef(null);
  const debounceRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < games.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      }
    };

    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, games.length]);

  // Debounced search function
  const searchGames = async (term) => {
    if (!term.trim()) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/games?search=${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || data || []);
      } else {
        setGames([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchGames(value);
    }, 300);
  };

  // Highlight matching text in game names
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className={styles.highlight}>{part}</mark> : 
        part
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.backdrop} />
      <div 
        ref={overlayRef}
        className={`${styles.panel} ${isOpen ? styles.slideIn : styles.slideOut}`}
      >
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className={styles.resultsContainer}>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <span>Searching...</span>
            </div>
          )}

          {!loading && searchTerm && games.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                  <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                  <path d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
                </svg>
              </div>
              <h3>No games found</h3>
              <p>No games found for '<strong>{searchTerm}</strong>'</p>
              <p>Try different keywords or browse our game categories</p>
            </div>
          )}

          {!loading && games.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                  {games.length} game{games.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className={styles.gamesGrid}>
                {games.slice(0, 20).map((game, index) => (
                  <div 
                    key={game._id || game.id || index}
                    className={`${styles.gameCardWrapper} ${
                      selectedIndex === index ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <GameCard 
                      game={{
                        ...game,
                        name: searchTerm ? highlightMatch(game.name, searchTerm) : game.name
                      }} 
                    />
                  </div>
                ))}
              </div>

              {games.length > 20 && (
                <div className={styles.seeMoreFooter}>
                  <button className={styles.seeMoreButton}>
                    See all {games.length} results
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !searchTerm && (
            <div className={styles.searchPrompt}>
              <div className={styles.searchPromptIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </div>
              <h3>Search for games</h3>
              <p>Start typing to find your favorite games...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;