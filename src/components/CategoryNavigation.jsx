import React from 'react';
import {
  Bird,
  Boxes,
  CircleDot,
  Drumstick,
  Feather,
  Heart,
  LayoutGrid,
  Package,
  Search,
  Slice,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

const ICON_MAP = {
  LayoutGrid,
  Bird,
  Boxes,
  Slice,
  Drumstick,
  Feather,
  Heart,
  CircleDot,
  Package,
};

export default function CategoryNavigation({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onChangeSearch,
  filteredCount,
}) {
  return (
    <div className="category-toolbar">
      <div className="category-strip" role="tablist" aria-label="Product categories">
        {CATEGORIES.map((category) => {
          const Icon = ICON_MAP[category.icon] || LayoutGrid;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`category-tile ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <Icon size={22} />
              <span className="category-tile-label">{category.label}</span>
            </button>
          );
        })}
      </div>

      <div className="catalog-filter-row">
        <div className="search-box">
          <Search size={15} className="search-box-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search cuts (Whole, Curry Cut, Breast, Liver...)"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onChangeSearch('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <span className="catalog-hint">
          Showing {filteredCount} {filteredCount === 1 ? 'cut' : 'cuts'} · Tap card to load scale or Add +
        </span>
      </div>
    </div>
  );
}
