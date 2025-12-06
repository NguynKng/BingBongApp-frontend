import { useState, useRef, memo } from "react";
import HoverProfileCard from "./HoverProfileCard";

const HoverWrapper = memo(({ children, slug, type, delay = 600 }) => {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const handleEnter = () => {
    timer.current = setTimeout(() => setOpen(true), delay);
  };

  const handleLeave = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}

      {/* HoverProfileCard popup */}
      {open && (
        <div className="relative z-50">
          <HoverProfileCard slug={slug} type={type} />
        </div>
      )}
    </div>
  );
});

HoverWrapper.displayName = "HoverWrapper";

export default HoverWrapper;