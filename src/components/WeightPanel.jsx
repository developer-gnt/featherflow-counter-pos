import React from 'react';
import { Scale, ShoppingCart } from 'lucide-react';
import { RATE_OPTIONS } from '../data/products';
import WeightPresets from './WeightPresets';

export default function WeightPanel({
  weightKg,
  onChangeWeight,
  ratePerKg,
  onChangeRate,
  selectedProduct,
  onAddPreset,
  onResetWeight,
  onAddWeighedToCart,
}) {
  const totalAmount = Math.round((Number(weightKg) || 0) * (Number(ratePerKg) || 0));

  const handleWeightBlur = (e) => {
    const parsed = parseFloat(e.target.value);
    if (Number.isNaN(parsed) || parsed < 0) {
      onChangeWeight(0);
    } else {
      onChangeWeight(Math.round(parsed * 1000) / 1000);
    }
  };

  return (
    <section className="weight-card" aria-label="Weight and Pricing Calculator">
      <div className="weight-top-grid">
        <div className="scale-icon-box" aria-hidden="true">
          <Scale size={26} />
        </div>

        <div className="weight-field-group">
          <label htmlFor="scale-weight-input" className="field-label">
            <span>Weight (kg)</span>
            {selectedProduct && (
              <span className="scale-product-tag" title={selectedProduct.name}>
                {selectedProduct.name}
              </span>
            )}
          </label>
          <div className="weight-value-row">
            <input
              id="scale-weight-input"
              type="number"
              step="0.05"
              min="0"
              className="weight-input"
              value={weightKg === 0 ? '' : weightKg.toFixed(3)}
              placeholder="0.000"
              onChange={(e) => {
                const v = e.target.value;
                onChangeWeight(v === '' ? 0 : parseFloat(v));
              }}
              onBlur={handleWeightBlur}
            />
            <span className="weight-unit">kg</span>
          </div>
        </div>

        <div className="weight-field-group">
          <label htmlFor="rate-per-kg-select" className="field-label">
            Rate per KG
          </label>
          <div className="rate-control-wrap">
            <span className="rate-prefix">₹</span>
            <select
              id="rate-per-kg-select"
              className="rate-select"
              value={ratePerKg}
              onChange={(e) => onChangeRate(Number(e.target.value))}
            >
              {!RATE_OPTIONS.includes(ratePerKg) && (
                <option value={ratePerKg}>{ratePerKg}</option>
              )}
              {RATE_OPTIONS.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="weight-field-group">
          <span className="field-label">Total</span>
          <span className="total-price-value">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="button"
          className="add-to-cart-btn"
          onClick={onAddWeighedToCart}
          disabled={!weightKg || weightKg <= 0}
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>

      <WeightPresets onAddPreset={onAddPreset} onReset={onResetWeight} />
    </section>
  );
}
