import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Settings,
  Plus,
  RotateCcw,
  Check,
  Building,
  Clock,
  Layers,
  CheckCircle2,
  Flame,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Complaint, ProblemCluster, UserProfile } from "../types";
import { CategoryConfig } from "../mockData/categories";
import { civicStore } from "../services/store";

export const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(civicStore.getComplaints());
  const [categories, setCategories] = useState<CategoryConfig[]>(civicStore.getCategories());
  const [clusters, setClusters] = useState<ProblemCluster[]>(civicStore.getClusters());
  const [currentUser, setCurrentUser] = useState<UserProfile>(civicStore.getCurrentUser());

  // New category form
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catHindi, setCatHindi] = useState("");
  const [catDept, setCatDept] = useState("");
  const [catSla, setCatSla] = useState(3);
  const [catKeywords, setCatKeywords] = useState("");

  useEffect(() => {
    return civicStore.subscribe(() => {
      setComplaints(civicStore.getComplaints());
      setCategories(civicStore.getCategories());
      setClusters(civicStore.getClusters());
      setCurrentUser(civicStore.getCurrentUser());
    });
  }, []);

  const handleAddCategory = () => {
    if (!catName || !catDept) return;
    const newCat: CategoryConfig = {
      id: catName.toLowerCase().replace(/\s+/g, "_"),
      name: catName,
      hindiName: catHindi || catName,
      iconName: "Folder",
      department: catDept,
      defaultSlaDays: catSla,
      subcategories: [
        { name: "General Issue", hindiName: "सामान्य समस्या", defaultSeverity: "Medium" },
        { name: "Severe Failure", hindiName: "गंभीर खराबी", defaultSeverity: "High" },
      ],
      keywords: catKeywords.split(",").map((k) => k.trim()),
    };
    civicStore.addCategory(newCat);
    setShowAddCatModal(false);
    setCatName("");
    setCatHindi("");
    setCatDept("");
    setCatKeywords("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-2xl shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-800 text-emerald-100 font-bold px-2.5 py-0.5 rounded-full border border-emerald-700">
              Apex State Governance
            </span>
            <span className="text-xs text-slate-300">Department of Personnel & Administrative Reforms</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">{currentUser.name}</h1>
          <p className="text-slate-300 text-xs mt-0.5">
            {currentUser.designation || "State Grievance Commissioner"} • Statewide Policy, Category Configuration & SLA Enforcement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCatModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Civic Category</span>
          </button>

          <button
            onClick={() => civicStore.resetToFactoryDemo()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg cursor-pointer border border-slate-600 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Grid: Configured Categories & Dynamic Problem Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configured Categories and SLA Settings */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Configured Civic Categories & SLA Standards
              </h3>
              <p className="text-xs text-slate-500">
                AI auto-routes problems to these departments and enforces target timelines
              </p>
            </div>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              {categories.length} Categories
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs hover:bg-white transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-slate-400 font-normal">({c.hindiName})</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Accountable: <strong className="text-emerald-900">{c.department}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                    SLA: {c.defaultSlaDays} Days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspots & Active Clusters */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Statewide Problem Clusters ({clusters.length})
              </h3>
              <p className="text-xs text-slate-500">
                Systemic issues automatically detected by Samadhan Didi AI
              </p>
            </div>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clusters.map((cl) => (
              <div
                key={cl.id}
                className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{cl.title}</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                    {cl.growthTrend}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Impact: <strong>{cl.complaintCount} Citizen Grievances</strong> • Dept: {cl.department}
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Target SLA: ~{cl.averageResolutionDays} days</span>
                  <span className="text-emerald-700 font-bold">Collector Notified ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add New Civic Category</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category English Name:</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g., Stray Animal Hazard / Municipal Animal Control"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hindi Translation:</label>
                <input
                  type="text"
                  value={catHindi}
                  onChange={(e) => setCatHindi(e.target.value)}
                  placeholder="e.g., आवारा पशु नियंत्रण"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accountable Department:</label>
                <input
                  type="text"
                  value={catDept}
                  onChange={(e) => setCatDept(e.target.value)}
                  placeholder="e.g., Municipal Corporation / Veterinary Department"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default SLA Target (Days):</label>
                <input
                  type="number"
                  value={catSla}
                  onChange={(e) => setCatSla(Number(e.target.value))}
                  min={1}
                  max={30}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">AI Match Keywords (comma separated):</label>
                <input
                  type="text"
                  value={catKeywords}
                  onChange={(e) => setCatKeywords(e.target.value)}
                  placeholder="dog, cattle, stray animal, bite, rabid, bandar, bandar katna"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddCatModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
