import React, { useState, useRef } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage6Props {
  materials: MaterialConfig;
  onComplete: (strengthScore: number) => void;
}

export const Stage6PoundFiber: React.FC<Stage6Props> = ({ materials, onComplete }) => {
  const [poundCount, setPoundCount] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const [strikePos, setStrikePos] = useState<{ x: number; y: number } | null>(null);
  const targetPounds = 7;

  const isPandan = materials.grassType === 'pandan';

  // Generate 54 grass elements distributed evenly across the entire circular mortar cavity
  // using Fermat's spiral / golden angle distribution for uniform coverage
  const mortarElements = useRef(
    Array.from({ length: 54 }).map((_, i) => {
      const goldenAngle = 137.5 * (Math.PI / 180);
      const radius = Math.sqrt((i + 1) / 54) * 92; // 0 to 92px covering entire 200px mortar
      const theta = i * goldenAngle;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const rotation = Math.random() * 360;
      const baseLength = 22 + (i % 5) * 6;
      return { x, y, rotation, baseLength };
    })
  ).current;

  const handlePound = (e: React.MouseEvent<HTMLDivElement>) => {
    sound.playPound();
    setIsStriking(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setStrikePos({ x: x * 0.7, y: y * 0.7 });

    setTimeout(() => {
      setIsStriking(false);
      setStrikePos(null);
    }, 180);

    const next = poundCount + 1;
    setPoundCount(next);

    if (next >= targetPounds) {
      setTimeout(() => {
        onComplete(95);
      }, 600);
    }
  };

  const progress = Math.min(100, Math.round((poundCount / targetPounds) * 100));
  const fiberFrayedness = poundCount / targetPounds; // 0 to 1

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator at mortar impact point */}
      {isStriking && strikePos && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Nện chày"
          offsetX={strikePos.x}
          offsetY={strikePos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 06 · Đập Dập Tách Sợi
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Đập Dập Làm Tơi Xơ Sợi
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nhấp trực tiếp vào cối đá để nện chày gỗ. Quan sát các cọng cỏ phân bố đều khắp lòng cối dần dẹp mỏng, tơi xơ và chuyển thành dạng mạng xơ thực vật.
        </p>
      </div>

      {/* Mortar Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 flex flex-col items-center">
        {/* Large Stone Mortar */}
        <div
          onClick={handlePound}
          className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-b from-stone-650 via-stone-750 to-stone-900 border-12 border-stone-800 shadow-2xl flex items-center justify-center cursor-pointer group active:scale-98 transition-transform overflow-hidden"
        >
          {/* Mortar Stone Inner Cavity */}
          <div className="relative w-68 h-68 md:w-80 md:h-80 rounded-full bg-stone-950/75 p-4 flex items-center justify-center overflow-hidden">
            {/* 54 Elements distributed evenly across the whole mortar */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              {mortarElements.map((el, i) => {
                // Width expands as grass flattens and frays
                const width = el.baseLength + fiberFrayedness * 16;
                // Height gets thinner: starts at 3.5px -> becomes 1.5px fine fiber
                const height = Math.max(1.2, 3.5 - fiberFrayedness * 2.2);
                const opacity = 0.7 + fiberFrayedness * 0.28;

                return (
                  <div
                    key={i}
                    style={{
                      left: `calc(50% + ${el.x}px)`,
                      top: `calc(50% + ${el.y}px)`,
                      width: `${width}px`,
                      height: `${height}px`,
                      transform: `translate(-50%, -50%) rotate(${el.rotation + poundCount * 12}deg)`,
                      opacity,
                    }}
                    className={`absolute rounded-full transition-all duration-300 shadow-xs ${
                      fiberFrayedness > 0.65
                        ? 'bg-gradient-to-r from-amber-100 via-emerald-100 to-amber-200 shadow-[0_0_4px_rgba(254,240,138,0.3)]'
                        : isPandan
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700'
                        : 'bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-600'
                    }`}
                  >
                    {/* Lateral micro-fibrils fanning out in mid to late pounds */}
                    {fiberFrayedness > 0.4 && (
                      <div className="absolute inset-0 -top-1 -bottom-1 border-y border-amber-200/40 opacity-70"></div>
                    )}
                  </div>
                );
              })}

              {/* Cellulose veil spreading across whole mortar */}
              {fiberFrayedness > 0.35 && (
                <div
                  style={{ opacity: (fiberFrayedness - 0.35) * 0.7 }}
                  className="absolute inset-6 rounded-full bg-radial from-amber-100/25 via-emerald-200/15 to-transparent blur-xs pointer-events-none"
                ></div>
              )}
            </div>

            {/* Impact Shockwave Flash */}
            {isStriking && (
              <div className="absolute inset-0 bg-amber-100/30 rounded-full animate-ping pointer-events-none"></div>
            )}
          </div>
        </div>

        {/* Real-time State Badge placed in clear bottom area, NOT blocking mortar */}
        <div className="mt-4 flex items-center gap-2 text-xs font-serif text-stone-700 bg-white/80 px-4 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>
            {fiberFrayedness < 0.35
              ? 'Trạng thái: Cọng cỏ chín mềm phân bố đều trong cối đang được đập dập'
              : fiberFrayedness < 0.75
              ? 'Trạng thái: Thớ cỏ dẹp mỏng, tách xơ dọc và bung tỏa đều đặn'
              : 'Trạng thái: Xơ thực vật tơi mịn hoàn toàn, đan xen thành mạng xơ liên kết dẻo dai'}
          </span>
        </div>

        {/* Bottom Progress & Skip */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-md gap-3 text-stone-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-stone-900">Mức độ tơi xơ:</span>
            <div className="w-36 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-amber-700 transition-all duration-200"
              ></div>
            </div>
            <span className="font-mono text-stone-600">{progress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playPound();
              onComplete(95);
            }}
            className="text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua đập nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
