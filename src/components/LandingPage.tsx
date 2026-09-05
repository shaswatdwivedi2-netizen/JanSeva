import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Shield,
  ArrowRight,
  Mic,
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  Users,
  Flame,
  Search,
  Building,
  GraduationCap,
  Briefcase,
  HelpCircle,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { UserRole } from "../types";
import { civicStore, DEMO_USERS } from "../services/store";
import { t } from "../translations";

interface LandingPageProps {
  onOpenSamadhanDidi: (prompt?: string) => void;
  onNavigate: (view: string, extra?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSamadhanDidi,
  onNavigate,
}) => {
  const [quickInput, setQuickInput] = useState("");
  const [language, setLanguage] = useState(civicStore.getLanguage());
  const stats = civicStore.getAggregatedStats();

  useEffect(() => {
    return civicStore.subscribe(() => {
      setLanguage(civicStore.getLanguage());
    });
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onOpenSamadhanDidi(quickInput.trim());
    }
  };

  const PROMPT_SUGGESTIONS_EN = [
    "Street light in our lane is broken for over a week",
    "My e-Kalyan post-matric scholarship payment is pending for 4 months",
    "Drinking water handpump in our village has stopped working",
    "My grandmother's old age pension has not been credited",
    "PDS ration shop dealer is distributing less grain than quota",
    "Which state government schemes are available for college students?",
  ];

  const PROMPT_SUGGESTIONS_HI = [
    "हमारे मोहल्ले की स्ट्रीट लाइट पिछले एक हफ्ते से खराब है",
    "मेरी ई-कल्याण पोस्ट मैट्रिक छात्रवृत्ति का भुगतान 4 महीने से नहीं आया",
    "गांव में पीने के पानी का हैंडपंप खराब हो गया है",
    "मेरी दादी की वृद्धा पेंशन बैंक खाते में नहीं आई",
    "पीडीएस राशन डीलर तय कोटे से कम अनाज दे रहा है",
    "कॉलेज छात्रों के लिए राज्य सरकार की कौनसी योजनाएं उपलब्ध हैं?",
  ];

  const activeSuggestions = language === "hi" ? PROMPT_SUGGESTIONS_HI : PROMPT_SUGGESTIONS_EN;

  const PROBLEM_DOMAINS = [
    { name: "Electricity", hindi: "बिजली आपूर्ति", count: 42, icon: "⚡" },
    { name: "Water Supply", hindi: "पेयजल एवं स्वच्छता", count: 38, icon: "💧" },
    { name: "Roads & Bridges", hindi: "सड़क एवं गड्ढे", count: 29, icon: "🛣️" },
    { name: "Scholarships", hindi: "ई-कल्याण छात्रवृत्ति", count: 24, icon: "🎓" },
    { name: "Social Pensions", hindi: "वृद्धा / विधवा पेंशन", count: 21, icon: "👵" },
    { name: "Ration & PDS", hindi: "खाद्य आपूर्ति एवं राशन", count: 18, icon: "🌾" },
    { name: "Public Health", hindi: "स्वास्थ्य केंद्र एवं दवा", count: 16, icon: "🏥" },
    { name: "Sanitation", hindi: "कचरा एवं सफाई", count: 15, icon: "🧹" },
  ];

  const HOW_IT_WORKS_STEPS = [
    {
      step: "01",
      title: t("step1Title", language),
      desc: t("step1Desc", language),
    },
    {
      step: "02",
      title: t("step2Title", language),
      desc: t("step2Desc", language),
    },
    {
      step: "03",
      title: t("step3Title", language),
      desc: t("step3Desc", language),
    },
    {
      step: "04",
      title: t("step4Title", language),
      desc: t("step4Desc", language),
    },
    {
      step: "05",
      title: t("step5Title", language),
      desc: t("step5Desc", language),
    },
    {
      step: "06",
      title: t("step6Title", language),
      desc: t("step6Desc", language),
    },
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-12 pb-16 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Tagline Badges */}
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300 text-emerald-950 px-3.5 py-1 rounded-full text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{t("problemAgnosticBanner", language)}</span>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {t("appName", language)}
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#064e3b] mt-2 font-serif">
                {language === "hi" ? "“आपकी समस्या, समाधान की ओर।”" : "“Aapki Samasya, Samadhan ki Ore.”"}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t("bringAnyGrievance", language)}
            </p>
          </div>

          {/* Conversational Input Hero Box */}
          <div className="max-w-3xl mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-xl border-2 border-emerald-500/80">
            <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder={
                    language === "hi"
                      ? "अपनी समस्या अपने शब्दों में लिखें या बोलें..."
                      : "Describe your problem in your own words, speak or type..."
                  }
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#064e3b] outline-hidden bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onOpenSamadhanDidi()}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] rounded-xl cursor-pointer transition-colors border border-emerald-200"
                  title={t("speak", language)}
                >
                  <Mic className="w-5 h-5 text-[#064e3b]" />
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial py-3 px-6 bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{t("talkToSamadhanDidi", language)}</span>
                </button>
              </div>
            </form>

            {/* Quick Chips */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-left text-xs pb-1">
              <span className="text-slate-400 font-semibold shrink-0 text-[11px]">
                {language === "hi" ? "उदाहरण क्लिक करें:" : "Try clicking:"}
              </span>
              {activeSuggestions.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onOpenSamadhanDidi(prompt)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors cursor-pointer shrink-0 truncate max-w-xs"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Live System Numbers Strip */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {language === "hi" ? "कुल शिकायतें" : "Total Grievances"}
              </span>
              <span className="text-xl font-black text-slate-900">
                {stats.total} {language === "hi" ? "दर्ज" : "Logged"}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                {t("verifiedByCitizen", language)}
              </span>
              <span className="text-xl font-black text-emerald-700">
                {stats.resolved} {language === "hi" ? "सुलझाई" : "Resolved"}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-blue-600 block">
                {language === "hi" ? "औसत निवारण समय" : "Avg Resolution SLA"}
              </span>
              <span className="text-xl font-black text-blue-700">
                {stats.avgResolutionDays} {language === "hi" ? "दिन" : "Days"}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">
                {t("slaComplianceRate", language)}
              </span>
              <span className="text-xl font-black text-amber-700">{stats.slaComplianceRate}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Role Login Experience for SIH Evaluation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {language === "hi" ? "SIH43 त्वरित भूमिका चयन" : "SIH43 Jury Quick Access"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === "hi"
              ? "बहु-भूमिका से जुड़ा समन्वित प्रोटोटाइप अनुभव"
              : "Multi-Role Connected Prototype Experience"}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            {language === "hi"
              ? "किसी भी भूमिका में तुरंत स्विच करें। एक भूमिका में किया गया कार्य अन्य सभी डैशबोर्ड पर तुरंत दिखाई देता है।"
              : "Switch between roles instantly. Every action in one role reflects in real time across all other dashboards."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(["citizen", "student", "university", "officer", "admin"] as UserRole[]).map((r) => {
            const demo = DEMO_USERS[r];
            const roleName =
              language === "hi"
                ? r === "citizen"
                  ? "नागरिक (Citizen)"
                  : r === "student"
                  ? "छात्र (Student)"
                  : r === "university"
                  ? "संस्थान (University)"
                  : r === "officer"
                  ? "शासकीय अधिकारी (Officer)"
                  : "राज्य प्रशासन (Admin)"
                : r;
            return (
              <div
                key={r}
                onClick={() => {
                  civicStore.switchRole(r);
                  if (r === "citizen") onNavigate("citizen-dashboard");
                  else if (r === "student") onNavigate("student-dashboard");
                  else if (r === "university") onNavigate("university-dashboard");
                  else if (r === "officer") onNavigate("officer-dashboard");
                  else if (r === "admin") onNavigate("admin-dashboard");
                }}
                className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold uppercase text-sm mb-3 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                    {r[0]}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm capitalize">{roleName}</h3>
                  <p className="text-emerald-800 text-xs font-semibold">{demo.name}</p>
                  <p className="text-slate-500 text-[11px] mt-1 leading-snug">
                    {r === "citizen" &&
                      (language === "hi"
                        ? "समस्या दर्ज करें, ट्रैक करें और जमीनी समाधान की पुष्टि हाँ/नहीं में करें।"
                        : "Submit & track issues, verify ground fixes with YES/NO.")}
                    {r === "student" &&
                      (language === "hi"
                        ? "छात्रवृत्ति विलंब, विश्वविद्यालय हॉस्टल एवं परीक्षा संबंधित शिकायतें।"
                        : "Scholarship delays, university hostel & exam issues.")}
                    {r === "university" &&
                      (language === "hi"
                        ? "आंतरिक परिसर टिकट एवं ई-कल्याण छात्र बोनाफाइड सत्यापन।"
                        : "Internal campus tickets & e-Kalyan student bonafide.")}
                    {r === "officer" &&
                      (language === "hi"
                        ? "लाइव हीटमैप, SLA कार्य आवंटन एवं समाधान फोटो साक्ष्य अपलोड।"
                        : "Heatmap, SLA dispatch & photo proof upload.")}
                    {r === "admin" &&
                      (language === "hi"
                        ? "राज्यव्यापी सुशासन, विभाग कॉन्फ़िगरेशन एवं निष्पक्ष ऑडिट।"
                        : "Statewide governance, category configuration & audits.")}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#064e3b] group-hover:text-emerald-950">
                  <span>{language === "hi" ? "डैशबोर्ड खोलें" : "Launch View"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem-Agnostic Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
              {language === "hi" ? "सार्वभौमिक जन-समस्या दायरा" : "Universal Civic Scope"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {language === "hi"
                ? "सिर्फ पानी या सड़क ही नहीं, कोई भी वास्तविक जन-समस्या।"
                : "Not Just Water. Not Just Roads. Any Genuine Civic Grievance."}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {language === "hi"
                ? "पारंपरिक पोर्टल नागरिकों को जटिल विभागों में उलझाते हैं। समाधान दीदी पूरी तरह समस्या-अज्ञेय (problem-agnostic) है: पेंशन रुकने से लेकर बिजली ट्रांसफार्मर तक कोई भी बात कहें, AI इसे संबंधित जिम्मेदार प्राधिकारी तक पहुंचाएगा।"
                : "Traditional grievance apps force citizens into rigid department silos. Samadhan Didi is completely problem-agnostic: bring any issue from pension stoppage to damaged transformers, and the AI routes it to the exact accountable authority."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROBLEM_DOMAINS.map((dom) => (
              <div
                key={dom.name}
                onClick={() =>
                  onOpenSamadhanDidi(
                    language === "hi"
                      ? `मेरी समस्या ${dom.hindi} से जुड़ी हुई है...`
                      : `My grievance is regarding ${dom.name}...`
                  )
                }
                className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 cursor-pointer transition-all space-y-1"
              >
                <div className="text-2xl">{dom.icon}</div>
                <div className="font-bold text-white text-xs sm:text-sm">
                  {language === "hi" ? dom.hindi : dom.name}
                </div>
                <div className="text-[11px] text-emerald-300">
                  {language === "hi" ? dom.name : dom.hindi}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How JANSEVA Works (6 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {language === "hi" ? "कार्यप्रणाली एवं चरण" : "Architecture & Workflow"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t("howItWorks", language)}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            {language === "hi"
              ? "नागरिक के पहले सहज शब्द से लेकर जमीनी स्तर पर सत्यापित समाधान तक।"
              : "From the citizen’s first natural spoken word to verified on-ground completion."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative"
            >
              <span className="text-2xl font-black text-emerald-200 block font-mono">
                {step.step}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-[#064e3b] to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">
            {language === "hi"
              ? "सुगम एवं त्वरित नागरिक समाधान का अनुभव करें"
              : "Ready to experience next-generation civic governance?"}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {language === "hi"
              ? "अपनी समस्या दर्ज करें, लाइव समय-सीमा ट्रैक करें या समाधान की मौके पर पुष्टि करें।"
              : "Report an issue, track live SLA countdowns, or verify municipal fixes in real time."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => onOpenSamadhanDidi()}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{t("talkToSamadhanDidi", language)}</span>
            </button>
            <button
              onClick={() => onNavigate("transparency")}
              className="px-6 py-3 bg-emerald-950/80 hover:bg-emerald-950 text-white font-semibold rounded-xl border border-emerald-600 cursor-pointer transition-colors text-sm"
            >
              {t("transparency", language)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
