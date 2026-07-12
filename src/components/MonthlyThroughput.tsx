'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchCLR, deriveEltMonthly, getUnique } from '@/lib/data';
import type { EltMonthlyRow } from '@/types';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const MONTH_KEYS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MonthlyThroughput() {
  const [data, setData] = useState<EltMonthlyRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [fRegion, setFRegion] = useState('');

  useEffect(() => { fetchCLR().then(d => { setData(deriveEltMonthly(d)); setLoading(false); }); }, []);

  const filtered = useMemo(() => {
    return data.filter(r => !fRegion || r.NHSRegion === fRegion).sort((a, b) => b.Total - a.Total);
  }, [data, fRegion]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const chartData = useMemo(() => {
    return MONTH_KEYS.map(m => {
      const v = filtered.reduce((s, r) => s + (r[m as keyof EltMonthlyRow] as number), 0);
      return { name: m, Approvals: v };
    });
  }, [filtered]);

  const totals = useMemo(() => {
    const t: Record<string, number> = { Total: 0, Prior: 0 };
    MONTH_KEYS.forEach(m => t[m] = filtered.reduce((s, r) => s + (r[m as keyof EltMonthlyRow] as number), 0));
    t.Total = filtered.reduce((s, r) => s + r.Total, 0);
    t.Prior = filtered.reduce((s, r) => s + r.PriorYearTotal, 0);
    return t;
  }, [filtered]);

  const grandDelta = totals.Prior > 0 ? Math.round(((totals.Total - totals.Prior) / totals.Prior) * 100) : 0;
  const gdStr = (grandDelta >= 0 ? '+' : '') + grandDelta + '%';

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      Organisation: r.Organisation, Region: r.NHSRegion,
      Jan: r.Jan, Feb: r.Feb, Mar: r.Mar, Apr: r.Apr, May: r.May, Jun: r.Jun,
      Jul: r.Jul, Aug: r.Aug, Sep: r.Sep, Oct: r.Oct, Nov: r.Nov, Dec: r.Dec,
      Total: r.Total, 'Prior Year': r.PriorYearTotal, 'YoY %': r.DeltaPercent
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly_Throughput');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Monthly_Throughput.xlsx');
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filter-bar">
          <div className="filter-group">
            <label className="filter-label">Region</label>
            <select className="filter-select" value={fRegion} onChange={e => { setFRegion(e.target.value); setPage(0); }}>
              <option value="">All Regions</option>
              {getUnique(data, 'NHSRegion').map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn btn-outline" onClick={() => setFRegion('')}>Clear</button>
            <button className="btn btn-gold btn-sm" onClick={exportExcel}><Download size={14} /> Export</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><div className="card-title">Monthly Approvals</div></div>
        <div className="card-body" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E81C6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#0E81C6" stopOpacity={0.15}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{fill: 'rgba(17,29,51,0.03)'}} contentStyle={{ fontSize: 12, borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(17, 29, 51, 0.08)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <Bar dataKey="Approvals" fill="url(#colorMonthly)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th>Organisation</th><th>Region</th>
                  {MONTH_KEYS.map(m => <th key={m} style={{ textAlign: 'center' }}>{m}</th>)}
                  <th style={{ textAlign: 'center' }}>Total</th>
                  <th style={{ textAlign: 'center' }}>Prior Yr</th>
                  <th style={{ textAlign: 'center' }}>YoY %</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={15} className="empty-state">No records found</td></tr>
                ) : rows.map(r => (
                  <tr key={r.Organisation}>
                    <td style={{ fontWeight: 600 }}>{r.Organisation}</td>
                    <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                    {MONTH_KEYS.map(m => (
                      <td key={m} style={{ textAlign: 'center', color: r[m as keyof EltMonthlyRow] === 0 ? 'var(--border)' : 'inherit' }}>
                        {r[m as keyof EltMonthlyRow] as number}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.Total}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.PriorYearTotal}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: r.DeltaPercent.startsWith('+') ? 'var(--success)' : r.DeltaPercent.startsWith('-') ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {r.DeltaPercent}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid var(--border)' }}>
                  <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>GRAND TOTAL</td>
                  {MONTH_KEYS.map(m => <td key={m} style={{ textAlign: 'center', fontWeight: 700 }}>{totals[m]}</td>)}
                  <td style={{ textAlign: 'center', fontWeight: 800 }}>{totals.Total}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{totals.Prior}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: grandDelta > 0 ? 'var(--success)' : grandDelta < 0 ? 'var(--danger)' : 'inherit' }}>
                    {gdStr}
                  </td>
                </tr>
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
