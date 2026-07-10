'use client';

interface StatusBadgeProps { status: string; }

const MAP: Record<string, string> = {
  'Active':       'badge badge-active',
  'N-Active':     'badge badge-nactive',
  'Closed':       'badge badge-closed',
  'On Hold':      'badge badge-onhold',
  'Pipeline':     'badge badge-pipeline',
  'Cancelled':    'badge badge-cancelled',
  'On Track':     'badge badge-ontrack',
  'At Risk':      'badge badge-atrisk',
  'Behind':       'badge badge-behind',
  'High':         'badge badge-high',
  'Medium':       'badge badge-medium',
  'Low':          'badge badge-low',
  'National':     'badge badge-national',
  'Regional':     'badge badge-regional',
  'Local':        'badge badge-local',
  'Within Target':'badge badge-within',
  'Slightly Delayed':'badge badge-slightly',
  'Significantly Delayed':'badge badge-significant',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return <span className="badge badge-cancelled">—</span>;
  const cls = MAP[status] || 'badge badge-closed';
  return <span className={cls}>{status}</span>;
}
