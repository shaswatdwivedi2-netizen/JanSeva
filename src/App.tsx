import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { DemoWalkthroughBanner } from "./components/DemoWalkthroughBanner";
import { LandingPage } from "./components/LandingPage";
import { SamadhanDidiChat } from "./components/SamadhanDidiChat";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { UniversityDashboard } from "./components/UniversityDashboard";
import { OfficerDashboard } from "./components/OfficerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { SchemesDirectory } from "./components/SchemesDirectory";
import { CommunityVoice } from "./components/CommunityVoice";
import { TransparencyDashboard } from "./components/TransparencyDashboard";
import { Footer } from "./components/Footer";
import { civicStore } from "./services/store";
import { Complaint, UserRole } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [viewExtra, setViewExtra] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState(civicStore.getCurrentUser());

  useEffect(() => {
    return civicStore.subscribe(() => {
      setCurrentUser(civicStore.getCurrentUser());
    });
  }, []);

  const handleNavigate = (view: string, extra?: any) => {
    setCurrentView(view);
    setViewExtra(extra || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenSamadhanDidi = (initialPrompt?: string) => {
    setChatInitialPrompt(initialPrompt);
    setIsChatOpen(true);
  };

  const handleStartScenario = (scenario: "street_light" | "scholarship" | "water_shortage" | "pension") => {
    if (scenario === "street_light") {
      civicStore.switchRole("citizen");
      handleOpenSamadhanDidi("Hamare area mein street light pichle ek hafte se kharab hai.");
    } else if (scenario === "scholarship") {
      civicStore.switchRole("student");
      handleOpenSamadhanDidi("Meri e-Kalyan post matric scholarship ka payment 4 mahine se nahi aaya, verification complete hai.");
    } else if (scenario === "water_shortage") {
      civicStore.switchRole("citizen");
      handleOpenSamadhanDidi("Hamare gaon mein peene ke paani ki supply 4 din se band hai aur handpump kharab hai.");
    } else if (scenario === "pension") {
      civicStore.switchRole("citizen");
      handleOpenSamadhanDidi("Meri dadi ki vridha pension pichle 3 mahine se account mein nahi aayi hai.");
    }
  };

  const handleComplaintRegistered = (complaint: Complaint) => {
    // Keep chat open so user sees receipt, but prepare citizen view
    setViewExtra({ highlightId: complaint.id });
  };

  const handleViewComplaintFromChat = (complaintId: string) => {
    setIsChatOpen(false);
    handleNavigate("citizen-dashboard", { highlightId: complaintId });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-slate-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* SIH43 Jury Guided Flow Presentation Bar */}
      <DemoWalkthroughBanner
        onStartScenario={handleStartScenario}
        onNavigate={handleNavigate}
      />

      {/* Main Responsive Civic Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSamadhanDidi={handleOpenSamadhanDidi}
      />

      {/* Main Active Screen */}
      <main className="flex-1">
        {currentView === "landing" && (
          <LandingPage
            onOpenSamadhanDidi={handleOpenSamadhanDidi}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "citizen-dashboard" && (
          <CitizenDashboard
            onOpenSamadhanDidi={handleOpenSamadhanDidi}
            highlightId={viewExtra?.highlightId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "student-dashboard" && (
          <StudentDashboard
            onOpenSamadhanDidi={handleOpenSamadhanDidi}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "university-dashboard" && (
          <UniversityDashboard />
        )}

        {currentView === "officer-dashboard" && (
          <OfficerDashboard />
        )}

        {currentView === "admin-dashboard" && (
          <AdminDashboard />
        )}

        {currentView === "schemes" && (
          <SchemesDirectory
            onOpenSamadhanDidi={handleOpenSamadhanDidi}
          />
        )}

        {currentView === "community-voice" && (
          <CommunityVoice
            onOpenSamadhanDidi={handleOpenSamadhanDidi}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "transparency" && (
          <TransparencyDashboard />
        )}
      </main>

      {/* Global Civic Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSamadhanDidi={() => handleOpenSamadhanDidi()}
      />

      {/* Full-Screen / Modal Samadhan Didi Conversational Experience */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 lg:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-full max-h-[92vh] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <SamadhanDidiChat
              initialPrompt={chatInitialPrompt}
              onClose={() => setIsChatOpen(false)}
              onComplaintRegistered={handleComplaintRegistered}
              onViewComplaint={handleViewComplaintFromChat}
            />
          </div>
        </div>
      )}
    </div>
  );
}
