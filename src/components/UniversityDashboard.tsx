import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Complaint, UserProfile } from "../types";
import { civicStore } from "../services/store";

export const UniversityDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(civicStore.getComplaints());
  const [currentUser, setCurrentUser] = useState<UserProfile>(civicStore.getCurrentUser());
  const [filterType, setFilterType] = useState<"all" | "scholarship" | "campus">("all");

  useEffect(() => {
    return civicStore.subscribe(() => {
      setComplaints(civicStore.getComplaints());
      setCurrentUser(civicStore.getCurrentUser());
    });
  }, []);

  const universityComplaints = complaints.filter(
    (c) =>
      c.category === "Education & Scholarships" ||
      c.title.toLowerCase().includes("university") ||
      c.title.toLowerCase().includes("hostel") ||
      c.title.toLowerCase().includes("marksheet") ||
      c.title.toLowerCase().includes("scholarship")
  );

  const scholarshipCount = universityComplaints.filter(
    (c) => c.title.toLowerCase().includes("scholarship") || c.subcategory.toLowerCase().includes("scholarship")
  ).length;

  const campusInfrastructureCount = universityComplaints.length - scholarshipCount;

  const filtered = universityComplaints.filter((c) => {
    if (filterType === "scholarship") {
      return c.title.toLowerCase().includes("scholarship") || c.subcategory.toLowerCase().includes("scholarship");
    }
    if (filterType === "campus") {
      return !c.title.toLowerCase().includes("scholarship") && !c.subcategory.toLowerCase().includes("scholarship");
    }
    return true;
  });

  const handleVerifyStudentBonafide = (complaintId: string) => {
    civicStore.updateComplaintStatus(
      complaintId,
      "In Progress",
      "University Student Welfare Office verified student bonafide enrollment & forwarded to State e-Kalyan Nodal Officer.",
      currentUser.name
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-700 text-indigo-100 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-600">
              Institutional Administration
            </span>
            <span className="text-xs text-slate-400">Higher & Technical Education Redressal</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">{currentUser.name}</h1>
          <p className="text-slate-300 text-xs mt-0.5">
            {currentUser.institutionName || "Ranchi University / BIT Mesra Campus"} • Student Welfare & e-Kalyan Nodal Cell
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Student Grievances</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{universityComplaints.length}</div>
          <span className="text-[10px] text-slate-400">Logged on JANSEVA Portal</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-indigo-600 block">Scholarship & DBT Delays</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{scholarshipCount}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Pending state nodal approval</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-amber-600 block">Internal Campus / Hostel</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{campusInfrastructureCount}</div>
          <span className="text-[10px] text-amber-600 font-medium">University maintenance action</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-600 block">Resolved with Proof</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {universityComplaints.filter((c) => c.status === "Resolved" || c.status === "Verified").length}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Verified by students</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                filterType === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Grievances ({universityComplaints.length})
            </button>
            <button
              onClick={() => setFilterType("scholarship")}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                filterType === "scholarship" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              External Govt Scholarship Issues ({scholarshipCount})
            </button>
            <button
              onClick={() => setFilterType("campus")}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                filterType === "campus" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Internal Campus Issues ({campusInfrastructureCount})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filtered.map((c) => (
            <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {c.id}
                  </span>
                  <span className="font-semibold text-slate-800">{c.citizenName} (Student)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {c.village}, {c.district}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                <p className="text-slate-500 line-clamp-1">{c.aiSummary || c.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded ${
                    c.status === "Resolved" || c.status === "Verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {c.status}
                </span>

                {c.status !== "Resolved" && c.status !== "Verified" && (
                  <button
                    onClick={() => handleVerifyStudentBonafide(c.id)}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    Verify Bonafide & Forward
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
