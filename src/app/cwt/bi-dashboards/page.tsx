'use client';

const kpiCards = [
  { label: 'Total Revenue (YTD)', value: '$2.4B', change: '+12.3%', positive: true, icon: '💰', color: '#22C55E' },
  { label: 'Active Bookings', value: '1.2M', change: '+8.7%', positive: true, icon: '✈️', color: '#0078D4' },
  { label: 'Countries Served', value: '152', change: '+3 New', positive: true, icon: '🌍', color: '#8B5CF6' },
  { label: 'Cost Avoidance', value: '$184M', change: '+21.4%', positive: true, icon: '💹', color: '#F59E0B' },
  { label: 'Avg Booking Value', value: '$1,940', change: '-2.1%', positive: false, icon: '📊', color: '#EF4444' },
  { label: 'Customer Satisfaction', value: '94.2%', change: '+1.8%', positive: true, icon: '⭐', color: '#14B8A6' },
];

const reportingDomains = [
  {
    name: 'Finance & Revenue', icon: '💰', color: '#22C55E', bg: 'rgba(34,197,94,0.07)',
    reports: ['P&L by Region', 'Revenue by Product', 'FX Impact Analysis', 'Budget vs Actual'],
    refreshRate: '15 min', dataSource: 'SAP S/4HANA → Gold Layer'
  },
  {
    name: 'Travel Operations', icon: '✈️', color: '#0078D4', bg: 'rgba(0,120,212,0.07)',
    reports: ['Booking Volume Trends', 'Route Analysis', 'Supplier Performance', 'Travel Policy Compliance'],
    refreshRate: 'Real-time', dataSource: 'Pega CRM → Gold Layer'
  },
  {
    name: 'Customer Analytics', icon: '👥', color: '#8B5CF6', bg: 'rgba(139,92,246,0.07)',
    reports: ['Customer Segmentation', 'Retention Cohorts', 'Top Accounts Dashboard', 'NPS Tracking'],
    refreshRate: '1 hour', dataSource: 'Salesforce → Gold Layer'
  },
  {
    name: 'Expense Management', icon: '🧾', color: '#EF4444', bg: 'rgba(239,68,68,0.07)',
    reports: ['Expense by Category', 'Policy Violations', 'Approval Workflow KPIs', 'Cost Centre Breakdown'],
    refreshRate: '30 min', dataSource: 'Concur / SAP → Gold Layer'
  },
];

const mockBarData = [
  { month: 'Jan', val: 65 }, { month: 'Feb', val: 78 }, { month: 'Mar', val: 72 },
  { month: 'Apr', val: 85 }, { month: 'May', val: 91 }, { month: 'Jun', val: 88 },
  { month: 'Jul', val: 95 }, { month: 'Aug', val: 82 }, { month: 'Sep', val: 99 },
  { month: 'Oct', val: 87 }, { month: 'Nov', val: 93 }, { month: 'Dec', val: 100 },
];

const mockLineData = [42, 55, 48, 62, 70, 65, 78, 72, 85, 88, 91, 95];

const topCountries = [
  { country: 'United States', bookings: 284320, pct: 100 },
  { country: 'United Kingdom', bookings: 198450, pct: 70 },
  { country: 'Germany', bookings: 142100, pct: 50 },
  { country: 'France', bookings: 118900, pct: 42 },
  { country: 'Singapore', bookings: 95600, pct: 34 },
];

const pieSlices = [
  { label: 'Air', pct: 42, color: '#0078D4' },
  { label: 'Hotel', pct: 28, color: '#22C55E' },
  { label: 'Rail', pct: 15, color: '#F59E0B' },
  { label: 'Car', pct: 10, color: '#8B5CF6' },
  { label: 'Other', pct: 5, color: '#EF4444' },
];

export default function BiDashboardsPage() {
  const maxVal = Math.max(...mockBarData.map(d => d.val));

  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #1a1200 50%, #F2C811 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .kpi-mock { background: #fff; border-radius: 14px; padding: 18px 20px; border: 1px solid var(--border); flex: 1; transition: all 0.15s; }
        .kpi-mock:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .domain-card { background: #fff; border-radius: 14px; padding: 18px 20px; border: 1px solid var(--border); flex: 1; }
        .bi-panel { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
        .pbi-header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff; border-radius: 12px 12px 0 0; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; }
        .pbi-canvas { background: #F8F9FA; border-radius: 0 0 12px 12px; padding: 20px; border: 1px solid #e2e8f0; border-top: none; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>CWT Enterprise EDW</span>
          <span className="cwt-badge" style={{ background: 'rgba(242,200,17,0.2)', border: '1px solid rgba(242,200,17,0.4)', color: '#F2C811' }}>Power BI Premium</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Business Intelligence & Executive Dashboards</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          Power BI Premium dashboards delivering real-time insights to executives and operational teams across 150+ countries — built on certified Gold Layer datasets with full row-level security.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        {kpiCards.map((kpi, i) => (
          <div key={i} className="kpi-mock">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: kpi.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{kpi.icon}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 6 }}>{kpi.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: kpi.positive ? '#22C55E' : '#EF4444' }}>{kpi.change}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs prior year</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Power BI Canvas */}
      <div style={{ marginBottom: 20 }}>
        <div className="pbi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>CWT Global Travel Analytics — Executive View</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Last refreshed: Today at 09:45 UTC · Certified Dataset</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Global', 'EMEA', 'APAC', 'Americas'].map(r => (
              <span key={r} style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: r === 'Global' ? '#0078D4' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}>{r}</span>
            ))}
          </div>
        </div>
        <div className="pbi-canvas">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            {/* Bar Chart Mock */}
            <div className="bi-panel">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Monthly Booking Volume (USD M)</div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                {mockBarData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ flex: 1, width: '100%', background: `rgba(0,120,212,${0.4 + (d.val / maxVal) * 0.5})`, borderRadius: '3px 3px 0 0', height: `${(d.val / maxVal) * 100}%`, minHeight: 4 }} />
                    <span style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart Mock */}
            <div className="bi-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spend by Category</div>
              <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto' }}>
                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  {(() => {
                    let offset = 0;
                    return pieSlices.map((s, i) => {
                      const circ = 2 * Math.PI * 15.9155;
                      const dash = (s.pct / 100) * circ;
                      const gap = circ - dash;
                      const el = <circle key={i} cx="18" cy="18" r="15.9155" fill="none" stroke={s.color} strokeWidth="3.5" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} />;
                      offset += dash;
                      return el;
                    });
                  })()}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--text)' }}>$2.4B</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pieSlices.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, color: 'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bi-panel">
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Top Countries by Volume</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topCountries.map((c, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>{c.country}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(c.bookings / 1000).toFixed(0)}K</span>
                    </div>
                    <div style={{ height: 5, background: '#E8EDF5', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: '#0078D4', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Domains */}
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Reporting Domains</div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {reportingDomains.map((d, i) => (
          <div key={i} className="domain-card" style={{ minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{d.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.name}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
              {d.reports.map((r, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  {r}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text)' }}>Refresh:</strong> {d.refreshRate}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text)' }}>Source:</strong> {d.dataSource}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
