import React, { useState } from "react";
import { MapPin, Check, X, Navigation } from "lucide-react";
import { JHARKHAND_DISTRICTS } from "../mockData/districts";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { state: string; district: string; block: string; village: string; coordinates: { lat: number; lng: number } }) => void;
  initialDistrict?: string;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialDistrict = "Bokaro",
}) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState(initialDistrict);
  const [selectedBlockName, setSelectedBlockName] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [customVillage, setCustomVillage] = useState("");
  const [gpsDetecting, setGpsDetecting] = useState(false);

  if (!isOpen) return null;

  const currentDistrict = JHARKHAND_DISTRICTS.find((d) => d.name === selectedDistrictName) || JHARKHAND_DISTRICTS[0];
  const blocks = currentDistrict.blocks;
  const currentBlock = blocks.find((b) => b.name === selectedBlockName) || blocks[0];

  const handleSimulateGPS = () => {
    setGpsDetecting(true);
    setTimeout(() => {
      setGpsDetecting(false);
      setSelectedDistrictName("Bokaro");
      setSelectedBlockName("Chas");
      setSelectedVillage("Kura");
    }, 800);
  };

  const handleConfirm = () => {
    const villageName = customVillage.trim() || selectedVillage || currentBlock.villages[0] || "Main Ward";
    const blockName = selectedBlockName || blocks[0]?.name || "Sadar";

    onSelect({
      state: "Jharkhand",
      district: currentDistrict.name,
      block: blockName,
      village: villageName,
      coordinates: currentDistrict.coordinates,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Select Issue Location</h3>
              <p className="text-xs text-slate-500">Jharkhand Civic Administrative Boundary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Detect Simulation */}
        <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className={`w-4 h-4 text-emerald-700 ${gpsDetecting ? "animate-spin" : ""}`} />
            <span className="text-xs text-emerald-900 font-medium">
              {gpsDetecting ? "Detecting GPS coordinates in Jharkhand..." : "Auto-detect location from device GPS"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSimulateGPS}
            disabled={gpsDetecting}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            {gpsDetecting ? "Detecting..." : "Detect GPS"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* District dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District (ज़िला)
            </label>
            <select
              value={selectedDistrictName}
              onChange={(e) => {
                setSelectedDistrictName(e.target.value);
                setSelectedBlockName("");
                setSelectedVillage("");
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.hindiName})
                </option>
              ))}
            </select>
          </div>

          {/* Block dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Block / Subdivision (प्रखण्ड)
            </label>
            <select
              value={selectedBlockName || blocks[0]?.name}
              onChange={(e) => {
                setSelectedBlockName(e.target.value);
                setSelectedVillage("");
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
            >
              {blocks.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village / Ward list or custom input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Village / Ward / Area (गाँव / वार्ड / मोहल्ला)
            </label>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {currentBlock.villages.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => {
                    setSelectedVillage(v);
                    setCustomVillage("");
                  }}
                  className={`px-2.5 py-1.5 rounded text-xs text-left border cursor-pointer transition-colors ${
                    selectedVillage === v && !customVillage
                      ? "bg-emerald-700 text-white border-emerald-700 font-medium"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom street / locality name..."
              value={customVillage}
              onChange={(e) => {
                setCustomVillage(e.target.value);
                setSelectedVillage("");
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
            />
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
            <span>Confirm Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
