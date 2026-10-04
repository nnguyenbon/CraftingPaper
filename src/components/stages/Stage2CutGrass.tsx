import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Scissors } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage2Props {
  materials: MaterialConfig;
  onComplete: (accuracy: number) => void;
}

export const Stage2CutGrass: React.FC<Stage2Props> = ({ materials, onComplete }) => {
  const [cuts, setCuts] = useState<number[]>([]);
  const [activeCutIndex, setActiveCutIndex] = useState<number | null>(null);
  const totalCutsNeeded = 5;

  const handleCut = (index: number) => {
    if (cuts.includes(index)) return;
    sound.playSnip();
    setActiveCutIndex(index);
    setTimeout(() => setActiveCutIndex(null), 200);

    const newCuts = [...cuts, index];
    setCuts(newCuts);

    if (newCuts.length >= totalCutsNeeded) {
      setTimeout(() => {
        onComplete(95);
      }, 600);
    }
  };

  const progress = Math.min(100, Math.round((cuts.length / totalCutsNeeded) * 100));
  const isPandan = materials.grassType === 'pandan';

  // 10 distinct, slender, long grass stalks across the board
  const stalkStyles = [
    { top: 28, delay: 0 },
    { top: 38, delay: 0.1 },
    { top: 48, delay: 0.05 },
    { top: 58, delay: 0.15 },
    { top: 68, delay: 0.02 },
    { top: 78, delay: 0.18 },
    { top: 88, delay: 0.08 },
    { top: 98, delay: 0.12 },
    { top: 108, delay: 0.04 },
    { top: 118, delay: 0.16 },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator indicating single-hand cutting position */}
      {activeCutIndex !== null && (
        <ActionIndicator
          count={1}
          isActing={true}
          offsetX={(activeCutIndex - 2) * 90}
          offsetY={0}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 02 · Cắt Cỏ
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Cắt Cỏ Thành Từng Đoạn
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          Nhấp dọc theo 5 đường cắt trên thớt để hạ dao cắt 10 cọng {isPandan ? 'cỏ lá dứa' : 'cỏ lá sả'} mảnh dài thành từng đoạn ngắn chuẩn bị rửa sạch.
        </p>
      </div>

      {/* Workspace Cutting Board */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200">
        <div className="w-full h-80 relative rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 shadow-2xl border-4 border-amber-950 flex items-center justify-center p-6 overflow-hidden">
          {/* Wood grain lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent"></div>

          {/* Cutting Area Container */}
          <div className="relative w-full max-w-2xl h-56 flex items-center justify-between px-6">
            {/* 10 Slender, Long, Thin Grass Stalks */}
            <div className="absolute inset-x-8 inset-y-6 flex flex-col justify-between pointer-events-none">
              {stalkStyles.map((stalk, sIdx) => (
                <div
                  key={sIdx}
                  className="relative w-full h-1.5 flex items-center"
                >
                  {/* Each stalk is broken up by the 5 cuts into 6 distinct segments */}
                  {Array.from({ length: 6 }).map((_, segIdx) => {
                    const isLeftCut = cuts.includes(segIdx - 1);
                    const isRightCut = cuts.includes(segIdx);
                    return (
                      <div
                        key={segIdx}
                        style={{
                          width: `${100 / 6}%`,
                          transform: isLeftCut || isRightCut ? `translateY(${((sIdx + segIdx) % 2 === 0 ? 1 : -1) * 2}px)` : 'none',
                        }}
                        className={`h-full transition-all duration-300 ${
                          isLeftCut ? 'ml-1.5' : ''
                        } ${
                          isPandan
                            ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800'
                            : 'bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-600'
                        } rounded-xs shadow-xs border-y border-emerald-900/30`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* 5 Distinct Cut Line Targets - completely visible and unobstructed */}
            {Array.from({ length: totalCutsNeeded }).map((_, idx) => {
              const isCut = cuts.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCut(idx)}
                  className={`relative z-10 w-12 h-44 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    isCut ? 'opacity-85' : 'hover:scale-105'
                  }`}
                  aria-label={`Đường cắt số ${idx + 1}`}
                >
                  {/* Guideline bar */}
                  <div
                    className={`w-1 h-36 rounded-full transition-all duration-200 ${
                      isCut
                        ? 'bg-amber-950/90 shadow-inner'
                        : 'bg-white/80 group-hover:bg-amber-300 shadow-md border-dashed border-stone-800'
                    }`}
                  ></div>

                  {/* Cut marker indicator */}
                  {!isCut ? (
                    <div className="absolute top-2 w-7 h-7 rounded-full border-2 border-dashed border-amber-300 bg-stone-900/80 text-amber-200 flex items-center justify-center shadow-lg group-hover:border-amber-400 group-hover:scale-110 transition-transform">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="absolute -top-1 w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Status & Skip */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-700 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-stone-900">Tiến độ cắt cỏ:</span>
            <div className="w-44 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-emerald-600 transition-all duration-300"
              ></div>
            </div>
            <span className="font-mono text-stone-600">{cuts.length}/{totalCutsNeeded} nhát cắt</span>
          </div>

          <button
            onClick={() => {
              cuts.length === 0 && sound.playSnip();
              onComplete(92);
            }}
            className="text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua cắt nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
