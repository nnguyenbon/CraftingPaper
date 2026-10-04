import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Scissors } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';

interface Stage2Props {
  onComplete: (accuracy: number) => void;
}

export const Stage2CutGrass: React.FC<Stage2Props> = ({ onComplete }) => {
  const [cuts, setCuts] = useState<number[]>([]); // cut indices
  const [isSwinging, setIsSwinging] = useState(false);
  const totalCutsNeeded = 6;

  const handleCut = (index: number) => {
    if (cuts.includes(index)) return;
    sound.playSnip();
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 160);

    const newCuts = [...cuts, index];
    setCuts(newCuts);

    if (newCuts.length >= totalCutsNeeded) {
      setTimeout(() => {
        onComplete(95);
      }, 500);
    }
  };

  const progress = Math.min(100, Math.round((cuts.length / totalCutsNeeded) * 100));

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* First Person Hands with Knife */}
      <FirstPersonHands tool="knife" isActing={isSwinging} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 02 · Chuẩn Bị Sợi
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Cắt Cỏ Thành Từng Đoạn
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nhấp hoặc chạm dọc theo các đường vạch đứt trên thớt để hạ dao cắt các nhánh cỏ tươi thành từng đoạn 5–7cm.
        </p>
      </div>

      {/* Workspace Cutting Board */}
      <div className="w-full relative bg-amber-950/20 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-900/20 overflow-hidden">
        {/* Wooden Workbench Surface Texture */}
        <div className="w-full h-80 relative rounded-2xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-inner border-4 border-amber-950/60 flex items-center justify-center p-6">
          {/* Wood grain ring lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent"></div>

          {/* Grass Bundles lying horizontally across board */}
          <div className="relative w-full max-w-2xl h-36 flex items-center justify-between px-4">
            {/* Background grass leaves */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 rounded-full blur-[1px] opacity-85 shadow-lg"></div>
              {/* Detailed grass leaf lines */}
              <div className="absolute inset-x-2 h-1 bg-emerald-300/40 rounded-full top-8"></div>
              <div className="absolute inset-x-6 h-1 bg-lime-200/50 rounded-full top-14"></div>
              <div className="absolute inset-x-4 h-1 bg-emerald-900/30 rounded-full top-20"></div>
            </div>

            {/* Cut Segments & Target Cut Lines */}
            {Array.from({ length: totalCutsNeeded }).map((_, idx) => {
              const isCut = cuts.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCut(idx)}
                  className={`relative z-10 w-12 h-32 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    isCut ? 'opacity-80' : 'hover:scale-105'
                  }`}
                  aria-label={`Vết cắt số ${idx + 1}`}
                >
                  {/* Guideline line */}
                  <div
                    className={`w-1 h-28 rounded-full transition-all duration-300 ${
                      isCut
                        ? 'bg-amber-950 shadow-inner translate-y-1'
                        : 'bg-white/80 group-hover:bg-amber-300 shadow-md border-dashed border-stone-800'
                    }`}
                  ></div>

                  {/* Cut Marker Indicator */}
                  {!isCut && (
                    <div className="absolute top-2 w-7 h-7 rounded-full bg-amber-100 text-stone-800 border border-amber-400 flex items-center justify-center shadow-md animate-bounce text-xs font-bold">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {isCut && (
                    <div className="absolute -top-1 text-xs text-amber-200 font-serif">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress & Quick Manual Bypass */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-stone-700 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-medium">Tiến độ cắt cỏ:</span>
            <div className="w-40 h-2.5 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-emerald-600 transition-all duration-300"
              ></div>
            </div>
            <span className="text-xs text-stone-500 font-mono">{cuts.length}/{totalCutsNeeded} nhát</span>
          </div>

          <button
            onClick={() => {
              cuts.length === 0 && sound.playSnip();
              onComplete(90);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua cắt nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
