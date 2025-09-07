// components/Caption/CaptionContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { translateAPI } from "../../services/api";

const CaptionsContext = createContext(null);
export function useCaptionsContext() {
  return useContext(CaptionsContext);
}

/**
 * CaptionsProvider Responsibilities:
 * - Manage whether captions enabled
 * - Run Web Speech API recognition for local speech (interim+final)
 * - Emit 'transcript' socket events as you had
 * - Call /api/translate (server) for final transcripts and emit 'translated' events
 * - Listen to socket 'transcript' and 'translated' from peer and expose remoteCaption + remoteTranslation
 *
 * Notes:
 * - For production accuracy, implement server-side STT or use Whisper/Google for STT, and use high-quality MT (DeepL/Google/OOAI).
 */
export function CaptionsProvider({ callId, peerUserId, children }) {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);
  const [enabled, setEnabled] = useState(false);
  const [enableRemoteCaption, setEnableRemoteCaption] = useState(false);
  const [localCaption, setLocalCaption] = useState("");
  const [localTranslation, setLocalTranslation] = useState("");
  const [remoteCaption, setRemoteCaption] = useState("");
  const [remoteTranslation, setRemoteTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("vi"); // default translate to Vietnamese
  const recognitionRef = useRef(null);
  const captionTimeoutRef = useRef(null);

  // helper: create recognition instance
  const createRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang =  "en-US" // default — we'll try auto-detect heuristics later or allow UI to change
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

    rec.onresult = async (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript + " ";
        else interim += r[0].transcript + " ";
      }

      const displayText = final ? final.trim() : interim.trim();
      setLocalCaption(displayText);

      // clear flush timer for UI
      if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
      captionTimeoutRef.current = setTimeout(() => {
        if (!final) setLocalCaption("");
      }, final ? 4000 : 2000);

      // emit raw transcript over socket (so remote shows)
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

      // If final, request translation from server and emit translated when available
      if (final) {
        // call translation endpoint on your server
        try {
          const response = await translateAPI.translateText(final.trim(), targetLang);
          if (response) {
            const translatedText = response.translated_text;
            setLocalTranslation(translatedText || "");
            // also emit translated event to peer so remote shows translation if you want
            try {
              socket?.emit("translated", {
                roomId: callId,
                userId: currentUser?._id,
                translation: translatedText,
                original: final.trim(),
              });
            } catch (e) {}
            // clear local translation after a bit
            setTimeout(() => setLocalTranslation(""), 5000);
          } else {
            console.warn("translate API failed", await response.success);
          }
        } catch (e) {
          console.warn("translate fetch failed", e);
        }
      }
    };

    rec.onerror = (ev) => {
      console.warn("SpeechRecognition error", ev);
    };

    rec.onend = () => {
      recognitionRef.current = null;
      // keep continuous: restart automatically if enabled
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
      try { rec.stop(); } catch(e) {}
      recognitionRef.current = null;
    } catch (e) {
      console.warn("stopRecognition error", e);
    }
  };

  // toggle captions on/off
  const toggleRemoteCaptions = (val) => {
    const next = typeof val === "boolean" ? val : !enableRemoteCaption;
    setEnableRemoteCaption(next);
  };

  const toggleCaptions = (val) => {
    const next = typeof val === "boolean" ? val : !enabled;
    setEnabled(next);
  };

  // start/stop recognition when enabled changes
  useEffect(() => {
    if (enabled) startRecognition();
    else {
      stopRecognition();
      setLocalCaption("");
      setLocalTranslation("");
    }
    return () => stopRecognition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, targetLang]);

  // Listen to mic events dispatched from CallWindow (optional, more robust)
  useEffect(() => {
    function onMicOn(e) {
      if (enabled) startRecognition();
    }
    function onMicOff(e) {
      stopRecognition();
      setLocalCaption("");
      setLocalTranslation("");
    }
    window.addEventListener("captions:mic-on", onMicOn);
    window.addEventListener("captions:mic-off", onMicOff);
    return () => {
      window.removeEventListener("captions:mic-on", onMicOn);
      window.removeEventListener("captions:mic-off", onMicOff);
    };
  }, [enabled]);

  // Receive transcripts / translated messages from socket (peer)
  useEffect(() => {
    if (!socket) return;
    const onTranscript = ({ roomId, userId, text, isFinal }) => {
      if (roomId !== callId) return;
      if (userId !== peerUserId) return;
      setRemoteCaption(text || "");
      if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
      captionTimeoutRef.current = setTimeout(() => setRemoteCaption(""), isFinal ? 4000 : 2000);
    };
    const onTranslated = ({ roomId, userId, translation, original }) => {
      if (roomId !== callId) return;
      if (userId !== peerUserId) return;
      setRemoteTranslation(translation || "");
      // clear after some time
      setTimeout(() => setRemoteTranslation(""), 5000);
    };
    socket.on("transcript", onTranscript);
    socket.on("translated", onTranslated);
    return () => {
      socket.off("transcript", onTranscript);
      socket.off("translated", onTranslated);
    };
  }, [socket, callId, peerUserId]);

  const value = {
    enabled,
    enableRemoteCaption,
    toggleCaptions,
    toggleRemoteCaptions,
    localCaption,
    localTranslation,
    remoteCaption,
    remoteTranslation,
    setTargetLang,
    targetLang,
  };

  return <CaptionsContext.Provider value={value}>{children}</CaptionsContext.Provider>;
}
