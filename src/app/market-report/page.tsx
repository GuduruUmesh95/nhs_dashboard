"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, LabelList
} from 'recharts';
import { Download, Filter, RefreshCcw } from 'lucide-react';
import { ClrRecord } from '@/types';
import { fetchCLR } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import PdfExportButton from '@/components/PdfExportButton';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Premium brand color palette for charts
const COLORS = [
  '#0E81C6', // Brand Blue
  '#26D3C8', // Aqua
  '#F1B71C', // Gold
  '#8B5CF6', // Purple
  '#E23B53', // Rose
  '#F57B20', // Orange
  '#4ADE80', // Emerald
];
const MONTHS_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function MarketReportPage() {
  const [data, setData] = useState<ClrRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set());
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set());
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());

  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchCLR().then((json: ClrRecord[]) => {
        setData(json);
        
        // Default select the current year if available
        const currentYear = new Date().getFullYear().toString();
        const years = new Set(json.map(d => d.ApprovalYear).filter(Boolean));
        if (years.has(currentYear)) {
          setSelectedYears(new Set([currentYear]));
        } else if (years.size > 0) {
          setSelectedYears(new Set([Array.from(years).sort().reverse()[0]]));
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(r => ({
      'Application ID': r.ApplicationID,
      'Organisation': r.Organisation,
      'Type': r.ApplicationType,
      'Scope': r.ApplicationScope,
      'Region': r.NHSRegion,
      'Country': r.Country,
      'Status': r.ApplicationStatus,
      'Review Stage': r.ReviewStage,
      'Research Type': r.ResearchType,
      'Submission Date': r.SubmissionDate,
      'Approval Date': r.ApprovalDate,
      'Progress (%)': r.ProgressPercent,
      'Cycle Time (days)': r.CycleTime
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Market Report');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Market_Report.xlsx');
  };

  // Unique values for filters
  const allRegions = useMemo(() => Array.from(new Set(data.map(d => d.NHSRegion).filter(Boolean))).sort(), [data]);
  const allScopes = useMemo(() => Array.from(new Set(data.map(d => d.ApplicationScope).filter(Boolean))).sort(), [data]);
  const allYears = useMemo(() => Array.from(new Set(data.map(d => d.ApprovalYear).filter(Boolean))).sort().reverse(), [data]);
  const allMonths = MONTHS_ORDER;

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(d => {
      const regionMatch = selectedRegions.size === 0 || selectedRegions.has(d.NHSRegion);
      const scopeMatch = selectedScopes.size === 0 || selectedScopes.has(d.ApplicationScope);
      const yearMatch = selectedYears.size === 0 || selectedYears.has(d.ApprovalYear);
      const monthMatch = selectedMonths.size === 0 || selectedMonths.has(d.ApprovalMonth);
      return regionMatch && scopeMatch && yearMatch && monthMatch;
    });
  }, [data, selectedRegions, selectedScopes, selectedYears, selectedMonths]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const rows = filteredData.slice(page * perPage, (page + 1) * perPage);

  // --- Aggregations for Charts ---

  // 1. Month Wise Application Volume Breakup
  const monthWiseVolume = useMemo(() => {
    const map = new Map<string, number>();
    MONTHS_ORDER.forEach(m => map.set(m, 0));
    filteredData.forEach(d => {
      if (d.ApprovalMonth) {
        map.set(d.ApprovalMonth, (map.get(d.ApprovalMonth) || 0) + (d.ApplicationVolume || 1));
      }
    });
    return MONTHS_ORDER.map(m => ({
      name: m.substring(0, 3), // Jan, Feb, etc.
      Volume: map.get(m) || 0
    }));
  }, [filteredData]);

  // 2. Region Breakup
  const regionBreakup = useMemo(() => {
    const map = new Map<string, { count: number, volume: number }>();
    filteredData.forEach(d => {
      if (d.NHSRegion) {
        const curr = map.get(d.NHSRegion) || { count: 0, volume: 0 };
        curr.count += 1;
        curr.volume += (d.ApplicationVolume || 1);
        map.set(d.NHSRegion, curr);
      }
    });
    return Array.from(map.entries()).map(([name, vals]) => ({
      name,
      Count: vals.count,
      Volume: vals.volume
    })).sort((a, b) => b.Volume - a.Volume);
  }, [filteredData]);

  // 3. Application Scope Volume
  const scopeBreakup = useMemo(() => {
    const map = new Map<string, { count: number, volume: number }>();
    filteredData.forEach(d => {
      if (d.ApplicationScope) {
        const curr = map.get(d.ApplicationScope) || { count: 0, volume: 0 };
        curr.count += 1;
        curr.volume += (d.ApplicationVolume || 1);
        map.set(d.ApplicationScope, curr);
      }
    });
    return Array.from(map.entries()).map(([name, vals]) => ({
      name,
      Count: vals.count,
      Volume: vals.volume
    })).sort((a, b) => b.Volume - a.Volume);
  }, [filteredData]);

  // 4. Trend Chart (Volume, Count, Cycle Time)
  const trendData = useMemo(() => {
    const map = new Map<string, { count: number, volume: number, totalCycle: number }>();
    MONTHS_ORDER.forEach(m => map.set(m, { count: 0, volume: 0, totalCycle: 0 }));
    
    filteredData.forEach(d => {
      if (d.ApprovalMonth) {
        const curr = map.get(d.ApprovalMonth)!;
        curr.count += 1;
        curr.volume += (d.ApplicationVolume || 1);
        curr.totalCycle += (d.CycleTime || 0);
      }
    });

    return MONTHS_ORDER.map(m => {
      const d = map.get(m)!;
      return {
        name: m.substring(0, 3),
        Volume: d.volume,
        Count: d.count,
        AvgCycleTime: d.count > 0 ? Math.round(d.totalCycle / d.count) : 0
      };
    });
  }, [filteredData]);

  const totalVolume = useMemo(() => {
    return regionBreakup.reduce((sum, item) => sum + item.Volume, 0);
  }, [regionBreakup]);

  // Toggle helpers
  const toggleSet = (set: Set<string>, val: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    const newSet = new Set(set);
    if (newSet.has(val)) newSet.delete(val);
    else newSet.add(val);
    setter(newSet);
    setPage(0);
  };

  const resetFilters = () => {
    setSelectedRegions(new Set());
    setSelectedScopes(new Set());
    setSelectedYears(new Set());
    setSelectedMonths(new Set());
    setPage(0);
  };

  if (loading) {
    return <div className="page-flex" style={{ padding: '20px' }}>Loading report data...</div>;
  }

  return (
    <div className="page-flex" style={{ flexDirection: 'row', gap: '20px', background: 'transparent' }}>
      {/* Sidebar Filters */}
      <div className="no-print" style={{ width: '260px', background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
          <h2 style={{ fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', fontWeight: 700 }}>
            <Filter size={16} /> Filters
          </h2>
          <button className="btn btn-sm" style={{ padding: '4px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }} onClick={resetFilters} title="Reset Filters">
            <RefreshCcw size={14} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Approval Year */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>Approval Year</h3>
            {allYears.map(y => (
              <label key={y} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedYears.has(y)} onChange={() => toggleSet(selectedYears, y, setSelectedYears)} />
                {y}
              </label>
            ))}
          </div>

          {/* NHS Region */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>NHS Region</h3>
            {allRegions.map(r => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedRegions.has(r)} onChange={() => toggleSet(selectedRegions, r, setSelectedRegions)} />
                {r}
              </label>
            ))}
          </div>

          {/* Application Scope */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>Application Scope</h3>
            {allScopes.map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedScopes.has(s)} onChange={() => toggleSet(selectedScopes, s, setSelectedScopes)} />
                {s}
              </label>
            ))}
          </div>
          
          {/* Approval Month */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>Approval Month</h3>
            {allMonths.map(m => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedMonths.has(m)} onChange={() => toggleSet(selectedMonths, m, setSelectedMonths)} />
                {m}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'transparent' }}>
        <div className="topbar-right" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Implementation Market Report</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0 0' }}>Showing {filteredData.length} filtered applications</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <PdfExportButton targetId="pdf-content" filename="Implementation_Market_Report" />
            <button className="btn btn-primary btn-sm" onClick={exportExcel}>
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        <div id="pdf-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px', backgroundColor: 'var(--bg-main)' }}>
          
          {/* Top KPI: Month Wise Volume */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Month Wise Application Volume Breakup</div>
            </div>
            <div style={{ height: '300px', padding: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthWiseVolume} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dx={-10} />
                  <RechartsTooltip cursor={{fill: 'rgba(17,29,51,0.03)'}} contentStyle={{borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(17, 29, 51, 0.08)'}}/>
                  <Bar dataKey="Volume" fill="rgba(14, 129, 198, 0.6)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Middle Row: Region Breakup & Scope Breakup */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Region */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Region Breakup</div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={regionBreakup} dataKey="Volume" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={78} paddingAngle={0} stroke="none">
                        {regionBreakup.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Total Text */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>{totalVolume}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total</div>
                  </div>
                </div>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th style={{ textAlign: 'center' }}>Projects</th>
                      <th style={{ textAlign: 'center' }}>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionBreakup.map((r, i) => (
                      <tr key={i}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: COLORS[i % COLORS.length] }}></span>
                          {r.name}
                        </td>
                        <td style={{ textAlign: 'center' }}>{r.Count}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.Volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scope */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Project Level (Scope) Volume</div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={scopeBreakup} dataKey="Volume" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={78} paddingAngle={0} stroke="none">
                        {scopeBreakup.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Total Text */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>{totalVolume}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total</div>
                  </div>
                </div>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Project Level</th>
                      <th style={{ textAlign: 'center' }}>Projects</th>
                      <th style={{ textAlign: 'center' }}>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopeBreakup.map((s, i) => (
                      <tr key={i}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: COLORS[(i + 3) % COLORS.length] }}></span>
                          {s.name}
                        </td>
                        <td style={{ textAlign: 'center' }}>{s.Count}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{s.Volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Trend Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Total Volume, Project Count & Average Cycle Time Trend</div>
            </div>
            <div style={{ height: '350px', padding: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="rgba(0,0,0,0.15)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dx={-10} label={{ value: 'Volume', angle: -90, position: 'insideLeft', offset: -5, fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dx={10} label={{ value: 'Projects / Days', angle: 90, position: 'insideRight', offset: -5, fill: 'var(--text-muted)', fontSize: 12 }} />
                  <RechartsTooltip cursor={{fill: 'rgba(17,29,51,0.03)'}} contentStyle={{borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(17, 29, 51, 0.08)'}}/>
                  <Legend wrapperStyle={{paddingTop: '10px'}} />
                  <Bar yAxisId="left" dataKey="Volume" fill="rgba(38, 211, 200, 0.25)" name="App Volume" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="Count" stroke="#0E81C6" name="Project Count" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" dataKey="AvgCycleTime" stroke="#8B5CF6" name="Avg Cycle Time (Days)" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Raw Data Table */}
          <div className="card no-print">
            <div className="card-header">
              <div className="card-title">Detailed Filtered Records ({filteredData.length})</div>
            </div>
            <div className="table-wrap">
              <table className="nhs-table" style={{ margin: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Organisation</th>
                    <th>Region</th>
                    <th>Scope</th>
                    <th>Status</th>
                    <th>Approval Date</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-state">No applications match the selected filters.</td>
                    </tr>
                  ) : rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{r.ApplicationID}</td>
                      <td>{r.Organisation}</td>
                      <td>{r.NHSRegion}</td>
                      <td>{r.ApplicationScope}</td>
                      <td>
                        <StatusBadge status={r.ApplicationStatus} />
                      </td>
                      <td>{r.ApprovalDate}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.ApplicationVolume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span className="pagination-info">Showing {filteredData.length === 0 ? 0 : page * perPage + 1}–{Math.min((page + 1) * perPage, filteredData.length)} of {filteredData.length}</span>
              <select className="filter-select" style={{ width: 'auto', padding: '4px 8px' }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}>
                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
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
    </div>
  );
}
