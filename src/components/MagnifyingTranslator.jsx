import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Volume2, Loader2, Languages } from "lucide-react";
import { translateAPI } from "../services/api";

const MagnifyingTranslator = () => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredText, setHoveredText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const lastWordRef = useRef("");

  // ✅ Toggle magnifying mode
  const toggleMagnifier = useCallback(() => {
    setIsActive((prev) => {
      const newState = !prev;
      if (!newState) {
        setHoveredText("");
        setTranslation("");
        lastWordRef.current = "";
      }
      return newState;
    });
  }, []);

  // ✅ Get word at mouse position
  const getWordAtPosition = useCallback((x, y) => {
    
    // Firefox & Chrome support
    let range;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
      }
    }

    if (!range) {
      return "";
    }

    const textNode = range.startContainer;
    
    if (textNode.nodeType !== Node.TEXT_NODE) {
      return "";
    }

    const text = textNode.textContent;
    let start = range.startOffset;
    let end = range.startOffset;

    // Word boundary - expanded
    const wordBoundary = /[\s.,!?;:()[\]{}"'`\-—–\n\r\t]/;

    // Find start of word
    while (start > 0 && !wordBoundary.test(text[start - 1])) {
      start--;
    }

    // Find end of word
    while (end < text.length && !wordBoundary.test(text[end])) {
      end++;
    }

    const word = text.slice(start, end).trim();
    return word;
  }, []);

  // ✅ Fetch translation
  const fetchTranslation = useCallback(async (text) => {
    if (!text) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await translateAPI.translateText(text, "en", "vi");
      
      const translatedText = response.data || "Không thể dịch";
      setTranslation(translatedText);
    } catch {
      setTranslation("Không thể dịch")
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Handle mouse move - Debounced detection
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleMouseMove = (e) => {
      // Update position immediately
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce word detection (300ms)
      debounceTimerRef.current = setTimeout(() => {
        const word = getWordAtPosition(e.clientX, e.clientY);
        
        if (word && word !== lastWordRef.current) {
          lastWordRef.current = word;
          setHoveredText(word);
          setTranslation("");
          fetchTranslation(word);
        } else if (!word && lastWordRef.current) {
          lastWordRef.current = "";
          setHoveredText("");
          setTranslation("");
          setLoading(false);
        }
      }, 300); // Reduced from 500ms to 300ms for faster response
    };

    document.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isActive, getWordAtPosition, fetchTranslation]);

  // ✅ Text to speech
  const handleSpeak = useCallback(() => {
    if ("speechSynthesis" in window && hoveredText) {
      window.speechSynthesis.cancel(); // Cancel previous
      const utterance = new SpeechSynthesisUtterance(hoveredText);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [hoveredText]);

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        toggleMagnifier();
      }
      if (e.key === "Escape" && isActive) {
        toggleMagnifier();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [toggleMagnifier, isActive]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleMagnifier}
        className={`fixed top-18 right-5 z-[40] p-2 rounded-full border-gray-400 border-[1px] shadow-2xl transition-all duration-300 ${
          isActive
            ? "bg-blue-500 text-white scale-110 ring-4 ring-blue-300"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        title="Magnifying Translator (Ctrl+M)"
      >
        {isActive ? <X className="w-6 h-6" /> : <Languages className="w-5 h-5" />}
      </button>

      {/* Scanning Area - Rectangle */}
      {isActive && (
        <>
          {/* Rectangle Scanner */}
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: `${position.x - 75}px`,
              top: `${position.y - 40}px`,
            }}
          >
            <div className="relative w-[150px] h-[80px] border-4 border-blue-500 backdrop-brightness-50 bg-blue-50/20 shadow-xl rounded-lg flex items-center justify-center">
              <Search className="w-8 h-8 text-blue-500 animate-pulse" />
              
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-600"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-600"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-600"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-600"></div>
            </div>
          </div>

          {/* Translation Card */}
          {hoveredText && (
            <div
              className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-blue-500 p-4 min-w-[280px] max-w-[400px] pointer-events-auto animate-fadeIn"
              style={{
                left: `${position.x + 100}px`,
                top: `${position.y - 60}px`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    TRANSLATOR
                  </span>
                </div>
                <button
                  onClick={handleSpeak}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Phát âm"
                >
                  <Volume2 className="w-4 h-4 text-blue-500" />
                </button>
              </div>

              {/* Original Text */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  English
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white break-words">
                  {hoveredText}
                </div>
              </div>

              {/* Translation */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Tiếng Việt
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang dịch...</span>
                  </div>
                ) : translation ? (
                  <div className="text-blue-600 dark:text-blue-400 font-semibold text-lg break-words">
                    {translation}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Chờ dịch...
                  </div>
                )}
              </div>

              {/* Arrow pointer */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-blue-500"></div>
            </div>
          )}

          {/* Hint */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] bg-black/80 text-white px-6 py-3 rounded-full shadow-xl backdrop-blur-sm animate-fadeIn">
            <p className="text-sm font-medium">
              Di chuyển chuột qua từ để dịch • ESC hoặc Ctrl+M để thoát
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default MagnifyingTranslator;