import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Flame, RotateCw, CheckCircle2 } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage5Props {
  materials: MaterialConfig;
  onComplete: () => void;
}

export const Stage5BoilLye: React.FC<Stage5Props> = ({ materials, onComplete }) => {
  const [hasAddedGrass, setHasAddedGrass] = useState(false);
  const [hasAddedLye, setHasAddedLye] = useState(false);
  const [stirProgress, setStirProgress] = useState(0); // 0-100%
  const [isStirring, setIsStirring] = useState(false);
  const [stirIndicatorPos, setStirIndicatorPos] = useState({ x: 0, y: 0 });

  const potRef = useRef<HTMLDivElement | null>(null);
  const lastAngle = useRef<number | null>(null);
  const accumulatedAngle = useRef<number>(0);
  const soundCooldown = useRef<number>(0);

  const isPandan = materials.grassType === 'pandan';

  // 50 slender, thin, long grass stalks in the basin
  const grassStalks = useRef(
    Array.from({ length: 50 }).map((_, i) => ({
      angle: (i * 360) / 50 + (Math.random() * 10 - 5),
      dist: 12 + (i % 6) * 7,
      length: 16 + (i % 5) * 6,
      rot: Math.random() * 360,
    }))
  ).current;

  // Boiling bubble sound effect while cooking and stirring
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasAddedGrass && hasAddedLye && stirProgress < 100) {
      interval = setInterval(() => {
        sound.playBoilBubble();
      }, 900);
    }
    return () => clearInterval(interval);
  }, [hasAddedGrass, hasAddedLye, stirProgress]);

  const handlePourGrass = () => {
    if (hasAddedGrass) return;
    sound.playTap();
    setHasAddedGrass(true);
  };

  const handlePourLye = () => {
    if (hasAddedLye) return;
    sound.playWaterSplash();
    setHasAddedLye(true);
  };

  // Clockwise pointer movement inside pot
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasAddedGrass || !hasAddedLye) return;
    setIsStirring(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    lastAngle.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isStirring || !potRef.current) return;

    const rect = potRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    setStirIndicatorPos({ x: dx * 0.65, y: dy * 0.65 });

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (lastAngle.current !== null) {
      let delta = angle - lastAngle.current;
      if (delta < -180) delta += 360;
      if (delta > 180) delta -= 360;

      // Clockwise rotation
      if (delta > 0) {
        accumulatedAngle.current += delta;
        const targetDegrees = 360 * 3.5;
        const next = Math.min(100, Math.round((accumulatedAngle.current / targetDegrees) * 100));
        setStirProgress(next);

        const now = Date.now();
        if (now - soundCooldown.current > 350) {
          sound.playWaterSplash();
          soundCooldown.current = now;
        }

        if (next >= 100) {
          setIsStirring(false);
          sound.playZenChime();
          setTimeout(() => onComplete(), 700);
        }
      }
    }
    lastAngle.current = angle;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsStirring(false);
    lastAngle.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe ignore
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator tracking stirring position */}
      {isStirring && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Khuấy thuận chiều kim đồng hồ"
          offsetX={stirIndicatorPos.x}
          offsetY={stirIndicatorPos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 05 · Nấu Kiềm Tự Nhiên
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Nấu Cỏ Với Nước Tro Bếp
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          Click vào thau cỏ và thau nước tro để cho vào nồi gang, sau đó <strong>giữ chuột và di chuyển theo chiều kim đồng hồ</strong> để khuấy đều.
        </p>
      </div>

      {/* Workspace */}
      <div className="w-full bg-stone-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-800 flex flex-col items-center">
        {/* Hearth Scene: Left basin (grass) - Center Cauldron - Right basin (lye water) */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 my-2">
          {/* 1. Left Basin: Thau chứa 50 cọng cỏ đã băm */}
          <div
            onClick={handlePourGrass}
            className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center p-3 transition-all cursor-pointer relative shadow-lg ${
              hasAddedGrass
                ? 'border-stone-700 bg-stone-900/60 opacity-50 cursor-default'
                : 'border-emerald-600 bg-stone-800 hover:scale-105 hover:border-emerald-400'
            }`}
          >
            {/* 50 grass elements inside basin */}
            {!hasAddedGrass ? (
              <div className="relative w-28 h-28 flex items-center justify-center">
                {grassStalks.map((stalk, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${stalk.length}px`,
                      height: '1.5px',
                      transform: `rotate(${stalk.angle}deg) translate(${stalk.dist}px) rotate(${stalk.rot}deg)`,
                    }}
                    className={`absolute rounded-full ${
                      isPandan ? 'bg-emerald-600' : 'bg-lime-400'
                    }`}
                  ></div>
                ))}
                <div className="absolute -bottom-2 bg-stone-950/80 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Thau cỏ (50 cọng)
                </div>
              </div>
            ) : (
              <div className="text-stone-400 text-xs font-serif flex items-center gap-1">
                <span>✓ Đã đổ vào nồi</span>
              </div>
            )}
          </div>

          {/* 2. Center: Large Cast-Iron Cauldron */}
          <div
            ref={potRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-stone-850 via-stone-900 to-stone-950 border-8 border-stone-700 shadow-2xl flex items-center justify-center overflow-hidden touch-none ${
              hasAddedGrass && hasAddedLye ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}
          >
            {/* Liquid & Material inside pot */}
            <div
              className={`relative w-52 h-52 md:w-64 md:h-64 rounded-full transition-colors duration-500 flex items-center justify-center overflow-hidden ${
                !hasAddedLye
                  ? 'bg-stone-950'
                  : stirProgress > 50
                  ? 'bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950'
                  : 'bg-gradient-to-b from-stone-700 via-amber-950 to-stone-900'
              }`}
            >
              {/* Clockwise swirl guide outline when ready to stir */}
              {hasAddedGrass && hasAddedLye && stirProgress < 100 && (
                <div className="absolute inset-4 rounded-full border border-dashed border-amber-300/30 flex items-center justify-center pointer-events-none">
                  <RotateCw className="w-6 h-6 text-amber-300/40 animate-spin [animation-duration:8s]" />
                </div>
              )}

              {/* Added grass inside pot (50 stalks clearly displayed and multiplying) */}
              {hasAddedGrass && (
                <div
                  style={{
                    transform: `rotate(${accumulatedAngle.current * 0.7}deg)`,
                  }}
                  className="relative w-44 h-44 flex items-center justify-center pointer-events-none"
                >
                  {grassStalks.map((stalk, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${stalk.length}px`,
                        height: '1.5px',
                        transform: `rotate(${stalk.angle}deg) translate(${stalk.dist * 0.8}px) rotate(${stalk.rot}deg)`,
                      }}
                      className={`absolute rounded-full transition-colors duration-500 ${
                        stirProgress > 60
                          ? 'bg-amber-500/80'
                          : isPandan
                          ? 'bg-emerald-600/90'
                          : 'bg-lime-400/90'
                      }`}
                    ></div>
                  ))}
                </div>
              )}

              {/* Boiling steam & bubbles */}
              {hasAddedGrass && hasAddedLye && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute top-10 left-10 w-5 h-5 rounded-full border border-amber-300/60 bg-amber-400/20 animate-ping"></div>
                  <div className="absolute bottom-12 right-12 w-6 h-6 rounded-full border border-amber-300/60 bg-amber-400/20 animate-ping delay-200"></div>
                </div>
              )}

              {/* Prompt if empty */}
              {!hasAddedGrass && !hasAddedLye && (
                <div className="text-stone-400 text-xs text-center font-serif px-4">
                  Nồi gang đang trống trên bếp củi
                </div>
              )}
            </div>
          </div>

          {/* 3. Right Basin: Thau chứa nước tro bếp */}
          <div
            onClick={handlePourLye}
            className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center p-3 transition-all cursor-pointer relative shadow-lg ${
              hasAddedLye
                ? 'border-stone-700 bg-stone-900/60 opacity-50 cursor-default'
                : 'border-amber-600 bg-stone-800 hover:scale-105 hover:border-amber-400'
            }`}
          >
            {!hasAddedLye ? (
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-b from-amber-700 to-amber-900 flex items-center justify-center border border-amber-500/50 shadow-inner">
                <div className="w-16 h-16 rounded-full border border-amber-400/30 animate-pulse"></div>
                <div className="absolute -bottom-2 bg-stone-950/80 text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/40">
                  Thau nước tro
                </div>
              </div>
            ) : (
              <div className="text-stone-400 text-xs font-serif flex items-center gap-1">
                <span>✓ Đã châm nước tro</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Status Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between w-full max-w-md gap-3 text-stone-300 text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Độ chín nhừ của sợi:</span>
            <div className="w-36 h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${stirProgress}%` }}
                className="h-full bg-orange-500 transition-all duration-150"
              ></div>
            </div>
            <span className="font-mono text-stone-400">{stirProgress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playBoilBubble();
              onComplete();
            }}
            className="text-stone-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua nấu nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
