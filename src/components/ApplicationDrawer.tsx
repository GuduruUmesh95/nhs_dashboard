'use client';
import { useEffect } from 'react';
import type { ClrRecord } from '@/types';
import StatusBadge from './StatusBadge';
import { X, Calendar, User, Building, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/data';

interface ApplicationDrawerProps {
  application: ClrRecord | null;
  onClose: () => void;
}

export default function ApplicationDrawer({ application, onClose }: ApplicationDrawerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (application) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [application]);

  if (!application) return null;

  const getMilestoneState = (milestone: string, isDone: boolean, isActive: boolean) => {
    if (isDone) return 'done';
    if (isActive) return '';
    return 'pending';
  };

  const steps = [
    { label: 'Application Submitted', date: application.SubmissionDate, done: true, active: false },
    { label: 'Analyst Assigned', date: application.AssignedDate, done: !!application.AssignedDate, active: false },
    { label: 'Under Review', date: '', done: ['Approved', 'Rejected'].includes(application.ReviewStage), active: application.ReviewStage === 'Under Review' },
    { label: application.CurrentMilestone || 'Milestone', date: application.MilestoneDueDate, done: application.ApplicationStatus === 'Closed', active: application.ApplicationStatus === 'Active' },
    { label: 'Approval Decision', date: application.ApprovalDate, done: !!application.ApprovalDate, active: false }
  ];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-content">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{application.ApplicationID}</div>
            <div className="drawer-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building size={12} /> {application.Organisation}
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="drawer-body">
          <div className="drawer-section">
            <div className="drawer-section-title">Status Overview</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <StatusBadge status={application.ApplicationStatus} />
              <StatusBadge status={application.OverallStatus} />
              <StatusBadge status={application.Priority} />
            </div>
            {application.StatusComments && (
              <div style={{ background: '#f8f9fc', padding: '12px 16px', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <strong>Latest Comment:</strong> {application.StatusComments}
              </div>
            )}
          </div>

          <div className="drawer-section">
            <div className="drawer-section-title">Key Details</div>
            <div className="drawer-grid">
              <div>
                <div className="drawer-field-label">Application Type</div>
                <div className="drawer-field-value">{application.ApplicationType}</div>
              </div>
              <div>
                <div className="drawer-field-label">Research Type</div>
                <div className="drawer-field-value">{application.ResearchType}</div>
              </div>
              <div>
                <div className="drawer-field-label">NHS Region</div>
                <div className="drawer-field-value">{application.NHSRegion}</div>
              </div>
              <div>
                <div className="drawer-field-label">Assigned Analyst</div>
                <div className="drawer-field-value">{application.AssignedAnalyst}</div>
              </div>
              <div>
                <div className="drawer-field-label">Global PM</div>
                <div className="drawer-field-value">{application.GlobalPM}</div>
              </div>
              <div>
                <div className="drawer-field-label">Cycle Time</div>
                <div className="drawer-field-value" style={{ color: application.CycleTime > 120 ? 'var(--danger)' : 'var(--navy)' }}>
                  {application.CycleTime} days
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <div className="drawer-section-title">Lifecycle Timeline</div>
            <div style={{ marginTop: 16 }}>
              {steps.map((step, idx) => (
                <div className="timeline-item" key={idx}>
                  <div className={`timeline-dot ${getMilestoneState(step.label, step.done, step.active)}`} />
                  <div className="timeline-content">
                    <div className="timeline-title" style={{ opacity: step.done || step.active ? 1 : 0.4 }}>{step.label}</div>
                    {(step.date || step.active) && (
                      <div className="timeline-date">
                        {step.date ? formatDate(step.date) : <span style={{ color: 'var(--gold)' }}>In Progress</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
