import React, { useState } from 'react';
import { BarChart3, Calendar, ChevronDown, RotateCw } from 'lucide-react';

export default function DashboardHeader({ onRefresh, onDateChange, selectedDate = 'Today' }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'This Month'];

  const handleRefreshClick = () => {
    setIsSpinning(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setIsSpinning(false);
    }, 800);
  };

  const handleSelectDate = (opt) => {
    if (onDateChange) onDateChange(opt);
    setShowDateDropdown(false);
  };

  return (
    <div className="dash-header-row">
      <div className="dash-title-group">
        <div className="dash-header-icon" aria-hidden="true">
          <BarChart3 size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="dash-title">Business Dashboard</h1>
          <p className="dash-subtitle">
            Track your sales, stock and business performance at a glance
          </p>
        </div>
      </div>

      <div className="dash-header-controls">
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="dash-date-btn"
            onClick={() => setShowDateDropdown((prev) => !prev)}
            aria-label="Filter date range"
            aria-expanded={showDateDropdown}
          >
            <Calendar size={15} color="#DC2026" />
            <span>{selectedDate}</span>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {showDateDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#FFFFFF',
                border: '1px solid #E5EAF2',
                borderRadius: 10,
                boxShadow: '0 4px 16px rgba(16, 42, 86, 0.1)',
                zIndex: 40,
                minWidth: 140,
                overflow: 'hidden',
              }}
            >
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    textAlign: 'left',
                    background: selectedDate === opt ? '#FFF1F2' : 'transparent',
                    color: selectedDate === opt ? '#DC2026' : '#102A56',
                    fontWeight: selectedDate === opt ? 700 : 500,
                    fontSize: 13,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectDate(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className={`dash-refresh-btn ${isSpinning ? 'is-spinning' : ''}`}
          onClick={handleRefreshClick}
          title="Refresh dashboard data"
          aria-label="Refresh dashboard data"
        >
          <RotateCw size={16} />
        </button>
      </div>
    </div>
  );
}
