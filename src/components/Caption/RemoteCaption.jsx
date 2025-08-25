// components/Captions/RemoteCaption.jsx
import React from "react";
import { useCaptionsContext } from "./CaptionContext";

export default function RemoteCaption() {
  const { remoteCaption } = useCaptionsContext();
  if (!remoteCaption) return null;
  return (
    <div
      className="bg-black/75 text-white px-3 py-2 rounded-md max-w-[70%] text-center text-sm shadow-lg"
      style={{ backdropFilter: "blur(4px)" }}
    >
      {remoteCaption}
    </div>
  );
}
