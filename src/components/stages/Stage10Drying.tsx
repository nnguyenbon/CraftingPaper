import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Sun, Wind, Sparkles } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';
import { MaterialConfig } from '../../types/paper';

interface Stage10Props {
  materials: MaterialConfig;
  onComplete: () => void;
}

export const Stage10Drying: React.FC<Stage10Props> = ({ materials, onComplete }) => {
  const [isCouched, setIsCouched] = useState(false);
  const [dryProgress, setDryProgress] = useState(0);
  const [isBrushing, setIsBrushing] = useState(false);

  // Auto fast drying timer once couched
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCouched && dryProgress < 100) {
      timer = setInterval(() => {
        setDryProgress((prev) => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(timer);
            sound.playZenChime();
            setTimeout(onComplete, 1200);
          }
          return Math.min(100, next);
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isCouched, dryProgress, onComplete]);

  const handleCouch = () => {
    sound.playWaterSplash();
    setIsCouched(true);
  };

  const handleBrush = () => {
    sound.playBrushSweep();
    setIsBrushing(true);
    setTimeout(() => setIsBrushing(false), 260);
    setDryProgress((prev) => Math.min(100, prev + 15));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <FirstPersonHands tool="brush" isActing={isBrushing} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 10 · Định Hình Khô Nhanh
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Dán Ván & Phơi Khô Giấy
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Ép màng giấy ướt từ khuôn lên ván phơi gỗ thông nhẵn bóng, dùng chổi mềm miết phẳng và hong dưới nắng ấm cùng gió trời.
        </p>
      </div>

      {/* Drying Plank Stage */}
      <div className="w-full relative bg-amber-50 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-900/10 flex flex-col items-center">
        {/* Wooden Drying Board with Sunlight Gradient */}
        <div className="relative w-full max-w-xl h-80 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border-8 border-amber-950 shadow-2xl flex items-center justify-center p-6 overflow-hidden">
          {/* Wood grain pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_20px)]"></div>

          {/* Sunlight beam beam from top right */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-yellow-100/40 via-yellow-100/10 to-transparent pointer-events-none"></div>

          {/* Paper Sheet on the Wooden Board */}
          {isCouched ? (
            <div
              style={{
                filter: `brightness(${0.75 + (dryProgress / 100) * 0.25}) contrast(${
                  0.9 + (dryProgress / 100) * 0.1
                })`,
              }}
              className="relative w-64 h-60 md:w-80 md:h-64 rounded-sm shadow-xl transition-all duration-300 flex items-center justify-center p-4 border border-amber-950/20 overflow-hidden bg-[#f4ecd8]"
            >
              {/* Organic fibers texture */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:12px_12px]"></div>

              {/* Steam evaporation haze */}
              {dryProgress < 95 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
              )}

              {/* Status overlay */}
              <div className="relative text-center">
                <div className="text-xs font-serif text-stone-700 font-medium">
                  {dryProgress < 100 ? (
                    <span className="flex items-center gap-1.5 justify-center">
                      <Sun className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>Hơi nước đang bốc hơi... ({dryProgress}%)</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 justify-center text-emerald-900 font-semibold">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Giấy đã khô ráo · Sẵn sàng bóc ván!</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-100/80 text-xs font-serif text-center px-4">
              Ván gỗ phơi nhẵn mịn đón nắng ấm
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!isCouched ? (
            <button
              onClick={handleCouch}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-100 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer animate-pulse"
            >
              <span>Úp liềm seo dán giấy lên ván</span>
            </button>
          ) : (
            <button
              onClick={handleBrush}
              className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-amber-100 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Wind className="w-4 h-4 text-amber-300" />
              <span>Dùng chổi miết phẳng & đuổi bọt khí ({dryProgress}%)</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playZenChime();
              onComplete();
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua phơi nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
