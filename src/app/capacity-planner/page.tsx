'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchCLR, fetchHierarchy, deriveTracker, deriveCapacity, getWeekStarts, getUnique } from '@/lib/data';
import type { CapacityRow } from '@/types';
import { Users, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, CartesianGrid } from 'recharts';

import PdfExportButton from '@/components/PdfExportButton';

export default function CapacityPlannerPage() {
  const [data, setData] = useState<CapacityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const weeks = useMemo(() => getWeekStarts(), []);

  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const [fRegion, setFRegion] = useState('');
  const [fLead, setFLead] = useState('');

  useEffect(() => {
    Promise.all([fetchCLR(), fetchHierarchy()]).then(([clr, hierarchy]) => {
      const trk = deriveTracker(clr);
      setData(deriveCapacity(trk, hierarchy, weeks));
      setLoading(false);
    });
  }, [weeks]);

  const filtered = useMemo(() => {
    return data.filter(r =>
      (!fRegion || r.NHSRegion === fRegion) &&
      (!fLead || r.TeamLead === fLead)
    );
  }, [data, fRegion, fLead]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const chartData = useMemo(() => {
    return weeks.map((w, i) => {
      const wk = `W${i + 1}`;
      const utilized = filtered.reduce((sum, r) => sum + (r[wk as keyof CapacityRow] as number), 0);
      const capacity = filtered.reduce((sum, r) => sum + r.TargetUtilization, 0);
      return { name: `W${i + 1}`, Utilized: utilized, Capacity: capacity };
    });
  }, [filtered, weeks]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => {
      const row: any = { Analyst: r.Name, Region: r.NHSRegion, 'Team Lead': r.TeamLead, 'Target Utilization': r.TargetUtilization, 'Active Total': r.ActiveCount };
      weeks.forEach((w, i) => { row[`Week ${i + 1}`] = r[`W${i + 1}` as keyof CapacityRow]; });
      return row;
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Capacity');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Capacity_Planner.xlsx');
  };

  const HeatCell = ({ val, max }: { val: number, max: number }) => {
    if (val === 0) return <div>-</div>;
    const isOver = val > max;
    const ratio = Math.min(val / max, 1);
    const bg = isOver ? 'rgba(239, 68, 68, 0.15)' : `rgba(14, 129, 198, ${ratio * 0.4})`;
    const color = isOver ? 'var(--danger)' : (ratio > 0.8 ? 'var(--text)' : 'var(--text-muted)');
    return <div style={{ background: bg, color, padding: '2px 6px', borderRadius: 4, fontWeight: isOver ? 600 : 400 }}>{val}</div>;
  };

  if (loading) return <div className="page-body" style={{ padding: 24 }}>Loading capacity model...</div>;

  return (
    <div className="page-body fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} /> Analyst Capacity Planner
          </div>
          <div className="topbar-subtitle">Resource allocation and capacity forecasting (12 weeks)</div>
        </div>
        <div className="topbar-right" style={{ display: 'flex', gap: '8px' }}>
          <PdfExportButton targetId="pdf-content" filename="Capacity_Planner" />
          <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export</button>
        </div>
      </div>

      <div id="pdf-content" style={{ padding: 24, backgroundColor: 'var(--bg-main)' }}>
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><div className="card-title">Team Utilization Forecast</div></div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{fill: 'rgba(17,29,51,0.03)'}} contentStyle={{ fontSize: 12, borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(17, 29, 51, 0.08)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <Bar dataKey="Utilized" fill="rgba(14, 129, 198, 0.6)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Capacity" fill="rgba(14, 129, 198, 0.15)" radius={[6, 6, 0, 0]} />
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
                  <th colSpan={5} style={{ borderRight: '2px solid #fff', textAlign: 'center', background: '#E8F4FA', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>Analyst Info</th>
                  <th colSpan={2} style={{ borderRight: '2px solid #fff', textAlign: 'center', background: '#D9EEF8', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>4-Week Summary</th>
                  <th colSpan={12} style={{ textAlign: 'center', background: '#E8F4FA', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>12-Week Active Case Heatmap</th>
                </tr>
                <tr>
                  <th>Analyst</th><th>Region</th><th>Team Lead</th>
                  <th style={{ textAlign: 'center' }}>Target Util.</th><th style={{ borderRight: '2px solid var(--border)', textAlign: 'center' }}>Active</th>
                  <th style={{ textAlign: 'center' }}>Avg Util.</th>
                  <th style={{ borderRight: '2px solid var(--border)', textAlign: 'center' }}>Cap. Available</th>
                  {weeks.map((w, i) => <th key={i} style={{ textAlign: 'center' }}>W{i+1}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={19} className="empty-state"><p>No records found</p></td></tr>
                ) : rows.map(r => {
                  let sum4 = 0;
                  weeks.slice(0, 4).forEach((w, i) => {
                    const val = r[`W${i + 1}` as keyof CapacityRow] as number;
                    sum4 += (val > 0 ? val : 0);
                  });
                  const avgUtil = parseFloat((sum4 / 4).toFixed(1));
                  const capAvail = parseFloat((r.TargetUtilization - avgUtil).toFixed(1));
                  
                  let capColor = 'var(--text-muted)';
                  if (capAvail > 0) capColor = '#15803D'; // Green (under util)
                  else if (capAvail === 0) capColor = '#B45309'; // Amber (at cap)
                  else capColor = 'var(--danger)'; // Red (over cap)

                  return (
                  <tr key={r.Name}>
                    <td style={{ fontWeight: 600 }}>{r.Name}</td>
                    <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                    <td style={{ fontSize: 12 }}>{r.TeamLead}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>{r.TargetUtilization}</td>
                    <td style={{ borderRight: '2px solid var(--border)', textAlign: 'center', fontWeight: 700 }}>{r.ActiveCount}</td>
                    
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--navy)' }}>{avgUtil}</td>
                    <td style={{ borderRight: '2px solid var(--border)', textAlign: 'center', fontWeight: 700, color: capColor }}>
                      {capAvail > 0 ? '+' : ''}{capAvail}
                    </td>

                    {weeks.map((w, i) => (
                      <td key={i} style={{ padding: '6px 4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <HeatCell val={r[`W${i + 1}` as keyof CapacityRow] as number} max={r.TargetUtilization} />
                        </div>
                      </td>
                    ))}
                  </tr>
                )})}
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
