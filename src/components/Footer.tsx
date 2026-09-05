import React from "react";
import { Shield, Sparkles, RotateCcw, ExternalLink } from "lucide-react";
import { civicStore } from "../services/store";

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenSamadhanDidi: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSamadhanDidi }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-100" />
              </div>
              <span className="font-black text-lg tracking-tight">JANSEVA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Powered by <strong>Samadhan Didi AI</strong>. An intelligent, problem-agnostic layer connecting citizens directly to accountable government departments across all 24 districts of Jharkhand.
            </p>
            <p className="text-emerald-400 font-serif italic text-xs">
              “Aapki Samasya, Samadhan ki Ore.”
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenSamadhanDidi()}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Talk to Samadhan Didi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("citizen-dashboard")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Citizen Grievances
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("officer-dashboard")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Officer Operations & Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("student-dashboard")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Student & Scholarship Cell
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("schemes")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Government Schemes Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("transparency")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Public Transparency Index
                </button>
              </li>
            </ul>
          </div>

          {/* Prototype Metadata & Reset */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              SIH43 Demonstration
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart India Hackathon SIH43 Prototype. Built with interactive reactive state simulation across all citizen, student, officer, and admin dashboards.
            </p>
            <div className="pt-2">
              <button
                onClick={() => civicStore.resetToFactoryDemo()}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset Demo Dataset</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <span>
            © 2026 JANSEVA • Government of Jharkhand Civic Redressal Prototype
          </span>
          <span>
            AI Powered • Problem-Agnostic • Citizen Verified
          </span>
        </div>
      </div>
    </footer>
  );
};
