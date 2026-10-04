import React, { useState, useRef } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Droplets, RotateCw, CheckCircle2 } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage3Props {
  materials: MaterialConfig;
  onComplete: (rinseScore: number) => void;
}

export const Stage3RinseGrass: React.FC<Stage3Props> = ({ materials, onComplete }) => {
  const [rinseProgress, setRinseProgress] = useState(0); // 0-100%
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndicatorPos, setCurrentIndicatorPos] = useState({ x: 0, y: 0 });

  const basinRef = useRef<HTMLDivElement | null>(null);
  const lastAngle = useRef<number | null>(null);
  const accumulatedAngle = useRef<number>(0);
  const soundCooldown = useRef<number>(0);

  const isPandan = materials.grassType === 'pandan';

  // 25 slender, thin, long cut grass elements in the basin
  const grassElements = useRef(
    Array.from({ length: 26 }).map((_, i) => ({
      angle: (i * 360) / 26 + (Math.random() * 15 - 7.5),
      dist: 28 + (i % 5) * 14,
      length: 22 + (i % 4) * 8,
      rotation: Math.random() * 360,
    }))
  ).current;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    lastAngle.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !basinRef.current) return;

    const rect = basinRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    setCurrentIndicatorPos({ x: dx * 0.7, y: dy * 0.7 });

    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180

    if (lastAngle.current !== null) {
      let delta = angle - lastAngle.current;
      // Handle wrap around -180/180
      if (delta < -180) delta += 360;
      if (delta > 180) delta -= 360;

      // Clockwise movement has positive delta
      if (delta > 0) {
        accumulatedAngle.current += delta;
        const targetDegrees = 360 * 3.5; // ~3.5 clockwise rotations to complete
        const nextProgress = Math.min(100, Math.round((accumulatedAngle.current / targetDegrees) * 100));
        setRinseProgress(nextProgress);

        const now = Date.now();
        if (now - soundCooldown.current > 350) {
          sound.playWaterSplash();
          soundCooldown.current = now;
        }

        if (nextProgress >= 100) {
          setIsDragging(false);
          sound.playZenChime();
          setTimeout(() => onComplete(100), 700);
        }
      }
    }
    lastAngle.current = angle;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    lastAngle.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe ignore
    }
  };

  const waterTurbidity = Math.max(0, 1 - rinseProgress / 100);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator tracking clockwise swirl */}
      {isDragging && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Khuấy thuận chiều kim đồng hồ"
          offsetX={currentIndicatorPos.x}
          offsetY={currentIndicatorPos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 03 · Rửa Cỏ
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Rửa Sạch Bụi Bẩn & Tạp Chất
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          Nhấn giữ chuột/chạm và <strong>di chuyển theo vòng tròn thuận chiều kim đồng hồ</strong> trong chậu để dòng nước cuốn sạch cặn bẩn bám trên thớ cỏ.
        </p>
      </div>

      {/* Basin Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 flex flex-col items-center">
        {/* Ceramic Water Basin */}
        <div
          ref={basinRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-stone-700 bg-stone-850 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden group touch-none"
        >
          {/* Water Fill with Dynamic Turbidity Shift */}
          <div
            style={{
              backgroundColor: `rgba(${Math.round(160 * waterTurbidity + 40 * (1 - waterTurbidity))}, ${Math.round(150 * waterTurbidity + 155 * (1 - waterTurbidity))}, ${Math.round(110 * waterTurbidity + 175 * (1 - waterTurbidity))}, 0.88)`,
            }}
            className="absolute inset-0 rounded-full transition-colors duration-300 flex items-center justify-center"
          >
            {/* Clockwise Guide Ring Outline */}
            <div className="absolute inset-8 rounded-full border border-dashed border-white/30 pointer-events-none flex items-center justify-center">
              <RotateCw className="w-6 h-6 text-white/40 animate-spin [animation-duration:8s]" />
            </div>

            {/* 26 Slender, Thin, Long Grass Stalks Floating */}
            <div
              style={{
                transform: `rotate(${accumulatedAngle.current * 0.8}deg)`,
              }}
              className="relative w-full h-full flex items-center justify-center transition-transform duration-75 pointer-events-none"
            >
              {grassElements.map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: `${item.length}px`,
                    height: '2px',
                    transform: `rotate(${item.angle}deg) translate(${item.dist}px) rotate(${item.rotation}deg)`,
                  }}
                  className={`absolute rounded-full shadow-xs ${
                    isPandan
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-800'
                      : 'bg-gradient-to-r from-emerald-400 to-lime-500'
                  } ${rinseProgress > 80 ? 'opacity-95' : 'opacity-80'}`}
                ></div>
              ))}
            </div>

            {/* Ripples when dragging */}
            {isDragging && (
              <div className="absolute inset-12 rounded-full border-2 border-white/50 animate-ping pointer-events-none"></div>
            )}

            {/* Completion Badge inside basin */}
            {rinseProgress >= 100 && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-emerald-900 font-serif font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Cỏ đã rửa sạch tinh khiết!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Clean Status & Skip */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between w-full max-w-md gap-3 text-stone-700 text-xs">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="font-semibold text-stone-900">Độ sạch của cỏ:</span>
            <div className="w-36 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${rinseProgress}%` }}
                className="h-full bg-cyan-600 transition-all duration-150"
              ></div>
            </div>
            <span className="font-mono text-stone-600">{rinseProgress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playWaterSplash();
              onComplete(100);
            }}
            className="text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua rửa nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
