'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchCLR, getUnique, formatDate } from '@/lib/data';
import type { ClrRecord } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import ApplicationDrawer from '@/components/ApplicationDrawer';
import { Download, BookOpen } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ApplicationRegistryPage() {
  const [all, setAll] = useState<ClrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [selectedApp, setSelectedApp] = useState<ClrRecord | null>(null);

  // Filters
  const [fStatus, setFStatus] = useState('');
  const [fRegion, setFRegion] = useState('');
  const [fType, setFType] = useState('');
  const [fScope, setFScope] = useState('');
  const [fOverall, setFOverall] = useState('');
  const [fPriority, setFPriority] = useState('');
  const [fAnalyst, setFAnalyst] = useState('');
  const [fSearch, setFSearch] = useState('');

  useEffect(() => { fetchCLR().then(d => { setAll(d); setLoading(false); }); }, []);

  const filtered = useMemo(() => {
    return all.filter(r =>
      (!fStatus || r.ApplicationStatus === fStatus) &&
      (!fRegion || r.NHSRegion === fRegion) &&
      (!fType || r.ApplicationType === fType) &&
      (!fScope || r.ApplicationScope === fScope) &&
      (!fOverall || r.OverallStatus === fOverall) &&
      (!fPriority || r.Priority === fPriority) &&
      (!fAnalyst || r.AssignedAnalyst === fAnalyst) &&
      (!fSearch || [r.ApplicationID, r.Organisation, r.AssignedAnalyst, r.GlobalPM, r.CurrentMilestone]
        .some(v => v.toLowerCase().includes(fSearch.toLowerCase())))
    );
  }, [all, fStatus, fRegion, fType, fScope, fOverall, fPriority, fAnalyst, fSearch]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const resetFilters = () => { setFStatus(''); setFRegion(''); setFType(''); setFScope(''); setFOverall(''); setFPriority(''); setFAnalyst(''); setFSearch(''); setPage(0); };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      'Application ID': r.ApplicationID, 'Organisation': r.Organisation, 'Type': r.ApplicationType,
      'Scope': r.ApplicationScope, 'Region': r.NHSRegion, 'Country': r.Country,
      'Status': r.ApplicationStatus, 'Overall Status': r.OverallStatus, 'Review Stage': r.ReviewStage,
      'Priority': r.Priority, 'Assigned Analyst': r.AssignedAnalyst, 'Global PM': r.GlobalPM,
      'Research Type': r.ResearchType, 'Programme Area': r.ProgrammeArea,
      'Submission Date': r.SubmissionDate, 'Approval Date': r.ApprovalDate,
      'Milestone': r.CurrentMilestone, 'Milestone Due': r.MilestoneDueDate,
      'Progress': r.ProgressPercent, 'Cycle Time (days)': r.CycleTime,
      'Timing Category': r.TimingCategory, 'Delay Code': r.DelayCode, 'Notes': r.ProjectNotes,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Application Registry');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Application_Registry.xlsx');
  };

  if (loading) return <div className="page-body"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  const ProgBar = ({ p }: { p: string }) => {
    const pct = parseInt(p) || 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="prog-bar-wrap"><div className="prog-bar-fill" style={{ width: `${pct}%` }} /></div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p}</span>
      </div>
    );
  };

  return (
    <div className="page-body page-flex fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={18} /> Application Registry</div>
          <div className="topbar-subtitle">Master register of all HRA research applications · Single source of truth</div>
        </div>
        <div className="topbar-right">
          <span className="record-chip">{filtered.length} / {all.length} records</span>
          <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export Excel</button>
        </div>
      </div>

      <div className="content-area">
        {/* Filters */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input className="filter-input" placeholder="ID, Organisation, Analyst…" value={fSearch} onChange={e => { setFSearch(e.target.value); setPage(0); }} />
            </div>
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select className="filter-select" value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(0); }}>
                <option value="">All Statuses</option>
                {getUnique(all, 'ApplicationStatus').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Region</label>
              <select className="filter-select" value={fRegion} onChange={e => { setFRegion(e.target.value); setPage(0); }}>
                <option value="">All Regions</option>
                {getUnique(all, 'NHSRegion').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">App. Type</label>
              <select className="filter-select" value={fType} onChange={e => { setFType(e.target.value); setPage(0); }}>
                <option value="">All Types</option>
                {getUnique(all, 'ApplicationType').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Scope</label>
              <select className="filter-select" value={fScope} onChange={e => { setFScope(e.target.value); setPage(0); }}>
                <option value="">All Scopes</option>
                {getUnique(all, 'ApplicationScope').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Overall Status</label>
              <select className="filter-select" value={fOverall} onChange={e => { setFOverall(e.target.value); setPage(0); }}>
                <option value="">All</option>
                {getUnique(all, 'OverallStatus').filter(Boolean).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <select className="filter-select" value={fPriority} onChange={e => { setFPriority(e.target.value); setPage(0); }}>
                <option value="">All</option>
                {getUnique(all, 'Priority').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Analyst</label>
              <select className="filter-select" value={fAnalyst} onChange={e => { setFAnalyst(e.target.value); setPage(0); }}>
                <option value="">All Analysts</option>
                {getUnique(all, 'AssignedAnalyst').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-outline" onClick={resetFilters}>Clear</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card table-card">
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th>Application ID</th><th>Organisation</th><th>Type</th><th>Scope</th>
                  <th>Region</th><th>Country</th><th>Status</th><th>Overall</th>
                  <th>Review Stage</th><th>Priority</th><th>Assigned Analyst</th>
                  <th>Global PM</th><th>Research Type</th><th>Programme Area</th>
                  <th>Submission Date</th><th>Approval Date</th><th>Milestone</th>
                  <th>Milestone Due</th><th>Progress</th><th>Cycle Time</th>
                  <th>Timing</th><th>Delay Code</th><th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={23} className="empty-state"><p>No records match your filters</p></td></tr>
                ) : rows.map(r => (
                  <tr key={r.ApplicationID} onClick={() => setSelectedApp(r)} style={{ cursor: 'pointer' }}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--navy)', fontWeight: 600 }}>{r.ApplicationID}</span></td>
                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{r.Organisation}</td>
                    <td><span style={{ fontSize: 12 }}>{r.ApplicationType}</span></td>
                    <td><StatusBadge status={r.ApplicationScope} /></td>
                    <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                    <td style={{ fontSize: 12 }}>{r.Country}</td>
                    <td><StatusBadge status={r.ApplicationStatus} /></td>
                    <td><StatusBadge status={r.OverallStatus} /></td>
                    <td style={{ fontSize: 12 }}>{r.ReviewStage || '—'}</td>
                    <td><StatusBadge status={r.Priority} /></td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{r.AssignedAnalyst}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{r.GlobalPM}</td>
                    <td style={{ fontSize: 12 }}>{r.ResearchType}</td>
                    <td style={{ fontSize: 12 }}>{r.ProgrammeArea}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(r.SubmissionDate)}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(r.ApprovalDate)}</td>
                    <td style={{ fontSize: 12 }}>{r.CurrentMilestone}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(r.MilestoneDueDate)}</td>
                    <td><ProgBar p={r.ProgressPercent} /></td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{r.CycleTime}d</td>
                    <td><StatusBadge status={r.TimingCategory} /></td>
                    <td style={{ fontSize: 12 }}>{r.DelayCode || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.ProjectNotes}>
                      {r.ProjectNotes || '—'}
                    </td>
                  </tr>
                ))}
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
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
              return <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p + 1}</button>;
            })}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>»</button>
          </div>
        </div>
      </div>
      <ApplicationDrawer application={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}
