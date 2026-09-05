import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  TrendingUp,
  ThumbsUp,
  Flame,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Complaint, ProblemCluster } from "../types";
import { civicStore } from "../services/store";

interface CommunityVoiceProps {
  onOpenSamadhanDidi: (prompt?: string) => void;
  onNavigate: (view: string) => void;
}

export const CommunityVoice: React.FC<CommunityVoiceProps> = ({
  onOpenSamadhanDidi,
  onNavigate,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>(civicStore.getComplaints());
  const [clusters, setClusters] = useState<ProblemCluster[]>(civicStore.getClusters());
  const [currentUser, setCurrentUser] = useState(civicStore.getCurrentUser());
  const [supportedMap, setSupportedMap] = useState<Record<string, boolean>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Bokaro");

  useEffect(() => {
    return civicStore.subscribe(() => {
      setComplaints(civicStore.getComplaints());
      setClusters(civicStore.getClusters());
      setCurrentUser(civicStore.getCurrentUser());
    });
  }, []);

  const handleSupport = (complaintId: string) => {
    if (supportedMap[complaintId]) return;
    civicStore.supportIssue(complaintId);
    setSupportedMap((prev) => ({ ...prev, [complaintId]: true }));
  };

  // Nearby complaints in current/selected district
  const nearbyComplaints = complaints
    .filter((c) => c.district.toLowerCase() === selectedDistrict.toLowerCase())
    .sort((a, b) => (b.supportersCount || 1) - (a.supportersCount || 1));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl text-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-700/80 text-emerald-200 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Community Voice & Neighborhood Collective Action
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-1">Nearby Civic Grievances</h1>
          <p className="text-emerald-100 text-xs mt-0.5 max-w-xl">
            See active civic issues reported in your locality. Support existing issues to increase priority without filing duplicate complaints.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-emerald-300 font-semibold">Location:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-xs font-semibold text-white outline-hidden cursor-pointer"
          >
            {["Bokaro", "Ranchi", "Dhanbad", "East Singhbhum", "Hazaribagh", "Latehar", "Deoghar"].map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Community Problem Clusters Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-700" />
          <h2 className="font-bold text-amber-950 text-base">
            Emerging Hotspots in {selectedDistrict} (AI Problem Clusters)
          </h2>
        </div>
        <p className="text-xs text-amber-900">
          Multiple citizens reporting the same problem automatically aggregates into a high-priority hotspot, triggering department head alerts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {clusters
            .filter((cl) => cl.district.toLowerCase() === selectedDistrict.toLowerCase())
            .map((cl) => (
              <div key={cl.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {cl.category}
                  </span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    {cl.complaintCount} Citizens Affected
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{cl.title}</h3>
                <p className="text-slate-500 text-xs">
                  Area: {cl.village || "Chas Sector"}, {cl.district} • Assigned to {cl.department}
                </p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-emerald-800">
                    SLA Resolution Target: ~{cl.averageResolutionDays} days
                  </span>
                  <button
                    onClick={() =>
                      onOpenSamadhanDidi(
                        `Main bhi ${cl.title} se prabhavit hoon. Mujhe is cluster mein add karein.`
                      )
                    }
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    I am also facing this →
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Individual Grievances in Locality */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            All Local Reports in {selectedDistrict} ({nearbyComplaints.length})
          </h2>
          <span className="text-xs text-slate-400">Click "I Face This Too" to boost priority</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyComplaints.map((c) => {
            const hasSupported = supportedMap[c.id];
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === "Resolved" || c.status === "Verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2">{c.aiSummary || c.description}</p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>
                      {c.village}, {c.district}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>{c.supportersCount || 1} Citizens</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSupport(c.id)}
                    disabled={hasSupported}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                      hasSupported
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{hasSupported ? "Supported ✓" : "I Face This Too"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
