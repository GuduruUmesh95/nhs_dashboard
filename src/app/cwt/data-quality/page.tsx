'use client';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const qualityDimensions = [
  { name: 'Completeness', desc: 'All required fields populated — no missing values in critical columns', score: 98.4, color: '#22C55E', icon: '✅', target: 99 },
  { name: 'Accuracy', desc: 'Data matches source system records — validated via reconciliation checks', score: 99.1, color: '#0078D4', icon: '🎯', target: 99 },
  { name: 'Consistency', desc: 'Same data represented identically across all systems and regions', score: 97.8, color: '#8B5CF6', icon: '🔗', target: 98 },
  { name: 'Timeliness', desc: 'Data available within SLA windows — pipeline latency within agreed thresholds', score: 96.2, color: '#F59E0B', icon: '⏱️', target: 95 },
  { name: 'Validity', desc: 'Data conforms to defined formats, ranges and business rules', score: 99.6, color: '#14B8A6', icon: '📋', target: 99 },
  { name: 'Uniqueness', desc: 'No duplicate records after deduplication — single canonical record per entity', score: 99.9, color: '#E3008C', icon: '🪞', target: 99.5 },
];

const lineageFlow = [
  { name: 'Pega CRM', layer: 'Source', color: '#6366F1', icon: '⚙️' },
  { name: 'ADF Pipeline', layer: 'Ingest', color: '#0078D4', icon: '🔄' },
  { name: 'Bronze Layer\n(ADLS Gen2)', layer: 'Raw', color: '#B45309', icon: '🥉' },
  { name: 'Spark Transform\n(Silver Layer)', layer: 'Process', color: '#8B5CF6', icon: '⚗️' },
  { name: 'FactBooking\n(Gold Layer)', layer: 'Serve', color: '#D97706', icon: '🥇' },
  { name: 'Power BI\nSemantic Model', layer: 'Publish', color: '#F2C811', icon: '📐' },
  { name: 'Executive\nDashboard', layer: 'Consume', color: '#22C55E', icon: '📊' },
];

const metadataCatalog = [
  { asset: 'FactBooking', type: 'Gold Table', owner: 'Data Engineering', classification: 'Confidential', lastUpdated: '2 min ago', status: 'Certified', rowCount: '284.3M', lineage: 3 },
  { asset: 'DimCustomer', type: 'Gold Table', owner: 'Data Engineering', classification: 'Confidential', lastUpdated: '15 min ago', status: 'Certified', rowCount: '1.8M', lineage: 2 },
  { asset: 'DimCurrency', type: 'Gold Table', owner: 'Finance Team', classification: 'Internal', lastUpdated: '1 hour ago', status: 'Certified', rowCount: '187', lineage: 1 },
  { asset: 'stg_pega_bookings', type: 'Silver Table', owner: 'Data Engineering', classification: 'Confidential', lastUpdated: '5 min ago', status: 'Validated', rowCount: '12.4M', lineage: 2 },
  { asset: 'raw_sap_gl', type: 'Bronze Table', owner: 'Data Engineering', classification: 'Confidential', lastUpdated: '30 min ago', status: 'Raw', rowCount: '45.6M', lineage: 1 },
];

const qualityRules = [
  { rule: 'BOOKING_AMT_NOT_NULL', table: 'FactBooking', column: 'TravelAmount_USD', status: 'PASS', failures: 0, total: 284300000 },
  { rule: 'CURRENCY_CODE_VALID', table: 'FactBooking', column: 'CurrencyKey', status: 'PASS', failures: 0, total: 284300000 },
  { rule: 'CUSTOMER_KEY_REF_INT', table: 'FactBooking', column: 'CustomerKey', status: 'WARN', failures: 127, total: 284300000 },
  { rule: 'DATE_IN_RANGE', table: 'FactBooking', column: 'DateKey', status: 'PASS', failures: 0, total: 284300000 },
  { rule: 'COUNTRY_CODE_FORMAT', table: 'DimCountry', column: 'CountryCode', status: 'PASS', failures: 0, total: 152 },
  { rule: 'CUSTOMER_NAME_NOT_BLANK', table: 'DimCustomer', column: 'CustomerName', status: 'FAIL', failures: 23, total: 1800000 },
];

export default function DataQualityPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0d1f0d 50%, #166534 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .dq-dim { background: #fff; border-radius: 14px; padding: 18px 20px; border: 1px solid var(--border); flex: 1; }
        .lineage-node { background: #fff; border-radius: 12px; padding: 12px 14px; text-align: center; border: 1px solid var(--border); flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4; }
        .score-bar-bg { height: 8px; background: #E8EDF5; border-radius: 4px; overflow: hidden; margin-top: 8px; }
        .status-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>CWT Enterprise EDW</span>
          <span className="cwt-badge" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac' }}>Data Governance</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Data Quality, Metadata & Data Lineage</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          Comprehensive data quality framework with automated rule enforcement, Microsoft Purview metadata catalog, and full end-to-end data lineage tracing from source system to Power BI report.
        </p>
      </div>

      {/* Quality Dimensions */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Data Quality Dimensions — Gold Layer Scores</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {qualityDimensions.map((dim, i) => (
            <div key={i} className="dq-dim" style={{ minWidth: 180 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 20 }}>{dim.icon}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: dim.score >= dim.target ? '#22C55E' : '#F59E0B', background: dim.score >= dim.target ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                  {dim.score >= dim.target ? '✅ On Target' : '⚠️ Monitor'}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{dim.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 10 }}>{dim.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: dim.color }}>{dim.score}%</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target: {dim.target}%</span>
              </div>
              <div className="score-bar-bg">
                <div style={{ height: '100%', width: `${dim.score}%`, background: dim.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Lineage */}
      <div style={{ marginBottom: 20, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 16 }}>Data Lineage — Source to Dashboard (Powered by Microsoft Purview)</div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
          {lineageFlow.map((node, ni) => (
            <div key={ni} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 4px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: node.color + '14', border: `2px solid ${node.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {node.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{node.name}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: node.color, marginTop: 2 }}>{node.layer}</div>
                </div>
              </div>
              {ni < lineageFlow.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, padding: '0 2px' }}>
                  <div style={{ width: 24, height: 2, background: `linear-gradient(to right, ${node.color}, ${lineageFlow[ni + 1].color})` }} />
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Catalog */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Metadata Catalog (Microsoft Purview)</div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Asset Name', 'Type', 'Owner', 'Classification', 'Last Updated', 'Status', 'Row Count', 'Upstream Sources'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metadataCatalog.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#0078D4', fontFamily: 'monospace' }}>{row.asset}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: row.type.includes('Gold') ? 'rgba(217,119,6,0.1)' : row.type.includes('Silver') ? 'rgba(71,85,105,0.1)' : 'rgba(180,83,9,0.1)', color: row.type.includes('Gold') ? '#D97706' : row.type.includes('Silver') ? '#475569' : '#B45309' }}>{row.type}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)' }}>{row.owner}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>{row.classification}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)' }}>{row.lastUpdated}</td>
                  <td style={{ padding: '10px 14px' }}><span className="status-badge" style={{ background: row.status === 'Certified' ? 'rgba(34,197,94,0.1)' : row.status === 'Validated' ? 'rgba(0,120,212,0.1)' : 'rgba(245,158,11,0.1)', color: row.status === 'Certified' ? '#22C55E' : row.status === 'Validated' ? '#0078D4' : '#F59E0B' }}>{row.status}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text)' }}>{row.rowCount}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)' }}>{row.lineage} system{row.lineage > 1 ? 's' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Rules */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Automated Quality Rule Results</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {qualityRules.map((rule, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                {rule.status === 'PASS' ? <CheckCircle2 size={20} color="#22C55E" /> : rule.status === 'WARN' ? <AlertTriangle size={20} color="#F59E0B" /> : <XCircle size={20} color="#EF4444" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{rule.rule}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rule.table} · {rule.column}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className="status-badge" style={{ background: rule.status === 'PASS' ? 'rgba(34,197,94,0.1)' : rule.status === 'WARN' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: rule.status === 'PASS' ? '#22C55E' : rule.status === 'WARN' ? '#F59E0B' : '#EF4444' }}>{rule.status}</span>
                {rule.failures > 0 && <div style={{ fontSize: 10, color: '#EF4444', marginTop: 2 }}>{rule.failures.toLocaleString()} failures</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
