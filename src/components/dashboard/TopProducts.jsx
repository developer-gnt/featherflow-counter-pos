import React, { useState } from 'react';
import { Bird, Trophy } from 'lucide-react';
import breastImg from '../../assets/images/chicken_breast_boneless_1794998817406.jpg';
import legImg from '../../assets/images/chicken_leg_drumstick_1794998817373.jpg';
import wingsImg from '../../assets/images/chicken_wings_1794998817423.jpg';
import liverImg from '../../assets/images/chicken_liver_1794998817431.jpg';

export const DEFAULT_TOP_PRODUCTS = [
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    subtitle: '(Boneless)',
    soldWeight: '28.5 kg sold',
    pricePerKg: 420,
    image: breastImg,
  },
  {
    id: 'chicken-legs',
    name: 'Chicken Legs',
    subtitle: '(Drumstick)',
    soldWeight: '24.2 kg sold',
    pricePerKg: 300,
    image: legImg,
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    subtitle: '',
    soldWeight: '18.7 kg sold',
    pricePerKg: 340,
    image: wingsImg,
  },
  {
    id: 'chicken-liver',
    name: 'Chicken Liver',
    subtitle: '',
    soldWeight: '12.1 kg sold',
    pricePerKg: 260,
    image: liverImg,
  },
];

const KNOWN_SOLD_WEIGHTS = {
  'chicken-breast': '28.5 kg sold',
  'chicken-legs': '24.2 kg sold',
  'chicken-leg': '24.2 kg sold',
  'chicken-wings': '18.7 kg sold',
  'chicken-liver': '12.1 kg sold',
  'whole-chicken': '32.0 kg sold',
  'chicken-pieces': '21.4 kg sold',
  'chicken-gizzard': '8.6 kg sold',
  'boneless-cubes': '15.2 kg sold',
};

export default function TopProducts({ products = [], onChangePrice }) {
  const [imgErrors, setImgErrors] = useState({});

  // If products are passed from the application, display all of them; otherwise fallback to default
  const allItems =
    products.length > 0
      ? products.map((prod) => ({
          ...prod,
          soldWeight:
            KNOWN_SOLD_WEIGHTS[prod.id] ||
            `${Math.max(5, Math.round((prod.stockKg || 10) * 1.8 * 10) / 10)} kg sold`,
        }))
      : DEFAULT_TOP_PRODUCTS;

  return (
    <section className="dash-card" aria-label="Top Selling Products">
      <div className="dash-card-header">
        <div className="dash-card-title-wrap">
          <span className="dash-card-icon" style={{ color: '#F59E0B' }} aria-hidden="true">
            <Trophy size={18} />
          </span>
          <h2 className="dash-card-title">Top Products</h2>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginLeft: 6 }}>
            ({allItems.length} items)
          </span>
        </div>
      </div>

      <div className="top-products-list">
        {allItems.map((prod, index) => {
          const rank = index + 1;
          const hasImgError = imgErrors[prod.id || index];

          return (
            <div key={prod.id || index} className="top-product-row">
              <div className="top-product-left">
                <span className="top-product-rank tabular-nums">{rank}</span>
                {!hasImgError && prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="top-product-img"
                    loading="lazy"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [prod.id || index]: true }))
                    }
                  />
                ) : (
                  <div
                    className="top-product-img"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DC2026',
                    }}
                  >
                    <Bird size={20} />
                  </div>
                )}
                <div className="top-product-details">
                  <span className="top-product-name">
                    {prod.name} {prod.subtitle || ''}
                  </span>
                  <span className="top-product-qty">{prod.soldWeight}</span>
                </div>
              </div>

              <div className="top-product-right">
                <span className="top-product-price tabular-nums">
                  ₹ {prod.pricePerKg}{' '}
                  <span style={{ fontSize: 13, fontWeight: 600 }}>/kg</span>
                </span>
                <button
                  type="button"
                  className="change-price-btn"
                  onClick={() => onChangePrice && onChangePrice(prod)}
                  aria-label={`Change price for ${prod.name}`}
                >
                  Change Price
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
