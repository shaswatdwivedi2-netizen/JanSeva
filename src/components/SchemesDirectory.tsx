import React, { useState } from "react";
import {
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle,
  FileText,
  Users,
  Building,
  Tag,
  ArrowRight,
} from "lucide-react";
import { GOVERNMENT_SCHEMES } from "../mockData/schemes";
import { GovernmentScheme } from "../types";

interface SchemesDirectoryProps {
  onOpenSamadhanDidi: (prompt?: string) => void;
}

export const SchemesDirectory: React.FC<SchemesDirectoryProps> = ({ onOpenSamadhanDidi }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAudience, setSelectedAudience] = useState<string>("All");
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  const categories = [
    "All",
    "Education & Scholarships",
    "Social Welfare & Pension",
    "Agriculture",
    "Women & Child",
    "Healthcare",
    "Housing",
  ];

  const audiences = ["All", "Students", "Farmers", "Senior Citizens", "Women", "Tribal", "Youth"];

  const filtered = GOVERNMENT_SCHEMES.filter((s) => {
    if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
    if (selectedAudience !== "All" && !s.targetAudience.includes(selectedAudience)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.eligibility.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Citizen Entitlements & Public Welfare
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Jharkhand Government Schemes & Scholarships
        </h1>
        <p className="text-slate-600 text-sm">
          Discover all state and central welfare initiatives tailored for students, farmers, senior citizens, and marginalized communities.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search schemes by name, keyword, eligibility or benefits..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-slate-400 font-semibold shrink-0">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors shrink-0 ${
                  selectedCategory === c
                    ? "bg-emerald-800 text-white font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Audience Filter */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            <span className="text-slate-400 font-semibold">Audience:</span>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-hidden"
            >
              {audiences.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/60">
                  {scheme.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{scheme.department}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">{scheme.name}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{scheme.shortDescription}</p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                <div className="text-slate-700">
                  <strong className="text-slate-900">Eligibility:</strong> {scheme.eligibility}
                </div>
                <div className="text-emerald-800 font-medium">
                  <strong className="text-emerald-950">Benefits:</strong> {scheme.benefits}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  onOpenSamadhanDidi(
                    `Mujhe "${scheme.name}" ke baare mein jankari chahiye aur main isme kaise apply kar sakta hoon?`
                  )
                }
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Ask Samadhan Didi about this Scheme</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedScheme(scheme)}
                  className="text-slate-600 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  View Details & Documents →
                </button>
                {scheme.link && (
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedScheme.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedScheme.name}</h3>
                <p className="text-xs text-slate-500">{selectedScheme.department}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Detailed Description:</span>
                <p className="text-slate-600 leading-relaxed">{selectedScheme.shortDescription}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-0.5">Key Financial / Material Benefits:</span>
                <p className="text-emerald-900 font-medium">{selectedScheme.benefits}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Required Documents:</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  {selectedScheme.requiredDocuments.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Application Procedure:</span>
                <p className="text-slate-600">{selectedScheme.howToApply}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedScheme;
                  setSelectedScheme(null);
                  onOpenSamadhanDidi(`Main ${s.name} ke liye apply karna chahta hoon, meri help karo.`);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Apply with Samadhan Didi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
