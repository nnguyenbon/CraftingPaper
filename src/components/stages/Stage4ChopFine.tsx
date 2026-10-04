import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Scissors } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';
import { MaterialConfig } from '../../types/paper';

interface Stage4Props {
  materials: MaterialConfig;
  onComplete: () => void;
}

export const Stage4ChopFine: React.FC<Stage4Props> = ({ materials, onComplete }) => {
  const [chopCount, setChopCount] = useState(0);
  const [isSwinging, setIsSwinging] = useState(false);
  const targetChops = 8;

  const handleChop = () => {
    sound.playSnip();
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 120);

    const next = chopCount + 1;
    setChopCount(next);

    if (next >= targetChops) {
      setTimeout(() => {
        onComplete();
      }, 400);
    }
  };

  const progress = Math.min(100, Math.round((chopCount / targetChops) * 100));

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <FirstPersonHands tool="knife" isActing={isSwinging} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 04 · Băm Nhỏ Nấu Nước Tro
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Băm Nhỏ Nguyên Liệu
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nhấp hoặc chạm nhịp nhàng vào thớt để băm cỏ và nguyên liệu phối thành các khúc ngắn 1–2cm, giúp nước tro thẩm thấu sâu vào từng bó xơ.
        </p>
      </div>

      {/* Cutting Workbench */}
      <div className="w-full relative bg-amber-950/20 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-900/20 overflow-hidden">
        <div
          onClick={handleChop}
          className="w-full h-80 relative rounded-2xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 shadow-inner border-4 border-amber-950/60 flex items-center justify-center p-6 cursor-pointer group"
        >
          {/* Wood Board Texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent"></div>

          {/* Grass pile transforming from coarse bundles into fine minced pieces */}
          <div className="relative w-full max-w-lg h-44 flex flex-wrap items-center justify-center gap-1.5 p-4 bg-amber-950/30 rounded-2xl border border-amber-900/40">
            {Array.from({ length: 32 }).map((_, i) => {
              const isChopped = i < chopCount * 4;
              return (
                <div
                  key={i}
                  style={{
                    width: isChopped ? '14px' : '38px',
                    height: isChopped ? '6px' : '10px',
                    transform: `rotate(${((i * 37) % 180) - 90}deg)`,
                  }}
                  className={`rounded-full transition-all duration-200 shadow-sm ${
                    i % 4 === 0 && materials.additiveType !== 'none'
                      ? 'bg-amber-300'
                      : 'bg-gradient-to-r from-emerald-500 to-lime-500'
                  } ${isChopped ? 'opacity-90' : 'opacity-70'}`}
                ></div>
              );
            })}
          </div>

          {/* Click prompt overlay */}
          <div className="absolute bottom-5 bg-stone-900/80 text-amber-100 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm pointer-events-none flex items-center gap-2 group-hover:bg-stone-900 transition-colors">
            <Scissors className="w-3.5 h-3.5" />
            <span>Nhấp liên tục để băm nhỏ ({chopCount}/{targetChops})</span>
          </div>
        </div>

        {/* Progress & Skip */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-stone-700 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-medium">Độ nhỏ của nguyên liệu:</span>
            <div className="w-40 h-2.5 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-amber-600 transition-all duration-300"
              ></div>
            </div>
            <span className="text-xs text-stone-500 font-mono">{progress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playSnip();
              onComplete();
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua băm nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
