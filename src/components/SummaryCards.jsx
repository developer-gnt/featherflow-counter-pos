import React from 'react';
import {
  BarChart3,
  Layers,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function SummaryCards({ stats = {}, onOpenModule }) {
  const safeStats = {
    todaySales: typeof stats?.todaySales === 'number' ? stats.todaySales : 12840,
    liveStockKg: typeof stats?.liveStockKg === 'number' ? stats.liveStockKg : 45.2,
    khataBalance: typeof stats?.khataBalance === 'number' ? stats.khataBalance : 18320,
    purchaseAmount: typeof stats?.purchaseAmount === 'number' ? stats.purchaseAmount : 7560,
    expensesAmount: typeof stats?.expensesAmount === 'number' ? stats.expensesAmount : 2300,
  };

  const handleOpen = (moduleName) => {
    if (typeof onOpenModule === 'function') {
      onOpenModule(moduleName);
    }
  };

  return (
    <section className="summary-grid" aria-label="Business Summary">
      <div
        className="summary-card summary-card--sales is-clickable"
        onClick={() => handleOpen('reports')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen('reports');
        }}
      >
        <div className="summary-icon">
          <BarChart3 size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Today&apos;s Sales</span>
          <span className="summary-value">
            ₹{safeStats.todaySales.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--stock is-clickable"
        onClick={() => handleOpen('stock')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen('stock');
        }}
      >
        <div className="summary-icon">
          <Layers size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Live Stock</span>
          <span className="summary-value">{safeStats.liveStockKg.toFixed(3)} kg</span>
        </div>
      </div>

      <div
        className="summary-card summary-card--khata is-clickable"
        onClick={() => handleOpen('khata')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen('khata');
        }}
      >
        <div className="summary-icon">
          <Users size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Khata Balance</span>
          <span className="summary-value">
            ₹{safeStats.khataBalance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--purchase is-clickable"
        onClick={() => handleOpen('suppliers')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen('suppliers');
        }}
      >
        <div className="summary-icon">
          <ShoppingCart size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Purchase</span>
          <span className="summary-value">
            ₹{safeStats.purchaseAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--expenses is-clickable"
        onClick={() => handleOpen('expenses')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen('expenses');
        }}
      >
        <div className="summary-icon">
          <ReceiptText size={18} />
        </div>
        <div className="summary-text">
          <span className="summary-label">Expenses</span>
          <span className="summary-value">
            ₹{safeStats.expensesAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div
        className="summary-card summary-card--reports is-clickable"
        onClick={() => handleOpen('reports')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen('reports');
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
