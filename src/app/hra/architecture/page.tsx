'use client';
import { Database, Server, Layers, BarChart3, ArrowDown, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const layers = [
  {
    id: 'source', label: 'Source Systems Layer', color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)',
    items: [
      { name: 'IRAS System', icon: '⚙️', desc: 'Ethics applications & approvals' },
      { name: 'Oracle Financials', icon: '🏢', desc: 'NHS Trust funding' },
      { name: 'NHS Spine', icon: '☁️', desc: 'Patient demographic data' },
      { name: 'Legacy Systems', icon: '🗄️', desc: 'On-premise databases' },
      { name: 'External APIs', icon: '🔗', desc: 'Clinical registries' },
      { name: 'Flat Files', icon: '📄', desc: 'CSV, Excel, JSON feeds' },
    ]
  },
  {
    id: 'ingestion', label: 'Ingestion & Orchestration Layer', color: '#0078D4', bg: 'rgba(0,120,212,0.08)', border: 'rgba(0,120,212,0.2)',
    items: [
      { name: 'Azure Data Factory', icon: '🔄', desc: 'Orchestration & scheduling' },
      { name: 'Azure Event Hubs', icon: '⚡', desc: 'Real-time streaming' },
      { name: 'Azure Service Bus', icon: '📨', desc: 'Message queuing' },
      { name: 'Self-Hosted IR', icon: '🔌', desc: 'On-prem connectivity' },
    ]
  },
  {
    id: 'storage', label: 'Storage & Processing Layer (Medallion)', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)',
    items: [
      { name: 'Bronze Layer', icon: '🥉', desc: 'Raw data as-is from sources' },
      { name: 'Silver Layer', icon: '🥈', desc: 'Cleansed & conformed data' },
      { name: 'Gold Layer', icon: '🥇', desc: 'Kimball star schema models' },
      { name: 'Azure Data Lake Gen2', icon: '🌊', desc: 'Hierarchical storage' },
    ]
  },
  {
    id: 'compute', label: 'Compute & Analytics Layer', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)',
    items: [
      { name: 'Azure Synapse Analytics', icon: '⚗️', desc: 'Unified analytics platform' },
      { name: 'Microsoft Fabric', icon: '🧩', desc: 'End-to-end analytics SaaS' },
      { name: 'Spark Pools', icon: '✨', desc: 'Big data transformation' },
      { name: 'SQL Dedicated Pools', icon: '🗃️', desc: 'Enterprise DW compute' },
    ]
  },
  {
    id: 'serving', label: 'Semantic & Serving Layer', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
    items: [
      { name: 'Power BI Semantic Model', icon: '📊', desc: 'Certified shared datasets' },
      { name: 'Analysis Services', icon: '🔬', desc: 'OLAP cube processing' },
      { name: 'REST APIs', icon: '🔗', desc: 'Data access for apps' },
      { name: 'Azure API Management', icon: '🌐', desc: 'API gateway & throttling' },
    ]
  },
  {
    id: 'consumption', label: 'Consumption Layer', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)',
    items: [
      { name: 'Power BI Premium', icon: '📈', desc: 'Executive dashboards' },
      { name: 'Power BI Embedded', icon: '💻', desc: 'App-embedded reports' },
      { name: 'Excel Connected', icon: '📋', desc: 'Self-service analytics' },
      { name: 'Custom Applications', icon: '📱', desc: 'Mobile & web portals' },
    ]
  },
];

const crossCutting = [
  { label: 'Azure Active Directory', icon: '🔐', desc: 'Identity & RBAC' },
  { label: 'Microsoft Purview', icon: '🏛️', desc: 'Data Governance & Lineage' },
  { label: 'Azure Monitor', icon: '📡', desc: 'Observability & Alerting' },
  { label: 'Azure Key Vault', icon: '🔑', desc: 'Secrets Management' },
  { label: 'Azure DevOps', icon: '🚀', desc: 'CI/CD Pipelines' },
];

export default function ArchitecturePage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a2744 50%, #0078D4 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .arch-layer { border-radius: 14px; padding: 20px 24px; border: 1px solid; margin-bottom: 0; }
        .arch-item { background: rgba(255,255,255,0.85); border-radius: 8px; padding: 10px 14px; display: flex; align-items: flex-start; gap: 10px; border: 1px solid rgba(0,0,0,0.06); flex: 1; min-width: 0; }
        .arch-arrow { display: flex; justify-content: center; padding: 6px 0; }
        .cross-pill { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; flex: 1; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>HRA Data Platform</span>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Technical Architecture</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Enterprise Data Warehouse Architecture</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          A fully cloud-native, layered architecture built on Microsoft Azure and Microsoft Fabric — designed for scale across 100+ NHS Trusts, multi-trust integration, and longitudinal patient data.
        </p>
      </div>

      {/* Architecture Layers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {layers.map((layer, li) => (
          <div key={layer.id}>
            <div className="arch-layer" style={{ background: layer.bg, borderColor: layer.border }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: layer.color, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: layer.color }} />
                {String(li + 1).padStart(2, '0')} · {layer.label}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {layer.items.map((item, ii) => (
                  <div key={ii} className="arch-item" style={{ minWidth: 160 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {li < layers.length - 1 && (
              <div className="arch-arrow">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
                  <div style={{ width: 2, height: 12, background: 'linear-gradient(to bottom, #0078D4, #50c0f0)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, #0078D4, #50c0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowDown size={6} color="#fff" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cross-Cutting Concerns */}
      <div style={{ marginTop: 24, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={13} />
          Cross-Cutting Concerns — Applied at Every Layer
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {crossCutting.map((c, i) => (
            <div key={i} className="cross-pill">
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
