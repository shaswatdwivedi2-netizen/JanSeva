import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Mic,
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
  Building,
  Calendar,
  Clock,
  Info,
  X,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { AIClassification, Complaint, GovernmentScheme, UserProfile } from "../types";
import { civicStore } from "../services/store";
import {
  askClarifyingQuestion,
  classifyComplaint,
  ConversationMessage,
  recommendSchemes,
  callGeminiIfAvailable,
} from "../services/aiService";
import { LocationPickerModal } from "./LocationPickerModal";
import { PhotoUploadModal } from "./PhotoUploadModal";
import { SpeechSimulationModal } from "./SpeechSimulationModal";

interface SamadhanDidiChatProps {
  initialPrompt?: string;
  onClose?: () => void;
  onComplaintRegistered?: (complaint: Complaint) => void;
  onViewComplaint?: (complaintId: string) => void;
}

export const SamadhanDidiChat: React.FC<SamadhanDidiChatProps> = ({
  initialPrompt,
  onClose,
  onComplaintRegistered,
  onViewComplaint,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(civicStore.getCurrentUser());
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  // Attachments state
  const [activeLocation, setActiveLocation] = useState<{
    state: string;
    district: string;
    block: string;
    village: string;
    coordinates: { lat: number; lng: number };
  }>({
    state: "Jharkhand",
    district: currentUser.district || "Bokaro",
    block: currentUser.block || "Chas",
    village: currentUser.village || "Kura",
    coordinates: { lat: 23.6693, lng: 86.1511 },
  });

  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

  // Modals
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSpeechModal, setShowSpeechModal] = useState(false);

  // Pending classification awaiting confirmation
  const [pendingClassification, setPendingClassification] = useState<AIClassification | null>(null);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    const welcomeText =
      civicStore.getLanguage() === "hi"
        ? "नमस्ते! मैं समाधान दीदी हूँ। आप मुझे अपनी समस्या अपने शब्दों में बेझिझक बता सकते हैं — चाहे वह पानी, बिजली, सड़क, राशन, छात्रवृत्ति, पेंशन, या कोई अन्य सरकारी सेवा हो।"
        : "Namaste! I am Samadhan Didi. Tell me your civic issue or problem in your own words — whether it is water, electricity, roads, scholarships, pensions, or any government service.";

    setMessages([
      {
        id: "msg-welcome",
        sender: "ai",
        text: welcomeText,
        timestamp: new Date().toISOString(),
        options: [
          "Hamare area mein street light kharab hai",
          "Meri e-Kalyan scholarship ka payment nahi aaya",
          "Gaon mein peene ke paani ki pipeline phoot gayi hai",
          "Mere liye kaunsi government scheme hai?",
        ],
      },
    ]);

    if (initialPrompt) {
      setTimeout(() => {
        handleSend(initialPrompt);
      }, 400);
    }
  }, [initialPrompt]);

  const handleSend = async (userText?: string) => {
    const text = (userText || inputText).trim();
    if (!text && !activePhotoUrl) return;

    setInputText("");

    const userMsg: ConversationMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "citizen",
      text: text || "Attached photo of problem",
      timestamp: new Date().toISOString(),
      photoUrl: activePhotoUrl || undefined,
      location: activeLocation,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    // Check if user is asking for schemes
    const lower = text.toLowerCase();
    if (lower.includes("kaunsi government scheme") || lower.includes("scheme chahiye") || lower.includes("scholarship chahiye") || lower.includes("recommended scheme")) {
      const schemes = recommendSchemes({
        isStudent: currentUser.role === "student" || lower.includes("student") || lower.includes("b.tech"),
        query: text,
      });

      setTimeout(() => {
        setIsTyping(false);
        const replyText =
          civicStore.getLanguage() === "hi"
            ? "मैंने आपकी प्रोफाइल और आवश्यकता के अनुसार झारखण्ड सरकार एवं भारत सरकार की सबसे उपयुक्त योजनाओं की पहचान की है:"
            : "Based on your profile and query, here are the most relevant government schemes and scholarships for you:";

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-ai`,
            sender: "ai",
            text: replyText,
            timestamp: new Date().toISOString(),
            recommendedSchemes: schemes.map((s) => s.scheme),
          },
        ]);
      }, 700);
      return;
    }

    // Check if AI should ask a clarifying question
    const clarCheck = askClarifyingQuestion(text, currentTurn, activeLocation);
    if (clarCheck.needsQuestion) {
      setTimeout(() => {
        setIsTyping(false);
        const qText = civicStore.getLanguage() === "hi" ? clarCheck.questionHindi : clarCheck.questionEnglish;
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-ai`,
            sender: "ai",
            text: qText,
            timestamp: new Date().toISOString(),
            options: clarCheck.options,
          },
        ]);
      }, 650);
      return;
    }

    // Try server Gemini if available
    let geminiReply = await callGeminiIfAvailable(text, messages, { location: activeLocation, user: currentUser });

    // Perform structured AI classification
    const existingCount = civicStore.getComplaints().filter((c) => c.district.toLowerCase() === activeLocation.district.toLowerCase()).length;
    const classification = classifyComplaint(text, activeLocation, activePhotoUrl || undefined, Math.min(24, existingCount));

    setPendingClassification(classification);

    setTimeout(() => {
      setIsTyping(false);
      const ackText =
        civicStore.getLanguage() === "hi"
          ? "मैंने आपकी समस्या को समझ लिया है और इसका प्राथमिक विश्लेषण तैयार किया है। क्या मैं इस समस्या की आधिकारिक शिकायत दर्ज कर दूँ?"
          : "I have understood your problem and generated an intelligent classification. Would you like me to register an official complaint for this issue?";

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: geminiReply ? `${geminiReply}\n\n${ackText}` : ackText,
          timestamp: new Date().toISOString(),
          classification,
          showConfirmationButtons: true,
        },
      ]);
    }, 800);
  };

  // Register complaint after citizen confirmation
  const handleConfirmRegister = () => {
    if (!pendingClassification) return;

    const newComplaint = civicStore.createComplaint({
      title: `${pendingClassification.subcategory} at ${activeLocation.village}, ${activeLocation.block}`,
      description: messages.filter((m) => m.sender === "citizen").map((m) => m.text).join(" | "),
      aiSummary: pendingClassification.problemSummary,
      category: pendingClassification.category,
      subcategory: pendingClassification.subcategory,
      severity: pendingClassification.severity,
      severityReason: pendingClassification.severityReason,
      district: activeLocation.district,
      block: activeLocation.block,
      village: activeLocation.village,
      coordinates: activeLocation.coordinates,
      photoUrl: activePhotoUrl || undefined,
      department: pendingClassification.department,
      expectedResolutionDate: pendingClassification.expectedResolutionDate,
    });

    setCreatedComplaint(newComplaint);
    setPendingClassification(null);

    const successMsg: ConversationMessage = {
      id: `msg-${Date.now()}-success`,
      sender: "ai",
      text:
        civicStore.getLanguage() === "hi"
          ? `बधाई हो! आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। शिकायत संख्या (Complaint ID): ${newComplaint.id}`
          : `Success! Your grievance has been registered. Complaint ID: ${newComplaint.id}`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, successMsg]);

    if (onComplaintRegistered) {
      onComplaintRegistered(newComplaint);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faf7] relative overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-[#064e3b] text-white px-4 py-3 sm:px-6 shadow-xs flex items-center justify-between z-10 border-b border-emerald-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
            <Sparkles className="w-6 h-6 fill-amber-400 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Samadhan Didi AI</h2>
              <span className="bg-white/15 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 text-emerald-100">
                Civic Assistant
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-tight">
              “Aapki Samasya, Samadhan ki Ore / Your Problem. One Intelligent Path to Resolution.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Attachment Pills Bar */}
      <div className="bg-[#f0f2ef] border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Location badge */}
          <button
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-white cursor-pointer font-medium text-slate-700"
          >
            <MapPin className="w-3.5 h-3.5 text-[#064e3b] shrink-0" />
            <span>
              {activeLocation.village}, {activeLocation.block}, {activeLocation.district}
            </span>
          </button>

          {/* Photo badge */}
          {activePhotoUrl ? (
            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-[#064e3b]" />
              <span className="font-medium text-[#064e3b]">Photo Attached</span>
              <button
                onClick={() => setActivePhotoUrl(null)}
                className="text-slate-400 hover:text-red-500 ml-1 cursor-pointer"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPhotoModal(true)}
              className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md border border-slate-200 hover:bg-white text-slate-600 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Photo (Optional)</span>
            </button>
          )}
        </div>

        <span className="text-[11px] text-[#064e3b] font-bold hidden sm:inline">
          Problem-Agnostic AI Grievance Engine
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "citizen" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-start gap-2.5 max-w-xl">
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#064e3b] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                  msg.sender === "citizen"
                    ? "bg-[#064e3b] text-white rounded-tr-none"
                    : "bg-white text-slate-900 border border-slate-200 rounded-tl-none"
                }`}
              >
                {/* Text */}
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Attached Photo in message */}
                {msg.photoUrl && (
                  <div className="mt-2.5 rounded-lg overflow-hidden border border-white/20 max-w-xs">
                    <img src={msg.photoUrl} alt="Evidence" className="w-full h-36 object-cover" />
                  </div>
                )}

                {/* Suggested Quick Reply Options */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(opt)}
                        className="px-3 py-1.5 rounded-lg bg-[#f0f2ef] hover:bg-emerald-50 text-[#064e3b] text-xs font-semibold border border-slate-200 transition-colors cursor-pointer text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* AI Structured Classification Card */}
                {msg.classification && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-[#064e3b]" />
                        <span className="font-bold text-xs uppercase tracking-wider text-[#064e3b]">
                          AI Analysis Result
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#064e3b] bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        {msg.classification.confidence}% Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg shadow-xs border border-emerald-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Category</span>
                        <span className="font-bold text-[#064e3b] text-xs">{msg.classification.category}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg shadow-xs border border-emerald-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Subcategory</span>
                        <span className="font-semibold text-slate-800 text-xs">{msg.classification.subcategory}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg shadow-xs border border-emerald-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Severity</span>
                        <span
                          className={`inline-block font-bold text-xs uppercase ${
                            msg.classification.severity === "Critical"
                              ? "text-red-600"
                              : msg.classification.severity === "High"
                              ? "text-orange-600"
                              : "text-[#064e3b]"
                          }`}
                        >
                          {msg.classification.severity}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg shadow-xs border border-emerald-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">SLA Deadline</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {msg.classification.slaDays} Days
                        </span>
                      </div>
                    </div>

                    <div className="text-xs bg-white p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Accountable Department
                      </span>
                      <p className="font-bold text-[#064e3b] mt-0.5 text-xs">
                        {msg.classification.department}
                      </p>
                    </div>

                    {msg.classification.severityReason && (
                      <div className="text-xs p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{msg.classification.severityReason}</span>
                      </div>
                    )}

                    {/* Register & Edit Action Buttons */}
                    {msg.showConfirmationButtons && !createdComplaint && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleConfirmRegister}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Register Complaint Now</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLocationPicker(true)}
                          className="py-2.5 px-3 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs cursor-pointer"
                        >
                          Edit Location
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommended Schemes List (if matched) */}
                {msg.recommendedSchemes && (
                  <div className="mt-3 space-y-2">
                    {msg.recommendedSchemes.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900">{s.name}</h4>
                          <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {s.category}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs">{s.shortDescription}</p>
                        <div className="text-[11px] text-slate-700">
                          <strong>Eligibility:</strong> {s.eligibility}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium">
                          <strong>Benefits:</strong> {s.benefits}
                        </div>
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSend(`Check eligibility details for ${s.name}`)}
                            className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            Check Eligibility →
                          </button>
                          {s.link && (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-slate-500 flex items-center gap-0.5 hover:underline"
                            >
                              Portal <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Success Complaint Registered Banner */}
        {createdComplaint && (
          <div className="p-5 rounded-2xl bg-white border-2 border-emerald-600 shadow-lg animate-in fade-in zoom-in-95 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-base text-emerald-950">Complaint Registered Successfully</h3>
                <p className="text-xs text-emerald-700 font-semibold">
                  Official ID: <span className="font-mono text-sm">{createdComplaint.id}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">CATEGORY</span>
                <span className="font-semibold text-slate-800">{createdComplaint.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">LOCATION</span>
                <span className="font-semibold text-slate-800">
                  {createdComplaint.village}, {createdComplaint.district}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PRIORITY</span>
                <span className="font-bold text-emerald-700">{createdComplaint.severity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EXPECTED BY</span>
                <span className="font-semibold text-slate-800">{createdComplaint.expectedResolutionDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onViewComplaint) onViewComplaint(createdComplaint.id);
                }}
                className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Track Complaint (शिकायत ट्रैक करें)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedComplaint(null);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `msg-${Date.now()}-next`,
                      sender: "ai",
                      text: "Aap koi doosri samasya ya sawal bhi pooch sakte hain.",
                      timestamp: new Date().toISOString(),
                    },
                  ]);
                }}
                className="py-2.5 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Report Another
              </button>
            </div>
          </div>
        )}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Samadhan Didi is analyzing your input...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Conversational Bottom Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={() => setShowSpeechModal(true)}
            className="p-2.5 rounded-xl bg-[#f0f2ef] text-[#064e3b] hover:bg-[#e2e7e0] transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            title="Speak (Voice simulation)"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Photo upload button */}
          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer border shadow-2xs ${
              activePhotoUrl
                ? "bg-[#064e3b] text-white border-[#064e3b]"
                : "bg-[#f0f2ef] hover:bg-[#e2e7e0] text-slate-700 border-slate-200"
            }`}
            title="Attach photo"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Location button */}
          <button
            type="button"
            onClick={() => setShowLocationPicker(true)}
            className="p-2.5 rounded-xl bg-[#f0f2ef] hover:bg-[#e2e7e0] text-slate-700 border border-slate-200 shadow-2xs cursor-pointer"
            title="Select location"
          >
            <MapPin className="w-5 h-5" />
          </button>

          {/* Main text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Aapki kya samasya hai? Describe in Hindi, Hinglish or English..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-[#064e3b] outline-hidden bg-[#f8faf7]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !activePhotoUrl}
            className={`p-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center ${
              inputText.trim() || activePhotoUrl
                ? "bg-[#064e3b] hover:bg-[#065f46] text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Modals */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        initialDistrict={activeLocation.district}
        onSelect={(loc) => setActiveLocation(loc)}
      />

      <PhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSelectPhoto={(url) => setActivePhotoUrl(url)}
      />

      <SpeechSimulationModal
        isOpen={showSpeechModal}
        onClose={() => setShowSpeechModal(false)}
        onTranscriptReady={(transcript) => {
          setInputText(transcript);
          setTimeout(() => handleSend(transcript), 300);
        }}
      />
    </div>
  );
};
