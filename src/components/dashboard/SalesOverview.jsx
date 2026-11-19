import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const DATA_PERIODS = {
  '7D': [
    { label: 'Mon', value: 10500 },
    { label: 'Tue', value: 12500 },
    { label: 'Wed', value: 11800 },
    { label: 'Thu', value: 14500 },
    { label: 'Fri', value: 16500 },
    { label: 'Sat', value: 15000 },
    { label: 'Sun', value: 12000 },
  ],
  '30D': [
    { label: 'W1', value: 72000 },
    { label: 'W2', value: 84500 },
    { label: 'W3', value: 91200 },
    { label: 'W4', value: 98000 },
  ],
  '90D': [
    { label: 'Month 1', value: 340000 },
    { label: 'Month 2', value: 385000 },
    { label: 'Month 3', value: 412000 },
  ],
};

export default function SalesOverview() {
  const [activePeriod, setActivePeriod] = useState('7D');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const dataset = DATA_PERIODS[activePeriod];
  const maxValue = activePeriod === '7D' ? 20000 : activePeriod === '30D' ? 100000 : 450000;
  const yTicks =
    activePeriod === '7D'
      ? [
          { val: 20000, label: '20k' },
          { val: 15000, label: '15k' },
          { val: 10000, label: '10k' },
          { val: 5000, label: '5k' },
          { val: 0, label: '0k' },
        ]
      : activePeriod === '30D'
      ? [
          { val: 100000, label: '100k' },
          { val: 75000, label: '75k' },
          { val: 50000, label: '50k' },
          { val: 25000, label: '25k' },
          { val: 0, label: '0k' },
        ]
      : [
          { val: 450000, label: '450k' },
          { val: 300000, label: '300k' },
          { val: 150000, label: '150k' },
          { val: 0, label: '0k' },
        ];

  // SVG Chart Dimensions
  const svgWidth = 340;
  const svgHeight = 175;
  const paddingLeft = 36;
  const paddingRight = 10;
  const paddingTop = 12;
  const paddingBottom = 26;

  const chartAreaWidth = svgWidth - paddingLeft - paddingRight;
  const chartAreaHeight = svgHeight - paddingTop - paddingBottom;

  const barCount = dataset.length;
  const slotWidth = chartAreaWidth / barCount;
  const barWidth = Math.min(26, slotWidth * 0.65);

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-title-wrap">
          <span className="dash-card-icon" aria-hidden="true">
            <TrendingUp size={18} />
          </span>
          <h2 className="dash-card-title">Sales Overview</h2>
        </div>

        <div className="dash-period-pills" role="tablist" aria-label="Sales Overview Timeframe">
          {['7D', '30D', '90D'].map((period) => (
            <button
              key={period}
              type="button"
              role="tab"
              aria-selected={activePeriod === period}
              className={`dash-pill-btn ${activePeriod === period ? 'is-active' : ''}`}
              onClick={() => setActivePeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="sales-chart-wrap" style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="barRedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC2026" stopOpacity="1" />
              <stop offset="60%" stopColor="#EF4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FEE2E2" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B9141B" stopOpacity="1" />
              <stop offset="100%" stopColor="#FECACA" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const yPos =
              paddingTop + chartAreaHeight * (1 - tick.val / maxValue);
            return (
              <g key={tick.label}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={svgWidth - paddingRight}
                  y2={yPos}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray={tick.val === 0 ? '0' : '2 2'}
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3.5}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="inherit"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Red Gradient Bars */}
          {dataset.map((d, i) => {
            const barHeight = Math.max(4, (d.value / maxValue) * chartAreaHeight);
            const x = paddingLeft + i * slotWidth + (slotWidth - barWidth) / 2;
            const y = paddingTop + chartAreaHeight - barHeight;
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={d.label}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  ry="4"
                  fill={isHovered ? 'url(#barHoverGradient)' : 'url(#barRedGradient)'}
                  className="chart-bar-rect"
                />
                {/* X-axis Weekday Label */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#DC2026' : '#64748B'}
                  fontSize="10.5"
                  fontWeight={isHovered ? '700' : '600'}
                  fontFamily="inherit"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 12,
              background: '#102A56',
              color: '#FFFFFF',
              padding: '3px 9px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(16, 42, 86, 0.2)',
              pointerEvents: 'none',
            }}
          >
            {dataset[hoveredIndex].label}: ₹{dataset[hoveredIndex].value.toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </div>
  );
}

