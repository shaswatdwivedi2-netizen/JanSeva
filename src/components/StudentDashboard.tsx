import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  Award,
  AlertCircle,
  FileCheck,
  Building2,
  Clock,
  ExternalLink,
  ChevronRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { Complaint, GovernmentScheme, UserProfile } from "../types";
import { civicStore } from "../services/store";
import { GOVERNMENT_SCHEMES } from "../mockData/schemes";

interface StudentDashboardProps {
  onOpenSamadhanDidi: (prompt?: string) => void;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenSamadhanDidi,
  onNavigate,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>(civicStore.getComplaints());
  const [currentUser, setCurrentUser] = useState<UserProfile>(civicStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<"grievances" | "scholarships" | "templates">("grievances");

  useEffect(() => {
    return civicStore.subscribe(() => {
      setComplaints(civicStore.getComplaints());
      setCurrentUser(civicStore.getCurrentUser());
    });
  }, []);

  const studentComplaints = complaints.filter(
    (c) =>
      c.category === "Education & Scholarships" ||
      c.citizenId === currentUser.id ||
      c.title.toLowerCase().includes("scholarship") ||
      c.title.toLowerCase().includes("hostel") ||
      c.title.toLowerCase().includes("marksheet")
  );

  const studentSchemes = GOVERNMENT_SCHEMES.filter(
    (s) => s.targetAudience.includes("Students") || s.isScholarship
  );

  const QUICK_STUDENT_TEMPLATES = [
    {
      title: "e-Kalyan Scholarship Stuck",
      prompt: "Meri e-Kalyan post matric scholarship portal par DA Approved dikha rahi hai par DBT bank account mein transfer nahi hua pichle 3 mahine se.",
      category: "Scholarship",
    },
    {
      title: "University Marksheet Delay",
      prompt: "Vinoba Bhave University semester 6 final marksheet aur provisional certificate 45 din beet jaane par bhi issue nahi kiya gaya hai.",
      category: "University",
    },
    {
      title: "Campus Hostel Water Shortage",
      prompt: "University campus Boys Hostel 2 mein peene ke paani ki supply aur bathroom pipelines pichle 5 din se kharab hain.",
      category: "Hostel/Campus",
    },
    {
      title: "NSP Central Sector Rejection",
      prompt: "National Scholarship Portal par bio-metric Aadhaar mismatch error aa raha hai jisse form submit nahi ho raha.",
      category: "Technical Portal",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-700/80 text-indigo-200 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Student Civic & Academic Cell
            </span>
            <span className="text-xs text-indigo-300">
              {currentUser.institutionName || "Vinoba Bhave University, Hazaribagh"}
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-1">{currentUser.name}</h1>
          <p className="text-indigo-200 text-xs mt-0.5 max-w-xl">
            Streamlined assistance for higher education scholarships, university grievance redressal, DBT verification, and welfare schemes.
          </p>
        </div>

        <button
          onClick={() => onOpenSamadhanDidi("Main student hoon, meri scholarship mein problem hai...")}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer text-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Ask Samadhan Didi</span>
        </button>
      </div>

      {/* Quick Problem Launchers (1-click to Samadhan Didi) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Common Student Issue Presets (Click to Auto-Diagnose)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_STUDENT_TEMPLATES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onOpenSamadhanDidi(item.prompt)}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all cursor-pointer shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs">{item.title}</h3>
              <p className="text-slate-500 text-[11px] line-clamp-2">{item.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab("grievances")}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === "grievances"
              ? "border-indigo-600 text-indigo-900 font-bold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          Student Grievance Tracker ({studentComplaints.length})
        </button>
        <button
          onClick={() => setActiveTab("scholarships")}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === "scholarships"
              ? "border-indigo-600 text-indigo-900 font-bold"
              : "border-transparent hover:text-slate-900"
          }`}
        >
          Available Scholarships & Schemes ({studentSchemes.length})
        </button>
      </div>

      {/* Tab 1: Grievance Tracker */}
      {activeTab === "grievances" && (
        <div className="space-y-3">
          {studentComplaints.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No active student grievances. Click any preset above or talk to Samadhan Didi.
            </div>
          ) : (
            studentComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {c.id}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {c.subcategory || c.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === "Resolved" || c.status === "Verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                  <p className="text-slate-600 text-xs">{c.aiSummary || c.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>Department: <strong className="text-slate-700">{c.department}</strong></span>
                    <span>•</span>
                    <span>Due: <strong className="text-slate-700">{c.expectedResolutionDate}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("citizen-dashboard")}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold text-xs rounded-lg cursor-pointer shrink-0 transition-colors flex items-center gap-1"
                >
                  <span>Track Full Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Available Scholarships */}
      {activeTab === "scholarships" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-800">
                    {scheme.department}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{scheme.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{scheme.shortDescription}</p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Eligibility:</strong> {scheme.eligibility}
                  </div>
                  <div className="text-emerald-800">
                    <strong className="text-emerald-950">Benefits:</strong> {scheme.benefits}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenSamadhanDidi(`Main ${scheme.name} ke liye eligible hoon ya nahi, check karo.`)}
                  className="flex-1 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors text-center"
                >
                  AI Eligibility Check
                </button>
                {scheme.link && (
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    title="Official Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
