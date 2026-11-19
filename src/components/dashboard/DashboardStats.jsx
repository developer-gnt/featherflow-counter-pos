import React from 'react';
import { IndianRupee, Package, Scale, ShoppingCart } from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardStats({ stats }) {
  // Format live values if passed, or default to the visual reference
  const salesVal = stats?.todaySales
    ? `₹ ${stats.todaySales.toLocaleString('en-IN')}`
    : '₹ 12,480';
  const weightVal = '42.5 kg';
  const ordersVal = '78';
  const revenueVal = salesVal;

  return (
    <div className="dash-kpi-grid">
      <StatCard
        icon={ShoppingCart}
        iconTheme="red"
        label="Today's Sales"
        value={salesVal}
        growth="++12% vs yesterday"
        sparklineColor="#DC2026"
        sparklinePoints="M 0 26 C 18 28, 28 14, 42 16 C 54 18, 60 8, 68 4"
      />

      <StatCard
        icon={Scale}
        iconTheme="red"
        label="Total Weight Sold"
        value={weightVal}
        growth="++8% vs yesterday"
        sparklineColor="#DC2026"
        sparklinePoints="M 0 24 C 16 26, 26 16, 40 18 C 50 20, 58 10, 68 6"
      />

      <StatCard
        icon={Package}
        iconTheme="green"
        label="Total Orders"
        value={ordersVal}
        growth="++10% vs yesterday"
        sparklineColor="#16A34A"
        sparklinePoints="M 0 25 C 16 28, 28 12, 42 18 C 52 22, 60 10, 68 5"
      />

      <StatCard
        icon={IndianRupee}
        iconTheme="red"
        label="Total Revenue"
        value={revenueVal}
        growth="++15% vs yesterday"
        sparklineColor="#DC2026"
        sparklinePoints="M 0 26 C 20 28, 30 15, 44 17 C 56 19, 62 8, 68 4"
      />
    </div>
  );
}

