import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  MapPin,
  Building,
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  Flame,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { Complaint, ComplaintStatus } from "../types";
import { civicStore } from "../services/store";
import confetti from "canvas-confetti";

interface CitizenDashboardProps {
  onOpenSamadhanDidi: (prompt?: string) => void;
  highlightId?: string;
  onNavigate: (view: string, extra?: any) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onOpenSamadhanDidi,
  highlightId,
  onNavigate,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>(civicStore.getComplaints());
  const [currentUser, setCurrentUser] = useState(civicStore.getCurrentUser());
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Verification prompt modal state
  const [verifyingComplaint, setVerifyingComplaint] = useState<Complaint | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState("");
  const [isVerifyingYes, setIsVerifyingYes] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    return civicStore.subscribe(() => {
      const updated = civicStore.getComplaints();
      setComplaints(updated);
      setCurrentUser(civicStore.getCurrentUser());
      if (selectedComplaint) {
        const found = updated.find((c) => c.id === selectedComplaint.id);
        if (found) setSelectedComplaint(found);
      }
    });
  }, [selectedComplaint]);

  useEffect(() => {
    if (highlightId) {
      const target = complaints.find((c) => c.id === highlightId);
      if (target) setSelectedComplaint(target);
    }
  }, [highlightId, complaints]);

  // Filter complaints for current citizen or related to current district
  const citizenComplaints = complaints.filter(
    (c) => c.citizenId === currentUser.id || c.district.toLowerCase() === (currentUser.district || "").toLowerCase()
  );

  const filtered = citizenComplaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.village.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "active") {
      return c.status === "Submitted" || c.status === "Assigned" || c.status === "In Progress" || c.status === "Reopened";
    }
    if (statusFilter === "verification") {
      return c.status === "Resolved" && !c.citizenVerification?.verified;
    }
    if (statusFilter === "resolved") {
      return c.status === "Resolved" || c.status === "Verified";
    }
    return true;
  });

  const awaitingVerification = citizenComplaints.filter(
    (c) => c.status === "Resolved" && !c.citizenVerification?.verified
  );

  const handleOpenVerifyModal = (complaint: Complaint, isYes: boolean) => {
    setVerifyingComplaint(complaint);
    setIsVerifyingYes(isYes);
    setVerificationFeedback("");
    setShowVerifyModal(true);
  };

  const handleConfirmVerification = () => {
    if (!verifyingComplaint) return;

    civicStore.verifyResolution(
      verifyingComplaint.id,
      isVerifyingYes,
      verificationFeedback.trim() || (isVerifyingYes ? "Issue is completely fixed on ground." : "Issue remains unresolved.")
    );

    if (isVerifyingYes) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    setShowVerifyModal(false);
    setVerifyingComplaint(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Welcome Banner with Fast Grievance CTA */}
      <div className="bg-[#064e3b] rounded-3xl text-white p-6 shadow-sm border border-emerald-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/15 text-emerald-100 font-semibold px-2.5 py-0.5 rounded-full border border-white/10">
              Citizen Portal • {currentUser.district}, Jharkhand
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-1 tracking-tight">Welcome, {currentUser.name}</h1>
          <p className="text-emerald-100/90 text-sm mt-0.5 max-w-xl leading-relaxed">
            Track and verify all civic problems reported by you and your neighborhood. Accountable, transparent governance powered by Samadhan Didi.
          </p>
        </div>

        <button
          onClick={() => onOpenSamadhanDidi()}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-2 cursor-pointer text-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Report New Grievance</span>
        </button>
      </div>

      {/* Awaiting Citizen Verification Notice Alert Box */}
      {awaitingVerification.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-950 text-sm">
                Action Required: {awaitingVerification.length} Complaint(s) Marked Resolved by Officers
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                The government department has submitted proof of work. Please verify if the problem has actually been fixed on the ground before closing the ticket.
              </p>

              <div className="mt-3 space-y-2">
                {awaitingVerification.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#064e3b]">{comp.id}</span> —{" "}
                      <span className="font-semibold text-slate-800">{comp.title}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Resolved by: {comp.resolutionProof?.officerName || "Department Field Unit"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenVerifyModal(comp, true)}
                        className="px-3 py-1.5 bg-[#064e3b] hover:bg-[#065f46] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>YES — Fixed</span>
                      </button>
                      <button
                        onClick={() => handleOpenVerifyModal(comp, false)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>NO — Reopen</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Complaint List & Detailed Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filters and Complaint Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, title, village or department..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-[#064e3b] outline-hidden bg-[#f8faf7]"
              />
            </div>

            <div className="flex items-center gap-1 text-xs overflow-x-auto">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "verification", label: `Verify (${awaitingVerification.length})` },
                { id: "resolved", label: "Resolved" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                    statusFilter === tab.id
                      ? "bg-[#064e3b] text-white font-bold"
                      : "bg-[#f0f2ef] hover:bg-[#e2e7e0] text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                No complaints found matching this filter.
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? "border-[#064e3b] ring-2 ring-[#064e3b]/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#064e3b] bg-[#f0f2ef] px-2 py-0.5 rounded border border-slate-200">
                            {c.id}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {c.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              c.status === "Resolved" || c.status === "Verified"
                                ? "bg-emerald-100 text-emerald-800"
                                : c.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : c.status === "Reopened" || c.status === "Escalated"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                        <p className="text-slate-600 text-xs line-clamp-2">{c.aiSummary || c.description}</p>
                      </div>

                      {c.photoUrl && (
                        <img
                          src={c.photoUrl}
                          alt="Photo"
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#064e3b]" />
                        <span>
                          {c.village}, {c.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-[#064e3b]">
                        <span>Details & Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Complaint Inspector & Verification */}
        <div className="lg:col-span-5">
          {selectedComplaint ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#064e3b]">
                    {selectedComplaint.id}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedComplaint.title}
                  </h2>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    selectedComplaint.status === "Verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedComplaint.status === "Resolved"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedComplaint.status}
                </span>
              </div>

              {/* Citizen Verification Prompt inside card */}
              {selectedComplaint.status === "Resolved" && !selectedComplaint.citizenVerification?.verified && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Citizen Verification Requested</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    The department marked this resolved. Please verify if the problem has actually been solved on the ground.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenVerifyModal(selectedComplaint, true)}
                      className="flex-1 py-1.5 bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs rounded-lg cursor-pointer shadow-2xs"
                    >
                      YES — Fixed
                    </button>
                    <button
                      onClick={() => handleOpenVerifyModal(selectedComplaint, false)}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-2xs"
                    >
                      NO — Reopen
                    </button>
                  </div>
                </div>
              )}

              {/* Resolution proof card if present */}
              {selectedComplaint.resolutionProof && (
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
                      Official Resolution Proof
                    </span>
                    <span className="text-[10px] text-emerald-700">
                      {new Date(selectedComplaint.resolutionProof.resolvedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 italic">
                    "{selectedComplaint.resolutionProof.note}"
                  </p>
                  {selectedComplaint.resolutionProof.photoUrl && (
                    <div className="rounded-lg overflow-hidden border border-emerald-200 max-h-44">
                      <img
                        src={selectedComplaint.resolutionProof.photoUrl}
                        alt="Proof"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 font-medium">
                    Verified by: {selectedComplaint.resolutionProof.officerName}
                  </div>
                </div>
              )}

              {/* Department & SLA Info */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">DEPARTMENT</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">EXPECTED RESOLUTION</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.expectedResolutionDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">SEVERITY PRIORITY</span>
                  <span className="font-bold text-amber-700">{selectedComplaint.severity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">COMMUNITY SUPPORT</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.supportersCount} Citizens</span>
                </div>
              </div>

              {/* Timeline Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Grievance Lifecycle Audit Timeline
                </h4>
                <div className="relative pl-5 border-l-2 border-emerald-200 space-y-4">
                  {selectedComplaint.timeline.map((step, idx) => (
                    <div key={step.id || idx} className="relative">
                      <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{step.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(step.timestamp).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          By: {step.actor} ({step.actorRole})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Select a complaint to inspect live resolution proof and full audit timeline.
            </div>
          )}
        </div>
      </div>

      {/* Citizen Verification Modal */}
      {showVerifyModal && verifyingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900">
              {isVerifyingYes ? "Confirm Problem Resolution (YES)" : "Report Issue Still Unresolved (NO)"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complaint: <span className="font-mono font-bold text-emerald-900">{verifyingComplaint.id}</span>
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isVerifyingYes
                  ? "Feedback or thank-you note (Optional):"
                  : "Please describe what is still broken or unresolved on the ground:"}
              </label>
              <textarea
                rows={3}
                value={verificationFeedback}
                onChange={(e) => setVerificationFeedback(e.target.value)}
                placeholder={
                  isVerifyingYes
                    ? "E.g., Street light repaired and glowing properly now. Thanks!"
                    : "E.g., Light was not repaired; the wires are still hanging."
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm cursor-pointer ${
                  isVerifyingYes ? "bg-emerald-700 hover:bg-emerald-800" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isVerifyingYes ? "Confirm Resolution" : "Reopen & Escalate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
