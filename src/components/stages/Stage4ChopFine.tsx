import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Scissors } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage4Props {
  materials: MaterialConfig;
  onComplete: () => void;
}

export const Stage4ChopFine: React.FC<Stage4Props> = ({ materials, onComplete }) => {
  const [chopCount, setChopCount] = useState(0);
  const [activeChopPos, setActiveChopPos] = useState<{ x: number; y: number } | null>(null);
  const targetChops = 7;

  const isPandan = materials.grassType === 'pandan';

  const handleChop = (e: React.MouseEvent<HTMLDivElement>) => {
    sound.playSnip();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setActiveChopPos({ x, y });
    setTimeout(() => setActiveChopPos(null), 180);

    const next = chopCount + 1;
    setChopCount(next);

    if (next >= targetChops) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const progress = Math.min(100, Math.round((chopCount / targetChops) * 100));

  // 36 grass bits that gradually shrink in length and multiply in fine snippets
  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator tracking chop hit point without blocking view */}
      {activeChopPos && (
        <ActionIndicator
          count={1}
          isActing={true}
          offsetX={activeChopPos.x}
          offsetY={activeChopPos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 04 · Băm Nhỏ
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Băm Nhỏ Cỏ Chuẩn Bị Nấu
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nhấp chuột trực tiếp lên bề mặt thớt để băm cỏ thành từng mẩu vụn ngắn 1–2cm, giúp kiềm tro ngấm đều khi nấu.
        </p>
      </div>

      {/* Cutting Workbench */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200">
        <div
          onClick={handleChop}
          className="w-full h-80 relative rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 shadow-2xl border-4 border-amber-950 flex items-center justify-center p-6 cursor-pointer overflow-hidden group"
        >
          {/* Wood grain pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent"></div>

          {/* Grass pile transforming from longer segments to tiny minced bits */}
          <div className="relative w-full max-w-md h-52 flex flex-wrap items-center justify-center gap-1.5 p-4 bg-amber-950/40 rounded-2xl border border-amber-900/40 shadow-inner">
            {Array.from({ length: 36 }).map((_, i) => {
              // As chopCount increases, width shrinks from 32px down to 8px!
              const currentWidth = Math.max(7, 34 - Math.floor(chopCount * 3.8));
              const isAdditive = i % 4 === 0 && materials.additiveType !== 'none';
              return (
                <div
                  key={i}
                  style={{
                    width: `${currentWidth}px`,
                    height: `${chopCount > 4 ? 2 : 2.5}px`,
                    transform: `rotate(${((i * 37 + chopCount * 18) % 180) - 90}deg)`,
                  }}
                  className={`rounded-full transition-all duration-150 shadow-xs ${
                    isAdditive
                      ? 'bg-amber-300'
                      : isPandan
                      ? 'bg-emerald-600'
                      : 'bg-lime-400'
                  }`}
                ></div>
              );
            })}

            {/* Hint overlay placed at the top-right corner so it never obscures the grass pile */}
            <div className="absolute top-2.5 right-3 bg-stone-900/80 text-amber-200 text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 pointer-events-none">
              <Scissors className="w-3 h-3 text-amber-300" />
              <span>Nhấp thớt ({chopCount}/{targetChops})</span>
            </div>
          </div>
        </div>

        {/* Bottom Status & Skip */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-700 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-stone-900">Độ nhỏ của cỏ:</span>
            <div className="w-40 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-amber-600 transition-all duration-200"
              ></div>
            </div>
            <span className="font-mono text-stone-600">{progress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playSnip();
              onComplete();
            }}
            className="text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua băm nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
