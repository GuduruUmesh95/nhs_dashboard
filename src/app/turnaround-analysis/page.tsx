'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchCLR, deriveTurnaroundStats, deriveTurnaroundSummary, formatDate } from '@/lib/data';
import type { ClrRecord } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import ApplicationDrawer from '@/components/ApplicationDrawer';
import { Clock, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

const MONTH_KEYS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

import PdfExportButton from '@/components/PdfExportButton';

export default function TurnaroundAnalysisPage() {
  const [clr, setClr] = useState<ClrRecord[]>([]);
  const [stats, setStats] = useState({ AvgDays: 0, MinDays: 0, MaxDays: 0, TotalAnalysed: 0 });
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ClrRecord | null>(null);

  // Detail table filters
  const [fCat, setFCat] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 15;

  useEffect(() => {
    fetchCLR().then(d => {
      setClr(d);
      setStats(deriveTurnaroundStats(d));
      setSummary(deriveTurnaroundSummary(d));
      setLoading(false);
    });
  }, []);

  const chartData = useMemo(() => {
    return MONTH_KEYS.map(m => {
      const row: any = { name: m };
      summary.forEach(s => { row[s.TimingCategory] = s[m] || null; });
      return row;
    });
  }, [summary]);

  const detailRows = useMemo(() => {
    return clr.filter(r => r.ApplicationStatus === 'Closed' && r.CycleTime > 0 && (!fCat || r.TimingCategory === fCat))
              .sort((a, b) => b.CycleTime - a.CycleTime);
  }, [clr, fCat]);

  const pagedDetails = detailRows.slice(page * perPage, (page + 1) * perPage);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(detailRows.map(r => ({
      'Application ID': r.ApplicationID, Organisation: r.Organisation,
      Type: r.ApplicationType, Region: r.NHSRegion,
      'Submission Date': r.SubmissionDate, 'Approval Date': r.ApprovalDate,
      'Cycle Time (Days)': r.CycleTime, 'Timing Category': r.TimingCategory,
      'Delay Code': r.DelayCode, 'Delay Description': r.DelayDescription
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnaround_Details');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Turnaround_Analysis.xlsx');
  };

  if (loading) return <div className="page-body"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  return (
    <div className="page-body fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={18} /> Approval Turnaround Analysis</div>
          <div className="topbar-subtitle">Cycle time performance analysis based on closed applications</div>
        </div>
        <div className="topbar-right" style={{ display: 'flex', gap: '8px' }}>
          <PdfExportButton targetId="pdf-content" filename="Turnaround_Analysis" />
          <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export Details</button>
        </div>
      </div>

      <div id="pdf-content" style={{ padding: 24, backgroundColor: 'var(--bg-main)' }}>
        <div className="stats-bar" style={{ marginBottom: 24 }}>
          <div className="stat-item"><div className="stat-label">Total Analysed</div><div className="stat-value">{stats.TotalAnalysed}</div></div>
          <div className="stat-divider" />
          <div className="stat-item"><div className="stat-label">Average Turnaround</div><div className="stat-value">{stats.AvgDays}</div><div className="stat-unit">days</div></div>
          <div className="stat-divider" />
          <div className="stat-item"><div className="stat-label">Fastest Approval</div><div className="stat-value" style={{ color: 'var(--brand-green)' }}>{stats.MinDays}</div><div className="stat-unit">days</div></div>
          <div className="stat-divider" />
          <div className="stat-item"><div className="stat-label">Longest Delay</div><div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.MaxDays}</div><div className="stat-unit">days</div></div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><div className="card-title">Average Cycle Time Trend by Category (Days)</div></div>
          <div className="card-body" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(14,129,198,0.03)' }} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', background: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <ReferenceLine y={60} stroke="#34A334" strokeDasharray="4 3" label={{ position: 'insideTopLeft', value: 'Target 60d', fill: '#34A334', fontSize: 10, fontWeight: 600 }} />
                <Line type="monotone" dataKey="Within Target" stroke="#34A334" strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#34A334' }} connectNulls />
                <Line type="monotone" dataKey="Slightly Delayed" stroke="#FF7915" strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#FF7915' }} connectNulls />
                <Line type="monotone" dataKey="Significantly Delayed" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#EF4444' }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><div className="card-title">Performance Summary</div></div>
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th>Category</th>
                  {MONTH_KEYS.map(m => <th key={m} style={{ textAlign: 'center' }}>{m}</th>)}
                  <th style={{ textAlign: 'center' }}>Avg Days</th>
                  <th style={{ textAlign: 'center' }}>Target</th>
                </tr>
              </thead>
              <tbody>
                {summary.map(r => (
                  <tr key={r.TimingCategory}>
                    <td><StatusBadge status={r.TimingCategory} /></td>
                    {MONTH_KEYS.map(m => <td key={m} style={{ textAlign: 'center', color: r[m] ? 'inherit' : 'var(--border)' }}>{r[m] || '-'}</td>)}
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.Average}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.Target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ padding: '12px 20px' }}>
            <div className="card-title">Detailed Turnaround Log (Closed Applications)</div>
            <select className="filter-select" style={{ width: 'auto', padding: '4px 8px' }} value={fCat} onChange={e => { setFCat(e.target.value); setPage(0); }}>
              <option value="">All Categories</option>
              <option value="Within Target">Within Target</option>
              <option value="Slightly Delayed">Slightly Delayed</option>
              <option value="Significantly Delayed">Significantly Delayed</option>
            </select>
          </div>
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th>App ID</th><th>Organisation</th><th>Type</th>
                  <th>Submission</th><th>Approval</th>
                  <th>Cycle Time</th><th>Category</th><th>Delay Reason</th>
                </tr>
              </thead>
              <tbody>
                {pagedDetails.map(r => (
                  <tr key={r.ApplicationID} onClick={() => setSelectedApp(r)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.ApplicationID}</td>
                    <td style={{ fontWeight: 500 }}>{r.Organisation}</td>
                    <td style={{ fontSize: 12 }}>{r.ApplicationType}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(r.SubmissionDate)}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(r.ApprovalDate)}</td>
                    <td style={{ fontWeight: 700, fontSize: 13, color: r.CycleTime > 120 ? 'var(--danger)' : r.CycleTime > 60 ? 'var(--warning)' : 'var(--success)' }}>
                      {r.CycleTime} days
                    </td>
                    <td><StatusBadge status={r.TimingCategory} /></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {r.DelayCode ? <strong>{r.DelayCode}: </strong> : ''}
                      {r.DelayDescription || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Page {page + 1} of {Math.ceil(detailRows.length / perPage) || 1}</span>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(detailRows.length / perPage) - 1}>›</button>
          </div>
        </div>
      </div>
      <ApplicationDrawer application={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}
