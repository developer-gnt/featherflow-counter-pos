import React from 'react';
import { Banknote, BookOpen, QrCode } from 'lucide-react';

const PAYMENT_OPTIONS = [
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'UPI / QR', label: 'UPI / QR', icon: QrCode },
  { id: 'Khata', label: 'Khata', icon: BookOpen },
];

export default function PaymentSelector({ paymentMode, onSelectPaymentMode }) {
  return (
    <div className="payment-section">
      <p className="payment-heading">Payment Mode</p>
      <div className="payment-grid" role="radiogroup" aria-label="Payment Mode">
        {PAYMENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = paymentMode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`payment-card ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectPaymentMode(option.id)}
            >
              <Icon size={18} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
