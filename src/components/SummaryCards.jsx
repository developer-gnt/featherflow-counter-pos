import React from 'react';
import {
  BarChart3,
  Layers,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function SummaryCards({ stats, onOpenModule }) {
  return (
    <section className="summary-grid" aria-label="Business Summary">
      <div
        className="summary-card summary-card--sales is-clickable"
        onClick={() => onOpenModule('reports')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenModule('reports');
        }}
      >
        <div className="summary-icon">
          <BarChart3 size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Today&apos;s Sales</span>
          <span className="summary-value">
            ₹{stats.todaySales.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--stock is-clickable"
        onClick={() => onOpenModule('stock')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenModule('stock');
        }}
      >
        <div className="summary-icon">
          <Layers size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Live Stock</span>
          <span className="summary-value">{stats.liveStockKg.toFixed(3)} kg</span>
        </div>
      </div>

      <div
        className="summary-card summary-card--khata is-clickable"
        onClick={() => onOpenModule('khata')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenModule('khata');
        }}
      >
        <div className="summary-icon">
          <Users size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Khata Balance</span>
          <span className="summary-value">
            ₹{stats.khataBalance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--purchase is-clickable"
        onClick={() => onOpenModule('suppliers')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenModule('suppliers');
        }}
      >
        <div className="summary-icon">
          <ShoppingCart size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Purchase</span>
          <span className="summary-value">
            ₹{stats.purchaseAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--expenses is-clickable"
        onClick={() => onOpenModule('expenses')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenModule('expenses');
        }}
      >
        <div className="summary-icon">
          <ReceiptText size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Expenses</span>
          <span className="summary-value">
            ₹{stats.expensesAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--reports is-clickable"
        onClick={() => onOpenModule('reports')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenModule('reports');
        }}
      >
        <div className="summary-icon">
          <TrendingUp size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Reports</span>
          <span className="summary-value summary-value--action">
            View &amp; Download
          </span>
        </div>
      </div>
    </section>
  );
}
