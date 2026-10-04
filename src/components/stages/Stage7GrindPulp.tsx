import React, { useState, useRef } from 'react';
import { GrindLevel, MaterialConfig } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';

interface Stage7Props {
  materials: MaterialConfig;
  currentGrind: GrindLevel;
  onChangeGrind: (grind: GrindLevel) => void;
  onComplete: () => void;
}

export const Stage7GrindPulp: React.FC<Stage7Props> = ({
  materials,
  currentGrind,
  onChangeGrind,
  onComplete,
}) => {
  const [hasLoadedMaterial, setHasLoadedMaterial] = useState(false);
  const [grindCount, setGrindCount] = useState(0);
  const [isCranking, setIsCranking] = useState(false);

  const isPandan = materials.grassType === 'pandan';

  // 45 tangled fibers in the raw loaded basin
  const basinFibers = useRef(
    Array.from({ length: 45 }).map((_, i) => ({
      angle: (i * 360) / 45 + (Math.random() * 8 - 4),
      dist: 6 + (i % 6) * 5.5,
      length: 16 + (i % 4) * 6,
      rot: Math.random() * 360,
    }))
  ).current;

  // 100 dense fiber particles for the grinder chamber
  const chamberFibers = useRef(
    Array.from({ length: 100 }).map((_, i) => ({
      angle: (i * 360) / 100 + (Math.random() * 6 - 3),
      dist: 5 + (i % 8) * 6,
      rot: Math.random() * 360,
    }))
  ).current;

  const handleLoadMaterial = () => {
    if (hasLoadedMaterial) return;
    sound.playTap();
    setHasLoadedMaterial(true);
  };

  const handleCrank = () => {
    if (!hasLoadedMaterial) return;
    sound.playGrind();
    setIsCranking(true);
    setTimeout(() => setIsCranking(false), 240);

    const nextCount = grindCount + 1;
    setGrindCount(nextCount);

    if (nextCount <= 3) {
      onChangeGrind('coarse');
    } else if (nextCount <= 7) {
      onChangeGrind('medium');
    } else {
      onChangeGrind('fine');
    }
  };

  let grindTier: { level: GrindLevel; label: string; desc: string; color: string } = {
    level: 'coarse',
    label: 'Nghiền Thô (1–3 lần)',
    desc: 'Sợi dài còn nguyên vẹn, bề mặt giấy sau này sẽ mộc mạc, lộ rõ thớ xơ tự nhiên.',
    color: 'text-amber-800 bg-amber-50 border-amber-300',
  };

  if (grindCount > 7) {
    grindTier = {
      level: 'fine',
      label: 'Nghiền Mịn (8+ lần)',
      desc: 'Sợi xơ phân rã thành hàng trăm vi sợi 1–2px nhuyễn mịn, bề mặt giấy phẳng mượt như lụa.',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
    };
  } else if (grindCount > 3) {
    grindTier = {
      level: 'medium',
      label: 'Nghiền Vừa (4–7 lần)',
      desc: 'Cân bằng hoàn hảo chuẩn nghệ nhân, mềm êm tự nhiên, sợi đan kết hài hòa.',
      color: 'text-blue-800 bg-blue-50 border-blue-300',
    };
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator tracking crank turning */}
      {isCranking && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Xoay cối nghiền"
          offsetY={-20}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 07 · Nghiền Bột Giấy
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Nghiền Bột Bằng Cối Đá
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          Click vào thau xơ cỏ để nạp vào cối. Số lần xoay cối quyết định mức độ nghiền (Thô / Vừa / Mịn) và kết cấu giấy thành phẩm.
        </p>
      </div>

      {/* Grinding Station Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 flex flex-col items-center">
        {/* Row: Graphic Basin of Pounded Fibers & Traditional Stone Grinder */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
          {/* 1. Graphic Basin of Pounded Grass Fibers (Thau gốm chứa xơ cỏ) */}
          <div
            onClick={handleLoadMaterial}
            className={`w-44 h-44 rounded-full border-6 flex flex-col items-center justify-center p-3 transition-all cursor-pointer relative shadow-xl overflow-hidden ${
              hasLoadedMaterial
                ? 'border-stone-500 bg-stone-850 opacity-60 cursor-default'
                : 'border-amber-700 bg-stone-800 hover:scale-105 hover:border-amber-500 ring-4 ring-amber-600/20'
            }`}
          >
            {/* Wooden/Ceramic Basin Rim Highlight */}
            <div className="absolute inset-1.5 rounded-full border border-stone-600/40 pointer-events-none"></div>

            {!hasLoadedMaterial ? (
              <div className="relative w-32 h-32 flex items-center justify-center pointer-events-none">
                {/* 45 Tangled Pounded Fibers rendered in the basin */}
                {basinFibers.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${f.length}px`,
                      height: '2px',
                      transform: `rotate(${f.angle}deg) translate(${f.dist}px) rotate(${f.rot}deg)`,
                    }}
                    className={`absolute rounded-full shadow-xs ${
                      isPandan
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-700'
                        : 'bg-gradient-to-r from-lime-400 to-emerald-600'
                    }`}
                  ></div>
                ))}

                {/* Badge at bottom of basin */}
                <div className="absolute -bottom-1 bg-stone-950/85 text-amber-200 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-amber-600/50 shadow-md">
                  Thau xơ cỏ đập dập
                </div>
              </div>
            ) : (
              <div className="text-stone-400 text-xs font-serif flex flex-col items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Đã nạp vào cối xay</span>
              </div>
            )}
          </div>

          {/* 2. Traditional Stone Mill / Paper Beater Machine */}
          <div
            onClick={handleCrank}
            className={`relative w-72 h-72 md:w-84 md:h-84 rounded-3xl bg-gradient-to-b from-stone-750 via-stone-800 to-stone-900 border-8 border-stone-850 shadow-2xl flex flex-col items-center justify-between p-4 overflow-hidden transition-all ${
              hasLoadedMaterial
                ? 'cursor-pointer hover:border-amber-700 group active:scale-98'
                : 'opacity-70 cursor-not-allowed'
            }`}
          >
            {/* Top Millstone Rim & Crank */}
            <div className="w-full flex items-center justify-between text-xs text-stone-300 font-mono px-2">
              <span className="flex items-center gap-1.5">
                <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${isCranking ? 'animate-spin' : ''}`} />
                <span className="font-semibold text-stone-200">Cối nghiền bột giấy</span>
              </span>
              <span className="text-amber-300 font-semibold bg-stone-950/70 px-2 py-0.5 rounded-md border border-stone-700">
                {grindCount} lần xoay
              </span>
            </div>

            {/* Central Pulp Chamber with High-Fidelity Fibers across all levels */}
            <div className="relative w-52 h-52 rounded-full bg-stone-950 border-4 border-stone-600 flex items-center justify-center overflow-hidden shadow-inner">
              {hasLoadedMaterial ? (
                <div
                  className={`w-full h-full rounded-full transition-transform duration-300 flex items-center justify-center p-3 relative ${
                    isCranking ? 'rotate-90 scale-95' : ''
                  }`}
                >
                  {/* Subtle slurry liquid base */}
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-500 ${
                      grindCount > 7
                        ? 'bg-amber-100/25'
                        : grindCount > 3
                        ? 'bg-amber-700/25'
                        : 'bg-emerald-900/30'
                    }`}
                  ></div>

                  {/* 100 Fibers in Chamber - DENSE AND NEVER EMPTY AT FINE LEVEL! */}
                  <div className="relative w-full h-full flex flex-wrap items-center justify-center pointer-events-none">
                    {chamberFibers.map((f, i) => {
                      // Coarse: 36 larger chunks (18-24px by 3px)
                      // Medium: 64 medium strands (10-14px by 2px)
                      // Fine: 100 slender micro-fibers (6-9px by 1.2px) densely filling the chamber!
                      const isFine = grindCount > 7;
                      const isMedium = grindCount > 3 && grindCount <= 7;

                      if (!isFine && !isMedium && i >= 36) return null;
                      if (isMedium && i >= 64) return null;

                      const particleLength = isFine ? 7 : isMedium ? 12 : 20;
                      const particleHeight = isFine ? 1.2 : isMedium ? 2 : 3;

                      return (
                        <div
                          key={i}
                          style={{
                            width: `${particleLength}px`,
                            height: `${particleHeight}px`,
                            transform: `rotate(${f.angle + grindCount * 25}deg) translate(${f.dist}px) rotate(${f.rot}deg)`,
                          }}
                          className={`absolute rounded-full transition-all duration-300 shadow-xs ${
                            isFine
                              ? 'bg-amber-100/90 shadow-[0_0_2px_rgba(254,240,138,0.5)]'
                              : isMedium
                              ? 'bg-amber-200/85'
                              : isPandan
                              ? 'bg-emerald-600/90'
                              : 'bg-lime-400/90'
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-stone-400 text-xs font-serif text-center px-4">
                  Cối trống · Hãy nạp xơ cỏ vào trước
                </div>
              )}
            </div>

            {/* Prompt bar at bottom of machine */}
            <div className="bg-stone-950/85 text-amber-200 text-xs font-serif px-3 py-1 rounded-full border border-stone-700 shadow-sm">
              {hasLoadedMaterial ? 'Nhấp vào cối để xoay nghiền' : 'Chờ nạp xơ cỏ'}
            </div>
          </div>
        </div>

        {/* Current Grind Tier Badge */}
        {hasLoadedMaterial && grindCount > 0 && (
          <div className={`w-full max-w-lg p-3 rounded-2xl border text-xs flex items-center justify-between gap-4 mb-4 ${grindTier.color}`}>
            <div>
              <div className="font-semibold font-serif text-sm">{grindTier.label}</div>
              <div className="text-[11px] mt-0.5 leading-relaxed">{grindTier.desc}</div>
            </div>
            <Sparkles className="w-5 h-5 shrink-0" />
          </div>
        )}

        {/* Continue to Stage 8 */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => {
              if (grindCount === 0) {
                onChangeGrind('medium');
              }
              sound.playTap();
              onComplete();
            }}
            disabled={!hasLoadedMaterial}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-md ${
              hasLoadedMaterial
                ? 'bg-stone-900 hover:bg-stone-800 text-amber-100 cursor-pointer'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>Đã nghiền xong · Pha bể giấy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
