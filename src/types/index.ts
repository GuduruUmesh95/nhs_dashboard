// ─── CLR / Application Registry ─────────────────────────────────────────────
export interface ClrRecord {
  ApplicationID: string;
  Organisation: string;
  Country: string;
  NHSRegion: string;
  ApplicationStatus: 'Active' | 'N-Active' | 'Closed' | 'Cancelled' | 'On Hold' | 'Pipeline';
  ApplicationType: 'New Application' | 'Amendment' | 'Add-Change' | 'Existing Service';
  ApplicationScope: 'National' | 'Regional' | 'Local';
  Priority: 'High' | 'Medium' | 'Low';
  AssignedAnalyst: string;
  GlobalPM: string;
  RegionalPM: string;
  OverallStatus: 'On Track' | 'At Risk' | 'Behind' | '';
  StatusComments: string;
  ReviewStage: 'Pre-Submission' | 'Under Review' | 'Approved' | 'Rejected' | 'On Hold' | '';
  ReviewType: 'Standard' | 'Expedited' | 'Complex';
  ResearchType: 'Clinical' | 'Health Technology' | 'Social Care' | 'Public Health';
  ProgrammeArea: string;
  CurrentMilestone: string;
  ProjectNotes: string;
  ReasonCode: string;
  MilestoneDueDate: string;   // ISO date string YYYY-MM-DD
  ProgressPercent: string;    // e.g. "75%"
  SubmissionDate: string;     // ISO date string
  AssignedDate: string;
  ApprovalDate: string;
  CompletedDate: string;
  CycleTime: number;          // days from submission to approval
  TimingCategory: 'Within Target' | 'Slightly Delayed' | 'Significantly Delayed' | '';
  DelayCode: string;
  DelayDescription: string;
  ApprovalYear: string;       // e.g. "2025"
  ApprovalMonth: string;      // e.g. "January"
  Quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | '';
  ComplexityScore: number;    // 1–5
  EffortDays: number;
  ApplicationVolume: number;
}

// ─── Hierarchy ───────────────────────────────────────────────────────────────
export interface HierarchyPerson {
  HierarchyID: number;
  UserID: string;
  Name: string;             // must match ClrRecord.AssignedAnalyst
  TeamLead: string;         // LeaderTwo in original
  SeniorLead: string;       // LeaderOne
  Director: string;         // Sr_Leader
  HeadOfDepartment: string; // VP
  Email: string;
  NHSRegion: string;
  Location: string;
  Role: string;
  Title: string;
  UserStatus: 'Active' | 'Inactive';
  TargetUtilization: number;      // targeted utilization
}

// ─── Home / Operations Overview ──────────────────────────────────────────────
export interface HomeSummary {
  TotalApplications: number;
  ActiveApplications: number;
  ClosedApplications: number;
  OnHoldApplications: number;
  PipelineApplications: number;
  CancelledApplications: number;
  NActiveApplications: number;
  ThisMonthApprovals: number;
  NextMonthApprovals: number;
  AvgCycleTimeDays: number;
  OnTrackCount: number;
  AtRiskCount: number;
  BehindCount: number;
  CycleTimeByType: CycleTimeByType[];
  MonthlyApprovals: MonthlyCount[];
  AtRiskApplications: AtRiskApplication[];
  LastUpdated: string;
}

export interface CycleTimeByType {
  ApplicationType: string;
  AvgDays: number;
}

export interface MonthlyCount {
  Month: string;   // e.g. "Jan 2025"
  Count: number;
}

export interface AtRiskApplication {
  ApplicationID: string;
  Organisation: string;
  NHSRegion: string;
  AssignedAnalyst: string;
  CurrentMilestone: string;
  MilestoneDueDate: string;
  StatusComments: string;
  OverallStatus: 'At Risk' | 'Behind';
}

// ─── Tracker (derived from CLR – active only) ────────────────────────────────
export interface TrackerRecord extends ClrRecord {
  W1: boolean;
  W2: boolean;
  W3: boolean;
  W4: boolean;
  W5: boolean;
  W6: boolean;
  W7: boolean;
  W8: boolean;
  W9: boolean;
  W10: boolean;
  W11: boolean;
  W12: boolean;
  DaysToApproval: number;
  UrgencyColor: 'green' | 'amber' | 'red';
}

// ─── Capacity Planner ────────────────────────────────────────────────────────
export interface CapacityRow {
  Name: string;
  NHSRegion: string;
  TeamLead: string;
  SeniorLead: string;
  TargetUtilization: number;
  ActiveCount: number;
  W1: number; W2: number; W3: number; W4: number;
  W5: number; W6: number; W7: number; W8: number;
  W9: number; W10: number; W11: number; W12: number;
}

// ─── ELT Weekly Throughput ───────────────────────────────────────────────────
export interface EltWeeklyRow {
  Organisation: string;
  NHSRegion: string;
  CurrentWeek: number;
  PriorWeek: number;
  Delta: number;
  DeltaColor: 'green' | 'red' | 'grey';
  OverallStatus: string;
  StatusComments: string;
  TotalVolume: number;
  Details: EltWeeklyDetail[];
}

export interface EltWeeklyDetail {
  ApplicationID: string;
  ApplicationType: string;
  Country: string;
  AssignedAnalyst: string;
  ApprovalDate: string;
  StatusComments: string;
}

// ─── ELT Monthly Throughput ──────────────────────────────────────────────────
export interface EltMonthlyRow {
  Organisation: string;
  NHSRegion: string;
  Jan: number; Feb: number; Mar: number; Apr: number;
  May: number; Jun: number; Jul: number; Aug: number;
  Sep: number; Oct: number; Nov: number; Dec: number;
  Total: number;
  PriorYearTotal: number;
  DeltaPercent: string;
}

// ─── Analyst Workload Summary (IMPS) ─────────────────────────────────────────
export interface WorkloadRow {
  AssignedAnalyst: string;
  TeamLead: string;
  NHSRegion: string;
  ActiveWithDate: number;   // Active + ApprovalDate set
  ActiveNoDate: number;     // N-Active
  Closed: number;
  Cancelled: number;
  OnHold: number;
  Pipeline: number;
  Total: number;
}

// ─── Approval Turnaround Analysis (Cycle Time) ───────────────────────────────
export interface TurnaroundSummaryRow {
  TimingCategory: string;
  Jan: number | null; Feb: number | null; Mar: number | null; Apr: number | null;
  May: number | null; Jun: number | null; Jul: number | null; Aug: number | null;
  Sep: number | null; Oct: number | null; Nov: number | null; Dec: number | null;
  Average: number;
  Target: number;
}

export interface TurnaroundDetailRow {
  Organisation: string;
  ApplicationID: string;
  ApplicationType: string;
  NHSRegion: string;
  Country: string;
  ApplicationScope: string;
  ApplicationStatus: string;
  SubmissionDate: string;
  ApprovalDate: string;
  CycleTime: number;
  TimingCategory: string;
  DelayCode: string;
  DelayDescription: string;
  ApprovalYear: string;
  ApprovalMonth: string;
}

export interface TurnaroundStats {
  AvgDays: number;
  MinDays: number;
  MaxDays: number;
  TotalAnalysed: number;
}
