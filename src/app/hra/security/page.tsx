'use client';
import { Shield, Lock, Eye, Users, CheckCircle2 } from 'lucide-react';

const rbacMatrix = [
  { role: 'HRA Executive Board', icon: '👔', color: '#0078D4', bg: 'rgba(0,120,212,0.07)',
    permissions: { executiveDash: true, operationalReports: false, rawData: false, adminPanel: false, auditLogs: false, dataExport: true, selfService: false },
    regions: 'National Overview', description: 'High-level KPI dashboards & summary reports only' },
  { role: 'Research Ethics Chair', icon: '📋', color: '#22C55E', bg: 'rgba(34,197,94,0.07)',
    permissions: { executiveDash: true, operationalReports: true, rawData: false, adminPanel: false, auditLogs: false, dataExport: true, selfService: true },
    regions: 'Assigned Region Only', description: 'Full regional view — row-level security applied per REC' },
  { role: 'Clinical Data Officer', icon: '📊', color: '#8B5CF6', bg: 'rgba(139,92,246,0.07)',
    permissions: { executiveDash: true, operationalReports: true, rawData: true, adminPanel: false, auditLogs: true, dataExport: true, selfService: true },
    regions: 'Assigned Scope', description: 'Access to Silver/Gold data layers and certified datasets' },
  { role: 'Health Data Engineer', icon: '⚙️', color: '#F59E0B', bg: 'rgba(245,158,11,0.07)',
    permissions: { executiveDash: false, operationalReports: false, rawData: true, adminPanel: true, auditLogs: true, dataExport: true, selfService: false },
    regions: 'All Environments', description: 'Bronze/Silver/Gold access — DevOps & pipeline management' },
  { role: 'HRA Auditor & Compliance', icon: '🔍', color: '#EF4444', bg: 'rgba(239,68,68,0.07)',
    permissions: { executiveDash: false, operationalReports: true, rawData: false, adminPanel: false, auditLogs: true, dataExport: false, selfService: false },
    regions: 'Read-only — All', description: 'Full audit log access — no data modification or export' },
];

const permissionColumns = [
  { key: 'executiveDash', label: 'Executive Dashboard' },
  { key: 'operationalReports', label: 'Operational Reports' },
  { key: 'rawData', label: 'Raw / Bronze Data' },
  { key: 'adminPanel', label: 'Admin Panel' },
  { key: 'auditLogs', label: 'Audit Logs' },
  { key: 'dataExport', label: 'Data Export' },
  { key: 'selfService', label: 'Self-Service BI' },
];

const dataClassification = [
  { level: 'Public', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', icon: '🌐',
    desc: 'Aggregated, anonymised statistics for external reporting. No PII. No business-sensitive data.',
    examples: 'Annual booking volumes, regional summaries, public KPIs' },
  { level: 'Internal', color: '#0078D4', bg: 'rgba(0,120,212,0.08)', border: 'rgba(0,120,212,0.25)', icon: '🏢',
    desc: 'Operational data for internal teams only. Access managed via AAD group membership.',
    examples: 'Regional performance reports, analyst dashboards, budget tracking' },
  { level: 'Confidential', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', icon: '🔒',
    desc: 'Customer PII, financial data, and pricing information. Encrypted at rest and in transit.',
    examples: 'Customer details, transaction records, supplier contracts' },
  { level: 'Restricted', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', icon: '⛔',
    desc: 'Highly sensitive — C-suite financials, M&A data, system credentials. MFA + Just-In-Time access.',
    examples: 'Board reports, acquisition data, security credentials' },
];

const securityControls = [
  { name: 'Azure Active Directory (AAD)', icon: '🔐', category: 'Identity', desc: 'SSO, MFA, Conditional Access policies applied to all EDW resources' },
  { name: 'Row-Level Security (RLS)', icon: '🔏', category: 'Data Access', desc: 'Power BI & Synapse RLS ensures users see only their authorised data scope' },
  { name: 'Object-Level Security (OLS)', icon: '📋', category: 'Data Access', desc: 'Column-level masking for PII fields — salary, DOB, passport data hidden by role' },
  { name: 'Azure Key Vault', icon: '🔑', category: 'Secrets', desc: 'All connection strings, API keys and certificates stored in Key Vault — never in code' },
  { name: 'Microsoft Purview', icon: '🏛️', category: 'Governance', desc: 'Automated data lineage, sensitivity labels, compliance scanning across all assets' },
  { name: 'Azure Policy', icon: '📜', category: 'Compliance', desc: 'Guardrails enforce data residency, encryption standards and approved resource types' },
  { name: 'Private Endpoints', icon: '🛡️', category: 'Network', desc: 'All Azure data services accessible via private VNet — no public internet exposure' },
  { name: 'Azure Monitor + Sentinel', icon: '📡', category: 'Threat Detection', desc: 'Real-time anomaly detection, threat intelligence and automated incident response' },
];

const complianceBadges = [
  { name: 'GDPR', region: 'EU/UK', color: '#0078D4', icon: '🇪🇺' },
  { name: 'ISO 27001', region: 'Global', color: '#22C55E', icon: '🏅' },
  { name: 'SOC 2 Type II', region: 'Global', color: '#8B5CF6', icon: '✅' },
  { name: 'PCI DSS', region: 'Financial', color: '#EF4444', icon: '💳' },
  { name: 'HIPAA', region: 'Healthcare', color: '#F59E0B', icon: '🏥' },
  { name: 'CCPA', region: 'California', color: '#14B8A6', icon: '🇺🇸' },
];

export default function SecurityPage() {
  return (
    <div className="page-body" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .cwt-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,120,212,0.1); border: 1px solid rgba(0,120,212,0.3); color: #0078D4; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .cwt-page-header { background: linear-gradient(135deg, #0F1923 0%, #1a0a1f 50%, #6B21A8 100%); border-radius: 16px; padding: 36px 40px; color: #fff; margin-bottom: 28px; position: relative; overflow: hidden; }
        .cwt-page-header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .perm-check { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; margin: 0 auto; }
        .sec-control { background: #fff; border-radius: 12px; padding: 14px 16px; border: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-start; }
        .sec-control:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-1px); transition: all 0.15s; }
        .compliance-badge { background: #fff; border-radius: 12px; padding: 14px 18px; text-align: center; border: 1px solid var(--border); flex: 1; }
      `}</style>

      {/* Page Header */}
      <div className="cwt-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span className="cwt-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>HRA Data Platform</span>
          <span className="cwt-badge" style={{ background: 'rgba(107,33,168,0.3)', border: '1px solid rgba(167,80,255,0.4)', color: '#d8b4fe' }}>Security & Governance</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>Security & Governance Layer</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 680, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          Enterprise-grade security applied at every layer — role-based access control, row/object-level security, Microsoft Purview governance, and full compliance across GDPR, SOC2, ISO 27001 and more.
        </p>
      </div>

      {/* RBAC Matrix */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 20, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 18 }}>Role-Based Access Control Matrix</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '2px solid var(--border)' }}>Role</th>
              {permissionColumns.map(col => (
                <th key={col.key} style={{ textAlign: 'center', padding: '8px 10px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '2px solid var(--border)', minWidth: 80 }}>{col.label}</th>
              ))}
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '2px solid var(--border)' }}>Scope</th>
            </tr>
          </thead>
          <tbody>
            {rbacMatrix.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? '#FAFBFC' : '#fff' }}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{row.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.role}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{row.description}</div>
                    </div>
                  </div>
                </td>
                {permissionColumns.map(col => (
                  <td key={col.key} style={{ textAlign: 'center', padding: '10px 10px', borderBottom: '1px solid var(--border)' }}>
                    <div className="perm-check" style={{ background: (row.permissions as any)[col.key] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.06)' }}>
                      {(row.permissions as any)[col.key] ? '✅' : '❌'}
                    </div>
                  </td>
                ))}
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{row.regions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Classification */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Data Classification Framework</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {dataClassification.map((dc, i) => (
            <div key={i} style={{ background: dc.bg, border: `1px solid ${dc.border}`, borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{dc.icon}</span>
                <div style={{ fontSize: 14, fontWeight: 800, color: dc.color }}>{dc.level}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{dc.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: dc.color, background: '#fff', padding: '5px 10px', borderRadius: 6, border: `1px solid ${dc.border}` }}>{dc.examples}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Controls */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Security Controls — Defence in Depth</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {securityControls.map((sc, i) => (
            <div key={i} className="sec-control">
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(107,33,168,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {sc.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{sc.name}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#8B5CF6', background: 'rgba(139,92,246,0.08)', padding: '1px 7px', borderRadius: 4 }}>{sc.category}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{sc.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Badges */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#64748B', marginBottom: 14 }}>Regulatory Compliance Coverage</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {complianceBadges.map((b, i) => (
            <div key={i} className="compliance-badge" style={{ minWidth: 100 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: b.color }}>{b.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{b.region}</div>
              <div style={{ marginTop: 6 }}><CheckCircle2 size={14} color={b.color} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
