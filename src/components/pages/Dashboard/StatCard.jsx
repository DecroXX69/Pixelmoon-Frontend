import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './StatCard.module.css';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const trendClass = trend > 0 ? styles.positive : styles.negative;

  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>
        <Icon size={24} />
      </div>
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <p className={styles.statValue}>{value}</p>
        {trend !== undefined && (
          <div className={`${styles.statTrend} ${trendClass}`}> 
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}  
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
