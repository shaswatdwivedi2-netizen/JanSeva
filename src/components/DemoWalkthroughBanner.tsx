import React, { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle2,
  Users,
  ShieldAlert,
  Flame,
  Layers,
  ArrowRight,
} from "lucide-react";
import { civicStore } from "../services/store";

interface DemoWalkthroughBannerProps {
  onStartScenario: (scenario: "street_light" | "scholarship" | "water_shortage" | "pension") => void;
  onNavigate: (view: string, extra?: any) => void;
}

export const DemoWalkthroughBanner: React.FC<DemoWalkthroughBannerProps> = ({
  onStartScenario,
  onNavigate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const demoSteps = [
    { num: 1, title: "1. Speak / Type", desc: "Citizen natural grievance in Hindi/English", action: () => onStartScenario("street_light") },
    { num: 2, title: "2. AI Questions", desc: "Samadhan Didi clarifies missing parameters", action: () => onStartScenario("street_light") },
    { num: 3, title: "3. Classification", desc: "Category, Severity & SLA evaluated", action: () => onStartScenario("street_light") },
    { num: 4, title: "4. Citizen Confirms", desc: "Complaint JSV-2026-00427 generated", action: () => onNavigate("citizen-dashboard") },
    { num: 5, title: "5. Officer Hub", desc: "Switch to Government Operations", action: () => { civicStore.switchRole("officer"); onNavigate("officer-dashboard"); } },
    { num: 6, title: "6. Heatmap & Clusters", desc: "Live Jharkhand density + 31 reports cluster", action: () => { civicStore.switchRole("officer"); onNavigate("officer-dashboard"); } },
    { num: 7, title: "7. Officer Action", desc: "Assign team -> Mark Resolved with photo proof", action: () => { civicStore.switchRole("officer"); onNavigate("officer-dashboard"); } },
    { num: 8, title: "8. Citizen Verify", desc: "Citizen verifies: YES - Fixed or NO - Reopen", action: () => { civicStore.switchRole("citizen"); onNavigate("citizen-dashboard"); } },
    { num: 9, title: "9. Public Transparency", desc: "Aggregated district SLAs & audit metrics", action: () => onNavigate("transparency") },
  ];

  return (
    <div className="bg-[#064e3b] text-white border-b border-emerald-900 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              SIH43 Jury Guided Flow
            </span>
            <span className="hidden md:inline text-xs text-emerald-100/90">
              3-5 Min Seamless Interactive Flow: Natural Input → AI Classification → Dept Routing → SLA Tracking → Resolution Proof → Citizen Verification → Transparency
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick 1-click preset triggers */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <button
                onClick={() => onStartScenario("street_light")}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-50 font-medium transition-colors cursor-pointer border border-white/15"
              >
                ⚡ Demo 1: Street Light
              </button>
              <button
                onClick={() => onStartScenario("scholarship")}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-50 font-medium transition-colors cursor-pointer border border-white/15"
              >
                🎓 Demo 2: Scholarship
              </button>
              <button
                onClick={() => onStartScenario("water_shortage")}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-50 font-medium transition-colors cursor-pointer border border-white/15"
              >
                💧 Demo 3: Water Cluster
              </button>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/15 text-xs font-semibold hover:bg-white/25 transition-colors cursor-pointer text-white"
            >
              <span>{expanded ? "Hide Steps" : "View 9-Step Guide"}</span>
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Step Pills */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-emerald-800/80 pb-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {demoSteps.map((step) => (
              <button
                key={step.num}
                onClick={() => {
                  setActiveStep(step.num);
                  step.action();
                }}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                  activeStep === step.num
                    ? "bg-amber-400 text-slate-950 border-amber-300 font-semibold shadow-xs"
                    : "bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 border-emerald-800/70"
                }`}
              >
                <div className="text-[11px] font-bold leading-tight flex items-center justify-between">
                  <span>{step.title}</span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </div>
                <div className={`text-[10px] mt-0.5 leading-snug line-clamp-2 ${activeStep === step.num ? "text-slate-800" : "text-emerald-300/80"}`}>
                  {step.desc}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
