import React, { useState } from 'react';
import { Bird, Plus } from 'lucide-react';

export default function ProductCard({
  product,
  isSelected,
  onSelectForScale,
  onQuickAdd,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={`product-card ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelectForScale(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectForScale(product);
        }
      }}
      aria-label={`Select ${product.name} at ₹${product.pricePerKg} per kg`}
    >
      <div>
        <div className="product-img-wrap">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                color: '#DC2026',
              }}
            >
              <Bird size={28} />
              <span style={{ fontSize: 11, fontWeight: 700 }}>{product.name}</span>
            </div>
          )}
        </div>

        <div className="product-info" style={{ marginTop: 8 }}>
          <h3 className="product-name">{product.name}</h3>
          {product.subtitle && (
            <p className="product-subtitle">{product.subtitle}</p>
          )}
          <p className="product-price">₹{product.pricePerKg} / kg</p>
        </div>
      </div>

      <button
        type="button"
        className="product-add-btn"
        onClick={(e) => {
          e.stopPropagation();
          onQuickAdd(product);
        }}
        aria-label={`Add ${product.name} to cart`}
      >
        <span>Add</span>
        <Plus size={15} strokeWidth={2.75} />
      </button>
    </article>
  );
}
