import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateWeight, onRemove }) {
  const itemTotal = Math.round(item.weightKg * item.pricePerKg);

  return (
    <div className="cart-item">
      <div className="cart-item-top">
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-img"
          referrerPolicy="no-referrer"
        />
        <div className="cart-item-meta">
          <p className="cart-item-name">
            {item.name} {item.subtitle ? item.subtitle : ''}
          </p>
          <p className="cart-item-rate">₹{item.pricePerKg} / kg</p>
        </div>

        <button
          type="button"
          className="cart-remove-btn"
          onClick={() => onRemove(item.id, item.pricePerKg)}
          aria-label={`Remove ${item.name}`}
          title="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="cart-item-bottom">
        <div className="qty-stepper" role="group" aria-label={`Adjust weight for ${item.name}`}>
          <button
            type="button"
            className="qty-step-btn"
            onClick={() => onUpdateWeight(item.id, item.pricePerKg, -0.25)}
            aria-label={`Decrease ${item.name} weight by 0.25 kg`}
          >
            <Minus size={14} />
          </button>
          <span className="qty-step-value">{item.weightKg.toFixed(3)} kg</span>
          <button
            type="button"
            className="qty-step-btn"
            onClick={() => onUpdateWeight(item.id, item.pricePerKg, 0.25)}
            aria-label={`Increase ${item.name} weight by 0.25 kg`}
          >
            <Plus size={14} />
          </button>
        </div>

        <span className="cart-item-total">₹{itemTotal.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
