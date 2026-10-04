import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';

interface Stage6Props {
  onComplete: (strengthScore: number) => void;
}

export const Stage6PoundFiber: React.FC<Stage6Props> = ({ onComplete }) => {
  const [poundCount, setPoundCount] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const targetPounds = 7;

  const handlePound = () => {
    sound.playPound();
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 220);

    const next = poundCount + 1;
    setPoundCount(next);

    if (next >= targetPounds) {
      setTimeout(() => {
        onComplete(95);
      }, 500);
    }
  };

  const progress = Math.min(100, Math.round((poundCount / targetPounds) * 100));

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <FirstPersonHands tool="mallet" isActing={isStriking} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 06 · Tách Tơi Sợi Xơ
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Dùng Chày Gỗ Đập Dập
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nhấp hoặc chạm mạnh mẽ vào cối đá để nện chày gỗ, giúp giải phóng từng vi sợi thảo mộc mà không làm đứt gãy mạch sợi tự nhiên.
        </p>
      </div>

      {/* Stone Mortar Workspace */}
      <div className="w-full relative bg-stone-950/20 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-400/30 overflow-hidden flex flex-col items-center">
        {/* Large Stone Mortar Cavity */}
        <div
          onClick={handlePound}
          className="relative w-72 h-72 md:w-88 md:h-88 rounded-full bg-gradient-to-b from-stone-600 via-stone-700 to-stone-900 border-12 border-stone-800 shadow-2xl flex items-center justify-center cursor-pointer group active:scale-98 transition-transform"
        >
          {/* Mortar Stone Texture Rim */}
          <div className="absolute inset-2 rounded-full border-2 border-stone-500/30 pointer-events-none"></div>

          {/* Plant Fibers being flattened & tangled */}
          <div className="relative w-52 h-52 rounded-full bg-stone-950/40 p-4 flex items-center justify-center overflow-hidden">
            {/* Visual Fiber Web expanding with each pound */}
            <div
              style={{
                transform: `scale(${1 + poundCount * 0.08})`,
                opacity: 0.7 + poundCount * 0.04,
              }}
              className="relative w-44 h-44 rounded-full flex flex-wrap items-center justify-center transition-all duration-200"
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: `${25 + (poundCount * 3)}px`,
                    height: `${Math.max(2, 6 - Math.floor(poundCount * 0.6))}px`,
                    transform: `rotate(${(i * 47) % 360}deg) translate(${((i % 4) * 10)}px)`,
                  }}
                  className="absolute bg-gradient-to-r from-amber-200 via-emerald-200 to-amber-300 rounded-full opacity-80 shadow-xs"
                ></div>
              ))}
            </div>

            {/* Impact Flash Shockwave */}
            {isStriking && (
              <div className="absolute inset-0 bg-amber-100/30 rounded-full animate-ping pointer-events-none"></div>
            )}
          </div>

          {/* Prompt Overlay */}
          <div className="absolute bottom-5 bg-stone-900/80 text-amber-100 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm pointer-events-none flex items-center gap-2 group-hover:bg-stone-900 transition-colors">
            <span>Nhấp để nện chày ({poundCount}/{targetPounds})</span>
          </div>
        </div>

        {/* Progress & Fast Forward */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between w-full max-w-md gap-3 text-stone-700 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Độ tơi tách sợi xơ:</span>
            <div className="w-36 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-amber-700 transition-all duration-200"
              ></div>
            </div>
            <span className="text-xs text-stone-500 font-mono">{progress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playPound();
              onComplete(95);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua đập nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
