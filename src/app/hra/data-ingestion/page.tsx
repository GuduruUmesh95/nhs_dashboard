'use client';
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const sources = [
  { name: 'IRAS System', icon: '⚙️', type: 'Application', color: '#6366F1' },
  { name: 'Oracle Financials', icon: '🏢', type: 'ERP', color: '#0078D4' },
  { name: 'NHS Spine', icon: '☁️', type: 'Clinical', color: '#00A1E0' },
  { name: 'Legacy RDBMS', icon: '🗄️', type: 'Database', color: '#64748B' },
  { name: 'Flat Files / SFTP', icon: '📄', type: 'Batch', color: '#8B5CF6' },
  { name: 'REST APIs / FX', icon: '🔗', type: 'Real-Time', color: '#F59E0B' },
  { name: 'Event Streams', icon: '⚡', type: 'Streaming', color: '#EF4444' },
];

const medallionLayers = [
  {
    id: 'bronze', label: 'Bronze', subtitle: 'Raw / Landing', icon: '🥉',
    color: '#B45309', bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.2)',
    details: [
      'Data landed as-is — no transformations',
      'Audit trail preserved — append-only pattern',
      'Supports structured, semi-structured & unstructured',
      'Stored in Delta Parquet format in ADLS Gen2',
    ]
  },
  {
    id: 'silver', label: 'Silver', subtitle: 'Cleansed / Conformed', icon: '🥈',
    color: '#475569', bg: 'rgba(71,85,105,0.08)', border: 'rgba(71,85,105,0.2)',
    details: [
      'Data quality rules applied — null checks, deduplication',
      'Schema standardisation across all sources',
      'Multi-currency conversion to USD/GBP/EUR',
      'Multi-language normalisation (30+ languages)',
    ]
  },
  {
    id: 'gold', label: 'Gold', subtitle: 'Curated / Business-Ready', icon: '🥇',
    color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)',
    details: [
      'Kimball dimensional models (Star Schema)',
      'Certified, validated — single source of truth',
      'Aggregated KPIs & summary tables',
      'Optimised for Power BI DirectQuery & Import',
    ]
  },
];

const pipelineTypes = [
  {
    title: 'Batch ETL (Extract → Transform → Load)',
    icon: '📦',
    color: '#0078D4',
    tools: 'Azure Data Factory · SQL Stored Procedures · Synapse Pipelines',
    useCases: ['Daily financial summaries', 'Monthly regulatory reports', 'Historical data migration'],
    schedule: 'Scheduled: Nightly at 02:00 UTC',
    latency: 'Latency: ~4–6 hrs',
  },
  {
    title: 'Streaming ELT (Extract → Load → Transform)',
    icon: '⚡',
    color: '#EF4444',
    tools: 'Azure Event Hubs · Stream Analytics · Fabric Real-Time Analytics',
    useCases: ['Live trial enrollments from IRAS', 'Real-time safety signal detection', 'Protocol deviation alerts'],
    schedule: 'Continuous streaming',
    latency: 'Latency: <30 seconds',
  },
  {
    title: 'Change Data Capture (CDC)',
    icon: '🔁',
    color: '#8B5CF6',
    tools: 'Azure Data Factory · Debezium · SQL Change Tracking',
    useCases: ['Incremental loads from Oracle & Spine', 'Detect record updates & deletes', 'Reduce pipeline load vs full refresh'],
    schedule: 'Micro-batch: Every 15 mins',
    latency: 'Latency: ~15–20 mins',
  },
  {
    title: 'API / File-Based Integration',
    icon: '🔗',
    color: '#F59E0B',
    tools: 'Azure Logic Apps · ADF Copy Activity · SFTP Connector',
    useCases: ['FX rate feeds (daily multi-currency)', 'Third-party clinical content', 'Government regulatory file drops'],
    schedule: 'Event-driven / Scheduled',
    latency: 'Latency: Variable',
  },
];

const qualityChecks = [
  { label: 'Schema Validation', icon: '✅', color: '#22C55E' },
  { label: 'Null / Blank Check', icon: '🔍', color: '#0078D4' },
  { label: 'Referential Integrity', icon: '🔗', color: '#8B5CF6' },
  { label: 'Deduplication', icon: '🪞', color: '#F59E0B' },
  { label: 'Currency Conversion', icon: '💱', color: '#EF4444' },
  { label: 'Language Normalisation', icon: '🌐', color: '#14B8A6' },
  { label: 'Business Rules Engine', icon: '📋', color: '#6366F1' },
  { label: 'Anomaly Detection', icon: '📡', color: '#E3008C' },
];

export default function DataIngestionPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a2744 50%, #0078D4 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .source-pill { background: #fff; border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; align-items: center; gap: 6px; border: 1px solid var(--border); text-align: center; flex: 1; min-width: 90px; transition: transform 0.15s; cursor: default; }
        .source-pill:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
        .medallion-layer { border-radius: 14px; padding: 20px 24px; border: 1px solid; }
        .pipeline-card { background: #fff; border-radius: 14px; padding: 20px 22px; border: 1px solid var(--border); flex: 1; transition: box-shadow 0.15s; }
        .pipeline-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .quality-tag { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; }
        .arrow-connector { display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #94A3B8; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>HRA Data Platform</span>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Data Engineering</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Data Ingestion & ETL/ELT Pipeline</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          Automated ingestion from 15+ source systems including IRAS, Oracle & NHS Spine — supporting batch ETL, real-time streaming, and CDC patterns across 100+ NHS Trusts.
        </p>
      </div>

      {/* Source Systems Row */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 14 }}>Source Systems (15+ Connected)</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {sources.map((s, i) => (
            <div key={i} className="source-pill">
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)' }}>{s.name}</div>
              <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: s.color + '14', padding: '1px 6px', borderRadius: 4 }}>{s.type}</span>
            </div>
          ))}
          <div className="source-pill" style={{ borderStyle: 'dashed', borderColor: '#CBD5E1' }}>
            <span style={{ fontSize: 24 }}>➕</span>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>+8 more</div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Connectors</span>
          </div>
        </div>
      </div>

      {/* Medallion Architecture */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Medallion Architecture — Bronze → Silver → Gold</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0078D4', background: 'rgba(0,120,212,0.08)', padding: '2px 10px', borderRadius: 10 }}>Delta Lake on ADLS Gen2</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr', gap: 0, alignItems: 'center' }}>
          {medallionLayers.map((layer, li) => (
            <React.Fragment key={layer.id}>
              <div className="medallion-layer" style={{ background: layer.bg, borderColor: layer.border }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 26 }}>{layer.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: layer.color }}>{layer.label} Layer</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{layer.subtitle}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {layer.details.map((d, di) => (
                    <div key={di} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={12} color={layer.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
              {li < 2 && (
                <div className="arrow-connector">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <ArrowRight size={20} color="#0078D4" />
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#0078D4', letterSpacing: '0.3px' }}>TRANSFORM</div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pipeline Types */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Pipeline Patterns</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {pipelineTypes.map((p, i) => (
            <div key={i} className="pipeline-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.tools}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                {p.useCases.map((uc, ui) => (
                  <div key={ui} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-muted)', alignItems: 'flex-start' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.color, marginTop: 5, flexShrink: 0 }} />
                    {uc}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, background: p.color + '12', color: p.color, padding: '3px 10px', borderRadius: 6 }}>{p.schedule}</span>
                <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: 6 }}>{p.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Checks */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 14 }}>Data Quality Gates — Applied at Every Layer</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {qualityChecks.map((q, i) => (
            <div key={i} className="quality-tag">
              <span style={{ fontSize: 16 }}>{q.icon}</span>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{q.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
