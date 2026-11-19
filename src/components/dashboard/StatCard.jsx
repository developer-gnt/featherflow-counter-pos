import React from 'react';

export default function StatCard({
  icon: Icon,
  iconTheme = 'red',
  label,
  value,
  growth,
  sparklineColor = '#DC2026',
  sparklinePoints = 'M 0 25 C 20 28, 28 10, 45 15 C 55 18, 62 6, 70 4',
}) {
  return (
    <div className="dash-kpi-card">
      <div className="dash-kpi-left">
        <div className={`dash-kpi-icon-box dash-kpi-icon-box--${iconTheme}`} aria-hidden="true">
          <Icon size={20} strokeWidth={2.25} />
        </div>
        <div className="dash-kpi-info">
          <span className="dash-kpi-label">{label}</span>
          <span className="dash-kpi-value tabular-nums">{value}</span>
          <span className="dash-kpi-growth">{growth}</span>
        </div>
      </div>

      <div className="dash-kpi-sparkline" aria-hidden="true">
        <svg width="68" height="32" viewBox="0 0 70 32" fill="none">
          <path
            d={sparklinePoints}
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
