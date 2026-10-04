import React from 'react';
import { motion } from 'motion/react';

interface FirstPersonHandsProps {
  tool: 'knife' | 'stir' | 'mallet' | 'pestle' | 'deckle' | 'brush' | 'tweezers' | 'none' | 'holding_paper';
  isActing: boolean; // e.g., currently swinging, cutting, or dipping
  actionType?: string;
  offsetX?: number;
  offsetY?: number;
}

export const FirstPersonHands: React.FC<FirstPersonHandsProps> = ({
  tool,
  isActing,
  offsetX = 0,
  offsetY = 0,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {/* 1. DECKLE MOULD HANDS (Two hands holding both sides of the bamboo deckle) */}
      {tool === 'deckle' && (
        <motion.div
          animate={{
            x: offsetX * 0.4,
            y: offsetY * 0.3 + (isActing ? 15 : 0),
            rotate: offsetX * 0.08,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="absolute inset-x-0 bottom-0 h-96 flex items-end justify-between px-4 md:px-24"
        >
          {/* Left Hand & Arm */}
          <div className="relative flex flex-col items-center origin-bottom-left -rotate-6">
            {/* Linen sleeve */}
            <div className="w-24 h-48 bg-gradient-to-t from-stone-800 via-stone-700 to-amber-950/80 rounded-t-3xl shadow-2xl border-t border-amber-900/30"></div>
            {/* Wrist & Hand gripping left deckle rail */}
            <div className="relative -mt-6 w-20 h-28 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl shadow-inner border border-amber-400/40">
              {/* Fingers wrapping */}
              <div className="absolute top-2 -right-3 w-7 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              <div className="absolute top-8 -right-4 w-7 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              <div className="absolute top-14 -right-4 w-7 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              <div className="absolute top-20 -right-3 w-6 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              {/* Thumb on top */}
              <div className="absolute top-4 left-2 w-8 h-12 bg-amber-300 rounded-full -rotate-12 shadow-md"></div>
            </div>
          </div>

          {/* Right Hand & Arm */}
          <div className="relative flex flex-col items-center origin-bottom-right rotate-6">
            {/* Linen sleeve */}
            <div className="w-24 h-48 bg-gradient-to-t from-stone-800 via-stone-700 to-amber-950/80 rounded-t-3xl shadow-2xl border-t border-amber-900/30"></div>
            {/* Wrist & Hand gripping right deckle rail */}
            <div className="relative -mt-6 w-20 h-28 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl shadow-inner border border-amber-400/40">
              {/* Fingers wrapping */}
              <div className="absolute top-2 -left-3 w-7 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              <div className="absolute top-8 -left-4 w-7 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              <div className="absolute top-14 -left-4 w-7 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              <div className="absolute top-20 -left-3 w-6 h-5 bg-amber-200 rounded-full shadow-sm"></div>
              {/* Thumb on top */}
              <div className="absolute top-4 right-2 w-8 h-12 bg-amber-300 rounded-full rotate-12 shadow-md"></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. BAMBOO KNIFE / CHOPPING TOOL (Right hand holding traditional blade) */}
      {tool === 'knife' && (
        <motion.div
          animate={
            isActing
              ? {
                  x: [0, -10, 5, 0],
                  y: [0, 45, -15, 0],
                  rotate: [0, -18, 4, 0],
                }
              : {
                  x: offsetX * 0.15,
                  y: offsetY * 0.15,
                  rotate: 0,
                }
          }
          transition={{ duration: isActing ? 0.14 : 0.2, ease: 'easeOut' }}
          className="absolute right-12 md:right-32 bottom-0 flex flex-col items-center origin-bottom-right"
        >
          {/* Blade extending upward */}
          <div className="relative -mb-10 w-8 h-44 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-t-xl shadow-lg border-l-2 border-slate-100 flex items-center justify-center -rotate-12 origin-bottom">
            {/* Cutting edge highlight */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
            <div className="w-1 h-32 bg-slate-400/40 rounded-full"></div>
          </div>

          {/* Wooden / Brass Ferrule */}
          <div className="w-9 h-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-sm shadow-md"></div>

          {/* Hand gripping handle */}
          <div className="relative w-20 h-28 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl shadow-2xl border border-amber-400/40">
            {/* Knuckles & fingers */}
            <div className="absolute top-2 left-2 w-14 h-5 bg-amber-300 rounded-full shadow-sm"></div>
            <div className="absolute top-8 left-2 w-14 h-5 bg-amber-300 rounded-full shadow-sm"></div>
            <div className="absolute top-14 left-2 w-14 h-5 bg-amber-300 rounded-full shadow-sm"></div>
            <div className="absolute top-20 left-2 w-12 h-5 bg-amber-300 rounded-full shadow-sm"></div>
            {/* Thumb wrapped around */}
            <div className="absolute top-6 -left-3 w-6 h-10 bg-amber-200 rounded-full rotate-45 shadow-sm"></div>
          </div>

          {/* Arm Sleeve */}
          <div className="w-24 h-48 bg-gradient-to-t from-stone-800 via-stone-700 to-amber-950/80 rounded-t-2xl shadow-2xl"></div>
        </motion.div>
      )}

      {/* 3. HEAVY WOODEN MALLET / PESTLE (For pounding fibers) */}
      {tool === 'mallet' && (
        <motion.div
          animate={
            isActing
              ? {
                  y: [0, -90, 60, 0],
                  scale: [1, 0.95, 1.08, 1],
                  rotate: [0, 8, -6, 0],
                }
              : {
                  x: offsetX * 0.1,
                  y: offsetY * 0.1,
                  rotate: 0,
                }
          }
          transition={{ duration: isActing ? 0.22 : 0.2, ease: 'easeInOut' }}
          className="absolute right-1/2 translate-x-1/2 bottom-0 flex flex-col items-center origin-bottom pointer-events-none"
        >
          {/* Mallet Head (Heavy carved hardwood) */}
          <div className="relative -mb-4 w-44 h-24 bg-gradient-to-b from-amber-900 via-stone-800 to-amber-950 rounded-2xl shadow-2xl border-b-4 border-stone-900 flex items-center justify-center">
            {/* Wood grain ring lines */}
            <div className="absolute inset-x-4 top-2 h-1 bg-amber-800/40 rounded-full"></div>
            <div className="absolute inset-x-6 top-6 h-1 bg-amber-950/60 rounded-full"></div>
            <div className="w-36 h-4 bg-amber-950/80 rounded-full"></div>
          </div>

          {/* Mallet Long Handle */}
          <div className="w-8 h-48 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-full shadow-lg"></div>

          {/* Artisan Hands (Two-handed grip) */}
          <div className="relative -mt-36 flex flex-col items-center">
            {/* Top Hand */}
            <div className="w-20 h-16 bg-gradient-to-b from-amber-200 to-amber-300 rounded-2xl shadow-md border border-amber-400/40"></div>
            {/* Bottom Hand */}
            <div className="mt-2 w-20 h-16 bg-gradient-to-b from-amber-200 to-amber-300 rounded-2xl shadow-md border border-amber-400/40"></div>
            {/* Forearm */}
            <div className="mt-2 w-28 h-36 bg-gradient-to-t from-stone-800 to-stone-700 rounded-t-3xl shadow-2xl"></div>
          </div>
        </motion.div>
      )}

      {/* 4. HORSEHAIR BRUSH (For smoothing paper during drying) */}
      {tool === 'brush' && (
        <motion.div
          animate={
            isActing
              ? {
                  x: [-30, 40, -30],
                  y: [-10, 15, -10],
                  rotate: [-12, 10, -12],
                }
              : {
                  x: offsetX * 0.2,
                  y: offsetY * 0.2,
                  rotate: 0,
                }
          }
          transition={{ duration: isActing ? 0.35 : 0.2, ease: 'easeInOut' }}
          className="absolute right-20 md:right-40 bottom-0 flex flex-col items-center origin-bottom-right"
        >
          {/* Brush Bristles (Soft natural hair) */}
          <div className="relative -mb-6 w-32 h-20 bg-gradient-to-b from-amber-100 via-amber-200 to-stone-400 rounded-t-2xl shadow-md border-t-2 border-amber-300 flex items-end justify-center">
            <div className="w-28 h-6 bg-amber-300/30 rounded-full"></div>
          </div>

          {/* Wooden Brush Block Handle */}
          <div className="w-36 h-10 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-xl shadow-lg border border-amber-950"></div>

          {/* Hand holding brush back */}
          <div className="relative -mt-4 w-24 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl shadow-xl border border-amber-400/40 flex items-center justify-center">
            <div className="w-16 h-8 bg-amber-300/60 rounded-full"></div>
          </div>

          {/* Arm sleeve */}
          <div className="w-28 h-48 bg-gradient-to-t from-stone-800 via-stone-700 to-amber-950/80 rounded-t-2xl shadow-2xl"></div>
        </motion.div>
      )}

      {/* 5. BAMBOO TWEEZERS / TONGS (For botanical petal placement) */}
      {tool === 'tweezers' && (
        <motion.div
          animate={{
            x: offsetX * 0.2,
            y: offsetY * 0.2 + (isActing ? 10 : 0),
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute right-24 md:right-48 bottom-0 flex flex-col items-center origin-bottom"
        >
          {/* Bamboo tweezer tips */}
          <div className="relative -mb-4 flex gap-1 items-end">
            <div className="w-1.5 h-36 bg-amber-600 rounded-t-full shadow-sm"></div>
            <div className="w-1.5 h-36 bg-amber-700 rounded-t-full shadow-sm"></div>
          </div>

          {/* Hand gripping tweezers */}
          <div className="relative -mt-16 w-20 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl shadow-xl border border-amber-400/40">
            <div className="absolute top-4 left-2 w-8 h-10 bg-amber-300 rounded-full -rotate-12"></div>
            <div className="absolute top-10 right-2 w-6 h-6 bg-amber-200 rounded-full"></div>
          </div>

          {/* Arm sleeve */}
          <div className="w-24 h-48 bg-gradient-to-t from-stone-800 via-stone-700 to-amber-950/80 rounded-t-2xl shadow-2xl"></div>
        </motion.div>
      )}

      {/* 6. WOODEN STIRRING PADDLE (For boiling pot and vat mixing) */}
      {tool === 'stir' && (
        <motion.div
          animate={
            isActing
              ? {
                  x: [-35, 35, -35],
                  y: [-15, 20, -15],
                  rotate: [-14, 14, -14],
                }
              : {
                  x: offsetX * 0.2,
                  y: offsetY * 0.2,
                }
          }
          transition={{ duration: isActing ? 0.5 : 0.2, ease: 'easeInOut' }}
          className="absolute right-28 md:right-56 bottom-0 flex flex-col items-center origin-bottom"
        >
          {/* Flat paddle blade */}
          <div className="relative -mb-8 w-16 h-56 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-t-3xl shadow-xl border-t border-amber-500/40"></div>
          
          {/* Round handle */}
          <div className="w-6 h-36 bg-amber-800 shadow-md"></div>

          {/* Hands holding paddle */}
          <div className="relative -mt-20 w-22 h-26 bg-gradient-to-b from-amber-200 to-amber-300 rounded-3xl shadow-xl border border-amber-400/40"></div>
          
          {/* Arm sleeve */}
          <div className="w-24 h-44 bg-gradient-to-t from-stone-800 to-stone-700 rounded-t-2xl shadow-2xl"></div>
        </motion.div>
      )}

      {/* 7. HOLDING PAPER (Two hands holding finished paper sheet up to view) */}
      {tool === 'holding_paper' && (
        <div className="absolute inset-x-0 bottom-0 h-40 flex items-end justify-between px-8 md:px-32">
          {/* Left Hand holding bottom corner */}
          <div className="relative w-24 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-t-3xl shadow-xl border border-amber-400/40 -rotate-12">
            <div className="absolute -top-3 left-4 w-6 h-8 bg-amber-200 rounded-full shadow-sm"></div>
            <div className="absolute -top-4 left-10 w-6 h-9 bg-amber-200 rounded-full shadow-sm"></div>
          </div>
          {/* Right Hand holding bottom corner */}
          <div className="relative w-24 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded-t-3xl shadow-xl border border-amber-400/40 rotate-12">
            <div className="absolute -top-4 right-10 w-6 h-9 bg-amber-200 rounded-full shadow-sm"></div>
            <div className="absolute -top-3 right-4 w-6 h-8 bg-amber-200 rounded-full shadow-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
};
