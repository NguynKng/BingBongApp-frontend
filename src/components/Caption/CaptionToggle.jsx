// components/Caption/CaptionToggle.jsx
import React from "react";
import { useCaptionsContext } from "./CaptionContext";
import { AudioLines, Captions, CaptionsOff } from "lucide-react";

export default function CaptionToggle() {
  const {
    enabled,
    toggleCaptions,
    enableRemoteCaption,
    toggleRemoteCaptions,
    recognitionLang,
    setRecognitionLang,
  } = useCaptionsContext();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => toggleRemoteCaptions()}
        className={`p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600`}
        title={enableRemoteCaption ? "Tắt phụ đề" : "Bật phụ đề"}
      >
        {enableRemoteCaption ? (
          <Captions className="text-white" />
        ) : (
          <CaptionsOff className="text-red-400" />
        )}
      </button>
      <button
        onClick={() => toggleCaptions()}
        className={`relative p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600`}
        title={enabled ? "Tắt phân tích âm thanh" : "Bật phân tích âm thanh"}
      >
        <AudioLines className={`${enabled ? "text-white" : "text-red-400"}`} />
      </button>

      <select
        value={recognitionLang}
        onChange={(e) => setRecognitionLang(e.target.value)}
        className="px-2 py-1 bg-gray-800 text-white rounded"
        title="Chọn ngôn ngữ nhận diện"
      >
        <option value="vi-VN">Tiếng Việt</option>
        <option value="en-US">English</option>
      </select>
    </div>
  );
}
