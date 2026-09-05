import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Sparkles, X, Check } from "lucide-react";

interface SpeechSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}

const VOICE_PRESETS = [
  {
    lang: "Hindi",
    text: "Hamare area mein street light pichle ek hafte se kharab hai.",
    label: "Street Light Grievance (बिजली / स्ट्रीट लाइट)",
  },
  {
    lang: "Hindi",
    text: "Hamare gaon mein peene ke paani ki supply 4 din se band hai aur handpump bhi kharab hai.",
    label: "Water Crisis (पेयजल आपूर्ति ठप)",
  },
  {
    lang: "Hindi",
    text: "Meri e-Kalyan post matric scholarship ka payment 4 mahine se nahi aaya, verification verified dikha raha hai.",
    label: "Scholarship Stuck (ई-कल्याण छात्रवृत्ति लंबित)",
  },
  {
    lang: "Hindi",
    text: "Meri dadi ki vridha pension pichle 3 mahine se account mein nahi aayi hai.",
    label: "Pension Issue (वृद्धावस्था पेंशन रुकी)",
  },
  {
    lang: "Hindi",
    text: "Ration dealer har mahine 2 kilo chawal kam de raha hai aur manmaana bartaav kar raha hai.",
    label: "PDS Food Supply (राशन में कम अनाज)",
  },
  {
    lang: "English",
    text: "The main connecting road between Chas and Bokaro has dangerous deep potholes causing accidents.",
    label: "Road Hazard (सड़क पर खतरनाक गड्ढे)",
  },
];

export const SpeechSimulationModal: React.FC<SpeechSimulationModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
}) => {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 30, 45, 20, 50, 35, 25, 60, 40, 20]);

  useEffect(() => {
    if (!isOpen) return;
    setIsListening(true);
    setTranscript("");

    // Simulate speech audio waves
    const interval = setInterval(() => {
      setWaveHeights(Array.from({ length: 12 }, () => Math.floor(10 + Math.random() * 50)));
    }, 150);

    // Try Web Speech API if supported
    let recognition: any = null;
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognition = new SpeechRec();
        recognition.lang = "hi-IN";
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onresult = (event: any) => {
          const current = event.results[0][0].transcript;
          setTranscript(current);
        };
        recognition.start();
      } catch (e) {
        console.log("Speech recognition not available, using voice simulator");
      }
    }

    return () => {
      clearInterval(interval);
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (text: string) => {
    setTranscript(text);
    setIsListening(false);
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscriptReady(transcript.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Voice Input Simulation</h3>
              <p className="text-xs text-slate-500">Natural voice grievance in Hindi, Hinglish or English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer */}
        <div className="mt-4 p-6 bg-emerald-950 rounded-xl text-center text-white relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 h-16 mb-3">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className="w-1.5 bg-emerald-400 rounded-full transition-all duration-150"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Samadhan Didi is listening... (बोलिए, सुन रही हूँ)</span>
          </div>

          {transcript ? (
            <div className="mt-3 p-3 bg-white/10 rounded-lg text-emerald-100 text-sm font-medium border border-white/10 text-left">
              "{transcript}"
            </div>
          ) : (
            <p className="text-xs text-emerald-300/70 mt-2">
              Speak into your microphone or choose a prototype audio sample below:
            </p>
          )}
        </div>

        {/* Quick Voice Presets */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Click to simulate citizen spoken voice sample:
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {VOICE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p.text)}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer text-xs"
              >
                <div className="font-semibold text-emerald-900 flex items-center justify-between">
                  <span>{p.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{p.lang}</span>
                </div>
                <p className="text-slate-600 mt-0.5 truncate">"{p.text}"</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!transcript.trim()}
            className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors ${
              transcript.trim()
                ? "bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Use Spoken Text</span>
          </button>
        </div>
      </div>
    </div>
  );
};
