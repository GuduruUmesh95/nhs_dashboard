'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchCLR, fetchHierarchy, deriveWorkload, getUnique } from '@/lib/data';
import type { WorkloadRow } from '@/types';
import { Users, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function WorkloadSummaryPage() {
  const [data, setData] = useState<WorkloadRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const [fRegion, setFRegion] = useState('');
  const [fLead, setFLead] = useState('');

  useEffect(() => {
    Promise.all([fetchCLR(), fetchHierarchy()]).then(([clr, hier]) => {
      setData(deriveWorkload(clr, hier));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return data.filter(r =>
      (!fRegion || r.NHSRegion === fRegion) &&
      (!fLead || r.TeamLead === fLead)
    );
  }, [data, fRegion, fLead]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const chartData = useMemo(() => {
    return filtered.slice(0, 15).map(r => ({
      name: r.AssignedAnalyst.split(' ')[0],
      Active: r.ActiveWithDate + r.ActiveNoDate,
      Pipeline: r.Pipeline,
      OnHold: r.OnHold,
      Closed: r.Closed
    }));
  }, [filtered]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      Analyst: r.AssignedAnalyst, 'Team Lead': r.TeamLead, Region: r.NHSRegion,
      'Active (With Date)': r.ActiveWithDate, 'Active (No Date)': r.ActiveNoDate,
      Pipeline: r.Pipeline, 'On Hold': r.OnHold, Closed: r.Closed, Cancelled: r.Cancelled,
      'Total Handled': r.Total
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workload_Summary');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Workload_Summary.xlsx');
  };

  if (loading) return <div className="page-body"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  return (
    <div className="page-body fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} /> Analyst Workload Summary</div>
          <div className="topbar-subtitle">Consolidated view of application distribution across the team</div>
        </div>
        <div className="topbar-right">
          <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export</button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><div className="card-title">Top 15 Analysts by Current Workload (Stacked)</div></div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(14,129,198,0.03)' }} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', background: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <Bar dataKey="Active" stackId="a" fill="rgba(14, 129, 198, 1)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Pipeline" stackId="a" fill="rgba(14, 129, 198, 0.7)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="OnHold" stackId="a" fill="rgba(14, 129, 198, 0.4)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Closed" stackId="a" fill="rgba(14, 129, 198, 0.15)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Region</label>
              <select className="filter-select" value={fRegion} onChange={e => { setFRegion(e.target.value); setPage(0); }}>
                <option value="">All Regions</option>
                {getUnique(data, 'NHSRegion').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Team Lead</label>
              <select className="filter-select" value={fLead} onChange={e => { setFLead(e.target.value); setPage(0); }}>
                <option value="">All Leads</option>
                {getUnique(data, 'TeamLead').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-outline" onClick={() => { setFRegion(''); setFLead(''); setPage(0); }}>Clear</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th>Assigned Analyst</th><th>Team Lead</th><th>Region</th>
                  <th style={{ textAlign: 'center' }}>Active (w/ Date)</th>
                  <th style={{ textAlign: 'center' }}>Active (No Date)</th>
                  <th style={{ textAlign: 'center' }}>Pipeline</th>
                  <th style={{ textAlign: 'center' }}>On Hold</th>
                  <th style={{ textAlign: 'center' }}>Closed</th>
                  <th style={{ textAlign: 'center' }}>Cancelled</th>
                  <th style={{ textAlign: 'center' }}>Total Assigned</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={10} className="empty-state"><p>No records found</p></td></tr>
                ) : rows.map(r => (
                  <tr key={r.AssignedAnalyst}>
                    <td style={{ fontWeight: 600 }}>{r.AssignedAnalyst}</td>
                    <td style={{ fontSize: 12 }}>{r.TeamLead}</td>
                    <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                    <td style={{ textAlign: 'center', color: r.ActiveWithDate ? 'var(--success)' : 'var(--text-muted)', fontWeight: r.ActiveWithDate ? 600 : 400 }}>{r.ActiveWithDate}</td>
                    <td style={{ textAlign: 'center', color: r.ActiveNoDate ? 'var(--warning)' : 'var(--text-muted)', fontWeight: r.ActiveNoDate ? 600 : 400 }}>{r.ActiveNoDate}</td>
                    <td style={{ textAlign: 'center', color: r.Pipeline ? 'var(--info)' : 'var(--text-muted)', fontWeight: r.Pipeline ? 600 : 400 }}>{r.Pipeline}</td>
                    <td style={{ textAlign: 'center', color: r.OnHold ? 'var(--danger)' : 'var(--text-muted)', fontWeight: r.OnHold ? 600 : 400 }}>{r.OnHold}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.Closed}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.Cancelled}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, background: '#f8f9fc' }}>{r.Total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length === 0 ? 0 : page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}</span>
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
    </div>
  );
}
