'use client';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange';
  icon?: ReactNode;
  trend?: string; // e.g. "+5%" or "-2%"
  delay?: number; // animation delay in ms
}

const trendColor = (t: string) => {
  if (t.startsWith('+')) return '#34A334';
  if (t.startsWith('-')) return '#EF4444';
  return '#6B7280';
};

export default function KpiCard({ label, value, sub, accent, icon, trend, delay = 0 }: KpiCardProps) {
  return (
    <div
      className={`kpi-card ${accent || 'accent'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div className="kpi-label">{label}</div>
        {icon && (
          <div className="icon-box">
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      {(sub || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px' }}>
          {sub && <div className="kpi-sub">{sub}</div>}
          {trend && (
            <span style={{ fontSize: 13, fontWeight: 700, color: trendColor(trend) }}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
