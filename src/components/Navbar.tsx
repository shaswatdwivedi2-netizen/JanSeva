import React, { useState, useEffect } from "react";
import {
  Shield,
  Bell,
  Globe,
  User,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { UserRole, CivicNotification } from "../types";
import { civicStore, DEMO_USERS } from "../services/store";
import { t } from "../translations";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  onOpenSamadhanDidi: (initialPrompt?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSamadhanDidi,
}) => {
  const [currentUser, setCurrentUser] = useState(civicStore.getCurrentUser());
  const [language, setLanguage] = useState(civicStore.getLanguage());
  const [notifications, setNotifications] = useState(civicStore.getNotifications());
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return civicStore.subscribe(() => {
      setCurrentUser(civicStore.getCurrentUser());
      setLanguage(civicStore.getLanguage());
      setNotifications(civicStore.getNotifications());
    });
  }, []);

  const unreadNotifs = notifications.filter(
    (n) => !n.read && (n.targetRole === "all" || n.targetRole === currentUser.role || n.userId === currentUser.id)
  );

  const handleRoleChange = (role: UserRole) => {
    civicStore.switchRole(role);
    setShowRoleMenu(false);
    // Route to appropriate initial dashboard
    if (role === "citizen") onNavigate("citizen-dashboard");
    else if (role === "student") onNavigate("student-dashboard");
    else if (role === "university") onNavigate("university-dashboard");
    else if (role === "officer") onNavigate("officer-dashboard");
    else if (role === "admin") onNavigate("admin-dashboard");
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    civicStore.setLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Govt of Jharkhand & SIH43 Ribbon in Natural Deep Tone */}
      <div className="bg-[#064e3b] text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-emerald-100">
            {t("govtJharkhandBanner", language)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block bg-white/10 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-100 border border-white/15">
            {t("sihBadge", language)}
          </span>
          <button
            onClick={() => civicStore.resetToFactoryDemo()}
            title="Reset to fresh demo dataset"
            className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px]">{t("resetData", language)}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#064e3b] flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-700/40 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#064e3b] font-sans">
                  {t("appName", language)}
                </span>
                <span className="text-[10px] bg-emerald-100 text-[#064e3b] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  AI Core
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400 inline" />
                <span>{language === "hi" ? "समाधान दीदी AI" : "Samadhan Didi AI"}</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate("landing")}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === "landing"
                  ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                  : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
              }`}
            >
              {t("home", language)}
            </button>

            {/* Quick conversational launch */}
            <button
              onClick={() => onOpenSamadhanDidi()}
              className="px-3 py-2 rounded-lg text-[#064e3b] font-bold bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{t("samadhanDidi", language)}</span>
            </button>

            {currentUser.role === "citizen" && (
              <button
                onClick={() => onNavigate("citizen-dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === "citizen-dashboard"
                    ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                    : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
                }`}
              >
                {t("myComplaints", language)}
              </button>
            )}

            {currentUser.role === "student" && (
              <button
                onClick={() => onNavigate("student-dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === "student-dashboard"
                    ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                    : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
                }`}
              >
                {t("studentDashboard", language)}
              </button>
            )}

            {currentUser.role === "university" && (
              <button
                onClick={() => onNavigate("university-dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === "university-dashboard"
                    ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                    : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
                }`}
              >
                {t("universityDashboard", language)}
              </button>
            )}

            {(currentUser.role === "officer" || currentUser.role === "admin") && (
              <button
                onClick={() => onNavigate("officer-dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === "officer-dashboard"
                    ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                    : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
                }`}
              >
                {t("governmentOperations", language)}
              </button>
            )}

            {currentUser.role === "admin" && (
              <button
                onClick={() => onNavigate("admin-dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === "admin-dashboard"
                    ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                    : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
                }`}
              >
                {t("adminDashboard", language)}
              </button>
            )}

            <button
              onClick={() => onNavigate("schemes")}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === "schemes"
                  ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                  : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
              }`}
            >
              {t("governmentSchemes", language)}
            </button>

            <button
              onClick={() => onNavigate("community-voice")}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === "community-voice"
                  ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                  : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
              }`}
            >
              {t("communityVoice", language)}
            </button>

            <button
              onClick={() => onNavigate("transparency")}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === "transparency"
                  ? "text-[#064e3b] bg-[#f0f2ef] font-bold"
                  : "hover:text-[#064e3b] hover:bg-[#f8faf7]"
              }`}
            >
              {t("transparency", language)}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* System Status Pill */}
            <span className="hidden xl:inline-flex items-center gap-1.5 bg-emerald-100 text-[#064e3b] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {t("systemLive", language)}
            </span>

            {/* Quick Action Button */}
            <button
              onClick={() => onOpenSamadhanDidi()}
              className="bg-[#064e3b] hover:bg-[#065f46] text-white px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{t("newProblem", language)}</span>
            </button>

            {/* Dual Segmented Language Toggle */}
            <div
              role="group"
              aria-label={t("languageLabel", language)}
              className="flex items-center bg-[#f0f2ef] p-0.5 rounded-lg border border-slate-200"
            >
              <div className="pl-1.5 pr-1 text-[#064e3b] hidden sm:block" aria-hidden="true">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <button
                type="button"
                onClick={() => civicStore.setLanguage("en")}
                aria-pressed={language === "en"}
                title="Switch interface to English"
                className={`px-2 sm:px-2.5 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-[#064e3b] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span className="hidden sm:inline">English</span>
                <span className="sm:hidden">EN</span>
              </button>
              <button
                type="button"
                onClick={() => civicStore.setLanguage("hi")}
                aria-pressed={language === "hi"}
                title="इंटरफ़ेस हिंदी में बदलें (Switch to Hindi)"
                className={`px-2 sm:px-2.5 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-[#064e3b] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 transition-colors relative cursor-pointer"
                title={t("notifications", language)}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">
                      {t("notifications", language)} ({unreadNotifs.length})
                    </span>
                    <button
                      onClick={() => civicStore.clearAllNotifications()}
                      className="text-xs text-emerald-700 hover:underline cursor-pointer"
                    >
                      {t("clearAll", language)}
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {t("noNotifs", language)}
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            civicStore.markNotificationRead(n.id);
                            if (n.complaintId) {
                              onNavigate("citizen-dashboard", { highlightId: n.complaintId });
                            }
                            setShowNotifMenu(false);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? "bg-emerald-50/40" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {n.type === "verification" && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                              {n.type === "sla" && <Flame className="w-3.5 h-3.5 text-red-500" />}
                              {n.type === "complaint" && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Demo Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-[#f0f2ef] border border-slate-200 text-[#064e3b] hover:bg-[#e2e7e0] transition-colors cursor-pointer text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-[#064e3b] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {currentUser.role[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="leading-tight capitalize font-bold">
                    {language === "hi"
                      ? currentUser.role === "citizen"
                        ? "नागरिक"
                        : currentUser.role === "student"
                        ? "छात्र"
                        : currentUser.role === "university"
                        ? "संस्थान"
                        : currentUser.role === "officer"
                        ? "अधिकारी"
                        : "प्रशासक"
                      : currentUser.role}
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal truncate max-w-[100px]">
                    {currentUser.name.split(" ")[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#064e3b]" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {t("switchRoleDemo", language)}
                    </span>
                  </div>
                  <div className="p-1 space-y-0.5 text-xs">
                    {(["citizen", "student", "university", "officer", "admin"] as UserRole[]).map((r) => {
                      const demo = DEMO_USERS[r];
                      const isActive = currentUser.role === r;
                      const roleLabel =
                        language === "hi"
                          ? r === "citizen"
                            ? "नागरिक (Citizen)"
                            : r === "student"
                            ? "छात्र (Student)"
                            : r === "university"
                            ? "संस्थान (Institution)"
                            : r === "officer"
                            ? "शासकीय अधिकारी (Officer)"
                            : "राज्य प्रशासन (Admin)"
                          : r.toUpperCase();
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(r)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
                              ? "bg-[#064e3b] text-white font-semibold"
                              : "hover:bg-[#f0f2ef] text-slate-700"
                          }`}
                        >
                          <div>
                            <div className="capitalize font-medium">{roleLabel}</div>
                            <div className={`text-[10px] ${isActive ? "text-emerald-100" : "text-slate-400"}`}>
                              {demo.name}
                            </div>
                          </div>
                          {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-200" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 text-sm font-medium">
          {/* Mobile Language Switcher */}
          <div className="p-3 mb-2 bg-[#f0f2ef] rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Globe className="w-4 h-4 text-[#064e3b]" />
              <span>{t("languageLabel", language)}</span>
            </div>
            <div className="inline-flex bg-white rounded-lg p-0.5 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => civicStore.setLanguage("en")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  language === "en" ? "bg-[#064e3b] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => civicStore.setLanguage("hi")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  language === "hi" ? "bg-[#064e3b] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigate("landing");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t("home", language)}
          </button>
          <button
            onClick={() => {
              onOpenSamadhanDidi();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 text-[#064e3b] font-semibold flex items-center gap-2 border border-emerald-200"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            {t("talkToSamadhanDidi", language)}
          </button>
          <button
            onClick={() => {
              onNavigate("citizen-dashboard");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t("myComplaints", language)}
          </button>
          <button
            onClick={() => {
              onNavigate("officer-dashboard");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t("governmentOperations", language)}
          </button>
          <button
            onClick={() => {
              onNavigate("schemes");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t("governmentSchemes", language)}
          </button>
          <button
            onClick={() => {
              onNavigate("community-voice");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t("communityVoice", language)}
          </button>
          <button
            onClick={() => {
              onNavigate("transparency");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            {t("transparency", language)}
          </button>
        </div>
      )}
    </header>
  );
};
