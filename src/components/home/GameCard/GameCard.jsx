import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GameCard.module.css';

const GameCard = ({ game }) => {
  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
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
          <p className={styles.gamePrice}>Starts ₹{game.startPrice}</p>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;