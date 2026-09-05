import React, { useState } from "react";
import { Camera, Upload, Check, X, Image as ImageIcon } from "lucide-react";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (url: string) => void;
}

export const PHOTO_PRESETS = [
  {
    title: "Street Light Failure",
    category: "Electricity",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Burst Water Pipeline",
    category: "Water Supply",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Severe Road Pothole",
    category: "Roads",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Overflowing Garbage Dump",
    category: "Sanitation",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Scholarship Portal Error",
    category: "Scholarship",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Pension Bank Passbook",
    category: "Pension",
    url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
  },
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
}) => {
  const [selectedUrl, setSelectedUrl] = useState(PHOTO_PRESETS[0].url);
  const [customFilePreview, setCustomFilePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomFilePreview(reader.result as string);
        setSelectedUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    onSelectPhoto(customFilePreview || selectedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Add Problem Photo</h3>
              <p className="text-xs text-slate-500">Visual proof speeds up department verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Custom File Box */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Upload from device or camera:
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
            <Upload className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="text-xs font-semibold text-slate-700">Click or drag photo here</span>
            <span className="text-[11px] text-slate-400">Supports JPG, PNG up to 10MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Realistic Demo Presets */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Or select prototype demonstration photo:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PHOTO_PRESETS.map((preset) => {
              const isSelected = selectedUrl === preset.url && !customFilePreview;
              return (
                <div
                  key={preset.title}
                  onClick={() => {
                    setSelectedUrl(preset.url);
                    setCustomFilePreview(null);
                  }}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected ? "border-emerald-600 ring-2 ring-emerald-500/30" : "border-slate-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-16 object-cover"
                  />
                  <div className="p-1 bg-white">
                    <p className="text-[10px] font-semibold text-slate-800 truncate">{preset.title}</p>
                    <p className="text-[9px] text-emerald-700">{preset.category}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Attach Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
