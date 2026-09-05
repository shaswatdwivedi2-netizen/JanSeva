import React, { useState, useEffect } from "react";
import {
  Shield,
  Filter,
  Search,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Users,
  Layers,
  MapPin,
  Camera,
  Check,
  X,
  FileCheck,
  Building,
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Complaint, ComplaintStatus, ProblemCluster, UserProfile } from "../types";
import { civicStore } from "../services/store";
import { JHARKHAND_DISTRICTS } from "../mockData/districts";
import { PhotoUploadModal } from "./PhotoUploadModal";

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#f59e0b",
  Medium: "#3b82f6",
  Low: "#10b981",
};

export const OfficerDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(civicStore.getComplaints());
  const [clusters, setClusters] = useState<ProblemCluster[]>(civicStore.getClusters());
  const [currentUser, setCurrentUser] = useState<UserProfile>(civicStore.getCurrentUser());

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Resolution modal state
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
  const [resolutionProofPhoto, setResolutionProofPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60"
  );
  const [resolutionNote, setResolutionNote] = useState<string>("");
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  useEffect(() => {
    return civicStore.subscribe(() => {
      const updated = civicStore.getComplaints();
      setComplaints(updated);
      setClusters(civicStore.getClusters());
      setCurrentUser(civicStore.getCurrentUser());
      if (selectedComplaint) {
        const found = updated.find((c) => c.id === selectedComplaint.id);
        if (found) setSelectedComplaint(found);
      }
    });
  }, [selectedComplaint]);

  // Statistics calculation
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "Submitted" || c.status === "Assigned").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved" || c.status === "Verified").length;
  const escalatedCount = complaints.filter((c) => c.status === "Escalated" || c.isEscalated).length;

  // Filtered complaints table
  const filtered = complaints.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    if (selectedDistrict !== "All" && c.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Action handlers
  const handleAssignToMe = (complaint: Complaint) => {
    civicStore.assignOfficer(complaint.id, currentUser.id, currentUser.name);
  };

  const handleStartWork = (complaint: Complaint) => {
    civicStore.updateComplaintStatus(
      complaint.id,
      "In Progress",
      "Field engineering crew reached location and started repairs.",
      currentUser.name
    );
  };

  const handleOpenResolveModal = (complaint: Complaint) => {
    setResolvingComplaint(complaint);
    setResolutionNote(`Issue thoroughly inspected and rectified on ground at ${complaint.village}. Operational restoration verified.`);
    setShowResolveModal(true);
  };

  const handleConfirmResolution = () => {
    if (!resolvingComplaint) return;
    civicStore.markResolved(
      resolvingComplaint.id,
      resolutionProofPhoto,
      resolutionNote,
      currentUser.name
    );
    setShowResolveModal(false);
    setResolvingComplaint(null);
  };

  const handleEscalate = (complaint: Complaint) => {
    civicStore.updateComplaintStatus(
      complaint.id,
      "Escalated",
      "Escalated directly to District Collector / Secretary for inter-departmental intervention.",
      currentUser.name
    );
  };

  // Heatmap district stats
  const districtCounts = JHARKHAND_DISTRICTS.map((d) => {
    const dComplaints = complaints.filter((c) => c.district.toLowerCase() === d.name.toLowerCase());
    return {
      name: d.name,
      count: dComplaints.length,
      resolved: dComplaints.filter((c) => c.status === "Resolved" || c.status === "Verified").length,
      active: dComplaints.filter((c) => c.status !== "Resolved" && c.status !== "Verified").length,
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Officer Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-800 text-emerald-200 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-700">
              Administrative Command Center
            </span>
            <span className="text-xs text-slate-400">
              {currentUser.department || "Government of Jharkhand Operations"}
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">
            {currentUser.name} — {currentUser.designation || "Executive Officer"}
          </h1>
          <p className="text-slate-300 text-xs mt-0.5">
            Jurisdiction: <span className="font-semibold text-emerald-400">{currentUser.district}</span> District • Real-Time SLA Dispatch & Verification Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => civicStore.resetToFactoryDemo()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer border border-slate-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Grievances</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Jharkhand State Registry</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Triage</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting field assignment</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">In Progress</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{inProgressCount}</div>
          <span className="text-[10px] text-blue-600 font-medium">Field teams deployed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Resolved / Verified</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">With citizen audit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            SLA Escalated
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">{escalatedCount}</div>
          <span className="text-[10px] text-rose-600 font-medium">Urgent DC review</span>
        </div>
      </div>

      {/* Problem Clusters Section (High impact AI detection) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-300 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-amber-950 text-base">
                Emerging Problem Clusters (AI Automated Pattern Detection)
              </h2>
              <p className="text-xs text-amber-800">
                Samadhan Didi automatically clusters multiple localized complaints to uncover systemic civic failures.
              </p>
            </div>
          </div>
          <span className="bg-amber-200 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-full">
            {clusters.length} Active Systemic Hotspots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              onClick={() => {
                setSelectedDistrict(cluster.district);
                setSelectedCategory(cluster.category);
              }}
              className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all hover:shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {cluster.category}
                </span>
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {cluster.growthTrend}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {cluster.title}
              </h3>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-700">
                  {cluster.complaintCount} Reported Cases
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  Filter Issues <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap & District Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Geographic Density Heatmap */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Jharkhand District Grievance Heatmap & Volume Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Live spatial density of citizen requests across 24 administrative districts
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtCounts.slice(0, 10)}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="active" name="Active Issues" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved Issues" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive District Pills */}
          <div className="pt-2 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-semibold text-slate-500 text-[11px] mr-1">Quick Filter District:</span>
            <button
              onClick={() => setSelectedDistrict("All")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedDistrict === "All"
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              All Jharkhand
            </button>
            {JHARKHAND_DISTRICTS.slice(0, 7).map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedDistrict(d.name)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedDistrict === d.name
                    ? "bg-emerald-700 text-white font-semibold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* SLA Status & Urgency Donut */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">SLA Compliance Urgency</h3>
            <p className="text-xs text-slate-500">Real-time deadline health monitoring</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="font-semibold text-emerald-900">On Track (&gt;3 Days left)</span>
              </div>
              <span className="font-bold text-emerald-900">{totalCount - escalatedCount - 5}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-900">Approaching Breach (&lt;24h)</span>
              </div>
              <span className="font-bold text-amber-900">5</span>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="font-semibold text-rose-900">SLA Breached & Escalated</span>
              </div>
              <span className="font-bold text-rose-900">{escalatedCount}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/60 mt-4">
            <div className="font-bold text-slate-900 mb-0.5">Automated Escalation Rule:</div>
            Any complaint exceeding department SLA by &gt;48 hours automatically triggers an SMS notification to the District Collector and marks the ticket red.
          </div>
        </div>
      </div>

      {/* Main Complaint Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Filters Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaints, ID, village..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap text-xs">
            {/* Category selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="Electricity / Power">Electricity</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Roads & Bridges">Roads</option>
              <option value="Education & Scholarships">Scholarships</option>
              <option value="Social Welfare & Pensions">Pensions</option>
              <option value="Sanitation & Waste">Sanitation</option>
            </select>

            {/* Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Verified">Verified</option>
              <option value="Escalated">Escalated</option>
            </select>

            <span className="text-slate-400 text-xs font-mono ml-auto">
              Showing {filtered.length} of {complaints.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">ID & Citizen</th>
                <th className="px-4 py-3">Problem / AI Summary</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Severity & SLA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      isSelected ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-emerald-950">{c.id}</div>
                      <div className="text-[11px] text-slate-500">{c.citizenName}</div>
                      <div className="text-[10px] text-slate-400">{c.citizenPhone}</div>
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{c.title}</div>
                      <div className="text-slate-500 line-clamp-1">{c.aiSummary || c.description}</div>
                      <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {c.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{c.village}</div>
                      <div className="text-[11px] text-slate-500">{c.district}, JH</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white mb-1"
                        style={{ backgroundColor: SEVERITY_COLORS[c.severity] || "#64748b" }}
                      >
                        {c.severity}
                      </span>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Due: {c.expectedResolutionDate}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === "Resolved" || c.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : c.status === "Escalated" || c.status === "Reopened"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {c.status}
                      </span>
                      {c.citizenVerification?.verified && (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          ✓ Citizen Verified
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status === "Submitted" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignToMe(c);
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium text-xs cursor-pointer shadow-2xs"
                          >
                            Assign Me
                          </button>
                        )}

                        {c.status === "Assigned" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartWork(c);
                            }}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs cursor-pointer shadow-2xs"
                          >
                            Start Work
                          </button>
                        )}

                        {c.status === "In Progress" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenResolveModal(c);
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium text-xs cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Resolved</span>
                          </button>
                        )}

                        {(c.status === "Resolved" || c.status === "Verified") && (
                          <span className="text-emerald-700 text-xs font-semibold">Done</span>
                        )}

                        {c.status !== "Resolved" && c.status !== "Verified" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEscalate(c);
                            }}
                            title="Escalate issue to higher officer"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <Flame className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Officer Resolution Modal with Proof Upload */}
      {showResolveModal && resolvingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Submit On-Ground Resolution Proof</h3>
                <p className="text-xs text-slate-500">
                  Ticket #{resolvingComplaint.id} — {resolvingComplaint.title}
                </p>
              </div>
              <button
                onClick={() => setShowResolveModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Resolution Engineering Work Note:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Mandatory Resolution Proof Photo:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPhotoPicker(true)}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Change Proof Photo
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-300 max-h-48 relative">
                  <img
                    src={resolutionProofPhoto}
                    alt="Proof Preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    Timestamped on ground: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolution}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Resolved & Send for Citizen Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Picker Modal for Proof */}
      <PhotoUploadModal
        isOpen={showPhotoPicker}
        onClose={() => setShowPhotoPicker(false)}
        onSelectPhoto={(url) => {
          setResolutionProofPhoto(url);
          setShowPhotoPicker(false);
        }}
      />
    </div>
  );
};
