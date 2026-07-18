'use client';
import { ArrowRight, Info } from 'lucide-react';

// Fact Table columns
const factStudy = {
  name: 'FactStudy', color: '#0078D4', bg: 'rgba(0,120,212,0.06)', border: 'rgba(0,120,212,0.25)',
  type: 'FACT',
  columns: [
    { name: 'StudyKey', type: 'BIGINT', pk: true },
    { name: 'DateKey', type: 'INT', fk: true },
    { name: 'TrustKey', type: 'INT', fk: true },
    { name: 'RegionKey', type: 'INT', fk: true },
    { name: 'CurrencyKey', type: 'INT', fk: true },
    { name: 'ProductKey', type: 'INT', fk: true },
    { name: 'AnalystKey', type: 'INT', fk: true },
    { name: 'FundingAmount', type: 'DECIMAL(18,2)', measure: true },
    { name: 'PatientCount', type: 'INT', measure: true },
    { name: 'ServiceFee', type: 'DECIMAL(18,2)', measure: true },
    { name: 'StudyDurationDays', type: 'INT', measure: true },
  ]
};

const factGrant = {
  name: 'FactGrant', color: '#8B5CF6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.25)',
  type: 'FACT',
  columns: [
    { name: 'GrantKey', type: 'BIGINT', pk: true },
    { name: 'DateKey', type: 'INT', fk: true },
    { name: 'TrustKey', type: 'INT', fk: true },
    { name: 'CurrencyKey', type: 'INT', fk: true },
    { name: 'CategoryKey', type: 'INT', fk: true },
    { name: 'GrantAmount', type: 'DECIMAL(18,2)', measure: true },
    { name: 'GrantCount', type: 'INT', measure: true },
    { name: 'IsApproved', type: 'BIT', measure: true },
  ]
};

const dimensions = [
  {
    name: 'DimDate', color: '#F59E0B', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)',
    type: 'DATE DIM',
    columns: [
      { name: 'DateKey', type: 'INT', pk: true },
      { name: 'FullDate', type: 'DATE' },
      { name: 'Year', type: 'INT' },
      { name: 'Quarter', type: 'INT' },
      { name: 'Month', type: 'INT' },
      { name: 'MonthName', type: 'NVARCHAR(20)' },
      { name: 'WeekOfYear', type: 'INT' },
      { name: 'IsWeekend', type: 'BIT' },
      { name: 'FiscalYear', type: 'INT' },
    ]
  },
  {
    name: 'DimTrust', color: '#22C55E', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.25)',
    type: 'SCD TYPE 2',
    columns: [
      { name: 'TrustKey', type: 'INT', pk: true },
      { name: 'TrustID', type: 'NVARCHAR(50)' },
      { name: 'TrustName', type: 'NVARCHAR(255)' },
      { name: 'Segment', type: 'NVARCHAR(100)' },
      { name: 'Industry', type: 'NVARCHAR(100)' },
      { name: 'ContractTier', type: 'NVARCHAR(50)' },
      { name: 'IsCurrent', type: 'BIT' },
      { name: 'ValidFrom', type: 'DATE' },
      { name: 'ValidTo', type: 'DATE' },
    ]
  },
  {
    name: 'DimRegion', color: '#14B8A6', bg: 'rgba(20,184,166,0.06)', border: 'rgba(20,184,166,0.25)',
    type: 'CONFORMED',
    columns: [
      { name: 'RegionKey', type: 'INT', pk: true },
      { name: 'RegionCode', type: 'CHAR(3)' },
      { name: 'RegionName', type: 'NVARCHAR(100)' },
      { name: 'Region', type: 'NVARCHAR(50)' },
      { name: 'Continent', type: 'NVARCHAR(50)' },
      { name: 'IsEU', type: 'BIT' },
      { name: 'Language', type: 'NVARCHAR(50)' },
      { name: 'TimeZone', type: 'NVARCHAR(50)' },
    ]
  },
  {
    name: 'DimCurrency', color: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.25)',
    type: 'CONFORMED',
    columns: [
      { name: 'CurrencyKey', type: 'INT', pk: true },
      { name: 'CurrencyCode', type: 'CHAR(3)' },
      { name: 'CurrencyName', type: 'NVARCHAR(50)' },
      { name: 'Symbol', type: 'NVARCHAR(10)' },
      { name: 'ExchangeRateToUSD', type: 'DECIMAL(18,6)' },
      { name: 'RateDate', type: 'DATE' },
      { name: 'IsBaseCurrency', type: 'BIT' },
    ]
  },
  {
    name: 'DimProduct', color: '#6366F1', bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.25)',
    type: 'JUNK DIM',
    columns: [
      { name: 'ProductKey', type: 'INT', pk: true },
      { name: 'ProductCode', type: 'NVARCHAR(50)' },
      { name: 'ProductName', type: 'NVARCHAR(100)' },
      { name: 'Category', type: 'NVARCHAR(50)' },
      { name: 'SubCategory', type: 'NVARCHAR(50)' },
      { name: 'ServiceType', type: 'NVARCHAR(50)' },
    ]
  },
];

function TableCard({ table, isCenter = false }: { table: any, isCenter?: boolean }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: `2px solid ${table.border.replace('0.25', '0.5')}`,
      minWidth: isCenter ? 240 : 180, overflow: 'hidden',
      boxShadow: isCenter ? '0 8px 32px rgba(0,120,212,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ background: `${table.bg}`, padding: '10px 14px', borderBottom: `1px solid ${table.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: table.color }}>{table.name}</div>
          <span style={{ fontSize: 9, fontWeight: 700, background: table.color + '20', color: table.color, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.4px' }}>{table.type}</span>
        </div>
      </div>
      <div style={{ padding: '8px 0' }}>
        {table.columns.map((col: any, i: number) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '3px 14px',
            background: col.pk ? 'rgba(255,215,0,0.06)' : col.fk ? 'rgba(0,120,212,0.03)' : 'transparent'
          }}>
            <span style={{ fontSize: 10, width: 14, flexShrink: 0, color: col.pk ? '#D97706' : col.fk ? '#0078D4' : col.measure ? '#22C55E' : 'transparent' }}>
              {col.pk ? '🔑' : col.fk ? '🔗' : col.measure ? '📊' : '  '}
            </span>
            <div style={{ fontSize: 11, fontWeight: col.pk || col.fk ? 700 : 400, color: 'var(--text)', flex: 1 }}>{col.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{col.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DataModelPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a2744 50%, #0078D4 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>HRA Data Platform</span>
          <span className="cwt-badge" style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(167,139,250,0.4)', color: '#d8b4fe' }}>Gold Layer</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Kimball Dimensional Data Model — Star Schema</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          The Gold Layer dimensional model built to Kimball standards — conformed dimensions supporting multi-currency (150+ countries), SCD Type 2 history, and 30+ languages.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 8 }}>Legend:</div>
        {[
          { icon: '🔑', label: 'Primary Key', color: '#D97706' },
          { icon: '🔗', label: 'Foreign Key', color: '#0078D4' },
          { icon: '📊', label: 'Measure / Metric', color: '#22C55E' },
          { label: 'FACT', desc: 'Central fact table', color: '#0078D4', badge: true },
          { label: 'SCD TYPE 2', desc: 'Slowly Changing Dimension', color: '#22C55E', badge: true },
          { label: 'CONFORMED', desc: 'Shared across fact tables', color: '#14B8A6', badge: true },
        ].map((item, i) => (
          <div key={i} className="legend-item">
            {item.icon ? <span>{item.icon}</span> : null}
            {item.badge ? <span style={{ fontSize: 9, fontWeight: 700, background: item.color + '18', color: item.color, padding: '2px 7px', borderRadius: 4 }}>{item.label}</span> : null}
            <span>{item.icon ? item.label : item.desc}</span>
          </div>
        ))}
      </div>

      {/* Star Schema Diagram */}
      {/* Row 1: top dim */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <TableCard table={dimensions[0]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 2, height: 20, background: 'linear-gradient(to bottom, #F59E0B, #0078D4)' }} />
      </div>

      {/* Middle row: dim | fact | dim */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 8 }}>
        <TableCard table={dimensions[1]} />
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 60 }}>
          <div style={{ width: 32, height: 2, background: 'linear-gradient(to right, #22C55E, #0078D4)' }} />
          <ArrowRight size={14} color="#0078D4" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TableCard table={factStudy} isCenter />
          <TableCard table={factGrant} isCenter />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowRight size={14} color="#0078D4" style={{ transform: 'scaleX(-1)' }} />
            <div style={{ width: 32, height: 2, background: 'linear-gradient(to right, #0078D4, #14B8A6)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowRight size={14} color="#8B5CF6" style={{ transform: 'scaleX(-1)' }} />
            <div style={{ width: 32, height: 2, background: 'linear-gradient(to right, #0078D4, #8B5CF6)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TableCard table={dimensions[2]} />
          <TableCard table={dimensions[3]} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 2, height: 20, background: 'linear-gradient(to bottom, #0078D4, #6366F1)' }} />
      </div>

      {/* Row 3: dim & fact 2 bottom */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 24 }}>
        <TableCard table={dimensions[4]} />
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 50 }}>
          <div style={{ width: 32, height: 2, background: 'linear-gradient(to right, #6366F1, #8B5CF6)' }} />
          <ArrowRight size={14} color="#8B5CF6" />
        </div>
        <TableCard table={factGrant} isCenter />
      </div>

      {/* Kimball Principles */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,120,212,0.05), rgba(0,120,212,0.02))', border: '1px solid rgba(0,120,212,0.15)', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#0078D4', marginBottom: 14 }}>Kimball Design Principles Applied</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { principle: 'Conformed Dimensions', desc: 'DimDate, DimCountry & DimCurrency shared across all fact tables for consistent cross-subject analysis' },
            { principle: 'SCD Type 2 History', desc: 'Customer & Product dimensions track historical changes with ValidFrom/ValidTo date patterns' },
            { principle: 'Grain Consistency', desc: 'Each fact table has a declared grain — one row per booking event / one row per expense claim' },
            { principle: 'Surrogate Keys', desc: 'Integer surrogate keys used throughout — source system natural keys preserved as business keys' },
          ].map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{p.principle}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
