import React from 'react';
import { ArrowRight, Edit2, Package } from 'lucide-react';
import wholeImg from '../../assets/images/chicken_whole_1794998816005.jpg';
import piecesImg from '../../assets/images/chicken_curry_pieces_1794998817430.jpg';
import wingsImg from '../../assets/images/chicken_wings_1794998817423.jpg';
import liverImg from '../../assets/images/chicken_liver_1794998817431.jpg';

export const STOCK_CATEGORIES = [
  {
    id: 'chicken',
    name: 'Chicken',
    availableStockKg: 120,
    maxKg: 150,
    color: '#DC2026',
    image: wholeImg,
  },
  {
    id: 'pieces',
    name: 'Pieces',
    availableStockKg: 80,
    maxKg: 150,
    color: '#EF4444',
    image: piecesImg,
  },
  {
    id: 'wings',
    name: 'Wings',
    availableStockKg: 40,
    maxKg: 150,
    color: '#F87171',
    image: wingsImg,
  },
  {
    id: 'liver',
    name: 'Liver',
    availableStockKg: 25,
    maxKg: 150,
    color: '#FCA5A5',
    image: liverImg,
  },
];

export default function StockStatus({ onNavigate }) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-title-wrap">
          <span className="dash-card-icon" aria-hidden="true">
            <Package size={18} />
          </span>
          <h2 className="dash-card-title">Stock Status</h2>
        </div>

        <div className="dash-stock-actions">
          <button
            type="button"
            className="dash-outline-pill-btn"
            onClick={() => onNavigate && onNavigate('stock')}
            aria-label="Edit stock in Live Stock view"
          >
            <Edit2 size={12} />
            <span>Edit Stock</span>
          </button>

          <button
            type="button"
            className="dash-link-action"
            onClick={() => onNavigate && onNavigate('stock')}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="stock-status-list">
        {STOCK_CATEGORIES.map((cat) => {
          const pct = Math.min(100, Math.round((cat.availableStockKg / cat.maxKg) * 100));
          return (
            <div key={cat.id} className="stock-status-row">
              <img
                src={cat.image}
                alt={cat.name}
                className="stock-status-img"
                loading="lazy"
              />
              <span className="stock-status-name">{cat.name}</span>
              <div
                className="stock-progress-track"
                role="progressbar"
                aria-valuenow={cat.availableStockKg}
                aria-valuemin={0}
                aria-valuemax={cat.maxKg}
                aria-label={`${cat.name} stock level`}
              >
                <div
                  className="stock-progress-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="stock-status-val tabular-nums">
                {cat.availableStockKg} kg
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

