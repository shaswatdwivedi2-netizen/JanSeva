export type UserRole = "citizen" | "student" | "university" | "officer" | "admin";

export type Language = "en" | "hi";

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low";

export type ComplaintStatus =
  | "Submitted"
  | "AI Classified"
  | "Assigned"
  | "In Progress"
  | "Escalated"
  | "Resolved"
  | "Verified"
  | "Reopened";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  state: string;
  district: string;
  block?: string;
  village?: string;
  preferredLanguage: Language;
  avatar?: string;
  institutionName?: string; // for university / student
  department?: string; // for officer
  designation?: string; // for officer
}

export interface ComplaintTimelineItem {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  proofPhoto?: string;
}

export interface Complaint {
  id: string; // e.g. JSV-2026-00427
  citizenId: string;
  citizenName: string; // Private, hidden in transparency views
  citizenPhone: string; // Private
  title: string;
  description: string;
  aiSummary: string;
  category: string;
  subcategory: string;
  severity: SeverityLevel;
  severityReason?: string;
  state: string;
  district: string;
  block: string;
  village: string;
  coordinates: { lat: number; lng: number };
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  expectedResolutionDate: string;
  department: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  status: ComplaintStatus;
  timeline: ComplaintTimelineItem[];
  resolutionProof?: {
    photoUrl?: string;
    note: string;
    resolvedAt: string;
    officerName: string;
  };
  citizenVerification?: {
    verified: boolean; // true = problem fixed, false = reopened
    feedback?: string;
    verifiedAt: string;
  };
  clusterId?: string;
  supportersCount?: number;
  isEscalated?: boolean;
}

export interface AIClassification {
  category: string;
  subcategory: string;
  problemSummary: string;
  severity: SeverityLevel;
  severityReason: string;
  location: {
    state: string;
    district: string;
    block: string;
    village: string;
  };
  department: string;
  slaDays: number;
  expectedResolutionDate: string;
  requiredInformation: string[];
  suggestedNextStep: string;
  confidence: number;
  clarifyingQuestions?: string[];
  similarComplaintsCount?: number;
}

export interface ProblemCluster {
  id: string;
  title: string;
  category: string;
  district: string;
  block: string;
  village: string;
  coordinates: { lat: number; lng: number };
  complaintCount: number;
  severity: SeverityLevel;
  growthTrend: string; // e.g. "+42% this week"
  department: string;
  complaintIds: string[];
  statusBreakdown: {
    pending: number;
    inProgress: number;
    resolved: number;
  };
  averageResolutionDays: number;
  lastUpdated: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  department: string;
  targetAudience: string[]; // e.g. "Students", "Farmers", "Women", "Senior Citizens", "Tribal Communities"
  shortDescription: string;
  eligibility: string;
  benefits: string;
  requiredDocuments: string[];
  applicationProcess: string;
  deadline: string;
  link?: string;
  isScholarship?: boolean;
  category: string;
}

export interface CivicNotification {
  id: string;
  userId: string;
  targetRole: UserRole | "all";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "complaint" | "sla" | "resolution" | "verification" | "cluster" | "scheme";
  complaintId?: string;
  schemeId?: string;
}

export interface DistrictStat {
  district: string;
  totalIssues: number;
  resolved: number;
  pending: number;
  inProgress: number;
  slaComplianceRate: number; // percentage
  avgResolutionDays: number;
  coordinates: { lat: number; lng: number };
  topCategories: { category: string; count: number }[];
  hotspotsCount: number;
}
