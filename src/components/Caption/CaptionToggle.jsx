// components/Captions/CaptionToggle.jsx
import React from "react";
import { useCaptionsContext } from "./CaptionContext";
import { Captions, CaptionsOff } from "lucide-react";

export default function CaptionToggle() {
  const { enabled, toggleCaptions } = useCaptionsContext();
  return (
    <button
      onClick={() => toggleCaptions()}
      className={`p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600`}
      title={enabled ? "Tắt phụ đề" : "Bật phụ đề"}
    >
      {enabled ? <Captions className="text-white" /> : <CaptionsOff className="text-red-400" />}
    </button>
  );
}
