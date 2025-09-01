// components/Caption/RemoteCaption.jsx
import React from "react";
import { useCaptionsContext } from "./CaptionContext";

export default function RemoteCaption() {
  const { remoteCaption, remoteTranslation, enableRemoteCaption } = useCaptionsContext();
  if (!enableRemoteCaption) return null;
  return (
    <div className="pointer-events-none fixed bottom-48 left-1/2 transform -translate-x-1/2 z-50 max-w-3xl w-[85%]">
      {remoteCaption && (
        <div className="bg-black/60 text-white py-3 px-4 rounded-2xl mb-2 text-lg text-center break-words">
          {remoteCaption}
        </div>
      )}
      {remoteTranslation && (
        <div className="bg-black/70 text-green-200 py-1 px-3 rounded-lg text-sm text-center break-words">
          {remoteTranslation}
        </div>
      )}
    </div>
  );
}
