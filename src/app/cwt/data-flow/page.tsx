'use client';
import { ArrowRight, ArrowDown } from 'lucide-react';

const stages = [
  {
    id: 'sources', label: 'Source Systems', icon: '🏢', color: '#6366F1', bg: 'rgba(99,102,241,0.08)',
    items: ['Pega CRM', 'SAP S/4HANA', 'Salesforce', 'Legacy DBs', 'REST APIs', 'Flat Files', 'Event Streams'],
    tech: 'JDBC · SFTP · REST · CDC',
    stat: '15+ Systems', statColor: '#6366F1'
  },
  {
    id: 'ingest', label: 'Ingestion', icon: '🔄', color: '#0078D4', bg: 'rgba(0,120,212,0.08)',
    items: ['Azure Data Factory', 'Event Hubs', 'Service Bus', 'Logic Apps'],
    tech: 'Batch · Streaming · CDC',
    stat: '200+ Pipelines', statColor: '#0078D4'
  },
  {
    id: 'raw', label: 'Raw Storage', icon: '🥉', color: '#B45309', bg: 'rgba(180,83,9,0.08)',
    items: ['ADLS Gen2 — Bronze', 'Delta Parquet Format', 'Append-Only Audit', 'Schema Registry'],
    tech: 'Delta Lake · Parquet',
    stat: 'As-Is Landing', statColor: '#B45309'
  },
  {
    id: 'transform', label: 'Transform & Enrich', icon: '⚗️', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',
    items: ['Synapse Spark Pools', 'Fabric Data Engineering', 'dbt Transformations', 'Azure Databricks'],
    tech: 'PySpark · SQL · dbt',
    stat: 'Silver Layer', statColor: '#8B5CF6'
  },
  {
    id: 'curated', label: 'Curated Data', icon: '🥇', color: '#D97706', bg: 'rgba(217,119,6,0.08)',
    items: ['Gold Layer — Kimball Schema', 'Conformed Dimensions', 'Fact Tables', 'Aggregate Stores'],
    tech: 'Star Schema · SSOT',
    stat: 'Single Source of Truth', statColor: '#D97706'
  },
  {
    id: 'semantic', label: 'Semantic Layer', icon: '📐', color: '#14B8A6', bg: 'rgba(20,184,166,0.08)',
    items: ['Power BI Semantic Model', 'Row-Level Security', 'Calculated Measures', 'Certified Datasets'],
    tech: 'DAX · Analysis Services',
    stat: 'Governed Metrics', statColor: '#14B8A6'
  },
  {
    id: 'powerbi', label: 'Power BI Dashboards', icon: '📊', color: '#F2C811', bg: 'rgba(242,200,17,0.08)',
    items: ['Executive Dashboards', 'Operational Reports', 'Self-Service Analytics', 'Embedded Reports'],
    tech: 'Power BI Premium · Paginated',
    stat: '150+ Countries', statColor: '#F2C811'
  },
];

const dataTypes = [
  { name: 'Structured Data', desc: 'Transactional records, financial data, booking data from RDBMS sources', icon: '🗃️', examples: 'SAP · SQL Server · Oracle' },
  { name: 'Semi-Structured', desc: 'JSON API responses, XML feeds, event payloads from streaming sources', icon: '📋', examples: 'REST APIs · Pega · Event Hubs' },
  { name: 'Unstructured Data', desc: 'Email content, scanned documents, travel policy PDFs and images', icon: '📄', examples: 'Blob Storage · Form Recognizer' },
  { name: 'Real-Time Streams', desc: 'Live booking events, fraud signals, travel disruption feeds', icon: '⚡', examples: 'Event Hubs · Stream Analytics' },
];

const globalStats = [
  { value: '150+', label: 'Countries', icon: '🌍' },
  { value: '60+', label: 'Currencies', icon: '💱' },
  { value: '30+', label: 'Languages', icon: '🌐' },
  { value: '100M+', label: 'Rows / Day', icon: '📈' },
  { value: '< 30s', label: 'Stream Latency', icon: '⚡' },
  { value: '99.9%', label: 'Data Accuracy', icon: '✅' },
];

export default function DataFlowPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a2744 50%, #0078D4 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .stage-card { border-radius: 14px; padding: 16px 18px; border: 1px solid; flex: 1; min-width: 0; }
        .flow-arrow { display: flex; align-items: flex-start; justify-content: center; padding-top: 36px; flex-shrink: 0; }
        .stat-pill { background: #fff; border-radius: 12px; padding: 14px 18px; text-align: center; border: 1px solid var(--border); flex: 1; }
        .dtype-card { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid var(--border); flex: 1; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>CWT Enterprise EDW</span>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>End-to-End Flow</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>End-to-End Data Flow</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          The complete journey of data — from 15+ source systems through ingestion, transformation and the gold layer, all the way to Power BI dashboards consumed across 150+ countries.
        </p>
      </div>

      {/* Global Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {globalStats.map((s, i) => (
          <div key={i} className="stat-pill">
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0078D4', letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Flow */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 20 }}>Data Pipeline — Source to Power BI</div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 4 }}>
          {stages.map((stage, si) => (
            <div key={stage.id} style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
              <div className="stage-card" style={{ background: stage.bg, borderColor: stage.color + '30', minWidth: 150 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10, alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: 26 }}>{stage.icon}</span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: stage.color }}>{stage.label}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: stage.color, background: stage.color + '14', padding: '2px 8px', borderRadius: 8 }}>{stage.stat}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {stage.items.map((item, ii) => (
                    <div key={ii} style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: stage.color, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{stage.tech}</div>
              </div>
              {si < stages.length - 1 && (
                <div className="flow-arrow" style={{ width: 32 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 14, height: 2, background: `linear-gradient(to right, ${stage.color}, ${stages[si + 1].color})` }} />
                    <ArrowRight size={12} color={stages[si + 1].color} style={{ marginTop: -4 }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Types Handled */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Data Types Handled</div>
        <div style={{ display: 'flex', gap: 14 }}>
          {dataTypes.map((dt, i) => (
            <div key={i} className="dtype-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>{dt.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{dt.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>{dt.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0078D4', background: 'rgba(0,120,212,0.07)', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>{dt.examples}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Capabilities Callout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { title: 'Multi-Currency Engine', desc: 'Automated FX conversion for 60+ currencies using daily ECB rate feeds integrated via ADF', icon: '💱', color: '#EF4444' },
          { title: 'Multi-Language NLP', desc: 'Azure Cognitive Services translates and normalises data across 30+ languages at pipeline level', icon: '🌐', color: '#14B8A6' },
          { title: 'Automated Reporting', desc: 'Power BI subscriptions deliver scheduled reports to 500+ stakeholders across 150+ countries', icon: '📤', color: '#22C55E' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
