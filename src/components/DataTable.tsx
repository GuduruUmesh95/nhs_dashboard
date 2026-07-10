'use client';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: number;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  stickyHeader?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, pageSize = 25, searchable = false, searchKeys = [], emptyMessage = 'No records found.'
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(pageSize);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let rows = data;
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(r => searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc' ? String(av ?? '').localeCompare(String(bv ?? '')) : String(bv ?? '').localeCompare(String(av ?? ''));
      });
    }
    return rows;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice(page * perPage, (page + 1) * perPage);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(0);
  };

  const SortIcon = ({ k }: { k: string }) => {
    if (sortKey !== k) return <ChevronsUpDown size={12} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="card">
      {searchable && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            className="filter-input"
            style={{ maxWidth: 300 }}
            placeholder="Search records…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
          />
          <span className="record-chip">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      <div className="table-wrap">
        <table className="nhs-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width, minWidth: col.width }}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.header}
                    {col.sortable !== false && <SortIcon k={String(col.key)} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty-state"><p>{emptyMessage}</p></td></tr>
            ) : pageData.map((row, ri) => (
              <tr key={ri} className="fade-in">
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render ? col.render(row) : String(row[String(col.key) as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span className="pagination-info">
          Showing {filtered.length === 0 ? 0 : page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}
        </span>
        <select className="filter-select" style={{ width: 'auto', padding: '4px 8px' }}
          value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}>
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
  );
}
