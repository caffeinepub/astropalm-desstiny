import { Moon, Star, Sun } from "lucide-react";
import React from "react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 w-full"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.975 0.008 85) 0%, oklch(0.96 0.015 80) 40%, oklch(0.93 0.018 280) 100%)",
      }}
    >
      {/* Decorative celestial elements */}
      <div className="absolute top-24 left-8 opacity-20 text-gold animate-pulse">
        <Star size={32} fill="currentColor" />
      </div>
      <div
        className="absolute top-40 right-12 opacity-15 text-gold animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        <Star size={20} fill="currentColor" />
      </div>
      <div
        className="absolute bottom-32 left-16 opacity-15 text-gold animate-pulse"
        style={{ animationDelay: "2s" }}
      >
        <Moon size={28} />
      </div>
      <div
        className="absolute bottom-40 right-20 opacity-20 text-gold animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        <Sun size={36} />
      </div>

      {/* SVG Mandala decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <title>Celestial mandala decoration</title>
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="oklch(0.72 0.1 75)"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="oklch(0.72 0.1 75)"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="oklch(0.72 0.1 75)"
            strokeWidth="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="30"
            fill="none"
            stroke="oklch(0.72 0.1 75)"
            strokeWidth="0.5"
          />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (angle) => (
              <line
                key={angle}
                x1="100"
                y1="10"
                x2="100"
                y2="190"
                stroke="oklch(0.72 0.1 75)"
                strokeWidth="0.3"
                transform={`rotate(${angle} 100 100)`}
              />
            ),
          )}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto animate-fade-in overflow-hidden">
        <div className="flex justify-center mb-3">
          <Star size={20} className="text-gold" fill="currentColor" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="celestial-divider w-16" />
          <Star size={14} className="text-gold" fill="currentColor" />
          <div className="celestial-divider w-16" />
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-2">
          <Star
            size={40}
            className="text-gold shrink-0 hidden sm:block"
            fill="currentColor"
            style={{
              filter: "drop-shadow(0 2px 6px oklch(0.72 0.1 75 / 0.4))",
            }}
          />
          <div className="text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-charcoal leading-tight break-words">
              <span className="text-gold-dark">Astroplam</span>
              <span className="text-charcoal/40 mx-2 sm:mx-3 font-bold">-</span>
              <span className="italic">Desstiny</span>
            </h1>
            <p className="text-sm sm:text-base text-charcoal/50 font-medium italic tracking-widest mt-1">
              by Viku Kharb
            </p>
          </div>
        </div>

        <p className="font-serif text-base sm:text-lg md:text-2xl text-charcoal/60 font-light italic mb-5 break-words">
          Where the Stars, Numbers &amp; Palmistry Reveal Your Destiny
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="celestial-divider w-16" />
          <Moon size={18} className="text-gold-dark/70" />
          <div className="celestial-divider w-16" />
        </div>

        <p className="text-charcoal/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 px-2">
          Unlock the ancient wisdom of Nadi Astrology, Numerology, and
          Palmistry. Explore our expert-led courses, personalized services, and
          transformative insights to navigate life's journey with clarity and
          purpose.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => scrollTo("courses")}
            className="btn-gold text-base px-8 py-3"
            data-ocid="hero.courses.button"
          >
            Explore Courses
          </button>
          <button
            type="button"
            onClick={() => scrollTo("services")}
            className="btn-outline-gold text-base px-8 py-3"
            data-ocid="hero.services.button"
          >
            Book a Service
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "4", label: "Expert Courses" },
            { value: "5", label: "Services" },
            { value: "3", label: "Ancient Sciences" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl font-semibold text-gold-dark">
                {stat.value}
              </div>
              <div className="text-xs text-charcoal/50 mt-1 tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs text-charcoal/50 tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
