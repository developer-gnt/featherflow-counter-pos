import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export const ACTIVITIES = [
  {
    id: 'act-1',
    time: '2:15 PM',
    title: 'New Sale – ₹ 1,250',
    desc: 'Bill #FF-1024',
  },
  {
    id: 'act-2',
    time: '1:48 PM',
    title: 'Stock Updated',
    desc: 'Chicken: +20 kg',
  },
  {
    id: 'act-3',
    time: '12:30 PM',
    title: 'New Customer Added',
    desc: 'Rahul Traders',
  },
  {
    id: 'act-4',
    time: '11:20 AM',
    title: 'Expense Recorded',
    desc: 'Transport – ₹ 500',
  },
];

export default function RecentActivities({ onNavigate }) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-title-wrap">
          <span className="dash-card-icon" aria-hidden="true">
            <Zap size={18} />
          </span>
          <h2 className="dash-card-title">Recent Activities</h2>
        </div>

        <button
          type="button"
          className="dash-link-action"
          onClick={() => onNavigate && onNavigate('reports')}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="recent-activities-list">
        <div className="timeline-track-line" aria-hidden="true" />
        {ACTIVITIES.map((item) => (
          <div key={item.id} className="timeline-item">
            <span className="timeline-time tabular-nums">{item.time}</span>
            <div className="timeline-dot" aria-hidden="true" />
            <div className="timeline-content">
              <span className="timeline-title">{item.title}</span>
              <span className="timeline-desc">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
