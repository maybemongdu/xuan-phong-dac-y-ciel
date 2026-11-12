import React, { useEffect, useState, useCallback } from 'react';

interface BowParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export const BowClickEffect: React.FC = () => {
  const [bows, setBows] = useState<BowParticle[]>([]);

  const handlePointerDown = useCallback((e: MouseEvent | TouchEvent) => {
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const newBow: BowParticle = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      rotation: Math.floor(Math.random() * 24) - 12, // slight natural tilt -12 to +12 deg
      scale: 0.85 + Math.random() * 0.3,
    };

    setBows((prev) => [...prev.slice(-12), newBow]); // keep max 12 at any instant to avoid clutter

    // Auto cleanup this specific bow after animation duration
    setTimeout(() => {
      setBows((prev) => prev.filter((b) => b.id !== newBow.id));
    }, 750);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, [handlePointerDown]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {bows.map((bow) => (
        <div
          key={bow.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform animate-bow-float"
          style={{
            left: `${bow.x}px`,
            top: `${bow.y}px`,
            transform: `translate(-50%, -50%) rotate(${bow.rotation}deg) scale(${bow.scale})`,
          }}
        >
          {/* Delicate Pastel Pink Ribbon Bow SVG */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-sm opacity-90"
          >
            {/* Left loop */}
            <path
              d="M50 50 C38 32 15 28 10 40 C6 50 20 62 46 54 Z"
              fill="#FBCFE8"
              stroke="#F472B6"
              strokeWidth="2.5"
            />
            <path
              d="M48 49 C38 38 22 36 18 42 C16 48 24 55 45 52 Z"
              fill="#FDF2F8"
              opacity="0.6"
            />
            {/* Right loop */}
            <path
              d="M50 50 C62 32 85 28 90 40 C94 50 80 62 54 54 Z"
              fill="#FBCFE8"
              stroke="#F472B6"
              strokeWidth="2.5"
            />
            <path
              d="M52 49 C62 38 78 36 82 42 C84 48 76 55 55 52 Z"
              fill="#FDF2F8"
              opacity="0.6"
            />
            {/* Left ribbon tail */}
            <path
              d="M47 52 C38 64 26 78 20 88 C32 84 42 76 49 56 Z"
              fill="#F9A8D4"
              stroke="#F472B6"
              strokeWidth="2"
            />
            {/* Right ribbon tail */}
            <path
              d="M53 52 C62 64 74 78 80 88 C68 84 58 76 51 56 Z"
              fill="#F9A8D4"
              stroke="#F472B6"
              strokeWidth="2"
            />
            {/* Center knot */}
            <circle
              cx="50"
              cy="51"
              r="7"
              fill="#F472B6"
              stroke="#DB2777"
              strokeWidth="1.5"
            />
            <circle
              cx="48.5"
              cy="49.5"
              r="2"
              fill="#FFFFFF"
              opacity="0.75"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
