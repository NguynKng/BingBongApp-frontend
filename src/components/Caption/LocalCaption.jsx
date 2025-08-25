// components/Captions/LocalCaption.jsx
import React from "react";
import { useCaptionsContext } from "./CaptionContext";

export default function LocalCaption() {
  const { localCaption } = useCaptionsContext();
  if (!localCaption) return null;
  return (
    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs max-w-[40%]">
      {localCaption}
    </div>
  );
}
