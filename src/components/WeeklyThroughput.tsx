'use client';
import { useEffect, useMemo, useState, Fragment } from 'react';
import { fetchCLR, deriveEltWeekly, getUnique, formatDate } from '@/lib/data';
import type { EltWeeklyRow } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { ChevronDown, ChevronRight, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function WeeklyThroughput() {
  const [data, setData] = useState<EltWeeklyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [fRegion, setFRegion] = useState('');
  const [fStatus, setFStatus] = useState('');

  useEffect(() => { fetchCLR().then(d => { setData(deriveEltWeekly(d)); setLoading(false); }); }, []);

  const filtered = useMemo(() => {
    return data.filter(r =>
      (!fRegion || r.NHSRegion === fRegion) &&
      (!fStatus || r.OverallStatus === fStatus)
    ).sort((a, b) => b.TotalVolume - a.TotalVolume);
  }, [data, fRegion, fStatus]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const toggleExpand = (org: string) => { setExpanded(p => ({ ...p, [org]: !p[org] })); };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      Organisation: r.Organisation, Region: r.NHSRegion,
      'Current Week': r.CurrentWeek, 'Prior Week': r.PriorWeek,
      Delta: r.Delta, 'Overall Status': r.OverallStatus,
      'Total Volume': r.TotalVolume
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly_Throughput');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Weekly_Throughput.xlsx');
  };

  const totalCur = filtered.reduce((s, r) => s + r.CurrentWeek, 0);
  const totalPrior = filtered.reduce((s, r) => s + r.PriorWeek, 0);
  const totalVol = filtered.reduce((s, r) => s + r.TotalVolume, 0);
  const grandDelta = totalCur - totalPrior;

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="fade-in">
      <div className="stats-bar">
        <div className="stat-item"><div className="stat-label">Total Volume (Active)</div><div className="stat-value">{totalVol}</div></div>
        <div className="stat-divider" />
        <div className="stat-item"><div className="stat-label">Current Week</div><div className="stat-value">{totalCur}</div></div>
        <div className="stat-divider" />
        <div className="stat-item"><div className="stat-label">Prior Week</div><div className="stat-value" style={{ color: 'var(--text-muted)' }}>{totalPrior}</div></div>
        <div className="stat-divider" />
        <div className="stat-item"><div className="stat-label">Net Delta</div>
          <div className="stat-value" style={{ color: grandDelta > 0 ? 'var(--brand-green)' : grandDelta < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            {grandDelta > 0 ? '+' : ''}{grandDelta}
          </div>
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
            <label className="filter-label">Status</label>
            <select className="filter-select" value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(0); }}>
              <option value="">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Behind">Behind</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn btn-outline" onClick={() => { setFRegion(''); setFStatus(''); setPage(0); }}>Clear</button>
            <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="nhs-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Organisation</th><th>Region</th>
                <th style={{ textAlign: 'center' }}>Prior Week</th>
                <th style={{ textAlign: 'center' }}>Current Week</th>
                <th style={{ textAlign: 'center' }}>Delta</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Total Volume</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={8} className="empty-state">No records found</td></tr>
              ) : rows.map(r => (
                <Fragment key={r.Organisation}>
                  <tr onClick={() => toggleExpand(r.Organisation)} style={{ cursor: 'pointer' }}>
                    <td style={{ textAlign: 'center', opacity: 0.5 }}>{expanded[r.Organisation] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</td>
                    <td style={{ fontWeight: 600 }}>{r.Organisation}</td>
                    <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.PriorWeek}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.CurrentWeek}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: r.Delta > 0 ? 'var(--success)' : r.Delta < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {r.Delta > 0 ? '+' : ''}{r.Delta}
                    </td>
                    <td><StatusBadge status={r.OverallStatus} /></td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.TotalVolume}</td>
                  </tr>
                  {expanded[r.Organisation] && (
                    <tr className="expand-row">
                      <td colSpan={8} style={{ padding: 0 }}>
                        <div className="expand-inner">
                          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                            <thead><tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                              <th style={{ textAlign: 'left', padding: '6px 10px' }}>App ID</th>
                              <th style={{ textAlign: 'left', padding: '6px 10px' }}>Type</th>
                              <th style={{ textAlign: 'left', padding: '6px 10px' }}>Analyst</th>
                              <th style={{ textAlign: 'left', padding: '6px 10px' }}>Approval Date</th>
                              <th style={{ textAlign: 'left', padding: '6px 10px' }}>Comments</th>
                            </tr></thead>
                            <tbody>
                              {r.Details.map(d => (
                                <tr key={d.ApplicationID} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                  <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{d.ApplicationID}</td>
                                  <td style={{ padding: '6px 10px' }}>{d.ApplicationType}</td>
                                  <td style={{ padding: '6px 10px' }}>{d.AssignedAnalyst}</td>
                                  <td style={{ padding: '6px 10px' }}>{formatDate(d.ApprovalDate)}</td>
                                  <td style={{ padding: '6px 10px', color: 'var(--text-muted)' }}>{d.StatusComments || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
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
  );
}
