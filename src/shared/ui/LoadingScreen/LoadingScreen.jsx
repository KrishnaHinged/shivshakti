"use client";

import React, { useState, useEffect } from "react";

/**
 * Animated SVG LoadingScreen representing an elevator installation process.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [statusText, setStatusText] = useState("Preparing shaft...");

  const statusSequence = [
    { time: 0,    text: "Preparing shaft..." },
    { time: 800,  text: "Installing guide rails..." },
    { time: 1400, text: "Assembling cabin..." },
    { time: 1900, text: "Fitting panels..." },
    { time: 2200, text: "Connecting wire ropes..." },
    { time: 2800, text: "System ready." },
  ];

  useEffect(() => {
    const timers = statusSequence.map(({ time, text }) =>
      setTimeout(() => setStatusText(text), time)
    );
    const fadeOutTimer = setTimeout(() => setFadeOut(true), 3200);
    const visibleTimer = setTimeout(() => setVisible(false), 3700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fadeOutTimer);
      clearTimeout(visibleTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <div
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        background: "radial-gradient(circle at 15% 20%, rgba(30,58,138,0.25) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(249,115,22,0.15) 0%, transparent 45%), #0A0A0A"
      }}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes draw-shaft { to { stroke-dashoffset: 0; } }
        @keyframes draw-rails { to { stroke-dashoffset: 0; } }
        @keyframes draw-cabin { to { stroke-dashoffset: 0; } }
        @keyframes draw-top-beam { to { stroke-dashoffset: 0; } }
        @keyframes draw-bottom-beam { to { stroke-dashoffset: 0; } }
        @keyframes draw-panel-lines { to { stroke-dashoffset: 0; } }
        @keyframes draw-door-split { to { stroke-dashoffset: 0; } }
        @keyframes draw-ropes { to { stroke-dashoffset: 0; } }
        @keyframes fade-in { to { opacity: 1; } }
        @keyframes light-appear { to { opacity: 1; } }
        @keyframes light-flicker {
          0%, 100% { opacity: 1; } 50% { opacity: 0.6; } 75% { opacity: 0.95; } 25% { opacity: 0.7; }
        }
        @keyframes anim-g { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes anim-1 { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes anim-2 { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes anim-3 { 0% { opacity: 0; } 15% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes cabin-up { from { transform: translateY(0); } to { transform: translateY(-60px); } }
        @keyframes progress-fill { from { width: 0%; } to { width: 100%; } }
        @keyframes status-fade {
          0%, 20% { opacity: 1; } 22.8% { opacity: 0; } 25.7%, 37.1% { opacity: 1; } 40% { opacity: 0; }
          42.8%, 51.4% { opacity: 1; } 54.3% { opacity: 0; } 57.1%, 60% { opacity: 1; } 62.8% { opacity: 0; }
          65.7%, 77.1% { opacity: 1; } 80% { opacity: 0; } 82.8%, 100% { opacity: 1; }
        }
        @keyframes spark-out-tl1 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(-15px, -10px) scale(0); opacity: 0; } }
        @keyframes spark-out-tl2 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(-10px, 15px) scale(0); opacity: 0; } }
        @keyframes spark-out-tr1 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(15px, -10px) scale(0); opacity: 0; } }
        @keyframes spark-out-tr2 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(10px, 15px) scale(0); opacity: 0; } }
        @keyframes spark-out-bl1 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(-12px, -12px) scale(0); opacity: 0; } }
        @keyframes spark-out-bl2 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(-15px, 10px) scale(0); opacity: 0; } }
        @keyframes spark-out-br1 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(12px, -12px) scale(0); opacity: 0; } }
        @keyframes spark-out-br2 { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(15px, 10px) scale(0); opacity: 0; } }

        .shaft { stroke-dasharray: 800; stroke-dashoffset: 800; animation: draw-shaft 0.6s ease-out 0s forwards; }
        .guide-rails { stroke-dasharray: 240; stroke-dashoffset: 240; animation: draw-rails 0.5s ease-out 0.3s forwards; }
        .cabin-box { stroke-dasharray: 520; stroke-dashoffset: 520; animation: draw-cabin 0.7s ease-out 0.5s forwards; }
        .top-beam { stroke-dasharray: 140; stroke-dashoffset: 140; animation: draw-top-beam 0.4s ease-out 1.0s forwards; }
        .bottom-beam { stroke-dasharray: 140; stroke-dashoffset: 140; animation: draw-bottom-beam 0.4s ease-out 1.05s forwards; }
        .panel-line { stroke-dasharray: 130; stroke-dashoffset: 130; animation: draw-panel-lines 0.4s ease-out 1.1s forwards; }
        .door-split { stroke-dasharray: 130; stroke-dashoffset: 130; animation: draw-door-split 0.3s ease-out 1.4s forwards; }
        .wire-rope { stroke-dasharray: 72; stroke-dashoffset: 72; animation: draw-ropes 0.35s ease-out 1.5s forwards; }
        .button-panel { opacity: 0; animation: fade-in 0.4s ease-out 1.8s forwards; }
        .ceiling-light { opacity: 0; animation: light-appear 0.3s ease-out 1.9s forwards, light-flicker 1.5s infinite ease-in-out 2.2s; }
        .indicator-box { opacity: 0; animation: fade-in 0.3s ease-out 2.0s forwards; }
        .indicator-text-g { opacity: 0; animation: anim-g 0.3s forwards 2.0s; }
        .indicator-text-1 { opacity: 0; animation: anim-1 0.3s forwards 2.3s; }
        .indicator-text-2 { opacity: 0; animation: anim-2 0.3s forwards 2.6s; }
        .indicator-text-3 { opacity: 0; animation: anim-3 0.3s forwards 2.9s; }
        .cabin-group { transform-box: fill-box; transform-origin: center; animation: cabin-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2.2s forwards; }
        .progress-fill { animation: progress-fill 3.2s linear 0s forwards; }
        .status-text { font-family: 'Outfit', sans-serif; animation: status-fade 3.5s linear forwards; }
        .spark { transform-box: fill-box; transform-origin: center; opacity: 0; }
        .spark-tl-1 { animation: spark-out-tl1 0.4s ease-out 1.0s forwards; }
        .spark-tl-2 { animation: spark-out-tl2 0.4s ease-out 1.02s forwards; }
        .spark-tr-1 { animation: spark-out-tr1 0.4s ease-out 1.4s forwards; }
        .spark-tr-2 { animation: spark-out-tr2 0.4s ease-out 1.38s forwards; }
        .spark-bl-1 { animation: spark-out-bl1 0.4s ease-out 1.05s forwards; }
        .spark-bl-2 { animation: spark-out-bl2 0.4s ease-out 1.07s forwards; }
        .spark-br-1 { animation: spark-out-br1 0.4s ease-out 1.45s forwards; }
        .spark-br-2 { animation: spark-out-br2 0.4s ease-out 1.43s forwards; }
      ` }} />

      <div className="relative w-[180px] h-[260px]">
        <svg
          width="180"
          height="260"
          viewBox="0 0 180 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-hidden"
        >
          <rect
            className="shaft"
            x="10"
            y="10"
            width="160"
            height="240"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
            fill="none"
          />

          <line className="guide-rails" x1="25" y1="10" x2="25" y2="250" stroke="#1E3A8A" strokeWidth="3" />
          <line className="guide-rails" x1="155" y1="10" x2="155" y2="250" stroke="#1E3A8A" strokeWidth="3" />

          <g className="cabin-group">
            <line className="wire-rope" x1="70" y1="10" x2="70" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line className="wire-rope" x1="90" y1="10" x2="90" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line className="wire-rope" x1="110" y1="10" x2="110" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />

            <rect
              className="cabin-box"
              x="30"
              y="80"
              width="120"
              height="140"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              fill="rgba(255,255,255,0.03)"
            />

            <line className="panel-line" x1="70" y1="85" x2="70" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line className="panel-line" x1="110" y1="85" x2="110" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line className="door-split" x1="90" y1="85" x2="90" y2="215" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <line className="top-beam" x1="20" y1="82" x2="160" y2="82" stroke="#F97316" strokeWidth="3" />
            <line className="bottom-beam" x1="20" y1="218" x2="160" y2="218" stroke="#F97316" strokeWidth="3" />

            <g className="button-panel">
              <rect
                x="115"
                y="130"
                width="10"
                height="50"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                fill="rgba(255,255,255,0.05)"
              />
              <circle cx="120" cy="142" r="2.5" fill="rgba(249,115,22,0.7)" />
              <circle cx="120" cy="155" r="2.5" fill="rgba(249,115,22,0.7)" />
              <circle cx="120" cy="168" r="2.5" fill="rgba(249,115,22,0.7)" />
            </g>

            <rect
              className="ceiling-light"
              x="55"
              y="87"
              width="70"
              height="6"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              style={{ filter: "blur(1.5px)" }}
            />

            <rect
              className="indicator-box"
              x="70"
              y="65"
              width="40"
              height="14"
              fill="rgba(30,58,138,0.3)"
              stroke="#1E3A8A"
              strokeWidth="1"
              rx="3"
            />
            <text className="indicator-text-g" x="90" y="75.5" textAnchor="middle" fill="#1E3A8A" fontSize="8" fontFamily="monospace">G</text>
            <text className="indicator-text-1" x="90" y="75.5" textAnchor="middle" fill="#1E3A8A" fontSize="8" fontFamily="monospace">1</text>
            <text className="indicator-text-2" x="90" y="75.5" textAnchor="middle" fill="#1E3A8A" fontSize="8" fontFamily="monospace">2</text>
            <text className="indicator-text-3" x="90" y="75.5" textAnchor="middle" fill="#1E3A8A" fontSize="8" fontFamily="monospace">3</text>
          </g>

          {/* Particle Sparks */}
          <circle className="spark spark-tl-1" cx="20" cy="82" r="2" fill="#F97316" />
          <circle className="spark spark-tl-2" cx="20" cy="82" r="2" fill="#F97316" />
          <circle className="spark spark-tr-1" cx="160" cy="82" r="2" fill="#F97316" />
          <circle className="spark spark-tr-2" cx="160" cy="82" r="2" fill="#F97316" />
          <circle className="spark spark-bl-1" cx="20" cy="218" r="2" fill="#F97316" />
          <circle className="spark spark-bl-2" cx="20" cy="218" r="2" fill="#F97316" />
          <circle className="spark spark-br-1" cx="160" cy="218" r="2" fill="#F97316" />
          <circle className="spark spark-br-2" cx="160" cy="218" r="2" fill="#F97316" />
        </svg>
      </div>

      <div style={{ width: "180px", height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginTop: "24px" }} className="overflow-hidden">
        <div className="progress-fill" style={{ height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #1E3A8A 0%, #F97316 100%)", width: "0%" }} />
      </div>

      <div className="status-text" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", marginTop: "12px" }}>
        {statusText}
      </div>
    </div>
  );
}
