import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';

interface Stage5Props {
  onComplete: () => void;
}

export const Stage5BoilLye: React.FC<Stage5Props> = ({ onComplete }) => {
  const [hasAddedMaterial, setHasAddedMaterial] = useState(false);
  const [hasAddedLye, setHasAddedLye] = useState(false);
  const [isStirring, setIsStirring] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);

  // Play boiling bubble sound periodically when cooking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasAddedMaterial && hasAddedLye && boilProgress < 100) {
      interval = setInterval(() => {
        sound.playBoilBubble();
      }, 700);
    }
    return () => clearInterval(interval);
  }, [hasAddedMaterial, hasAddedLye, boilProgress]);

  const handleAddMaterial = () => {
    sound.playTap();
    setHasAddedMaterial(true);
  };

  const handleAddLye = () => {
    sound.playWaterSplash();
    setHasAddedLye(true);
  };

  const handleStir = () => {
    sound.playWaterSplash();
    sound.playBoilBubble();
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 300);

    const next = Math.min(100, boilProgress + 20);
    setBoilProgress(next);

    if (next >= 100) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <FirstPersonHands tool="stir" isActing={isStirring} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 05 · Nấu Kiềm Tự Nhiên
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Nấu Cỏ Với Nước Tro Bếp
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Nước tro bếp giàu kiềm tự nhiên (K₂CO₃) giúp bẻ gãy chất keo lignin trong cỏ, giải phóng các bó sợi cellulose mềm mại.
        </p>
      </div>

      {/* Hearth & Cauldron Interactive Area */}
      <div className="w-full relative bg-stone-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-800 overflow-hidden flex flex-col items-center">
        {/* Hearth Fire Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 via-amber-950/20 to-transparent pointer-events-none"></div>

        {/* Large Cast-Iron Pot */}
        <div className="relative w-72 h-72 md:w-88 md:h-88 rounded-full bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border-8 border-stone-700 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Iron Pot Rim Highlight */}
          <div className="absolute inset-2 rounded-full border border-stone-600/30 pointer-events-none"></div>

          {/* Liquid Inside */}
          <div
            className={`relative w-56 h-56 md:w-68 md:h-68 rounded-full transition-colors duration-700 flex items-center justify-center overflow-hidden ${
              !hasAddedLye
                ? 'bg-stone-950'
                : boilProgress > 50
                ? 'bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950'
                : 'bg-gradient-to-b from-stone-700 via-amber-950 to-stone-900'
            }`}
          >
            {/* Added Material floating in pot */}
            {hasAddedMaterial && (
              <div
                className={`relative w-44 h-44 rounded-full flex flex-wrap items-center justify-center gap-1 transition-all duration-500 ${
                  isStirring ? 'rotate-45 scale-90' : ''
                }`}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      transform: `rotate(${i * 35}deg)`,
                    }}
                    className={`w-6 h-2 rounded-full transition-colors duration-700 ${
                      boilProgress > 60 ? 'bg-amber-600/90' : 'bg-emerald-600/80'
                    }`}
                  ></div>
                ))}
              </div>
            )}

            {/* Boiling Steam & Bubbles */}
            {hasAddedMaterial && hasAddedLye && (
              <>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Steam haze */}
                  <div className="w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                  {/* Bubble rings */}
                  <div className="absolute top-10 left-12 w-6 h-6 rounded-full border border-amber-300/60 bg-amber-400/20 animate-ping"></div>
                  <div className="absolute bottom-12 right-14 w-8 h-8 rounded-full border border-amber-300/60 bg-amber-400/20 animate-ping delay-150"></div>
                  <div className="absolute top-20 right-10 w-5 h-5 rounded-full border border-amber-300/60 bg-amber-400/20 animate-ping delay-300"></div>
                </div>
              </>
            )}

            {/* Prompt Text inside pot if empty */}
            {!hasAddedMaterial && (
              <div className="text-stone-400 text-xs text-center font-serif px-4">
                Nồi gang đang sẵn sàng trên bếp lửa
              </div>
            )}
          </div>
        </div>

        {/* Action Controls Step by Step */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          {!hasAddedMaterial && (
            <button
              onClick={handleAddMaterial}
              className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-amber-100 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg cursor-pointer animate-pulse"
            >
              <span>1. Cho cỏ vào nồi</span>
            </button>
          )}

          {hasAddedMaterial && !hasAddedLye && (
            <button
              onClick={handleAddLye}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-900 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg cursor-pointer animate-pulse"
            >
              <span>2. Thêm gáo nước tro</span>
            </button>
          )}

          {hasAddedMaterial && hasAddedLye && (
            <button
              onClick={handleStir}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4 animate-bounce text-yellow-300" />
              <span>Khuấy đảo nồi nấu ({boilProgress}%)</span>
            </button>
          )}
        </div>

        {/* Progress & Fast Forward */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between w-full max-w-md gap-3 text-stone-300 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs">Độ mềm nhừ của sợi:</span>
            <div className="w-36 h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${boilProgress}%` }}
                className="h-full bg-orange-500 transition-all duration-300"
              ></div>
            </div>
            <span className="text-xs text-stone-400 font-mono">{boilProgress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playBoilBubble();
              onComplete();
            }}
            className="text-xs text-stone-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua nấu nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
