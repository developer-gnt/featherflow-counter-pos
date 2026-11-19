import React from 'react';
import { Receipt } from 'lucide-react';

export default function RecentCounterBills({ transactions = [] }) {
  return (
    <section className="dash-card" aria-label="Recent Counter Sales Bills">
      <div className="dash-card-header">
        <div className="dash-card-title-wrap">
          <span className="dash-card-icon" aria-hidden="true">
            <Receipt size={18} />
          </span>
          <h2 className="dash-card-title">Recent Counter Bills</h2>
        </div>
      </div>

      <div className="bills-table-wrap">
        <table className="bills-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Bill No.</th>
              <th style={{ width: '25%' }}>Customer</th>
              <th style={{ width: '15%' }}>Weight</th>
              <th style={{ width: '15%' }}>Payment</th>
              <th style={{ width: '15%' }}>Time</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                  No counter bills recorded yet today.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="bill-id-cell tabular-nums">{tx.id}</td>
                  <td>{tx.customer}</td>
                  <td className="tabular-nums">{Number(tx.weightKg).toFixed(3)} kg</td>
                  <td>{tx.paymentMode}</td>
                  <td className="tabular-nums" style={{ color: '#64748B' }}>{tx.time}</td>
                  <td className="bill-amount-cell tabular-nums">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
