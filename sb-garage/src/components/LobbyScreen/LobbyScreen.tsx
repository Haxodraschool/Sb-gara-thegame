'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { useInterval } from 'react-use';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import * as Progress from '@radix-ui/react-progress';

/* ─── Inline SVG Icons ─── */
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CoinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" fill="#EAB308" />
    <circle cx="12" cy="12" r="7" fill="#FDE047" />
    <rect x="10" y="8" width="4" height="8" fill="#CA8A04" />
  </svg>
);

const CardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const DeckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    {/* Back card (offset) */}
    <rect x="6" y="8" width="18" height="22" rx="1" fill="#754b29" stroke="#111" strokeWidth="2" />
    {/* Main card */}
    <rect x="4" y="4" width="18" height="22" rx="1" fill="#b07842" stroke="#111" strokeWidth="2" />
    {/* Inner decorative border */}
    <rect x="6" y="6" width="14" height="18" fill="none" stroke="#f6c963" strokeWidth="1.5" />
    {/* Diamond symbol */}
    <path d="M13 10 L17 15 L13 20 L9 15 Z" fill="#f6c963" stroke="#111" strokeWidth="1" strokeLinejoin="miter" />
    {/* Inner small diamond */}
    <path d="M13 12.5 L15 15 L13 17.5 L11 15 Z" fill="#8c5830" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

/* ─── Component ─── */
export default function LobbyScreen() {
  const user = useGameStore((state) => state.user);
  const { setTheme } = useTheme();

  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Update clock every second
  useInterval(() => setTime(new Date()), 1000);

  // Sync theme with real time
  useEffect(() => {
    if (!mounted) return;
    const hours = time.getHours();
    setTheme(hours >= 6 && hours < 18 ? 'light' : 'dark');
  }, [time, mounted, setTheme]);

  // Derived values
  const currentLevel = user?.level || 5;
  const currentDay = user?.currentDay || 15;
  const gold = user?.gold || 1250;
  const prestigePoints = user?.garageHealth || 75;
  const maxPrestige = 100;

  const timeStr = mounted ? format(time, 'hh:mm a') : '00:00 --';

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden bg-black select-none flex items-center justify-center font-pixel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background blur layer — fills letterbox areas on non-16:9 screens */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-105 pointer-events-none"
        style={{ backgroundImage: 'url("/bg-lobby.jpg")' }}
      />

      {/* Game container — locked to 16:9 aspect ratio, always shows full image */}
      <div
        className="relative z-10 w-full h-full max-w-[177.78vh] max-h-[56.25vw] bg-center bg-no-repeat bg-cover shadow-[0_0_40px_rgba(0,0,0,1)] flex flex-col justify-between"
        style={{
          backgroundImage: 'url("/bg-lobby.jpg")',
          imageRendering: 'pixelated',
        }}
      >
        {/* HUD overlay */}
        <div className="absolute inset-0 pointer-events-none p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-between">

          {/* ═══ TOP ROW ═══ */}
          <div className="flex justify-between items-start w-full">

            {/* Top-Left: Branding + Day */}
            <div className="flex flex-col gap-3 pointer-events-auto">
              <motion.div 
                className="relative bg-[#080810]/80 backdrop-blur-md rounded-md flex items-center justify-center px-6 py-3 min-w-[240px] overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(0,229,255,0.1), inset 0 0 10px rgba(0,229,255,0.1)",
                    "0 0 20px rgba(0,229,255,0.3), inset 0 0 20px rgba(0,229,255,0.2)",
                    "0 0 10px rgba(0,229,255,0.1), inset 0 0 10px rgba(0,229,255,0.1)"
                  ],
                  border: [
                    "1px solid rgba(0,229,255,0.3)",
                    "1px solid rgba(0,229,255,0.7)",
                    "1px solid rgba(0,229,255,0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* ─── Tech UI Details ─── */}
                {/* Cyberpunk scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,229,255,0.4) 3px)' }} />
                
                {/* 4 Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-[2px] border-l-[2px] border-[#ff2d55] bg-transparent" style={{ boxShadow: '-2px -2px 5px rgba(255,45,85,0.5)' }} />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-[2px] border-r-[2px] border-[#ff2d55] bg-transparent" style={{ boxShadow: '2px -2px 5px rgba(255,45,85,0.5)' }} />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-[2px] border-l-[2px] border-[#00e5ff] bg-transparent" style={{ boxShadow: '-2px 2px 5px rgba(0,229,255,0.5)' }} />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-[2px] border-r-[2px] border-[#00e5ff] bg-transparent" style={{ boxShadow: '2px 2px 5px rgba(0,229,255,0.5)' }} />

                {/* Glitch lines left/right */}
                <motion.div className="absolute left-1 w-[2px] h-1/3 bg-[#00e5ff]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <motion.div className="absolute right-1 w-[2px] h-1/3 bg-[#ff2d55]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />

                <div className="flex items-center justify-center gap-0 text-3xl sm:text-[34px] pb-1 tracking-[0.15em] font-bold z-10 w-full relative">
                  <span
                    className="relative"
                    style={{
                      color: '#ff2d55',
                      textShadow: `
                        0 0 4px rgba(255,45,85,0.9),
                        0 0 10px rgba(255,45,85,0.7),
                        0 0 20px rgba(255,45,85,0.4)
                      `,
                      WebkitTextStroke: '0.5px rgba(255,45,85,0.3)',
                      imageRendering: 'pixelated',
                    }}
                  >
                    SB
                  </span>
                  <span
                    className="relative mx-0"
                    style={{
                      color: '#c026d3',
                      textShadow: `
                        0 0 4px rgba(192,38,211,0.9),
                        0 0 10px rgba(192,38,211,0.7),
                        0 0 20px rgba(192,38,211,0.4)
                      `,
                      imageRendering: 'pixelated',
                    }}
                  >
                    -
                  </span>
                  <span
                    className="relative"
                    style={{
                      color: '#00e5ff',
                      textShadow: `
                        0 0 4px rgba(0,229,255,0.9),
                        0 0 10px rgba(0,229,255,0.6),
                        0 0 20px rgba(0,229,255,0.3)
                      `,
                      WebkitTextStroke: '0px transparent',
                      imageRendering: 'pixelated',
                    }}
                  >
                    GARAGE
                  </span>
                </div>
              </motion.div>
              <div className="text-white text-3xl sm:text-[34px] drop-shadow-[3px_3px_0_#111] font-bold tracking-wider ml-1">
                NGÀY {currentDay}/50
              </div>
            </div>

            {/* Top-Right: Clock / Gold / Prestige */}
            <div className="flex flex-col gap-3 items-end w-[280px] pointer-events-auto">

              {/* Clock */}
              <motion.div className="flex items-center gap-3 bg-zinc-800/90 border-[3px] border-zinc-900 rounded p-2 w-full justify-start shadow-lg backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                <div className="bg-zinc-700 p-1 rounded-sm">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-2xl sm:text-3xl drop-shadow-[1px_1px_0_rgba(0,0,0,1)] mt-1">
                  {timeStr}
                </span>
              </motion.div>

              {/* Gold */}
              <motion.div className="flex items-center gap-3 bg-zinc-800/90 border-[3px] border-zinc-900 rounded p-2 w-full justify-between shadow-lg backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                <div className="bg-zinc-700 p-1 rounded-sm flex items-center justify-center">
                  <CoinIcon className="w-6 h-6" />
                </div>
                <span className="text-yellow-400 text-2xl sm:text-3xl drop-shadow-[1px_1px_0_rgba(0,0,0,1)] mt-1">
                  {gold.toLocaleString()} G
                </span>
              </motion.div>

              {/* Prestige bar */}
              <motion.div className="bg-zinc-800/90 border-[3px] border-zinc-900 rounded p-3 w-full flex flex-col gap-1 shadow-lg backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-xl sm:text-2xl drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">UY TÍN</span>
                  <span className="text-white text-xl sm:text-2xl drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">LEVEL {currentLevel}</span>
                </div>
                <Progress.Root className="relative w-full h-6 sm:h-8 bg-zinc-950 border-[3px] border-zinc-900 overflow-hidden" value={prestigePoints}>
                  <Progress.Indicator
                    className="h-full bg-lime-400 transition-all duration-500 ease-in-out border-r-[2px] border-lime-200"
                    style={{ width: `${(prestigePoints / maxPrestige) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-zinc-900 font-bold text-lg sm:text-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] z-10 pointer-events-none">
                    {prestigePoints}/{maxPrestige}
                  </span>
                </Progress.Root>
              </motion.div>

            </div>
          </div>

          {/* ═══ BOTTOM ROW ═══ */}
          <div className="flex justify-between items-end w-full">

            {/* Bottom-Left: Inventory */}
            <motion.button
              className="pointer-events-auto active:translate-y-1 active:shadow-none transition-all group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative flex items-center justify-center w-[200px] sm:w-[240px]">
                <Image 
                  src="/deckbutton.png" 
                  alt="Deck Button" 
                  width={240}
                  height={100}
                  className="w-full h-auto object-contain drop-shadow-[0_6px_0_rgba(0,0,0,0.8)] group-hover:brightness-110 group-hover:-translate-y-1 transition-all duration-300"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute -inset-2 bg-yellow-500/0 group-hover:bg-yellow-500/10 blur-xl rounded-full transition-all duration-300 pointer-events-none" />
              </div>
            </motion.button>

            {/* Bottom-Right: End Day */}
            <motion.button
              className="bg-[#1e1e21] border-[3px] border-[#101010] p-1 sm:p-[6px] rounded-[12px] shadow-[0_5px_0_rgba(0,0,0,0.8)] pointer-events-auto active:translate-y-1 active:shadow-none transition-all group min-w-[200px] sm:min-w-[240px]"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-[#32353c] border-[3px] border-[#484b52] group-hover:border-[#5a5e66] rounded-md p-2 sm:p-3 flex items-center justify-center gap-4 w-full h-full transition-colors">
                <div className="relative flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fca100" className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[2px_3px_0_#111] group-hover:brightness-110 transition-colors" style={{ strokeWidth: 4, strokeLinecap: 'square' }}>
                    <polyline points="4 13 9 18 20 6" />
                  </svg>
                </div>
                <div className="flex flex-col items-center justify-center leading-none gap-2 mt-1">
                  <span className="text-[#fca100] text-2xl sm:text-[32px] drop-shadow-[1px_2px_0_#111] font-bold tracking-widest" style={{ WebkitTextStroke: '1px #333' }}>
                    KẾT THÚC
                  </span>
                  <span className="text-[#fca100] text-2xl sm:text-[32px] drop-shadow-[1px_2px_0_#111] font-bold tracking-widest" style={{ WebkitTextStroke: '1px #333' }}>
                    NGÀY
                  </span>
                </div>
              </div>
            </motion.button>

          </div>

        </div>
        {/* end HUD overlay */}
      </div>
      {/* end game container */}
    </motion.div>
  );
}
