'use client';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

const heroMetrics = [
  { value: '100+', label: 'Trusts', sub: 'National single platform', icon: '🏥', color: '#0078D4', bg: 'rgba(0,120,212,0.08)' },
  { value: '40%', label: 'Faster Reporting', sub: 'vs manual processes', icon: '⚡', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  { value: '$2M+', label: 'Annual Savings', sub: 'Infrastructure & ops', icon: '💰', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  { value: '99.9%', label: 'Data Accuracy', sub: 'Gold layer certified', icon: '🎯', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  { value: '0', label: 'Manual Reports', sub: 'Fully automated', icon: '🤖', color: '#14B8A6', bg: 'rgba(20,184,166,0.08)' },
  { value: '500+', label: 'Stakeholders', sub: 'Automated report delivery', icon: '👥', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
];

const benefits = [
  {
    category: 'Operational Efficiency', color: '#0078D4', icon: '⚡',
    items: [
      'Eliminated 3-day manual reporting cycle — reports now delivered automatically in 15 minutes',
      'Reduced ETL development time by 60% using Azure Data Factory reusable templates',
      '200+ fully automated pipelines replacing manual data extraction tasks',
      'Zero unplanned pipeline failures in production over 12-month period',
    ]
  },
  {
    category: 'Financial Impact', color: '#22C55E', icon: '💰',
    items: [
      '$2M+ annual infrastructure savings vs on-premise data warehouse',
      '40% reduction in reporting overhead across all global regions',
      'Real-time cost visibility enabling £18M in operational cost avoidance decisions',
      'Eliminated 6 legacy reporting tools — consolidated to single Power BI platform',
    ]
  },
  {
    category: 'National Scale & Reach', color: '#8B5CF6', icon: '🌍',
    items: [
      'Single platform serving 100+ NHS Trusts with regional data governance compliance',
      'Multi-region data standardisation across 15+ ICS regions',
      'Clinical code normalisation (SNOMED CT / ICD-10) using Azure AI',
      'IRAS integration delivers real-time clinical trial data to 500+ Power BI users nationally',
    ]
  },
  {
    category: 'Data Quality & Trust', color: '#F59E0B', icon: '🛡️',
    items: [
      'Established Single Source of Truth — eliminated conflicting KPI versions across teams',
      '99.9% data accuracy achieved through automated quality gates at every pipeline stage',
      'Full data lineage from source to dashboard — every number is traceable and auditable',
      'Microsoft Purview governance covering all 150+ data assets in the enterprise catalog',
    ]
  },
  {
    category: 'Decision Intelligence', color: '#14B8A6', icon: '📊',
    items: [
      'Executive dashboards refresh every 15 minutes — decisions based on near-real-time data',
      'Self-service analytics empowered 300+ business analysts without IT dependency',
      'Predictive models integrated into Power BI dashboards for demand forecasting',
      'Cross-regional benchmarking now possible for first time in company history',
    ]
  },
  {
    category: 'Security & Compliance', color: '#EF4444', icon: '🔐',
    items: [
      'GDPR, SOC2, ISO 27001 and PCI DSS compliance achieved and maintained',
      'Row-level security ensures every user sees only their authorised data scope',
      'Zero security incidents since platform launch — full audit trail maintained',
      'Microsoft Purview sensitivity labels applied automatically across all data assets',
    ]
  },
];

const milestones = [
  { phase: 'Phase 1', title: 'Foundation & Discovery', duration: 'Months 1–2', status: 'complete', items: ['Architecture design', 'Source system inventory', 'Azure environment setup', 'Stakeholder alignment'] },
  { phase: 'Phase 2', title: 'Core Ingestion', duration: 'Months 3–5', status: 'complete', items: ['ADF pipelines built', 'Bronze layer live', 'IRAS integration', 'Oracle connectivity'] },
  { phase: 'Phase 3', title: 'Data Modelling', duration: 'Months 5–7', status: 'complete', items: ['Kimball star schema', 'Silver layer logic', 'Gold layer published', 'Quality gates live'] },
  { phase: 'Phase 4', title: 'BI & Dashboards', duration: 'Months 7–9', status: 'complete', items: ['Power BI semantic model', 'Executive dashboards', 'RBAC & RLS applied', 'UAT with 50 users'] },
  { phase: 'Phase 5', title: 'National Rollout', duration: 'Months 9–12', status: 'complete', items: ['100+ Trusts live', '500+ users onboarded', 'Training delivered', 'Support BAU'] },
];

const techStack = [
  { name: 'Microsoft Azure', role: 'Cloud Platform', icon: '☁️' },
  { name: 'Microsoft Fabric', role: 'Analytics SaaS', icon: '🧩' },
  { name: 'Azure Data Factory', role: 'Orchestration', icon: '🔄' },
  { name: 'Azure Synapse', role: 'Data Warehouse', icon: '⚗️' },
  { name: 'Power BI Premium', role: 'Business Intelligence', icon: '📊' },
  { name: 'Microsoft Purview', role: 'Governance', icon: '🏛️' },
  { name: 'Azure Active Directory', role: 'Identity & Security', icon: '🔐' },
  { name: 'IRAS System', role: 'Source System', icon: '⚙️' },
];

export default function OutcomesPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a3d0a 40%, #166534 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .hero-metric { border-radius: 16px; padding: 24px 20px; text-align: center; border: 1px solid rgba(0,0,0,0.06); flex: 1; transition: transform 0.15s, box-shadow 0.15s; }
        .hero-metric:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .benefit-card { background: #fff; border-radius: 14px; padding: 20px 22px; border: 1px solid var(--border); flex: 1; min-width: 280px; }
        .milestone { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid var(--border); flex: 1; position: relative; }
        .milestone::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 12px 12px 0 0; background: linear-gradient(90deg, #22C55E, #0078D4); }
        .tech-pill { background: #fff; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; border: 1px solid var(--border); flex: 1; min-width: 150px; transition: all 0.15s; }
        .tech-pill:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-1px); }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>HRA Data Platform</span>
          <span className="cwt-badge" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac' }}>Delivered by The Visionarys</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Business Outcomes & Benefits</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          The measurable impact of HRA's enterprise data transformation — from fragmented manual processes to a world-class, cloud-native data platform serving 100+ NHS Trusts with automated, real-time intelligence.
        </p>
      </div>

      {/* Hero Metrics */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        {heroMetrics.map((m, i) => (
          <div key={i} className="hero-metric" style={{ background: m.bg }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: m.color, letterSpacing: '-1.5px', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 6 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Benefits Grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>Key Benefits Delivered</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {benefits.map((b, i) => (
            <div key={i} className="benefit-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: b.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{b.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.category}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {b.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={13} color={b.color} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Timeline */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>Delivery Timeline — 12 Month Programme</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {milestones.map((m, i) => (
            <div key={i} className="milestone">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: 4 }}>{m.phase}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.duration}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{m.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {m.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center' }}>
                    <CheckCircle2 size={11} color="#22C55E" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,120,212,0.05), rgba(0,120,212,0.02))', border: '1px solid rgba(0,120,212,0.15)', borderRadius: 16, padding: '22px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#0078D4', marginBottom: 16 }}>Technology Stack — Microsoft-Powered Enterprise Platform</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {techStack.map((t, i) => (
            <div key={i} className="tech-pill">
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(0,120,212,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Delivered by The Visionarys</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Enterprise Data Engineering · Envision · Innovate · Achieve</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Enterprise Architecture', 'Data Engineering', 'Cloud Migration', 'Power BI', 'Data Governance'].map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: '#0078D4', background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.15)', padding: '4px 10px', borderRadius: 8 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
