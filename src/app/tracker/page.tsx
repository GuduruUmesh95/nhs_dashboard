'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchCLR, deriveTracker, getWeekStarts, isActiveInWeek, getDaysToApproval, urgencyColor, formatDate, getUnique } from '@/lib/data';
import type { ClrRecord } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Download, ListTodo } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function TrackerPage() {
  const [all, setAll] = useState<ClrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const [fRegion, setFRegion] = useState('');
  const [fType, setFType] = useState('');
  const [fAnalyst, setFAnalyst] = useState('');
  const [fSearch, setFSearch] = useState('');

  const weeks = useMemo(() => getWeekStarts(), []);

  useEffect(() => { fetchCLR().then(d => { setAll(deriveTracker(d)); setLoading(false); }); }, []);

  const filtered = useMemo(() => {
    return all.filter(r =>
      (!fRegion || r.NHSRegion === fRegion) &&
      (!fType || r.ApplicationType === fType) &&
      (!fAnalyst || r.AssignedAnalyst === fAnalyst) &&
      (!fSearch || [r.ApplicationID, r.Organisation, r.AssignedAnalyst].some(v => v.toLowerCase().includes(fSearch.toLowerCase())))
    );
  }, [all, fRegion, fType, fAnalyst, fSearch]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const resetFilters = () => { setFRegion(''); setFType(''); setFAnalyst(''); setFSearch(''); setPage(0); };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => {
      const row: any = {
        'Application ID': r.ApplicationID, 'Organisation': r.Organisation, 'Type': r.ApplicationType,
        'Region': r.NHSRegion, 'Status': r.ApplicationStatus, 'Priority': r.Priority,
        'Assigned Analyst': r.AssignedAnalyst, 'Overall Status': r.OverallStatus,
        'Assigned Date': r.AssignedDate, 'Submission Date': r.SubmissionDate, 'Approval Date': r.ApprovalDate
      };
      weeks.forEach((w, i) => { row[`Week ${i + 1} (${formatDate(w.toISOString())})`] = isActiveInWeek(r, w) ? 'Active' : ''; });
      return row;
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tracker');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Active_Tracker.xlsx');
  };

  if (loading) return <div className="page-body"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  return (
    <div className="page-body page-flex fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ListTodo size={18} /> Active Application Tracker</div>
          <div className="topbar-subtitle">Live view of in-progress applications with 12-week forward look</div>
        </div>
        <div className="topbar-right">
          <span className="record-chip">{filtered.length} active records</span>
          <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="content-area">
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input className="filter-input" placeholder="ID, Org, Analyst…" value={fSearch} onChange={e => { setFSearch(e.target.value); setPage(0); }} />
            </div>
            <div className="filter-group">
              <label className="filter-label">Region</label>
              <select className="filter-select" value={fRegion} onChange={e => { setFRegion(e.target.value); setPage(0); }}>
                <option value="">All</option>
                {getUnique(all, 'NHSRegion').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">App. Type</label>
              <select className="filter-select" value={fType} onChange={e => { setFType(e.target.value); setPage(0); }}>
                <option value="">All</option>
                {getUnique(all, 'ApplicationType').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Analyst</label>
              <select className="filter-select" value={fAnalyst} onChange={e => { setFAnalyst(e.target.value); setPage(0); }}>
                <option value="">All</option>
                {getUnique(all, 'AssignedAnalyst').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-outline" onClick={resetFilters}>Clear</button>
            </div>
          </div>
        </div>

        <div className="card table-card">
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th colSpan={9} style={{ borderRight: '2px solid #fff', textAlign: 'center', background: '#E8F4FA', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>Application Details</th>
                  <th colSpan={12} style={{ textAlign: 'center', background: '#D9EEF8', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>Next 12 Weeks (Active Flags)</th>
                </tr>
                <tr>
                  <th>ID</th><th>Organisation</th><th>Type</th><th>Region</th>
                  <th>Status</th><th>Analyst</th><th>Overall</th>
                  <th>Approval Date</th><th style={{ borderRight: '2px solid var(--border)' }}>Days To</th>
                  {weeks.map((w, i) => <th key={i} style={{ fontSize: 10, textAlign: 'center' }}>W{i+1}<br/>{w.getDate()}/{w.getMonth()+1}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={21} className="empty-state"><p>No active applications</p></td></tr>
                ) : rows.map(r => {
                  const days = getDaysToApproval(r.ApprovalDate);
                  const uCol = urgencyColor(days);
                  return (
                    <tr key={r.ApplicationID}>
                      <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--navy)' }}>{r.ApplicationID}</span></td>
                      <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{r.Organisation}</td>
                      <td style={{ fontSize: 12 }}>{r.ApplicationType}</td>
                      <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                      <td><StatusBadge status={r.ApplicationStatus} /></td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{r.AssignedAnalyst}</td>
                      <td><StatusBadge status={r.OverallStatus} /></td>
                      <td style={{ fontSize: 12 }}>{formatDate(r.ApprovalDate)}</td>
                      <td style={{ borderRight: '2px solid var(--border)', fontWeight: 600, color: uCol === 'red' ? 'var(--danger)' : uCol === 'amber' ? 'var(--warning)' : 'var(--success)' }}>
                        {days}
                      </td>
                      {weeks.map((w, i) => (
                        <td key={i} style={{ textAlign: 'center', padding: 4 }}>
                          <div style={{ 
                            width: 16, height: 16, borderRadius: 4, 
                            background: isActiveInWeek(r, w) ? 'var(--success)' : '#f1f5f9', 
                            margin: '0 auto' 
                          }} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length === 0 ? 0 : page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}</span>
            <select className="filter-select" style={{ width: 'auto', padding: '4px 8px' }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}>
              {[25, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
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
