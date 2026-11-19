import React, { useState } from 'react';
import { ScanLine, ShoppingCart, User, UserPlus, Wallet } from 'lucide-react';

export default function POSHeader({
  customerType,
  onSelectCustomerType,
  khataCustomers,
  selectedKhataId,
  onSelectKhataId,
  onQuickScanSku,
  onOpenAddCustomer,
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [skuInput, setSkuInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState('');

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!skuInput.trim()) return;
    const matched = onQuickScanSku(skuInput.trim());
    if (matched) {
      setScanFeedback(`Added ${matched.name} (${matched.sku})`);
      setSkuInput('');
    } else {
      setScanFeedback(`No item found for "${skuInput.trim()}"`);
    }
  };

  return (
    <>
      <div className="pos-header-row">
        <div className="pos-title-group">
          <div className="pos-title-icon">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1 className="pos-title">Counter POS (New Sale)</h1>
            <p className="pos-subtitle">Weigh, add products and complete the sale</p>
          </div>
        </div>

        <div className="pos-customer-actions">
          <button
            type="button"
            className={`customer-mode-btn ${
              customerType === 'walkin' ? 'is-active' : ''
            }`}
            onClick={() => onSelectCustomerType('walkin')}
          >
            <Wallet size={16} />
            <span>Walk-in Cash</span>
          </button>

          <button
            type="button"
            className={`customer-mode-btn ${
              customerType === 'khata' ? 'is-active' : ''
            }`}
            onClick={() => onSelectCustomerType('khata')}
          >
            <User size={16} />
            <span>Khata (Customer)</span>
          </button>

          <button
            type="button"
            className={`scan-btn ${showScanner ? 'is-active' : ''}`}
            onClick={() => {
              setShowScanner((prev) => !prev);
              setScanFeedback('');
            }}
            aria-label="Barcode or SKU scanner"
            title="Barcode / SKU quick entry"
          >
            <ScanLine size={19} />
          </button>
        </div>
      </div>

      {customerType === 'khata' && (
        <div className="khata-customer-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2026', whiteSpace: 'nowrap' }}>
              Khata Account:
            </span>
            <select
              className="khata-customer-select"
              value={selectedKhataId}
              onChange={(e) => onSelectKhataId(e.target.value)}
              aria-label="Select Khata customer"
            >
              {khataCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Balance: ₹{c.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
          {onOpenAddCustomer && (
            <button
              type="button"
              className="btn-secondary"
              style={{
                height: 38,
                padding: '0 12px',
                fontSize: 12.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
              onClick={onOpenAddCustomer}
            >
              <UserPlus size={15} color="#DC2026" />
              <span>Add New Customer</span>
            </button>
          )}
        </div>
      )}

      {showScanner && (
        <form className="scanner-bar" onSubmit={handleScanSubmit}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#17191D' }}>
            Barcode / SKU Lookup:
          </span>
          <input
            type="text"
            className="text-input"
            placeholder="Enter SKU e.g. FF-101 or FF-103..."
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <button type="submit" className="btn-primary">
            Add Item
          </button>
          {scanFeedback && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2026' }}>
              {scanFeedback}
            </span>
          )}
        </form>
      )}
    </>
  );
}
