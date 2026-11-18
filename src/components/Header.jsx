import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { MANAGER_AVATAR } from '../data/products';

function ChickenLogoIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15.5 3.5C14.8 2.6 13.4 2.5 12.6 3.3C12 2.4 10.6 2.6 10.2 3.7C9.6 3.4 8.8 3.8 8.7 4.6C8.7 5.7 9.1 6.8 9.6 7.6C7.5 8.2 5.4 9.9 4.5 12.2C3.6 14.5 4.4 17.5 6.8 19.1C8.8 20.4 11.7 20.6 14.1 19.6C16.6 18.6 18.4 16.3 18.9 13.7C19.2 12.1 19 10.4 18.2 9.1L20.5 7.9L18.4 6.7C18.5 5.4 17.3 4.2 15.9 4.5C15.9 4.1 15.8 3.7 15.5 3.5Z"
        fill="#FFFFFF"
      />
      <circle cx="15.2" cy="7.3" r="0.9" fill="#DC2026" />
    </svg>
  );
}

export default function Header({
  isOnline,
  onToggleOnline,
  isSyncing,
  onSync,
  onToggleSidebar,
  onSelectModule,
  onLogout,
  notificationsCount,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="brand-lockup">
          <div className="brand-logo-box">
            <ChickenLogoIcon />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">FeatherFlow Chicken Center</span>
            <span className="brand-subtitle">Counter Accounting PWA</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className={`status-pill ${isOnline ? '' : 'is-offline'}`}
          onClick={onToggleOnline}
          title="Toggle counter connection status"
        >
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        <button
          type="button"
          className={`header-icon-btn ${isSyncing ? 'is-syncing' : ''}`}
          onClick={onSync}
          aria-label="Sync counter data"
          title="Sync counter data"
        >
          <RefreshCw size={17} />
        </button>

        <div className="user-profile-wrap">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={17} />
            {notificationsCount > 0 && (
              <span className="notif-count">{notificationsCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-dropdown" role="menu">
              <div className="header-dropdown-title">Counter Alerts</div>
              <button
                type="button"
                className="header-dropdown-item"
                onClick={() => {
                  onSelectModule('stock');
                  setShowNotifications(false);
                }}
              >
                <span>Chicken Liver low stock (1.5 kg)</span>
              </button>
              <button
                type="button"
                className="header-dropdown-item"
                onClick={() => {
                  onSelectModule('khata');
                  setShowNotifications(false);
                }}
              >
                <span>Al-Madina Khata due ₹6,450</span>
              </button>
            </div>
          )}
        </div>

        <div className="user-profile-wrap">
          <button
            type="button"
            className="user-profile-btn"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            aria-label="User profile menu"
          >
            <img
              src={MANAGER_AVATAR}
              alt="Sheezan Shaikh"
              className="user-avatar"
              referrerPolicy="no-referrer"
            />
            <div className="user-meta">
              <span className="user-name">Sheezan Shaikh</span>
              <span className="admin-badge">Admin</span>
            </div>
            <ChevronDown size={15} />
          </button>

          {showProfileMenu && (
            <div className="header-dropdown" role="menu">
              <div className="header-dropdown-title">Sheezan Shaikh · Admin</div>
              <button
                type="button"
                className="header-dropdown-item"
                onClick={() => {
                  onSelectModule('cashdrawer');
                  setShowProfileMenu(false);
                }}
              >
                <span>Open Cash Drawer</span>
              </button>
              <button
                type="button"
                className="header-dropdown-item"
                onClick={() => {
                  onSelectModule('settings');
                  setShowProfileMenu(false);
                }}
              >
                <span>Counter Settings</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
          aria-label="Lock or logout counter session"
          title="Lock counter"
        >
          <LogOut size={15} />
          <span className="logout-label">Logout</span>
        </button>
      </div>
    </header>
  );
}
