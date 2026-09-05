import {
  CivicNotification,
  Complaint,
  ComplaintStatus,
  DistrictStat,
  Language,
  ProblemCluster,
  UserProfile,
  UserRole,
} from "../types";
import { INITIAL_COMPLAINTS, INITIAL_CLUSTERS, SAMPLE_OFFICERS } from "../mockData/initialComplaints";
import { JHARKHAND_DISTRICTS } from "../mockData/districts";
import { INITIAL_CATEGORIES, CategoryConfig } from "../mockData/categories";

const STORAGE_KEY_COMPLAINTS = "janseva_complaints_v1";
const STORAGE_KEY_CLUSTERS = "janseva_clusters_v1";
const STORAGE_KEY_CATEGORIES = "janseva_categories_v1";
const STORAGE_KEY_NOTIFS = "janseva_notifs_v1";
const STORAGE_KEY_USER = "janseva_user_v1";
const STORAGE_KEY_LANG = "janseva_lang_v1";

// Demo user profiles for each role
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  citizen: {
    id: "cit-101",
    name: "Rameshwar Mahato",
    role: "citizen",
    phone: "9876543210",
    email: "rameshwar.m@citizen.gov.in",
    state: "Jharkhand",
    district: "Bokaro",
    block: "Chas",
    village: "Kura",
    preferredLanguage: "hi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60",
  },
  student: {
    id: "stu-202",
    name: "Budhram Munda",
    role: "student",
    phone: "9431789012",
    email: "budhram.munda@vbu.edu.in",
    state: "Jharkhand",
    district: "Hazaribagh",
    block: "Sadar Hazaribagh",
    village: "Matwari",
    institutionName: "Vinoba Bhave University, Hazaribagh",
    preferredLanguage: "en",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
  },
  university: {
    id: "uni-303",
    name: "Dr. Arvind Shrivastava (Dean of Student Welfare)",
    role: "university",
    phone: "9431109876",
    email: "dsw@ranchiuniversity.ac.in",
    state: "Jharkhand",
    district: "Ranchi",
    institutionName: "Ranchi University / BIT Mesra Campus",
    preferredLanguage: "en",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
  },
  officer: {
    id: "off-2",
    name: "Er. Amitesh Verma",
    role: "officer",
    phone: "9835098765",
    email: "amitesh.verma@jbvnl.co.in",
    state: "Jharkhand",
    district: "Bokaro",
    department: "Jharkhand Bijli Vitran Nigam Ltd (JBVNL)",
    designation: "Assistant Electrical Engineer (Chas Sub-Division)",
    preferredLanguage: "en",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
  },
  admin: {
    id: "adm-001",
    name: "Dr. Vandana Dadel, IAS",
    role: "admin",
    phone: "9431000001",
    email: "director.publicgrievances@jharkhand.gov.in",
    state: "Jharkhand",
    district: "Ranchi",
    department: "Department of Personnel & Administrative Reforms",
    designation: "State Grievance Commissioner",
    preferredLanguage: "en",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
  },
};

const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: "notif-1",
    userId: "cit-101",
    targetRole: "citizen",
    title: "Complaint In Progress",
    message: "Your complaint JSV-2026-00427 (Street Light) has been accepted by Er. Amitesh Verma. Repair team dispatched.",
    timestamp: "2026-09-03T02:30:00Z",
    read: false,
    type: "complaint",
    complaintId: "JSV-2026-00427",
  },
  {
    id: "notif-2",
    userId: "cit-102",
    targetRole: "citizen",
    title: "Action Required: Verify Resolution",
    message: "Complaint JSV-2026-00412 has been marked Resolved by DWSD. Please verify if water flow is restored.",
    timestamp: "2026-09-02T16:00:00Z",
    read: false,
    type: "verification",
    complaintId: "JSV-2026-00412",
  },
  {
    id: "notif-3",
    userId: "off-2",
    targetRole: "officer",
    title: "New Civic Report Assigned",
    message: "New complaint JSV-2026-00427 in Chas Sector assigned to your jurisdiction.",
    timestamp: "2026-09-02T19:00:00Z",
    read: false,
    type: "complaint",
    complaintId: "JSV-2026-00427",
  },
  {
    id: "notif-4",
    userId: "off-5",
    targetRole: "officer",
    title: "SLA Breach Escalation Notice",
    message: "Complaint JSV-2026-00388 (e-Kalyan delay) has breached SLA by >7 days. Escalated to District Collector.",
    timestamp: "2026-08-26T00:01:00Z",
    read: false,
    type: "sla",
    complaintId: "JSV-2026-00388",
  },
];

type Listener = () => void;

class CivicStore {
  private complaints: Complaint[] = [];
  private clusters: ProblemCluster[] = [];
  private categories: CategoryConfig[] = [];
  private notifications: CivicNotification[] = [];
  private currentUser: UserProfile = DEMO_USERS.citizen;
  private language: Language = "hi";
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedComplaints = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      this.complaints = savedComplaints ? JSON.parse(savedComplaints) : INITIAL_COMPLAINTS;

      const savedClusters = localStorage.getItem(STORAGE_KEY_CLUSTERS);
      this.clusters = savedClusters ? JSON.parse(savedClusters) : INITIAL_CLUSTERS;

      const savedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      this.categories = savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES;

      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
      this.notifications = savedNotifs ? JSON.parse(savedNotifs) : INITIAL_NOTIFICATIONS;

      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      } else {
        this.currentUser = DEMO_USERS.citizen;
      }

      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === "en" || savedLang === "hi") {
        this.language = savedLang;
      }
    } catch (e) {
      console.warn("CivicStore storage load error:", e);
      this.complaints = INITIAL_COMPLAINTS;
      this.clusters = INITIAL_CLUSTERS;
      this.categories = INITIAL_CATEGORIES;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.currentUser = DEMO_USERS.citizen;
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(this.complaints));
      localStorage.setItem(STORAGE_KEY_CLUSTERS, JSON.stringify(this.clusters));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEY_LANG, this.language);
    } catch (e) {
      console.warn("CivicStore persist error:", e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  // Getters
  public getComplaints(): Complaint[] {
    return this.complaints;
  }

  public getClusters(): ProblemCluster[] {
    return this.clusters;
  }

  public getCategories(): CategoryConfig[] {
    return this.categories;
  }

  public getNotifications(): CivicNotification[] {
    return this.notifications;
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public getLanguage(): Language {
    return this.language;
  }

  // User & Language Switch
  public switchRole(role: UserRole) {
    this.currentUser = DEMO_USERS[role];
    this.persist();
  }

  public setLanguage(lang: Language) {
    this.language = lang;
    this.persist();
  }

  // Create Complaint
  public createComplaint(newComplaintData: Partial<Complaint>): Complaint {
    const idNumber = Math.floor(10000 + Math.random() * 90000);
    const complaintId = `JSV-2026-0${idNumber}`;
    const now = new Date().toISOString();

    const complaint: Complaint = {
      id: complaintId,
      citizenId: this.currentUser.id,
      citizenName: this.currentUser.name,
      citizenPhone: this.currentUser.phone,
      title: newComplaintData.title || "Civic Grievance Report",
      description: newComplaintData.description || "",
      aiSummary: newComplaintData.aiSummary || newComplaintData.description || "",
      category: newComplaintData.category || "Public Infrastructure",
      subcategory: newComplaintData.subcategory || "General",
      severity: newComplaintData.severity || "Medium",
      severityReason: newComplaintData.severityReason || "Assessed based on citizen input.",
      state: "Jharkhand",
      district: newComplaintData.district || this.currentUser.district || "Bokaro",
      block: newComplaintData.block || this.currentUser.block || "Chas",
      village: newComplaintData.village || this.currentUser.village || "Kura",
      coordinates: newComplaintData.coordinates || { lat: 23.6693, lng: 86.1511 },
      photoUrl: newComplaintData.photoUrl,
      createdAt: now,
      updatedAt: now,
      expectedResolutionDate: newComplaintData.expectedResolutionDate || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0],
      department: newComplaintData.department || "Relevant Local Authority",
      status: "Submitted",
      supportersCount: 1,
      timeline: [
        {
          id: `t1-${complaintId}`,
          status: "Submitted",
          title: "Complaint Submitted",
          description: "Lodged via Samadhan Didi conversational AI.",
          timestamp: now,
          actor: this.currentUser.name,
          actorRole: this.currentUser.role === "student" ? "Student" : "Citizen",
        },
        {
          id: `t2-${complaintId}`,
          status: "AI Classified",
          title: "AI Analysis Complete",
          description: `Automatically classified into ${newComplaintData.category}. Priority: ${newComplaintData.severity}.`,
          timestamp: new Date(Date.now() + 2000).toISOString(),
          actor: "Samadhan Didi AI",
          actorRole: "AI Engine",
        },
      ],
    };

    // Auto assign officer if match found
    const matchingOfficer = SAMPLE_OFFICERS.find((o) => o.department === complaint.department);
    if (matchingOfficer) {
      complaint.assignedOfficerId = matchingOfficer.id;
      complaint.assignedOfficerName = matchingOfficer.name;
      complaint.timeline.push({
        id: `t3-${complaintId}`,
        status: "Assigned",
        title: "Assigned to Department",
        description: `Dispatched to ${complaint.department} (${matchingOfficer.name}).`,
        timestamp: new Date(Date.now() + 4000).toISOString(),
        actor: "System Router",
        actorRole: "Automated Router",
      });
      complaint.status = "Assigned";
    }

    this.complaints.unshift(complaint);

    // Update clusters dynamically
    this.updateClustersForNewComplaint(complaint);

    // Create notifications
    this.notifications.unshift({
      id: `notif-${Date.now()}-cit`,
      userId: this.currentUser.id,
      targetRole: "citizen",
      title: "Complaint Registered Successfully",
      message: `Your complaint #${complaint.id} has been registered and routed to ${complaint.department}.`,
      timestamp: now,
      read: false,
      type: "complaint",
      complaintId: complaint.id,
    });

    this.notifications.unshift({
      id: `notif-${Date.now()}-off`,
      userId: matchingOfficer?.id || "officer",
      targetRole: "officer",
      title: "New Grievance Escalated",
      message: `Complaint #${complaint.id} reported in ${complaint.village}, ${complaint.district}.`,
      timestamp: now,
      read: false,
      type: "complaint",
      complaintId: complaint.id,
    });

    this.persist();
    return complaint;
  }

  // Update clusters dynamically
  private updateClustersForNewComplaint(c: Complaint) {
    const existing = this.clusters.find(
      (cl) => cl.category.toLowerCase() === c.category.toLowerCase() && cl.district.toLowerCase() === c.district.toLowerCase()
    );

    if (existing) {
      existing.complaintCount += 1;
      existing.complaintIds.push(c.id);
      existing.statusBreakdown.pending += 1;
      existing.lastUpdated = new Date().toISOString();
      c.clusterId = existing.id;
    } else {
      // Check if there are 3+ similar complaints in this district
      const matchingCount = this.complaints.filter(
        (cmp) => cmp.category === c.category && cmp.district === c.district
      ).length;

      if (matchingCount >= 3) {
        const newCluster: ProblemCluster = {
          id: `cluster-${Date.now()}`,
          title: `${c.category} Emerging Issue — ${c.district}`,
          category: c.category,
          district: c.district,
          block: c.block,
          village: c.village,
          coordinates: c.coordinates,
          complaintCount: matchingCount,
          severity: "High",
          growthTrend: "+35% this week",
          department: c.department,
          complaintIds: [c.id],
          statusBreakdown: { pending: matchingCount, inProgress: 0, resolved: 0 },
          averageResolutionDays: 3.5,
          lastUpdated: new Date().toISOString(),
        };
        this.clusters.unshift(newCluster);
        c.clusterId = newCluster.id;
      }
    }
  }

  // Officer updates status
  public updateComplaintStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    note?: string,
    officerName: string = "Officer"
  ) {
    const target = this.complaints.find((c) => c.id === complaintId);
    if (!target) return;

    target.status = newStatus;
    target.updatedAt = new Date().toISOString();

    target.timeline.push({
      id: `t-${Date.now()}`,
      status: newStatus,
      title: `Status: ${newStatus}`,
      description: note || `Complaint marked as ${newStatus} by ${officerName}.`,
      timestamp: new Date().toISOString(),
      actor: officerName,
      actorRole: "Government Officer",
    });

    // Notify citizen
    this.notifications.unshift({
      id: `notif-stat-${Date.now()}`,
      userId: target.citizenId,
      targetRole: "citizen",
      title: `Status Updated: ${newStatus}`,
      message: `Your complaint #${target.id} is now ${newStatus}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "complaint",
      complaintId: target.id,
    });

    this.persist();
  }

  // Officer assigns
  public assignOfficer(complaintId: string, officerId: string, officerName: string) {
    const target = this.complaints.find((c) => c.id === complaintId);
    if (!target) return;

    target.assignedOfficerId = officerId;
    target.assignedOfficerName = officerName;
    target.status = "In Progress";
    target.updatedAt = new Date().toISOString();

    target.timeline.push({
      id: `t-ass-${Date.now()}`,
      status: "In Progress",
      title: "Assigned & In Progress",
      description: `Assigned to ${officerName}. Field team dispatched.`,
      timestamp: new Date().toISOString(),
      actor: officerName,
      actorRole: "Government Officer",
    });

    this.notifications.unshift({
      id: `notif-assign-${Date.now()}`,
      userId: target.citizenId,
      targetRole: "citizen",
      title: "Officer Assigned",
      message: `Your complaint #${target.id} was accepted by ${officerName}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "complaint",
      complaintId: target.id,
    });

    this.persist();
  }

  // Officer resolves
  public markResolved(
    complaintId: string,
    proofPhoto: string,
    resolutionNote: string,
    officerName: string
  ) {
    const target = this.complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const now = new Date().toISOString();
    target.status = "Resolved";
    target.updatedAt = now;
    target.resolutionProof = {
      photoUrl: proofPhoto,
      note: resolutionNote,
      resolvedAt: now,
      officerName,
    };

    target.timeline.push({
      id: `t-res-${Date.now()}`,
      status: "Resolved",
      title: "Marked Resolved with Proof",
      description: resolutionNote,
      proofPhoto,
      timestamp: now,
      actor: officerName,
      actorRole: "Government Officer",
    });

    // Notify citizen for verification
    this.notifications.unshift({
      id: `notif-ver-${Date.now()}`,
      userId: target.citizenId,
      targetRole: "citizen",
      title: "Please Verify: Issue Fixed?",
      message: `Officer ${officerName} marked #${target.id} as Resolved. Has your problem actually been resolved?`,
      timestamp: now,
      read: false,
      type: "verification",
      complaintId: target.id,
    });

    this.persist();
  }

  // Citizen verifies
  public verifyResolution(complaintId: string, isFixed: boolean, feedback: string) {
    const target = this.complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const now = new Date().toISOString();
    if (isFixed) {
      target.status = "Verified";
      target.citizenVerification = {
        verified: true,
        feedback,
        verifiedAt: now,
      };
      target.timeline.push({
        id: `t-ver-${Date.now()}`,
        status: "Verified",
        title: "Citizen Confirmed Resolution (YES)",
        description: feedback || "Citizen confirmed the issue is fully solved on the ground.",
        timestamp: now,
        actor: this.currentUser.name,
        actorRole: "Citizen",
      });
    } else {
      target.status = "Reopened";
      target.isEscalated = true;
      target.citizenVerification = {
        verified: false,
        feedback,
        verifiedAt: now,
      };
      target.timeline.push({
        id: `t-reopen-${Date.now()}`,
        status: "Reopened",
        title: "Citizen Rejected Resolution (NO - Still Unresolved)",
        description: `Citizen reported issue remains unsolved: "${feedback}". Escalated to senior authority.`,
        timestamp: now,
        actor: this.currentUser.name,
        actorRole: "Citizen",
      });

      // Officer notification
      this.notifications.unshift({
        id: `notif-reopen-${Date.now()}`,
        userId: target.assignedOfficerId || "officer",
        targetRole: "officer",
        title: "Complaint Reopened by Citizen",
        message: `Citizen reported #${target.id} was not fixed on ground: "${feedback}". Reopened immediately.`,
        timestamp: now,
        read: false,
        type: "sla",
        complaintId: target.id,
      });
    }

    this.persist();
  }

  // Support an issue in community voice
  public supportIssue(complaintId: string) {
    const target = this.complaints.find((c) => c.id === complaintId);
    if (!target) return;
    target.supportersCount = (target.supportersCount || 0) + 1;
    this.persist();
  }

  // Notification management
  public markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.persist();
  }

  // Admin add category
  public addCategory(cat: CategoryConfig) {
    this.categories.push(cat);
    this.persist();
  }

  // Reset demo state
  public resetToFactoryDemo() {
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_CLUSTERS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem(STORAGE_KEY_USER);
    this.complaints = INITIAL_COMPLAINTS;
    this.clusters = INITIAL_CLUSTERS;
    this.categories = INITIAL_CATEGORIES;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.currentUser = DEMO_USERS.citizen;
    this.persist();
  }

  // Aggregated Public Statistics
  public getAggregatedStats() {
    const total = this.complaints.length;
    const resolved = this.complaints.filter((c) => c.status === "Resolved" || c.status === "Verified").length;
    const pending = this.complaints.filter((c) => c.status === "Submitted" || c.status === "Assigned").length;
    const inProgress = this.complaints.filter((c) => c.status === "In Progress").length;
    const escalated = this.complaints.filter((c) => c.status === "Escalated" || c.isEscalated).length;

    const complianceRate = Math.round(((total - escalated) / Math.max(1, total)) * 100);

    // Category breakdown
    const catMap: Record<string, number> = {};
    this.complaints.forEach((c) => {
      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });

    const categoryStats = Object.entries(catMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // District breakdown
    const districtStats: DistrictStat[] = JHARKHAND_DISTRICTS.map((d) => {
      const distComplaints = this.complaints.filter((c) => c.district.toLowerCase() === d.name.toLowerCase());
      const dTotal = distComplaints.length;
      const dResolved = distComplaints.filter((c) => c.status === "Resolved" || c.status === "Verified").length;
      const dPending = distComplaints.filter((c) => c.status === "Submitted" || c.status === "Assigned").length;
      const dInProgress = distComplaints.filter((c) => c.status === "In Progress").length;
      const dEscalated = distComplaints.filter((c) => c.status === "Escalated" || c.isEscalated).length;
      const rate = dTotal > 0 ? Math.round(((dTotal - dEscalated) / dTotal) * 100) : 92;

      const dCatMap: Record<string, number> = {};
      distComplaints.forEach((c) => {
        dCatMap[c.category] = (dCatMap[c.category] || 0) + 1;
      });
      const topCategories = Object.entries(dCatMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        district: d.name,
        totalIssues: dTotal,
        resolved: dResolved,
        pending: dPending,
        inProgress: dInProgress,
        slaComplianceRate: rate,
        avgResolutionDays: 3.4,
        coordinates: d.coordinates,
        topCategories,
        hotspotsCount: this.clusters.filter((cl) => cl.district.toLowerCase() === d.name.toLowerCase()).length,
      };
    });

    return {
      total,
      resolved,
      pending,
      inProgress,
      escalated,
      slaComplianceRate: complianceRate,
      avgResolutionDays: 3.6,
      categoryStats,
      districtStats,
    };
  }
}

export const civicStore = new CivicStore();
