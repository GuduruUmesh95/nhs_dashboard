'use client';
import { useState, useEffect } from 'react';
import { BarChart2, CalendarDays, Calendar } from 'lucide-react';
import WeeklyThroughput from '@/components/WeeklyThroughput';
import MonthlyThroughput from '@/components/MonthlyThroughput';
import PdfExportButton from '@/components/PdfExportButton';

export default function ThroughputPage() {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  // If the page is loaded by Puppeteer for a PDF export, it will pass ?view=monthly
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=monthly')) {
      setView('monthly');
    }
  }, []);

  return (
    <div className="page-body fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={18} /> Application Throughput
          </div>
          <div className="topbar-subtitle">
            {view === 'weekly' 
              ? 'Week-on-week comparison of application volumes per organisation' 
              : '12-month rolling view of approvals by organisation'}
          </div>
        </div>
        <div className="topbar-right" style={{ display: 'flex', gap: '12px' }}>
          <PdfExportButton 
            targetId="pdf-content" 
            filename="Application_Throughput" 
            disabled={view === 'weekly'} 
            title={view === 'weekly' ? 'PDF Export is only available in Monthly view' : undefined}
            exportUrl={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?view=monthly` : undefined}
          />
          <div style={{ display: 'inline-flex', background: 'rgba(14, 129, 198, 0.08)', borderRadius: '8px', padding: '4px', border: '1px solid rgba(14, 129, 198, 0.15)' }}>
            <button 
              onClick={() => setView('weekly')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, 
                background: view === 'weekly' ? 'var(--brand-blue)' : 'transparent', 
                color: view === 'weekly' ? '#ffffff' : 'var(--brand-blue-dk)',
                boxShadow: view === 'weekly' ? '0 2px 8px rgba(14,129,198,0.3)' : 'none',
                transition: 'all 0.2s ease', cursor: 'pointer', border: 'none'
              }}
            >
              <CalendarDays size={14} /> Weekly View
            </button>
            <button 
              onClick={() => setView('monthly')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, 
                background: view === 'monthly' ? 'var(--brand-blue)' : 'transparent', 
                color: view === 'monthly' ? '#ffffff' : 'var(--brand-blue-dk)',
                boxShadow: view === 'monthly' ? '0 2px 8px rgba(14,129,198,0.3)' : 'none',
                transition: 'all 0.2s ease', cursor: 'pointer', border: 'none'
              }}
            >
              <Calendar size={14} /> Monthly View
            </button>
          </div>
        </div>
      </div>

      <div id="pdf-content" style={{ padding: 24, paddingTop: 16, backgroundColor: 'var(--bg-main)' }}>
        {view === 'weekly' ? <WeeklyThroughput /> : <MonthlyThroughput />}
      </div>
    </div>
  );
}
