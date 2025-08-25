// components/Captions/CaptionsContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const CaptionsContext = createContext(null);

export function useCaptionsContext() {
  return useContext(CaptionsContext);
}

export function CaptionsProvider({ callId, peerUserId, children }) {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);

  const [enabled, setEnabled] = useState(false);
  const [localCaption, setLocalCaption] = useState("");
  const [remoteCaption, setRemoteCaption] = useState("");
  const captionTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  // create SpeechRecognition instance if supported
  const createRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = "vi-VN";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = true;
    return rec;
  };

  // start recognition
  const startRecognition = () => {
    if (recognitionRef.current) return;
    const rec = createRecognition();
    if (!rec) {
      toast.error("Trình duyệt không hỗ trợ SpeechRecognition.");
      return;
    }
    recognitionRef.current = rec;

    rec.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript + " ";
        else interim += r[0].transcript + " ";
      }

      const displayText = final ? final.trim() : interim.trim();
      setLocalCaption(displayText);

      // emit transcript to server
      if (displayText) {
        try {
          socket?.emit("transcript", {
            roomId: callId,
            userId: currentUser?._id,
            text: displayText,
            isFinal: Boolean(final),
          });
        } catch (e) {
          console.warn("emit transcript failed", e);
        }
      }
    };

    rec.onerror = (ev) => {
      console.warn("SpeechRecognition error", ev);
    };

    rec.onend = () => {
      recognitionRef.current = null;
      // if still enabled, restart to keep continuous recognition (workaround)
      if (enabled) setTimeout(() => startRecognition(), 200);
    };

    try {
      rec.start();
    } catch (e) {
      console.warn("rec.start failed", e);
    }
  };

  const stopRecognition = () => {
    try {
      const rec = recognitionRef.current;
      if (!rec) return;
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try { rec.stop(); } catch (e) {}
      recognitionRef.current = null;
    } catch (e) {
      console.warn("stopRecognition error", e);
    }
  };

  // toggle captions
  const toggleCaptions = (val) => {
    const next = typeof val === "boolean" ? val : !enabled;
    setEnabled(next);
  };

  // when enabled changes: start/stop recognition
  useEffect(() => {
    if (enabled) {
      startRecognition();
    } else {
      stopRecognition();
      setLocalCaption("");
      // optionally notify peers that local captions disabled
    }
    // cleanup on unmount
    return () => stopRecognition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // receive transcripts from socket
  useEffect(() => {
    if (!socket) return;
    const onTranscript = ({ roomId, userId, text, isFinal }) => {
      if (roomId !== callId) return;
      if (userId !== peerUserId) return; // only show captions from the peer we're in call with
      setRemoteCaption(text);
      if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
      captionTimeoutRef.current = setTimeout(() => {
        setRemoteCaption("");
      }, isFinal ? 4000 : 2500);
    };
    socket.on("transcript", onTranscript);
    return () => {
      socket.off("transcript", onTranscript);
      if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
    };
  }, [socket, callId, peerUserId]);

  const value = {
    enabled,
    toggleCaptions,
    localCaption,
    remoteCaption,
    setRemoteCaption,
  };

  return <CaptionsContext.Provider value={value}>{children}</CaptionsContext.Provider>;
}
