import React from 'react';
import { motion } from 'motion/react';

interface ActionIndicatorProps {
  count?: 1 | 2; // number of hands/indicator circles
  isActing?: boolean;
  label?: string;
  position?: 'center' | 'bottom' | 'custom';
  offsetX?: number;
  offsetY?: number;
}

export const ActionIndicator: React.FC<ActionIndicatorProps> = ({
  count = 1,
  isActing = false,
  label,
  offsetX = 0,
  offsetY = 0,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20 flex items-center justify-center">
      {count === 1 ? (
        // 1 Indicator Circle (Border only, no fill, never obscures the object)
        <motion.div
          animate={{
            x: offsetX,
            y: offsetY,
            scale: isActing ? [1, 0.88, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col items-center justify-center"
        >
          <div
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed transition-all duration-200 ${
              isActing
                ? 'border-amber-400 scale-95 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                : 'border-white/70 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
            }`}
          >
            {/* Center subtle dot marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
            </div>
          </div>
          {label && (
            <span className="text-[10px] font-mono text-amber-200/90 bg-stone-950/60 px-2 py-0.5 rounded-full mt-1 backdrop-blur-xs">
              {label}
            </span>
          )}
        </motion.div>
      ) : (
        // 2 Indicator Circles (Two-handed operation, e.g. deckle mould left/right)
        <div className="w-full max-w-xl flex items-center justify-between px-8 md:px-16">
          {/* Left indicator circle */}
          <motion.div
            animate={{
              x: offsetX * 0.5,
              y: offsetY * 0.3,
              scale: isActing ? 0.92 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed transition-all duration-200 ${
                isActing
                  ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  : 'border-white/70 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-amber-200/80 bg-stone-950/60 px-1.5 py-0.5 rounded-full mt-1">
              Tay trái
            </span>
          </motion.div>

          {/* Right indicator circle */}
          <motion.div
            animate={{
              x: offsetX * 0.5,
              y: offsetY * 0.3,
              scale: isActing ? 0.92 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed transition-all duration-200 ${
                isActing
                  ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  : 'border-white/70 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-amber-200/80 bg-stone-950/60 px-1.5 py-0.5 rounded-full mt-1">
              Tay phải
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
};
