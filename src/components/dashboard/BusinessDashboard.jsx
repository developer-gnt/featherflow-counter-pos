import React, { useState } from 'react';
import { IndianRupee, Pencil, X } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import TopProducts from './TopProducts';
import SalesOverview from './SalesOverview';
import StockStatus from './StockStatus';
import RecentActivities from './RecentActivities';
import RecentCounterBills from './RecentCounterBills';
import './dashboard.css';

export default function BusinessDashboard({
  stats,
  transactions = [],
  products = [],
  onUpdateProduct,
  onNavigate,
}) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [productForPriceChange, setProductForPriceChange] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [priceChangeFeedback, setPriceChangeFeedback] = useState(null);

  const handleRefresh = () => {
    setPriceChangeFeedback('Dashboard data refreshed with latest counter metrics.');
    setTimeout(() => {
      setPriceChangeFeedback(null);
    }, 2800);
  };

  const handleStartPriceChange = (prod) => {
    setProductForPriceChange(prod);
    setNewPrice(String(prod.pricePerKg || ''));
  };

  const handleSavePriceChange = (e) => {
    e.preventDefault();
    const rateNum = parseFloat(newPrice);
    if (Number.isNaN(rateNum) || rateNum <= 0) return;

    if (onUpdateProduct && productForPriceChange) {
      onUpdateProduct({
        ...productForPriceChange,
        pricePerKg: Math.round(rateNum),
      });
    }

    setPriceChangeFeedback(`Updated ${productForPriceChange.name} price to ₹${Math.round(rateNum)}/kg.`);
    setProductForPriceChange(null);
    setTimeout(() => {
      setPriceChangeFeedback(null);
    }, 2800);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Toast Feedback */}
      {priceChangeFeedback && (
        <div
          className="cart-success"
          style={{
            margin: '0 0 6px',
            animation: 'fadeIn 0.2s ease',
          }}
          role="status"
        >
          {priceChangeFeedback}
        </div>
      )}

      {/* 1. Header */}
      <DashboardHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={handleRefresh}
      />

      {/* 2. KPI Cards (4 in a row) */}
      <DashboardStats stats={stats} />

      {/* 3. Top Products (Full-width Card) */}
      <TopProducts
        products={products}
        onNavigate={onNavigate}
        onChangePrice={handleStartPriceChange}
      />

      {/* 4. Analytics Section (3 Cards in a row) */}
      <div className="dash-analytics-row">
        <SalesOverview />
        <StockStatus onNavigate={onNavigate} />
        <RecentActivities onNavigate={onNavigate} />
      </div>

      {/* 5. Recent Counter Bills (Full-width Card) */}
      <RecentCounterBills transactions={transactions} />

      {/* Change Price Modal */}
      {productForPriceChange && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="price-modal-title"
        >
          <div className="modal-card" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IndianRupee size={20} color="#DC2026" />
                <h3 id="price-modal-title" className="modal-title">
                  Change Product Price
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setProductForPriceChange(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSavePriceChange}
              style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}
            >
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #E5EAF2',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#102A56' }}>
                  {productForPriceChange.name}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Current Rate: <strong>₹{productForPriceChange.pricePerKg}/kg</strong>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  New Rate per KG (₹) <span style={{ color: '#DC2026' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 40,
                      padding: '0 12px',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRight: 'none',
                      borderTopLeftRadius: 9,
                      borderBottomLeftRadius: 9,
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#4B5563',
                    }}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="text-input"
                    style={{
                      width: '100%',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      height: 40,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setProductForPriceChange(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Pencil size={14} />
                  <span>Update Price</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
