import React from 'react';
import {
  Bird,
  FileBarChart2,
  Home,
  Layers,
  LayoutGrid,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { PROMO_CHICKEN_IMAGE, SIDEBAR_ITEMS } from '../data/products';

const ICON_MAP = {
  Home,
  LayoutGrid,
  Users,
  Truck,
  Package,
  ReceiptText,
  FileBarChart2,
  ShoppingBag,
  Layers,
  Settings,
};

export default function Sidebar({
  activeModule,
  onSelectModule,
  isOpen,
  onClose,
}) {
  const handleSelect = (id) => {
    onSelectModule(id);
    onClose();
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label="Primary Sidebar Navigation"
      >
        <div className="sidebar-mobile-header">
          <span style={{ fontWeight: 800, fontSize: 15 }}>FeatherFlow Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 4,
              color: '#17191D',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon] || Home;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-promo-card">
          <div className="promo-icon-badge">
            <Bird size={18} />
          </div>
          <p className="promo-title">Fresh Chicken</p>
          <p className="promo-subtitle">Daily Stock</p>
          <img
            src={PROMO_CHICKEN_IMAGE}
            alt="Fresh Chicken Daily Stock"
            className="promo-image"
            referrerPolicy="no-referrer"
          />
        </div>
      </aside>
    </>
  );
}
