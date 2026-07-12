'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home, ClipboardList, BookOpen, Users,
  TrendingUp, Clock, ChevronDown, PieChart, PanelLeftClose, PanelLeftOpen,
  Database, GitBranch, Shield, BarChart3, Layers, Zap, Globe, Award, Search, ArrowRightLeft
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  { label: 'Operations Overview', href: '/overview', icon: <Home size={15} /> },
  { label: 'Implementation Market Report', href: '/market-report', icon: <PieChart size={15} /> },
  { label: 'Application Registry', href: '/application-registry', icon: <BookOpen size={15} /> },
  {
    label: 'Capacity Tracker', icon: <ClipboardList size={15} />,
    children: [
      { label: 'Capacity Hierarchy', href: '/capacity-hierarchy' },
      { label: 'Active Application Tracker', href: '/tracker' },
      { label: 'Analyst Capacity Planner', href: '/capacity-planner' },
    ]
  },
  { label: 'Application Throughput', href: '/throughput', icon: <TrendingUp size={15} /> },
  { label: 'Analyst Workload Summary', href: '/workload-summary', icon: <Users size={15} /> },
  { label: 'Approval Turnaround Analysis', href: '/turnaround-analysis', icon: <Clock size={15} /> },
];

const CWT_NAV: NavItem[] = [
  { label: 'Process Flow', href: '/cwt/process-flow', icon: <ArrowRightLeft size={15} /> },
  { label: 'EDW Architecture', href: '/cwt/architecture', icon: <Layers size={15} /> },
  { label: 'Microsoft Fabric & Azure', href: '/cwt/fabric-azure', icon: <Database size={15} /> },
  { label: 'Data Ingestion & ETL/ELT', href: '/cwt/data-ingestion', icon: <Zap size={15} /> },
  { label: 'Kimball Star Schema', href: '/cwt/data-model', icon: <GitBranch size={15} /> },
  { label: 'End-to-End Data Flow', href: '/cwt/data-flow', icon: <TrendingUp size={15} /> },
  { label: 'Security & Governance', href: '/cwt/security', icon: <Shield size={15} /> },
  { label: 'BI & Executive Dashboards', href: '/cwt/bi-dashboards', icon: <BarChart3 size={15} /> },
  { label: 'Data Quality & Lineage', href: '/cwt/data-quality', icon: <Search size={15} /> },
  { label: 'Business Outcomes', href: '/cwt/outcomes', icon: <Award size={15} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(['Capacity Tracker', 'Application Throughput']);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
    if (isCollapsed) setIsCollapsed(false);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isGroupActive = (children: { href: string }[]) => children.some(c => isActive(c.href));

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ paddingBottom: '24px' }}>
        <Image
          src="/images/logo.avif"
          alt="The Visionarys"
          width={38}
          height={38}
          style={{ objectFit: 'contain', borderRadius: 6, width: 38, height: 38 }}
          priority
        />
        <div className="sidebar-logo-text-wrapper">
          <div className="sidebar-logo-text">The Visionarys</div>
          <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Envision · Innovate · Achieve
          </div>
        </div>
      </div>

      <div className="sidebar-logo-text-wrapper" style={{ padding: '16px 18px 0' }}>
        <div style={{ 
          background: 'linear-gradient(90deg, rgba(14,129,198,0.15) 0%, rgba(14,129,198,0.02) 100%)', 
          borderLeft: '2px solid var(--brand-blue)',
          padding: '8px 12px', borderRadius: '0 6px 6px 0',
          color: '#fff', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.5px',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-blue)', boxShadow: '0 0 8px var(--brand-blue)' }} />
          NHS HRA Analytics
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>

        {NAV.map(item => {
          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`sidebar-item ${isActive(item.href!) ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                <span className="sidebar-text">{item.label}</span>
              </Link>
            );
          }
          const open = openGroups.includes(item.label);
          const groupActive = isGroupActive(item.children);
          return (
            <div key={item.label}>
              <div
                className={`sidebar-group-trigger ${groupActive ? 'active' : ''}`}
                onClick={() => toggleGroup(item.label)}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                <span className="sidebar-text">{item.label}</span>
                <span className="sidebar-text" style={{ flex: 0, opacity: 0.5, transition: 'transform 0.2s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', display: 'inline-flex' }}>
                  <ChevronDown size={13} />
                </span>
              </div>
              {open && (
                <div className="sidebar-group-children">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`sidebar-sub-item ${isActive(child.href) ? 'active' : ''}`}
                    >
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: isActive(child.href) ? '#0E81C6' : 'rgba(255,255,255,0.25)',
                        flexShrink: 0, display: 'inline-block',
                        transition: 'background 0.15s'
                      }} />
                      <span className="sidebar-text">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="sidebar-divider" style={{ marginTop: 16 }} />

        {/* NHS HRA Prototype Section */}
        <div style={{ padding: '12px 18px 6px' }}>
          <div style={{
            background: 'linear-gradient(90deg, rgba(0,120,212,0.18) 0%, rgba(0,120,212,0.04) 100%)',
            borderLeft: '2px solid #0078D4',
            padding: '7px 12px', borderRadius: '0 6px 6px 0',
            color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0078D4', boxShadow: '0 0 6px #0078D4' }} />
            <span className="sidebar-text">NHS HRA Prototype</span>
          </div>
        </div>

        <div className="sidebar-section-label" style={{ marginTop: 4 }}>Data Engineering</div>
        {CWT_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href!}
            className={`sidebar-item ${isActive(item.href!) ? 'active' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            {item.icon}
            <span className="sidebar-text">{item.label}</span>
          </Link>
        ))}

        <div className="sidebar-divider" style={{ marginTop: 8 }} />
      </nav>

      {/* Collapse Toggle */}
      <div className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </div>
    </aside>
  );
}
