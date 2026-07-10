import type { ClrRecord, HierarchyPerson, HomeSummary } from '@/types';

const BASE = '/data';

export async function fetchCLR(): Promise<ClrRecord[]> {
  const res = await fetch(`${BASE}/clr.json`);
  if (!res.ok) throw new Error('Failed to load CLR data');
  return res.json();
}

export async function fetchHierarchy(): Promise<HierarchyPerson[]> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('hierarchyData');
    if (cached) return JSON.parse(cached);
  }
  const res = await fetch(`${BASE}/hierarchy.json`);
  if (!res.ok) throw new Error('Failed to load hierarchy data');
  const data = await res.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('hierarchyData', JSON.stringify(data));
  }
  return data;
}

export function saveHierarchy(data: HierarchyPerson[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hierarchyData', JSON.stringify(data));
  }
}

export async function fetchHomeSummary(): Promise<HomeSummary> {
  const res = await fetch(`${BASE}/home-summary.json`);
  if (!res.ok) throw new Error('Failed to load home summary');
  return res.json();
}

// ─── Derived: Active Application Tracker ─────────────────────────────────────
export function deriveTracker(clr: ClrRecord[]): ClrRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return clr.filter(r => {
    if (!['Active', 'N-Active'].includes(r.ApplicationStatus)) return false;
    const approval = new Date(r.ApprovalDate);
    return approval >= today;
  });
}

// ─── Derived: Weekly columns (next 12 weeks) ──────────────────────────────────
export function getWeekStarts(): Date[] {
  const weeks: Date[] = [];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // start of this week (Mon)
  monday.setHours(0, 0, 0, 0);
  for (let i = 0; i < 12; i++) {
    const w = new Date(monday);
    w.setDate(monday.getDate() + i * 7);
    weeks.push(w);
  }
  return weeks;
}

export function isActiveInWeek(record: ClrRecord, weekStart: Date): boolean {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const sub = new Date(record.SubmissionDate);
  const appr = new Date(record.ApprovalDate);
  return sub <= weekEnd && appr >= weekStart;
}

export function getDaysToApproval(approvalDate: string): number {
  const today = new Date();
  const appr = new Date(approvalDate);
  return Math.ceil((appr.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function urgencyColor(days: number): 'green' | 'amber' | 'red' {
  if (days > 30) return 'green';
  if (days >= 15) return 'amber';
  return 'red';
}

// ─── Derived: Capacity Planner ────────────────────────────────────────────────
export function deriveCapacity(tracker: ClrRecord[], hierarchy: HierarchyPerson[], weekStarts: Date[]): any[] {
  const active = hierarchy.filter(h => h.UserStatus === 'Active');
  return active.map(person => {
    const assigned = tracker.filter(r => r.AssignedAnalyst === person.Name);
    const weeks: Record<string, number> = {};
    weekStarts.forEach((ws, idx) => {
      weeks[`W${idx + 1}`] = assigned.filter(r => isActiveInWeek(r, ws)).length;
    });
    return {
      Name: person.Name,
      NHSRegion: person.NHSRegion,
      TeamLead: person.TeamLead,
      SeniorLead: person.SeniorLead,
      TargetUtilization: person.TargetUtilization,
      ActiveCount: assigned.length,
      ...weeks,
    } as any;
  });
}

// ─── Derived: ELT Weekly ─────────────────────────────────────────────────────
export function deriveEltWeekly(clr: ClrRecord[]): any[] {
  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  thisWeekStart.setHours(0, 0, 0, 0);
  const priorWeekStart = new Date(thisWeekStart);
  priorWeekStart.setDate(thisWeekStart.getDate() - 7);

  const orgMap: Record<string, { cur: number; prior: number; region: string; status: string; comments: string; total: number; details: ClrRecord[] }> = {};
  for (const r of clr) {
    if (!orgMap[r.Organisation]) {
      orgMap[r.Organisation] = { cur: 0, prior: 0, region: r.NHSRegion, status: r.OverallStatus, comments: r.StatusComments, total: 0, details: [] };
    }
    if (isActiveInWeek(r, thisWeekStart)) { orgMap[r.Organisation].cur++; orgMap[r.Organisation].details.push(r); }
    if (isActiveInWeek(r, priorWeekStart)) orgMap[r.Organisation].prior++;
    orgMap[r.Organisation].total++;
  }
  return Object.entries(orgMap).map(([org, v]) => {
    const delta = v.cur - v.prior;
    return {
      Organisation: org, NHSRegion: v.region,
      CurrentWeek: v.cur, PriorWeek: v.prior,
      Delta: delta, DeltaColor: delta > 0 ? 'green' : delta < 0 ? 'red' : 'grey',
      OverallStatus: v.status, StatusComments: v.comments,
      TotalVolume: v.total, Details: v.details,
    } as any;
  }).filter((r: any) => r.CurrentWeek > 0 || r.PriorWeek > 0);
}

// ─── Derived: ELT Monthly ────────────────────────────────────────────────────
const MONTH_KEYS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function deriveEltMonthly(clr: ClrRecord[]): any[] {
  const thisYear = new Date().getFullYear().toString();
  const lastYear = (new Date().getFullYear() - 1).toString();
  const orgMap: Record<string, Record<string, number>> = {};
  const orgRegion: Record<string, string> = {};
  for (const r of clr) {
    if (!orgMap[r.Organisation]) { orgMap[r.Organisation] = {}; MONTH_KEYS.forEach(m => orgMap[r.Organisation][m] = 0); }
    orgRegion[r.Organisation] = r.NHSRegion;
    const mi = MONTH_NAMES.indexOf(r.ApprovalMonth);
    if (mi >= 0 && r.ApprovalYear === thisYear) orgMap[r.Organisation][MONTH_KEYS[mi]]++;
  }
  const priorMap: Record<string, number> = {};
  for (const r of clr) {
    if (r.ApprovalYear === lastYear) { priorMap[r.Organisation] = (priorMap[r.Organisation] || 0) + 1; }
  }
  return Object.entries(orgMap).map(([org, months]) => {
    const total = Object.values(months).reduce((a, b) => a + b, 0);
    const prior = priorMap[org] || 0;
    const delta = prior > 0 ? Math.round(((total - prior) / prior) * 100) : 0;
    return { Organisation: org, NHSRegion: orgRegion[org], ...months, Total: total, PriorYearTotal: prior, DeltaPercent: (delta >= 0 ? '+' : '') + delta + '%' } as any;
  }).filter((r: any) => r.Total > 0);
}

// ─── Derived: Workload Summary ────────────────────────────────────────────────
export function deriveWorkload(clr: ClrRecord[], hierarchy: HierarchyPerson[]) {
  const teamMap: Record<string, string> = {};
  hierarchy.forEach(h => { teamMap[h.Name] = h.TeamLead; });
  const analystMap: Record<string, { tl: string; region: string; a: number; n: number; c: number; x: number; h: number; p: number }> = {};
  for (const r of clr) {
    const key = r.AssignedAnalyst;
    if (!analystMap[key]) analystMap[key] = { tl: teamMap[key] || '—', region: r.NHSRegion, a: 0, n: 0, c: 0, x: 0, h: 0, p: 0 };
    if (r.ApplicationStatus === 'Active') analystMap[key].a++;
    else if (r.ApplicationStatus === 'N-Active') analystMap[key].n++;
    else if (r.ApplicationStatus === 'Closed') analystMap[key].c++;
    else if (r.ApplicationStatus === 'Cancelled') analystMap[key].x++;
    else if (r.ApplicationStatus === 'On Hold') analystMap[key].h++;
    else if (r.ApplicationStatus === 'Pipeline') analystMap[key].p++;
  }
  return Object.entries(analystMap).map(([name, v]) => ({
    AssignedAnalyst: name, TeamLead: v.tl, NHSRegion: v.region,
    ActiveWithDate: v.a, ActiveNoDate: v.n, Closed: v.c,
    Cancelled: v.x, OnHold: v.h, Pipeline: v.p,
    Total: v.a + v.n + v.c + v.x + v.h + v.p,
  })).sort((a, b) => b.Total - a.Total);
}

// ─── Derived: Turnaround Analysis ────────────────────────────────────────────
export function deriveTurnaroundStats(clr: ClrRecord[]) {
  const closed = clr.filter(r => r.ApplicationStatus === 'Closed' && r.CycleTime > 0);
  if (!closed.length) return { AvgDays: 0, MinDays: 0, MaxDays: 0, TotalAnalysed: 0 };
  const times = closed.map(r => r.CycleTime);
  return {
    AvgDays: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    MinDays: Math.min(...times),
    MaxDays: Math.max(...times),
    TotalAnalysed: closed.length,
  };
}

export function deriveTurnaroundSummary(clr: ClrRecord[]) {
  const closed = clr.filter(r => r.ApplicationStatus === 'Closed' && r.CycleTime > 0);
  const categories = ['Within Target', 'Slightly Delayed', 'Significantly Delayed'];
  const targets: Record<string, number> = { 'Within Target': 60, 'Slightly Delayed': 120, 'Significantly Delayed': 180 };
  return categories.map(cat => {
    const row: Record<string, number | null | string> = { TimingCategory: cat };
    MONTH_KEYS.forEach((mk, mi) => {
      const items = closed.filter(r => r.TimingCategory === cat && MONTH_NAMES.indexOf(r.ApprovalMonth) === mi);
      row[mk] = items.length ? Math.round(items.reduce((a, r) => a + r.CycleTime, 0) / items.length) : null;
    });
    const all = closed.filter(r => r.TimingCategory === cat);
    row['Average'] = all.length ? Math.round(all.reduce((a, r) => a + r.CycleTime, 0) / all.length) : 0;
    row['Target'] = targets[cat];
    return row;
  });
}

// ─── Utilities ────────────────────────────────────────────────────────────────
export function formatDate(d: string): string {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

export function getUnique<T>(arr: T[], key: keyof T): string[] {
  return [...new Set(arr.map(r => String(r[key])).filter(Boolean))].sort();
}
