'use client';
import { useEffect, useState } from 'react';
import { fetchCLR, deriveHomeSummary, formatDate } from '@/lib/data';
import type { HomeSummary, ClrRecord } from '@/types';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import ApplicationDrawer from '@/components/ApplicationDrawer';
import PdfExportButton from '@/components/PdfExportButton';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import { 
  AlertTriangle, Activity, Sparkles, FilterX,
  Layers, PlayCircle, CalendarDays, Calendar, Clock, CheckCircle2, Inbox, PauseCircle
} from 'lucide-react';

// Brand rainbow palette for charts/pie — in brand order
const PIE_COLORS = ['#0E81C6','#34A334','#FF7915','#3BB4E5','#F59E0B','#A75079'];
const STATUS_KEYS = ['Active','Closed','On Hold','Pipeline','N-Active','Cancelled'];

export default function OverviewPage() {
  const [data, setData] = useState<HomeSummary | null>(null);
  const [records, setRecords] = useState<ClrRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ClrRecord | null>(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => { 
    fetchCLR().then(clrData => {
      setRecords(clrData);
      setData(deriveHomeSummary(clrData));
    });
  }, []);

  if (!data || !records.length) return <div className="page-body"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  const pieData = [
    { name: 'Active', value: data.ActiveApplications },
    { name: 'Closed', value: data.ClosedApplications },
    { name: 'On Hold', value: data.OnHoldApplications },
    { name: 'Pipeline', value: data.PipelineApplications },
    { name: 'N-Active', value: data.NActiveApplications },
  ].filter(d => d.value > 0);

  const generateInsight = () => {
    const active = records.filter(r => r.ApplicationStatus === 'Active');
    const delayed = active.filter(r => r.TimingCategory === 'Significantly Delayed');
    if (delayed.length > 5) {
      const regions = delayed.reduce((acc, r) => { acc[r.NHSRegion] = (acc[r.NHSRegion] || 0) + 1; return acc; }, {} as Record<string, number>);
      const topRegion = Object.keys(regions).sort((a,b) => regions[b] - regions[a])[0];
      return <span><strong>Attention:</strong> High volume of significantly delayed applications detected in the <strong>{topRegion}</strong> region.</span>;
    }
    if (data.AvgCycleTimeDays > 60) return <span><strong>Notice:</strong> National average cycle time ({data.AvgCycleTimeDays} days) is currently exceeding the 60-day target.</span>;
    return <span><strong>On Track:</strong> Overall pipeline is healthy with {data.ThisMonthApprovals} approvals processed this month.</span>;
  };

  const CustomPieLegend = ({ payload }: any) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', padding: '16px 20px 0', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: entry.color, marginRight: 8 }} />
            <span style={{ flex: 1 }}>{entry.value}</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{entry.payload.value}</span>
          </div>
        ))}
      </div>
    );
  };

  let fullData = [];
  let tableTitle = '';
  if (filterStatus) {
    if (STATUS_KEYS.includes(filterStatus)) {
      fullData = records.filter(r => r.ApplicationStatus === filterStatus);
      tableTitle = `Filtered View: ${filterStatus} Applications`;
    } else if (['On Track', 'At Risk', 'Behind'].includes(filterStatus)) {
      fullData = records.filter(r => r.OverallStatus === filterStatus);
      tableTitle = `Filtered View: ${filterStatus} Applications`;
    } else if (filterStatus === 'Total Applications') {
      fullData = records;
      tableTitle = 'All Applications';
    } else if (filterStatus === 'This Month Approvals') {
      const now = new Date();
      const pfx = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      fullData = records.filter(r => r.ApplicationStatus === 'Closed' && r.MilestoneDueDate?.startsWith(pfx));
      tableTitle = 'Filtered View: This Month Approvals';
    } else if (filterStatus === 'Next Month Expected') {
      const nm = new Date();
      nm.setMonth(nm.getMonth() + 1);
      const npfx = `${nm.getFullYear()}-${String(nm.getMonth() + 1).padStart(2, '0')}`;
      fullData = records.filter(r => r.ApplicationStatus === 'Active' && r.MilestoneDueDate?.startsWith(npfx));
      tableTitle = 'Filtered View: Expected Next Month';
    } else {
      fullData = records;
      tableTitle = 'All Applications';
    }
  } else {
    fullData = records;
    tableTitle = 'All Applications';
  }

  const totalPages = Math.ceil(fullData.length / perPage);
  const tableData = fullData.slice(page * perPage, (page + 1) * perPage);

  // Compute dynamic bar chart data (Monthly Distribution)
  const monthCounts: Record<string, number> = {};
  
  // Temporal metrics
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYearStr = `${now.getFullYear()}`;
  
  // Pre-fill monthCounts with Jan-Dec of current year
  for (let i = 1; i <= 12; i++) {
    monthCounts[`${currentYearStr}-${String(i).padStart(2, '0')}`] = 0;
  }
  
  let tillPreviousMonth = 0;
  let currentMonthCount = 0;
  let restOfYear = 0;

  fullData.forEach(r => {
    const dateStr = r.ApplicationStatus === 'Closed' ? (r as any).ApprovalDate || r.MilestoneDueDate : r.MilestoneDueDate;
    if (!dateStr) return;
    
    const m = dateStr.substring(0, 7); // YYYY-MM
    monthCounts[m] = (monthCounts[m] || 0) + 1;
    
    if (m < currentMonthStr) {
      tillPreviousMonth++;
    } else if (m === currentMonthStr) {
      currentMonthCount++;
    } else if (m > currentMonthStr && dateStr.startsWith(currentYearStr)) {
      restOfYear++;
    }
  });

  const dynamicMonthData = Object.keys(monthCounts).sort().map(k => {
    const d = new Date(k + '-01');
    return {
      Month: d.toLocaleString('en-GB', { month: 'short', year: '2-digit' }),
      Count: monthCounts[k]
    };
  }).slice(-12);

  return (
    <div className="page-body fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">Operations Overview</div>
          <div className="topbar-subtitle">Health Research Authority · Live Application Tracking</div>
        </div>
        <div className="topbar-right">
          <PdfExportButton targetId="pdf-content" filename="Operations_Overview" />
          {filterStatus && (
            <button className="btn btn-outline" style={{ fontSize: 13, padding: '6px 14px', marginRight: 16, borderColor: 'var(--border)' }} onClick={() => { setFilterStatus(''); setPage(0); }}>
              <FilterX size={16} style={{ marginRight: 6, color: 'var(--danger)' }} />
              Reset Filters
            </button>
          )}
          <Activity size={16} color="var(--text-muted)" style={{ marginLeft: 16 }} />
          <span className="last-updated">Last updated: {data.LastUpdated}</span>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        
        {/* ── BENTO BOX LAYOUT ── */}
        <div id="pdf-content" className="bento-layout fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24, backgroundColor: 'var(--bg-main)' }}>
          {/* TOP ROW: 5 Status KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              <KpiCard label="Active" value={data.ActiveApplications} accent="success" delay={0} icon={<PlayCircle size={18}/>} onClick={() => setFilterStatus('Active')} isSelected={filterStatus === 'Active'} />
              <KpiCard label="Closed" value={data.ClosedApplications} accent="success" delay={30} icon={<CheckCircle2 size={18}/>} onClick={() => setFilterStatus('Closed')} isSelected={filterStatus === 'Closed'} />
              <KpiCard label="Pipeline" value={data.PipelineApplications} accent="info" delay={60} icon={<Inbox size={18}/>} onClick={() => setFilterStatus('Pipeline')} isSelected={filterStatus === 'Pipeline'} />
              <KpiCard label="On-Hold" value={data.OnHoldApplications} accent="purple" delay={90} icon={<PauseCircle size={18}/>} onClick={() => setFilterStatus('On Hold')} isSelected={filterStatus === 'On Hold'} />
              <KpiCard label="Inactive" value={data.NActiveApplications} accent="orange" delay={120} icon={<Activity size={18}/>} onClick={() => setFilterStatus('N-Active')} isSelected={filterStatus === 'N-Active'} />
            </div>
            
            {/* SECOND ROW: Temporal KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <KpiCard label="Till Previous Month" value={tillPreviousMonth} accent="info" sub="All past volume" delay={150} icon={<Clock size={18}/>} />
              <KpiCard label="Current Month" value={currentMonthCount} accent="warning" sub={new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })} delay={180} icon={<CalendarDays size={18}/>} />
              <KpiCard label="Rest of the Year" value={restOfYear} accent="purple" sub="Upcoming this year" delay={210} icon={<Calendar size={18}/>} />
              <KpiCard label="Total Applications" value={fullData.length} accent="accent" sub="All time volume" delay={240} icon={<Layers size={18}/>} />
            </div>

          {/* BOTTOM ROW: Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            
            {/* Bar Chart */}
            <div className="card chart-card" style={{ flex: 1, minHeight: 400 }}>
              <div className="card-header"><div className="card-title">{filterStatus ? `Monthly Distribution (${filterStatus})` : 'Monthly Approvals — Last 12 Months'} </div></div>
              <div className="card-body" style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterStatus ? dynamicMonthData : data.MonthlyApprovals} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                    <XAxis dataKey="Month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip cursor={{ fill: 'rgba(14,129,198,0.05)' }} contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                    <Bar dataKey="Count" fill="rgba(14, 129, 198, 0.6)" barSize={48} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Application Breakdown Donut */}
            <div className="card chart-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <div className="card-title">Status Breakdown</div>
              </div>
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 0' }}>
                
                <div style={{ position: 'relative', height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={78} innerRadius={58}
                        paddingAngle={0} stroke="none"
                        onClick={(entry) => setFilterStatus(entry.name || '')}
                      >
                        {pieData.map((d, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} style={{ cursor: 'pointer', opacity: filterStatus && filterStatus !== d.name ? 0.2 : 1, transition: 'opacity 0.2s' }} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Total Text */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px' }}>{data.TotalApplications}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total</div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <CustomPieLegend payload={pieData.map((d, i) => ({ value: d.name, color: PIE_COLORS[i % PIE_COLORS.length], payload: { value: d.value } }))} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="card fade-in" style={{ marginBottom: 24 }} id="details-table">
          <div className="card-header">
            <div className="card-title" style={{ color: filterStatus ? 'var(--navy)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {!filterStatus && <AlertTriangle size={16} />} {tableTitle}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="record-chip">{tableData.length} records</span>
              {filterStatus ? (
                <button className="btn btn-outline" style={{ fontSize: 12, padding: '4px 12px', height: 28 }} onClick={() => { setFilterStatus(''); setPage(0); }}>
                  <FilterX size={14} style={{ marginRight: 6 }} />
                  Clear Filter
                </button>
              ) : null}
            </div>
          </div>
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th>Application ID</th><th>Organisation</th><th>Region</th>
                  <th>Assigned Analyst</th><th>Current Milestone</th>
                  <th>Milestone Due</th><th>Status</th><th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <tr><td colSpan={8} className="empty-state"><p>No applications found in this view 🎉</p></td></tr>
                ) : tableData.map(r => (
                  <tr key={r.ApplicationID} onClick={() => setSelectedApp(r)} style={{ cursor: 'pointer' }}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-blue)', fontWeight: 600 }}>{r.ApplicationID}</span></td>
                    <td style={{ fontWeight: 500 }}>{r.Organisation}</td>
                    <td>{r.NHSRegion}</td>
                    <td>{r.AssignedAnalyst}</td>
                    <td>{r.CurrentMilestone}</td>
                    <td>{formatDate(r.MilestoneDueDate)}</td>
                    <td><StatusBadge status={r.ApplicationStatus === 'Active' ? r.OverallStatus : r.ApplicationStatus} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{r.StatusComments || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Showing {fullData.length === 0 ? 0 : page * perPage + 1}–{Math.min((page + 1) * perPage, fullData.length)} of {fullData.length}</span>
            <select className="filter-select" style={{ width: 'auto', padding: '4px 8px' }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}>
              {[10, 25, 50].map(n => <option key={n} value={n}>{n} per page</option>)}
            </select>
            <button className="page-btn" onClick={() => setPage(0)} disabled={page === 0}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
            <span style={{ fontSize: 13, padding: '0 8px' }}>Page {page + 1} of {totalPages || 1}</span>
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>»</button>
          </div>
        </div>
      </div>
      <ApplicationDrawer application={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}
