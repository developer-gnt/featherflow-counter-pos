import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CompleteSaleButton({ onClick }) {
  return (
    <button
      type="button"
      className="complete-sale-btn"
      onClick={onClick}
    >
      <span>Complete Sale</span>
      <ArrowRight size={19} />
    </button>
  );
}
