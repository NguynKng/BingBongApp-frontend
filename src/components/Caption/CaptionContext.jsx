// components/Caption/CaptionContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { translateAPI } from "../../services/api";

const CaptionsContext = createContext(null);
export const useCaptionsContext = () => useContext(CaptionsContext);

/* -------------------- LANG HELPERS -------------------- */

const getTargetLangFromRecognition = (recognitionLang) => {
  return recognitionLang?.startsWith("vi") ? "en" : "vi";
};

const getTranslatePair = (recognitionLang) => {
  const source = recognitionLang?.startsWith("vi") ? "vi" : "en";
  const target = source === "vi" ? "en" : "vi";
  return { source, target };
};

/* -------------------- PROVIDER -------------------- */

export function CaptionsProvider({ callId, peerUserId, children }) {
  const socket = useAuthStore((s) => s.socket);
  const currentUser = useAuthStore((s) => s.user);

  const [enabled, setEnabled] = useState(false);
  const [enableRemoteCaption, setEnableRemoteCaption] = useState(false);

  const [localCaption, setLocalCaption] = useState("");
  const [localTranslation, setLocalTranslation] = useState("");

  const [remoteCaption, setRemoteCaption] = useState("");
  const [remoteTranslation, setRemoteTranslation] = useState("");

  const [recognitionLang, setRecognitionLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState(
    getTargetLangFromRecognition("en-US")
  );

  const recognitionRef = useRef(null);
  const captionTimeoutRef = useRef(null);
  const translateTimeoutRef = useRef(null);

  /* -------------------- SYNC LANG -------------------- */

  useEffect(() => {
    setTargetLang(getTargetLangFromRecognition(recognitionLang));
  }, [recognitionLang]);

  /* -------------------- SPEECH -------------------- */

  const createRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      toast.error("Trình duyệt không hỗ trợ Speech Recognition");
      return null;
    }

    const rec = new SR();
    rec.lang = recognitionLang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;
    return rec;
  };

  const clearCaptionTimeout = () => {
    if (captionTimeoutRef.current) {
      clearTimeout(captionTimeoutRef.current);
      captionTimeoutRef.current = null;
    }
  };

  const startRecognition = () => {
    if (recognitionRef.current) return;

    const rec = createRecognition();
    if (!rec) return;

    recognitionRef.current = rec;

    rec.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript + " ";
        else interim += r[0].transcript + " ";
      }

      const displayText = (finalText || interim).trim();
      if (!displayText) return;

      setLocalCaption(displayText);

      clearCaptionTimeout();
      captionTimeoutRef.current = setTimeout(
        () => setLocalCaption(""),
        finalText ? 4000 : 2000
      );

      // Emit transcript (chỉ khi có ý nghĩa)
      if (finalText || displayText.length > 10) {
        socket?.emit("transcript", {
          roomId: callId,
          userId: currentUser?._id,
          text: displayText,
          isFinal: Boolean(finalText),
        });
      }

      if (!finalText || finalText.trim().length < 3) return;

      // -------- DEBOUNCE TRANSLATE --------
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }

      translateTimeoutRef.current = setTimeout(async () => {
        try {
          const { source, target } = getTranslatePair(recognitionLang);
          const res = await translateAPI.translateText(
            finalText.trim(),
            source,
            target
          );

          const translated = res?.data || "";
          setLocalTranslation(translated);

          socket?.emit("translated", {
            roomId: callId,
            userId: currentUser?._id,
            translation: translated,
            original: finalText.trim(),
          });

          setTimeout(() => setLocalTranslation(""), 5000);
        } catch (err) {
          console.warn("Translate failed", err);
        }
      }, 400);
    };

    rec.onerror = (e) => {
      console.warn("SpeechRecognition error", e);
    };

    rec.onend = () => {
      recognitionRef.current = null;
      if (enabled) {
        setTimeout(startRecognition, 600); // ⬅️ quan trọng
      }
    };

    try {
      rec.start();
    } catch (e) {
      console.warn("rec.start error", e);
    }
  };

  const stopRecognition = () => {
    clearCaptionTimeout();

    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current);
      translateTimeoutRef.current = null;
    }

    const rec = recognitionRef.current;
    if (!rec) return;

    try {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.stop();
    } catch {}

    recognitionRef.current = null;
  };

  /* -------------------- TOGGLE -------------------- */

  const toggleCaptions = (val) =>
    setEnabled(typeof val === "boolean" ? val : !enabled);

  const toggleRemoteCaptions = (val) =>
    setEnableRemoteCaption(
      typeof val === "boolean" ? val : !enableRemoteCaption
    );

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    stopRecognition();
    setLocalCaption("");
    setLocalTranslation("");

    if (enabled) startRecognition();
    return stopRecognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, recognitionLang]);

  useEffect(() => {
    if (!socket) return;

    const onTranscript = ({ roomId, userId, text, isFinal }) => {
      if (roomId !== callId || userId !== peerUserId) return;

      setRemoteCaption(text || "");
      clearCaptionTimeout();
      captionTimeoutRef.current = setTimeout(
        () => setRemoteCaption(""),
        isFinal ? 4000 : 2000
      );
    };

    const onTranslated = ({ roomId, userId, translation }) => {
      if (roomId !== callId || userId !== peerUserId) return;
      setRemoteTranslation(translation || "");
      setTimeout(() => setRemoteTranslation(""), 5000);
    };

    socket.on("transcript", onTranscript);
    socket.on("translated", onTranslated);

    return () => {
      socket.off("transcript", onTranscript);
      socket.off("translated", onTranslated);
    };
  }, [socket, callId, peerUserId]);

  /* -------------------- CONTEXT -------------------- */

  const value = {
    enabled,
    enableRemoteCaption,
    toggleCaptions,
    toggleRemoteCaptions,

    localCaption,
    localTranslation,

    remoteCaption,
    remoteTranslation,

    recognitionLang,
    setRecognitionLang,
  };

  return (
    <CaptionsContext.Provider value={value}>
      {children}
    </CaptionsContext.Provider>
  );
}
