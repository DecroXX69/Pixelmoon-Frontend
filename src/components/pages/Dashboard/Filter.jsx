// src/components/FilterPanel/FilterPanel.jsx
import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import styles from './FilterPanel.module.css';

export const FilterPanel = ({ isOpen, togglePanel, filters, setFilters, onSearch, onClear }) => {
  return (
    <div className={`${styles.filterPanel} ${isOpen ? styles.open : ''}`}>  
      <div className={styles.filterHeader} onClick={togglePanel}>
        <h4>Filters</h4>
        <button className={styles.toggleBtn}>
          <Filter size={16} />
        </button>
      </div>
      {isOpen && (
        <div className={styles.filterContent}>
          <div className="row g-3">
            <div className="col-md-3">
              <select
                className="form-control"
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              >
                <option value="">Select Period</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="From"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="To"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={onSearch}>
                  <Search size={16} />
                  Search
                </button>
                <button className="btn btn-outline-danger" onClick={onClear}>
                  <X size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
