// ─── Core Entity Types for WorkFlow HRMS ───────────────────────────────────

export type UserRole = 'Employee' | 'Manager' | 'HR' | 'Admin';
export type Country = 'IN' | 'US';
export type Status = 'active' | 'inactive' | 'on-leave';

// ─── Employee ───────────────────────────────────────────────────────────────
export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  color: string;
  designation: string;
  department: string;
  employmentStatus: Status;
  /** Alias for employmentStatus used in UI */
  status: Status;
  role: UserRole;
  managerId?: string;
  reportingManagerId?: string;
  reportingManager?: string;
  joiningDate: string;
  dateOfJoining: string;
  country: Country;
  location: string;
  phone?: string;
  buddyId?: string;
  employeeCode: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  skills?: string[];
}

// ─── Onboarding ─────────────────────────────────────────────────────────────
export type OnboardingPhase = 'pre-joining' | 'day-1' | 'week-1' | 'week-2' | 'month-1';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  phase: OnboardingPhase;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  status: TaskStatus;
  completedDate?: string;
}

export interface WelcomeMessage {
  id: string;
  senderName: string;
  senderRole: string;
  message: string;
  hasVideo?: boolean;
  videoUrl?: string;
  avatarInitials: string;
  color: string;
}

export interface RelocationSupport {
  visaStatus: string;
  visaExpiry?: string;
  accommodationAddress?: string;
  accommodationStatus: string;
  travelBookingStatus: string;
  allowanceAmount: number;
  currency: string;
  localBuddy: string;
  localBuddyContact: string;
  tickets: { id: string; subject: string; status: string }[];
}

export interface TeamIntroduction {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  bio: string;
  expertise: string[];
  funFact: string;
  initials: string;
  color: string;
  introductionStatus: 'pending' | 'done';
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  status: 'upcoming' | 'completed' | 'missed';
  type: 'check-in' | 'review' | 'celebration';
}

export interface OnboardingEmployee {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  manager: string;
  buddy: string;
  joiningDate: string;
  progressPercent: number;
  tasks: OnboardingTask[];
  welcomeMessages: WelcomeMessage[];
  relocationSupport?: RelocationSupport;
  teamIntroductions: TeamIntroduction[];
  milestones: OnboardingMilestone[];
  isComplete: boolean;
}

// ─── Attendance ──────────────────────────────────────────────────────────────
export type AttendanceStatusType = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave' | 'holiday' | 'weekend';
export type ClockMethod = 'selfie' | 'geolocation' | 'ip' | 'biometric' | 'manual';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatusType;
  productiveHours: number;
  breakHours: number;
  overtimeHours: number;
  totalHours: number;
  clockMethod: ClockMethod;
  locationVerified: boolean;
  ipValidated: boolean;
  shiftName: string;
  exceptionFlag?: string;
}

export interface ShiftInfo {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
}

// ─── Leave ───────────────────────────────────────────────────────────────────
export type LeaveType = 'casual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'lwp' | 'comp-off';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  pending: number;
  available: number;
  carriedForward?: number;
  encashed?: number;
  color: string;
}

export interface ApprovalStep {
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  date?: string;
  comment?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvalFlow: ApprovalStep[];
  submittedDate: string;
}

// ─── Payroll ─────────────────────────────────────────────────────────────────
export type PayrollStatus = 'draft' | 'processing' | 'approved' | 'paid';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  payPeriod: string;
  payDate: string;
  country: Country;
  status: PayrollStatus;
  currency: string;
  earnings: {
    basic: number;
    hra: number;
    specialAllowance: number;
    bonus?: number;
    overtime?: number;
    reimbursements?: number;
  };
  deductions: {
    pf?: number;
    incomeTax: number;
    professionalTax?: number;
    esi?: number;
    healthInsurance: number;
    lwf?: number;
    federalTax?: number;
    stateTax?: number;
    socialSecurity?: number;
    medicare?: number;
  };
  employerContributions?: {
    pf?: number;
    esi?: number;
    gratuity?: number;
  };
  grossPay: number;
  totalDeductions: number;
  netPay: number;
}

// ─── Document ────────────────────────────────────────────────────────────────
export type DocumentCategory = 'identity' | 'employment' | 'work-auth' | 'tax' | 'education' | 'other';
export type DocumentStatus = 'missing' | 'uploaded' | 'verified' | 'rejected';

export interface Document {
  id: string;
  employeeId: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadDate?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  expiryDate?: string;
  isRequired: boolean;
}

// ─── Expense ─────────────────────────────────────────────────────────────────
export type ExpenseCategory = 'travel' | 'food' | 'accommodation' | 'communication' | 'medical' | 'office-supplies' | 'other';
export type ExpenseStatus = 'draft' | 'submitted' | 'pending-approval' | 'approved' | 'rejected' | 'paid';

export interface Reimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  date: string;
  receiptUrls: string[];
  isMileage: boolean;
  mileageKm?: number;
  mileageFrom?: string;
  mileageTo?: string;
  ratePerKm?: number;
  isTaxable: boolean;
  status: ExpenseStatus;
  policyValid: boolean;
  policyMessage?: string;
  approvalFlow: ApprovalStep[];
  paidDate?: string;
}

// ─── Performance ─────────────────────────────────────────────────────────────
export type GoalCategory = 'individual' | 'team' | 'departmental' | 'organizational';
export type GoalType = 'quarterly' | 'annual' | 'project';
export type GoalStatus = 'not-started' | 'in-progress' | 'on-track' | 'at-risk' | 'completed' | 'cancelled';

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: GoalCategory;
  type: GoalType;
  weight: number;
  dueDate: string;
  status: GoalStatus;
  progress: number;
  keyResults: KeyResult[];
}

export type ReviewType = 'quarterly' | 'annual' | 'probation' | 'project' | '360-degree';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewType: ReviewType;
  period: string;
  overallRating: number;
  maxRating: number;
  categoryRatings: { category: string; rating: number; maxRating: number }[];
  strengths: string[];
  areasOfImprovement: string[];
  goalsAchieved: number;
  totalGoals: number;
  recommendations: string;
  employeeComments?: string;
  reviewDate: string;
  reviewerName: string;
}

export interface Feedback {
  id: string;
  fromEmployee: string;
  toEmployee: string;
  type: 'peer' | 'manager' | 'upward' | 'self';
  message: string;
  rating?: number;
  date: string;
}

// ─── Contributions ───────────────────────────────────────────────────────────
export type ContributionType = 'self-initiated' | 'committed' | 'assigned';
export type ContributionCategory = 'innovation' | 'process-improvement' | 'cost-saving' | 'revenue-generation' | 'quality' | 'customer-satisfaction' | 'team-building' | 'other';
export type ContributionStatus = 'draft' | 'proposal-pending' | 'approved-to-start' | 'in-progress' | 'under-review' | 'completed' | 'rejected';

export interface ValueContribution {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  title: string;
  description: string;
  type: ContributionType;
  category: ContributionCategory;
  suggestedPoints: number;
  finalPoints?: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string[];
  tags: string[];
  status: ContributionStatus;
  approvalFlow: ApprovalStep[];
  createdDate: string;
}

export interface ContributionItem {
  id: string;
  title: string;
  description: string;
  category: ContributionCategory;
  suggestedPoints: number;
  isAvailable: boolean;
  claimedBy?: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ContributionLeaderboard {
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  department: string;
  totalPoints: number;
  rank: number;
  badges: string[];
  averageRating: number;
  color: string;
}

// ─── Training ────────────────────────────────────────────────────────────────
export type TrainingCategory = 'orientation' | 'technical' | 'compliance' | 'soft-skills' | 'product';
export type ContentType = 'video' | 'document' | 'quiz' | 'interactive';
export type ModuleStatus = 'not-started' | 'in-progress' | 'completed';

export interface TrainingContent {
  id: string;
  title: string;
  type: ContentType;
  duration: number;
  completed: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  durationMinutes: number;
  dueDate: string;
  isMandatory: boolean;
  isCertificateEligible: boolean;
  progress: number;
  status: ModuleStatus;
  contents: TrainingContent[];
  certificateId?: string;
}

// ─── Recruitment ─────────────────────────────────────────────────────────────
export type JobStatus = 'active' | 'paused' | 'closed' | 'filled';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type CandidateStatus = 'new' | 'screening' | 'shortlisted' | 'interview-scheduled' | 'interviewed' | 'offer-extended' | 'hired' | 'rejected';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  requirements: string[];
  responsibilities: string[];
  status: JobStatus;
  applicantsCount: number;
  shortlistedCount: number;
  interviewingCount: number;
  postedDate: string;
}

export interface Candidate {
  id: string;
  jobPostingId: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  appliedRole: string;
  skills: string[];
  experienceYears: number;
  expectedSalary: number;
  currency: string;
  noticePeriodDays: number;
  rating: number;
  notes: string;
  status: CandidateStatus;
  appliedDate: string;
  interviewDate?: string;
  color: string;
}

// ─── Recognition ─────────────────────────────────────────────────────────────
export type RecognitionCategory = 'excellence' | 'team-player' | 'innovation' | 'leadership' | 'customer-focus';

export interface Recognition {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  fromEmployeeInitials: string;
  toEmployeeId: string;
  toEmployeeName: string;
  toEmployeeInitials: string;
  category: RecognitionCategory;
  message: string;
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  date: string;
  liked: boolean;
  fromColor: string;
  toColor: string;
}

// ─── Announcements ───────────────────────────────────────────────────────────
export type AnnouncementCategory = 'hr-update' | 'event' | 'policy' | 'celebration' | 'compliance' | 'general';
export type AnnouncementPriority = 'critical' | 'high' | 'medium' | 'low';
export type VisibilityScope = 'global' | 'department' | 'location';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  visibilityScope: VisibilityScope;
  targetDepartments?: string[];
  targetLocations?: string[];
  attachments?: string[];
  expiryDate?: string;
  publishedDate: string;
  publishedBy: string;
  views: number;
  likes: number;
  acknowledgments: number;
  comments: number;
  requiresAcknowledgment: boolean;
  acknowledged: boolean;
}
