import React, { useEffect, useRef } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const footerRef = useRef(null);

  // Scroll-in effect
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footerRef.current.classList.add("fade-in-up");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
  }, []);

  return (
    <>
      {/* Inline CSS animations */}
      <style>{`
        /* Gradient animation */
        .gradient-bg {
          background: linear-gradient(270deg, #bfdbfe, #c7d2fe, #ddd6fe);
          background-size: 400% 400%;
          animation: gradientAnim 8s ease infinite;
        }
        /* Dark-mode gradient */
        .dark .gradient-bg {
          background: linear-gradient(270deg, #1f2937, #374151, #4b5563);
          background-size: 400% 400%;
          animation: gradientAnim 8s ease infinite;
        }
        @keyframes gradientAnim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Fade-in-up on scroll */
        .fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-init {
          opacity: 0;
          transform: translateY(20px);
        }

        /* Icon hover animation */
        .icon-hover:hover {
          transform: scale(1.1);
        }
        .icon-hover {
          transition: transform 0.2s ease, color 0.2s ease;
        }
      `}</style>

      <footer
        ref={footerRef}
        className="gradient-bg dark:gradient-bg shadow-inner text-blue-900 dark:text-gray-200 relative overflow-hidden fade-init"
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 text-sm sm:text-base md:text-lg flex flex-col md:flex-row flex-wrap justify-between gap-8">
          {/* Column 1: About */}
          <div className="flex-1 min-w-[250px] text-center md:text-left">
            <h3 className="font-bold text-2xl mb-4">Bing Bong</h3>
            <p className="text-justify">
              Bing Bong is a social community for tech enthusiasts,
              lifelong learners, and people who are eager to share knowledge
              and grow together.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="flex-1 min-w-[250px] text-center">
            <h4 className="font-semibold text-xl mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex justify-center items-center gap-2 text-lg">
                <Mail className="size-5" /> <span>support@bingbong.vn</span>
              </li>
              <li className="flex justify-center items-center gap-2 text-lg">
                <Phone className="size-5" /> <span>0123 456 789</span>
              </li>
              <li className="flex justify-center items-center gap-2 text-lg">
                <MapPin className="size-5" /> <span>Ho Chi Minh City</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="flex-1 min-w-[250px] text-center md:text-center">
            <h4 className="font-semibold text-xl mb-3">Follow Us</h4>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="icon-hover text-blue-700 dark:text-gray-200 hover:text-blue-900 dark:hover:text-white"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="icon-hover text-pink-600 dark:text-pink-400 hover:text-pink-800"
              >
                <Instagram />
              </a>
              <a
                href="#"
                className="icon-hover text-blue-500 dark:text-blue-300 hover:text-blue-700"
              >
                <Twitter />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-center text-xs py-4 text-blue-700 dark:text-gray-400">
          © {new Date().getFullYear()} Bing Bong. All rights reserved.
        </div>
      </footer>
    </>
  );
}
