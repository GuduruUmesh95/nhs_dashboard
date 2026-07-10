'use client';
import { ArrowRight, CheckCircle2, XCircle, Zap, Globe, Users, BarChart3, Database, RefreshCw, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

const currentState = [
  { icon: <XCircle size={16} className="text-red-500" />, title: 'Manual Data Extraction', desc: 'Teams manually export data from Pega, SAP & legacy systems into spreadsheets daily', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'Siloed Data Sources', desc: '15+ disconnected source systems with no unified view — each region maintaining separate reports', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'Multi-Currency Chaos', desc: 'Currency conversions done manually in Excel across 150+ countries with no standardisation', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'No Single Source of Truth', desc: 'Finance, Operations & HR teams working from different versions of data — conflicting KPIs', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'Delayed Reporting Cycles', desc: 'Monthly reports taking 3–5 days to compile. Executive decks prepared manually every quarter', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'No Governance Framework', desc: 'No data lineage, audit trails, or role-based access control — compliance risk across all regions', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'Limited Scalability', desc: 'On-premise infrastructure unable to scale for growing transaction volumes and new markets', color: '#EF4444' },
  { icon: <XCircle size={16} />, title: 'Multi-Language Barriers', desc: 'Unstructured data in 30+ languages with no automated translation or standardisation pipeline', color: '#EF4444' },
];

const futureState = [
  { icon: <CheckCircle2 size={16} />, title: 'Automated ETL/ELT Pipelines', desc: 'Azure Data Factory orchestrates 200+ automated pipelines — zero manual extraction required', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Unified Enterprise Data Warehouse', desc: 'Single Azure Synapse Analytics warehouse integrating all source systems in real-time', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Automated Multi-Currency Engine', desc: 'Real-time currency conversion for 150+ countries via automated FX rate integration', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Single Source of Truth', desc: 'Gold-layer Kimball dimensional model ensuring every team works from the same validated data', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Real-Time Power BI Dashboards', desc: 'Executive dashboards refresh every 15 minutes. Reports delivered automatically to stakeholders', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Microsoft Purview Governance', desc: 'Full data lineage, metadata catalog, RBAC, GDPR compliance — automated audit trails end-to-end', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Cloud-Native Scalability', desc: 'Microsoft Fabric scales elastically to handle 100M+ transactions/day across all global markets', color: '#22C55E' },
  { icon: <CheckCircle2 size={16} />, title: 'Multi-Language NLP Processing', desc: 'Automated language detection and normalisation for 30+ languages using Azure Cognitive Services', color: '#22C55E' },
];

const metrics = [
  { value: '150+', label: 'Countries', sub: 'Global reach' },
  { value: '3→0', label: 'Manual Days', sub: 'Report generation' },
  { value: '99.9%', label: 'Data Accuracy', sub: 'Gold layer' },
  { value: '15min', label: 'Refresh Rate', sub: 'Real-time BI' },
  { value: '200+', label: 'ETL Pipelines', sub: 'Automated' },
  { value: '40%', label: 'Cost Reduction', sub: 'Infra savings' },
];

export default function ProcessFlowPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .state-card { background: #fff; border-radius: 12px; padding: 16px 18px; display: flex; align-items: flex-start; gap: 12px; border: 1px solid var(--border); transition: transform 0.2s, box-shadow 0.2s; }
        .state-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .state-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a2744 50%, #0078D4 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .cwt-page-header::after { content: ''; position: absolute; bottom: -60px; right: 80px; width: 140px; height: 140px; border-radius: 50%; background: rgba(0,120,212,0.15); }
        .metric-pill { background: #fff; border-radius: 12px; padding: 16px 20px; text-align: center; border: 1px solid var(--border); }
        .transformation-arrow { display: flex; align-items: center; justify-content: center; }
        .col-header { font-size: 13px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; padding: 10px 16px; border-radius: 8px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>CWT Enterprise EDW</span>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Process Transformation</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Current State vs Future State</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          A comprehensive transformation of CWT's data landscape — from fragmented, manual processes across 150+ countries to a fully automated, cloud-native enterprise data platform.
        </p>
      </div>

      {/* Impact Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 28 }}>
        {metrics.map((m, i) => (
          <div key={i} className="metric-pill">
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0078D4', letterSpacing: '-0.5px' }}>{m.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{m.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Two Column Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 0, alignItems: 'start' }}>
        {/* Current State */}
        <div>
          <div className="col-header" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.2)' }}>
            <XCircle size={16} />
            Current State — Fragmented & Manual
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentState.map((item, i) => (
              <div key={i} className="state-card">
                <div className="state-icon" style={{ background: 'rgba(239,68,68,0.08)' }}>
                  <XCircle size={15} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 46, paddingBottom: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 62, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0078D4, #50c0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,120,212,0.3)' }}>
                <ArrowRight size={14} color="#fff" />
              </div>
            </div>
          ))}
        </div>

        {/* Future State */}
        <div>
          <div className="col-header" style={{ background: 'rgba(34,197,94,0.08)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle2 size={16} />
            Future State — Automated & Scalable
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {futureState.map((item, i) => (
              <div key={i} className="state-card">
                <div className="state-icon" style={{ background: 'rgba(34,197,94,0.08)' }}>
                  <CheckCircle2 size={15} color="#22C55E" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 28, background: 'linear-gradient(135deg, rgba(0,120,212,0.06), rgba(0,120,212,0.02))', border: '1px solid rgba(0,120,212,0.15)', borderRadius: 14, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Transformation Delivered by The Visionarys</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enterprise Data Engineering · Microsoft Azure · Microsoft Fabric · Power BI · Pega Integration</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Azure', 'Microsoft Fabric', 'Power BI', 'Pega'].map(t => (
            <span key={t} style={{ padding: '6px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
