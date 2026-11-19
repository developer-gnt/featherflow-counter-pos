import React from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import breastImg from '../../assets/images/chicken_breast_boneless_1794998817406.jpg';
import legImg from '../../assets/images/chicken_leg_drumstick_1794998817373.jpg';
import wingsImg from '../../assets/images/chicken_wings_1794998817423.jpg';
import liverImg from '../../assets/images/chicken_liver_1794998817431.jpg';

export const DEFAULT_TOP_PRODUCTS = [
  {
    rank: 1,
    id: 'chicken-breast',
    name: 'Chicken Breast',
    soldWeight: '28.5 kg sold',
    pricePerKg: 420,
    image: breastImg,
  },
  {
    rank: 2,
    id: 'chicken-legs',
    name: 'Chicken Legs',
    soldWeight: '24.2 kg sold',
    pricePerKg: 300,
    image: legImg,
  },
  {
    rank: 3,
    id: 'chicken-wings',
    name: 'Chicken Wings',
    soldWeight: '18.7 kg sold',
    pricePerKg: 340,
    image: wingsImg,
  },
  {
    rank: 4,
    id: 'chicken-liver',
    name: 'Chicken Liver',
    soldWeight: '12.1 kg sold',
    pricePerKg: 260,
    image: liverImg,
  },
];

export default function TopProducts({ products = [], onNavigate, onChangePrice }) {
  // Sync live rates from products if they exist
  const items = DEFAULT_TOP_PRODUCTS.map((item) => {
    const liveProd = products.find(
      (p) =>
        p.id === item.id ||
        p.name.toLowerCase().includes(item.name.toLowerCase())
    );
    return {
      ...item,
      pricePerKg: liveProd?.pricePerKg ?? item.pricePerKg,
      actualProduct: liveProd || item,
    };
  });

  return (
    <section className="dash-card" aria-label="Top Selling Products">
      <div className="dash-card-header">
        <div className="dash-card-title-wrap">
          <span className="dash-card-icon" style={{ color: '#F59E0B' }} aria-hidden="true">
            <Trophy size={18} />
          </span>
          <h2 className="dash-card-title">Top Products</h2>
        </div>

        <button
          type="button"
          className="dash-link-action"
          onClick={() => onNavigate && onNavigate('products')}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="top-products-list">
        {items.map((prod) => (
          <div key={prod.rank} className="top-product-row">
            <div className="top-product-left">
              <span className="top-product-rank tabular-nums">{prod.rank}</span>
              <img
                src={prod.image}
                alt={prod.name}
                className="top-product-img"
                loading="lazy"
              />
              <div className="top-product-details">
                <span className="top-product-name">{prod.name}</span>
                <span className="top-product-qty">{prod.soldWeight}</span>
              </div>
            </div>

            <div className="top-product-right">
              <span className="top-product-price tabular-nums">
                ₹ {prod.pricePerKg} <span style={{ fontSize: 13, fontWeight: 600 }}>/kg</span>
              </span>
              <button
                type="button"
                className="change-price-btn"
                onClick={() => onChangePrice && onChangePrice(prod.actualProduct)}
                aria-label={`Change price for ${prod.name}`}
              >
                Change Price
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
