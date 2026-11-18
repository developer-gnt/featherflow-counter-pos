import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  selectedProductId,
  onSelectForScale,
  onQuickAdd,
  onClearFilters,
}) {
  if (products.length === 0) {
    return (
      <div className="empty-products-box">
        <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#17191D' }}>
          No matching chicken cuts found
        </p>
        <button type="button" className="btn-secondary" onClick={onClearFilters}>
          Show All Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={product.id === selectedProductId}
          onSelectForScale={onSelectForScale}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}
