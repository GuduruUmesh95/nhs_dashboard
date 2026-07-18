'use client';

const azureServices = [
  {
    category: 'Data Integration', color: '#0078D4', bg: 'rgba(0,120,212,0.07)',
    services: [
      { name: 'Azure Data Factory', icon: '🔄', desc: 'Hybrid data integration at scale' },
      { name: 'Azure Event Hubs', icon: '⚡', desc: 'Real-time event streaming' },
      { name: 'Azure Service Bus', icon: '📨', desc: 'Enterprise message broker' },
      { name: 'Azure API Management', icon: '🌐', desc: 'API gateway & lifecycle mgmt' },
    ]
  },
  {
    category: 'Storage & Lakes', color: '#00BCF2', bg: 'rgba(0,188,242,0.07)',
    services: [
      { name: 'Azure Data Lake Gen2', icon: '🌊', desc: 'Hierarchical namespace storage' },
      { name: 'Azure Blob Storage', icon: '🗂️', desc: 'Unstructured data at scale' },
      { name: 'Azure SQL Database', icon: '🗃️', desc: 'Relational cloud database' },
      { name: 'Azure Cosmos DB', icon: '🌍', desc: 'Multi-model NoSQL database' },
    ]
  },
  {
    category: 'Analytics & Compute', color: '#8B5CF6', bg: 'rgba(139,92,246,0.07)',
    services: [
      { name: 'Azure Synapse Analytics', icon: '⚗️', desc: 'Limitless analytics platform' },
      { name: 'Azure Databricks', icon: '✨', desc: 'Apache Spark analytics' },
      { name: 'Azure HDInsight', icon: '🔬', desc: 'Open-source analytics' },
      { name: 'Azure Machine Learning', icon: '🤖', desc: 'Enterprise ML platform' },
    ]
  },
  {
    category: 'Microsoft Fabric', color: '#E3008C', bg: 'rgba(227,0,140,0.07)',
    services: [
      { name: 'Fabric OneLake', icon: '🧩', desc: 'Unified data lake for Fabric' },
      { name: 'Fabric Data Engineering', icon: '🛠️', desc: 'Notebooks & Spark jobs' },
      { name: 'Fabric Data Warehouse', icon: '🏗️', desc: 'T-SQL analytics warehouse' },
      { name: 'Fabric Real-Time Analytics', icon: '📡', desc: 'KQL-based streaming analytics' },
    ]
  },
  {
    category: 'Visualisation & BI', color: '#F2C811', bg: 'rgba(242,200,17,0.07)',
    services: [
      { name: 'Power BI Premium', icon: '📊', desc: 'Enterprise self-service BI' },
      { name: 'Power BI Embedded', icon: '💻', desc: 'Embed reports in apps' },
      { name: 'Power BI Paginated', icon: '📋', desc: 'Pixel-perfect reports' },
      { name: 'Power BI Dataflows', icon: '🔃', desc: 'Self-service ETL in Power BI' },
    ]
  },
  {
    category: 'Governance & Security', color: '#107C10', bg: 'rgba(16,124,16,0.07)',
    services: [
      { name: 'Microsoft Purview', icon: '🏛️', desc: 'Data governance & lineage' },
      { name: 'Azure Active Directory', icon: '🔐', desc: 'Identity & access management' },
      { name: 'Azure Key Vault', icon: '🔑', desc: 'Secrets & certificate mgmt' },
      { name: 'Azure Policy', icon: '📜', desc: 'Compliance & guardrails' },
    ]
  },
  {
    category: 'DevOps & Monitoring', color: '#0F1923', bg: 'rgba(15,25,35,0.06)',
    services: [
      { name: 'Azure DevOps', icon: '🚀', desc: 'CI/CD & agile boards' },
      { name: 'Azure Monitor', icon: '📡', desc: 'Full-stack observability' },
      { name: 'Application Insights', icon: '🔍', desc: 'App performance monitoring' },
      { name: 'Log Analytics', icon: '📝', desc: 'Centralised log aggregation' },
    ]
  },
  {
    category: 'AI & Cognitive Services', color: '#FF6B35', bg: 'rgba(255,107,53,0.07)',
    services: [
      { name: 'Azure OpenAI', icon: '🧠', desc: 'GPT models for insights' },
      { name: 'Cognitive Services', icon: '👁️', desc: 'Vision, language, speech' },
      { name: 'Azure Translator', icon: '🌐', desc: '30+ language translation' },
      { name: 'Azure Form Recognizer', icon: '📄', desc: 'Document intelligence' },
    ]
  },
];

const fabricCapabilities = [
  { name: 'OneLake', desc: 'Single unified data lake — all Fabric items read/write to OneLake natively', badge: 'Foundation', color: '#E3008C' },
  { name: 'Lakehouse', desc: 'Combine data lake flexibility with data warehouse performance — Delta Parquet format', badge: 'Storage', color: '#0078D4' },
  { name: 'Data Pipeline', desc: 'Low-code data orchestration built on ADF — 90+ connectors included', badge: 'Integration', color: '#00BCF2' },
  { name: 'Notebook', desc: 'PySpark, Scala & SQL notebooks with native OneLake integration', badge: 'Engineering', color: '#8B5CF6' },
  { name: 'Data Warehouse', desc: 'T-SQL compatible, serverless warehouse with automatic scaling', badge: 'Analytics', color: '#107C10' },
  { name: 'Power BI', desc: 'Native BI within Fabric — direct lake mode, no import required', badge: 'Reporting', color: '#F2C811' },
];

export default function FabricAzurePage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #0a2744 50%, #0078D4 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .svc-card { background: #fff; border-radius: 10px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; border: 1px solid rgba(0,0,0,0.06); transition: transform 0.15s, box-shadow 0.15s; }
        .svc-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
        .cat-section { border-radius: 14px; padding: 18px 20px; border: 1px solid; }
        .fabric-cap { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid var(--border); flex: 1; min-width: 200px; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>HRA Data Platform</span>
          <span className="cwt-badge" style={{ background: 'rgba(227,0,140,0.2)', border: '1px solid rgba(227,0,140,0.4)', color: '#E3008C' }}>Microsoft Fabric</span>
          <span className="cwt-badge" style={{ background: 'rgba(0,120,212,0.15)', border: '1px solid rgba(0,120,212,0.3)', color: '#60a5fa' }}>Azure</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Microsoft Fabric & Azure Architecture</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          The full Azure cloud service catalogue powering HRA's enterprise data platform — from ingestion and storage through to governance, AI, and visualisation.
        </p>
      </div>

      {/* Microsoft Fabric Spotlight */}
      <div style={{ background: 'linear-gradient(135deg, rgba(227,0,140,0.06), rgba(0,120,212,0.04))', border: '1px solid rgba(227,0,140,0.15)', borderRadius: 14, padding: '22px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🧩</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Microsoft Fabric — Unified SaaS Analytics Platform</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>The single pane of glass for all HRA analytics workloads — from data engineering to BI reporting</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {fabricCapabilities.map((cap, i) => (
            <div key={i} className="fabric-cap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{cap.name}</div>
                <span style={{ fontSize: 10, fontWeight: 700, background: cap.color + '18', color: cap.color, padding: '2px 8px', borderRadius: 10, border: `1px solid ${cap.color}30` }}>{cap.badge}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{cap.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Azure Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {azureServices.map((cat, ci) => (
          <div key={ci} className="cat-section" style={{ background: cat.bg, borderColor: cat.color + '30' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: cat.color, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
              {cat.category}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {cat.services.map((svc, si) => (
                <div key={si} className="svc-card">
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{svc.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{svc.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{svc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
