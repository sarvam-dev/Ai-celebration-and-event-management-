import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface SplashAnimationScreenProps {
  onComplete: () => void;
  autoPlayDuration?: number; // total duration in seconds (5.7s)
}

export const SplashAnimationScreen: React.FC<SplashAnimationScreenProps> = ({
  onComplete,
  autoPlayDuration = 5.7,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [scale, setScale] = useState(1);

  // Requested arched text: "UTSAVAM" in large format
  const textString = "UTSAVAM";
  const characters = useMemo(() => textString.split(""), [textString]);

  // Optical arc geometry on virtual stage:
  // Radius R = 275px for large, bold, prominent 3D text centered over the emblem
  // Arc angle spans symmetrically from -142° to -38° with apex at -90° (top)
  const arcRadius = 275;
  const startAngle = -142;
  const endAngle = -38;
  const angleSpan = endAngle - startAngle; // 104 degrees

  // Optical kerning weights for balanced spacing of U-T-S-A-V-A-M
  const getCharWeight = (char: string) => {
    if (char === 'M' || char === 'W') return 1.3;
    if (char === 'A') return 1.15;
    if (char === 'U' || char === 'V') return 1.05;
    if (char === 'S') return 1.0;
    if (char === 'T') return 0.95;
    return 1.0;
  };

  const letterData = useMemo(() => {
    const weights = characters.map(getCharWeight);
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);

    let cumulativeWeight = 0;
    return characters.map((char, i) => {
      const charWeight = weights[i];
      // Place anchor precisely at midpoint of character's optical space
      const midpointWeight = cumulativeWeight + charWeight / 2;
      cumulativeWeight += charWeight;

      const progress = midpointWeight / totalWeight;
      const angleDeg = startAngle + progress * angleSpan;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Coordinates relative to center anchor (0, 0)
      const x = arcRadius * Math.cos(angleRad);
      const y = arcRadius * Math.sin(angleRad);
      const rot = angleDeg + 90; // Tangent angle

      // Stagger: letters appear one by one between 0.18s and 1.0s
      const delay = 0.18 + i * 0.11;

      return { char, x, y, rot, delay, i };
    });
  }, [characters]);

  // Auto-adapt responsive scale calculation for mobile & desktop viewports
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Virtual design target: 820px wide by 640px high
      const availableW = vw - 24;
      const availableH = vh - 32;
      const scaleX = availableW / 820;
      const scaleY = availableH / 640;
      const fitScale = Math.min(scaleX, scaleY);

      // Clamped scale so on tiny phones it fits cleanly, and on 4K it expands majestically
      setScale(Math.max(0.38, Math.min(1.3, fitScale)));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Master Clock (runs from 0.0s to 5.7s)
  useEffect(() => {
    const intervalMs = 25;
    const increment = intervalMs / 1000;

    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + increment;
        if (next >= autoPlayDuration) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 180);
          return autoPlayDuration;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlayDuration, onComplete]);

  // Disappear phase: between 4.85s and 5.6s
  const isDisappearing = elapsed >= 4.85;

  return (
    <div
      onClick={onComplete}
      className="relative w-full h-screen bg-[#120E0C] text-[#FAF8F5] overflow-hidden flex items-center justify-center select-none cursor-pointer"
    >
      {/* Warm Ambient Claude Terracotta Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#D96B27]/18 blur-[180px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#EA580C]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(8,6,5,0.85)_100%)]" />
      </div>

      {/* Auto-Adapting Virtual Stage: scales smoothly to fit any phone, tablet, or desktop screen */}
      <div
        style={{
          width: '800px',
          height: '600px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
        className="relative shrink-0 flex items-center justify-center pointer-events-none"
      >
        {/* Whole 3D Assembly with Disappearance Dissolve at 4.9s - 5.6s */}
        <motion.div
          animate={
            isDisappearing
              ? {
                  opacity: 0,
                  scale: 0.9,
                  filter: 'blur(16px)',
                  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
                }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.3 },
                }
          }
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Center Origin Pivot Anchor at (400, 375) */}
          <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
            {/* Subtle Guide Arc Ring */}
            <svg
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 overflow-visible"
              width="650"
              height="650"
              viewBox="-325 -325 650 650"
            >
              <ellipse
                cx="0"
                cy="0"
                rx={arcRadius}
                ry={arcRadius}
                fill="none"
                stroke="#D96B27"
                strokeWidth="1.2"
                strokeOpacity="0.14"
                strokeDasharray="4 6"
              />
            </svg>

            {/* 1. Large, Bold Solid 3D Text along Semicircle Arc (Letter-by-Letter) */}
            {letterData.map((item) => (
              <div
                key={`letter-${item.i}`}
                style={{
                  position: 'absolute',
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <motion.span
                  initial={{
                    opacity: 0,
                    scale: 0.2,
                    y: 28,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: item.delay,
                    duration: 0.44,
                    type: 'spring',
                    stiffness: 340,
                    damping: 20,
                  }}
                  className="block select-none pointer-events-none uppercase text-white"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                    fontWeight: 900,
                    fontSize: '56px',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                    // Deep, heavy, solid 3D extrusion in Claude terracotta / royal gold
                    textShadow: `
                      0 1px 0 #F59E0B,
                      0 2px 0 #EA580C,
                      0 3px 0 #D96B27,
                      0 4px 0 #C2410C,
                      0 5px 0 #9A3412,
                      0 6px 0 #7C2D12,
                      0 7px 0 #541E06,
                      0 8px 0 #381203,
                      0 10px 4px rgba(0, 0, 0, 0.75),
                      0 18px 30px rgba(0, 0, 0, 0.9),
                      0 0 40px rgba(245, 158, 11, 0.7)
                    `,
                  }}
                >
                  {item.char}
                </motion.span>
              </div>
            ))}

            {/* 2. Official Uploaded Utsavam AI Logo (Appears at ~1.15s) */}
            <div
              style={{
                position: 'absolute',
                left: '0px',
                top: '28px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.25,
                  rotate: -10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: 1.15,
                  duration: 0.85,
                  type: 'spring',
                  stiffness: 220,
                  damping: 18,
                }}
                className="relative flex items-center justify-center"
              >
                {/* Ambient Golden Flare behind circular logo */}
                <div className="absolute inset-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-tr from-[#D96B27]/40 via-[#F59E0B]/35 to-[#EA580C]/30 blur-3xl pointer-events-none" />

                {/* Circular Utsavam AI Logo Badge */}
                <div className="relative w-72 h-72 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(217,107,39,0.35)]">
                  {/* Subtle 3D Depth Shadow behind the logo image */}
                  <img
                    src="/assets/aistudio/utsavam_circle_logo.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute top-2 left-0 w-72 h-72 rounded-full object-contain opacity-40 blur-[4px] brightness-0"
                  />

                  {/* The Crisp Circular Utsavam AI Emblem */}
                  <img
                    src="/assets/aistudio/utsavam_circle_logo.png"
                    alt="Utsavam AI Circular Logo"
                    className="relative w-72 h-72 rounded-full object-contain select-none pointer-events-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)]"
                    draggable={false}
                  />
                </div>
              </motion.div>
            </div>

            {/* 3. Solid 3D "AI CELEBRATION AND EVENT MANAGEMENT" Subtext (Appears at ~2.1s) */}
            <div
              style={{
                position: 'absolute',
                left: '0px',
                top: '215px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                  scale: 0.88,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  delay: 2.1,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-4 whitespace-nowrap"
              >
                {/* Left Terracotta / Gold Gradient Accent Rule */}
                <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D96B27] to-[#F59E0B] shadow-[0_1px_2px_#000]" />

                {/* 3D "AI CELEBRATION AND EVENT MANAGEMENT" Text */}
                <span
                  className="uppercase text-xs sm:text-sm tracking-[0.24em] text-[#FFF8F0]"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
                    fontWeight: 900,
                    textShadow: `
                      0 1px 0 #F59E0B,
                      0 2px 0 #EA580C,
                      0 3px 0 #D96B27,
                      0 4px 0 #9A3412,
                      0 5px 0 #7C2D12,
                      0 7px 16px rgba(0, 0, 0, 0.8),
                      0 0 24px rgba(245, 158, 11, 0.6)
                    `,
                  }}
                >
                  AI CELEBRATION AND EVENT MANAGEMENT
                </span>

                {/* Right Terracotta / Gold Gradient Accent Rule */}
                <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-l from-transparent via-[#D96B27] to-[#F59E0B] shadow-[0_1px_2px_#000]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
