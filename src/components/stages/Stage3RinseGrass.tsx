import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Droplets, RotateCw } from 'lucide-react';

interface Stage3Props {
  onComplete: (rinseScore: number) => void;
}

export const Stage3RinseGrass: React.FC<Stage3Props> = ({ onComplete }) => {
  const [rinseCount, setRinseCount] = useState(0);
  const [isSwirling, setIsSwirling] = useState(false);
  const targetRinses = 5;

  const handleWash = () => {
    sound.playWaterSplash();
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 300);

    const nextCount = rinseCount + 1;
    setRinseCount(nextCount);

    if (nextCount >= targetRinses) {
      setTimeout(() => {
        onComplete(100);
      }, 500);
    }
  };

  const progress = Math.min(100, Math.round((rinseCount / targetRinses) * 100));
  const waterTurbidity = Math.max(0, 1 - rinseCount / targetRinses);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 03 · Làm Sạch Thảo Mộc
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Rửa Sạch Bụi Bẩn & Tạp Chất
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nhấp hoặc chạm vào chậu nước giếng trong để vò rửa cỏ, giúp loại bỏ hoàn toàn cát bụi và tạp chất bám trên bề mặt xơ.
        </p>
      </div>

      {/* Ceramic Basin Viewport */}
      <div className="w-full relative bg-stone-200 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-300 overflow-hidden flex flex-col items-center">
        {/* Large Round Ceramic Water Basin */}
        <div
          onClick={handleWash}
          className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-stone-700 bg-stone-800 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group hover:scale-[1.01] transition-transform"
        >
          {/* Water fill with procedural color shift from cloudy amber-tinted to clear aqua */}
          <div
            style={{
              backgroundColor: `rgba(${Math.round(180 * waterTurbidity + 40 * (1 - waterTurbidity))}, ${Math.round(160 * waterTurbidity + 140 * (1 - waterTurbidity))}, ${Math.round(120 * waterTurbidity + 160 * (1 - waterTurbidity))}, 0.85)`,
            }}
            className="absolute inset-0 rounded-full transition-colors duration-500 flex items-center justify-center"
          >
            {/* Water Ripple rings when swirling */}
            {isSwirling && (
              <div className="absolute inset-4 rounded-full border-4 border-white/60 animate-ping pointer-events-none"></div>
            )}

            {/* Grass Bundles Submerged */}
            <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${isSwirling ? 'rotate-45 scale-95' : 'scale-100'}`}>
              <div className="absolute inset-0 bg-emerald-600/70 rounded-full blur-sm"></div>
              {/* Segments of chopped grass floating */}
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    transform: `rotate(${i * 26 + (rinseCount * 30)}deg) translate(${30 + (i % 3) * 15}px)`,
                  }}
                  className="absolute w-12 h-2.5 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full shadow-sm transition-transform duration-300"
                ></div>
              ))}
            </div>

            {/* Floating dust bubbles fading out */}
            {rinseCount < targetRinses && (
              <div
                style={{ opacity: waterTurbidity }}
                className="absolute inset-8 rounded-full pointer-events-none flex items-center justify-center transition-opacity duration-300"
              >
                <div className="text-stone-700/60 text-xs font-serif">Bụi đất đang lắng và trôi đi...</div>
              </div>
            )}

            {rinseCount >= targetRinses && (
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full pointer-events-none flex items-center justify-center text-emerald-950 font-serif font-medium text-sm">
                Nước trong vắt · Cỏ đã tinh khiết!
              </div>
            )}
          </div>

          {/* Action Callout Prompt Overlay */}
          <div className="absolute bottom-6 flex items-center gap-1.5 bg-stone-900/70 text-amber-100 px-3.5 py-1.5 rounded-full text-xs backdrop-blur-sm pointer-events-none group-hover:bg-stone-900/90 transition-all">
            <RotateCw className={`w-3.5 h-3.5 ${isSwirling ? 'animate-spin' : ''}`} />
            <span>Nhấp để khuấy vò cỏ</span>
          </div>
        </div>

        {/* Progress Info */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between w-full max-w-md gap-3">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-600" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800">
                Độ sạch của cỏ: {progress}%
              </span>
              <div className="w-44 h-2 bg-stone-300 rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-cyan-600 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playWaterSplash();
              onComplete(100);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua rửa nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
