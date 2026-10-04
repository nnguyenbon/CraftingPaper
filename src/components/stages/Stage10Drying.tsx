import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Sun, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage10Props {
  materials: MaterialConfig;
  onComplete: () => void;
}

export const Stage10Drying: React.FC<Stage10Props> = ({ materials, onComplete }) => {
  const [isCouched, setIsCouched] = useState(false);
  const [spongePasses, setSpongePasses] = useState(0);
  const [isSponging, setIsSponging] = useState(false);
  const [dryProgress, setDryProgress] = useState(0);
  const [spongePos, setSpongePos] = useState<{ x: number; y: number } | null>(null);

  const isPandan = materials.grassType === 'pandan';
  const targetSpongePasses = 3;

  // Auto fast drying timer once couched and sponged
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCouched && spongePasses >= targetSpongePasses && dryProgress < 100) {
      timer = setInterval(() => {
        setDryProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(timer);
            sound.playZenChime();
          }
          return Math.min(100, next);
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isCouched, spongePasses, dryProgress]);

  const handleCouch = () => {
    sound.playWaterSplash();
    setIsCouched(true);
  };

  const handleSpongePress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCouched || spongePasses >= targetSpongePasses) return;
    sound.playBrushSweep();
    setIsSponging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setSpongePos({ x, y });

    setTimeout(() => {
      setIsSponging(false);
      setSpongePos(null);
    }, 220);

    const nextPass = spongePasses + 1;
    setSpongePasses(nextPass);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator tracking sponge action */}
      {isSponging && spongePos && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Ép bọt biển"
          offsetX={spongePos.x}
          offsetY={spongePos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 10 · Dán Ván & Phơi Khô
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Dán Ván & Ép Phơi Giấy
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          Nhấp vào khuôn để ép dán màng giấy ướt lên ván gỗ thông, dùng <strong>miếng bọt biển</strong> dặm đều hút bớt nước rồi hong khô dưới nắng ấm.
        </p>
      </div>

      {/* Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 flex flex-col items-center">
        {/* Main Stage: Wooden Drying Board */}
        <div className="relative w-full max-w-2xl h-88 rounded-2xl bg-gradient-to-r from-amber-800 via-amber-750 to-amber-900 border-8 border-amber-950 shadow-2xl flex items-center justify-center p-6 overflow-hidden">
          {/* Wood grain pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_24px)]"></div>

          {/* Sunlight beam beam from top right */}
          <div className="absolute top-0 right-0 w-88 h-88 bg-gradient-to-bl from-yellow-100/35 via-yellow-100/10 to-transparent pointer-events-none"></div>

          {/* If NOT yet couched: show the wet mould waiting to be transferred to the board */}
          {!isCouched ? (
            <div
              onClick={handleCouch}
              className="relative w-72 h-56 rounded-xl border-6 border-dashed border-amber-400/80 bg-stone-900/60 p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-102 hover:border-amber-300 transition-all shadow-xl group"
            >
              <div className="text-3xl mb-2">📜</div>
              <div className="font-serif font-semibold text-amber-200 text-sm text-center">
                Màng giấy ướt trên khuôn
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1 text-center font-mono">
                Click vào đây để úp dán lên ván gỗ
              </div>
            </div>
          ) : (
            // Wet Paper Sheet adhering to the Wooden Board
            <div
              onClick={handleSpongePress}
              style={{
                filter: `brightness(${0.78 + (dryProgress / 100) * 0.22}) contrast(${
                  0.92 + (dryProgress / 100) * 0.08
                })`,
              }}
              className={`relative w-72 h-60 md:w-84 md:h-68 rounded-sm shadow-xl transition-all duration-300 flex items-center justify-center p-4 border border-amber-950/20 overflow-hidden ${
                isPandan ? 'bg-[#e0edd5]' : 'bg-[#eef3e2]'
              } ${spongePasses < targetSpongePasses ? 'cursor-pointer hover:border-amber-400' : 'cursor-default'}`}
            >
              {/* Paper Fibers texture */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:10px_10px]"></div>

              {/* Steam evaporation haze during drying */}
              {spongePasses >= targetSpongePasses && dryProgress < 95 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
              )}

              {/* Status prompt inside paper */}
              <div className="relative text-center pointer-events-none">
                {spongePasses < targetSpongePasses ? (
                  <div className="text-xs font-serif text-stone-800 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                    Dặm bọt biển hút nước ({spongePasses}/{targetSpongePasses})
                  </div>
                ) : dryProgress < 100 ? (
                  <div className="text-xs font-serif text-stone-800 bg-white/85 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Hơi nước bốc lên... ({dryProgress}%)</span>
                  </div>
                ) : (
                  <div className="text-xs font-serif text-emerald-950 font-bold bg-white/95 px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Giấy đã khô ráo hoàn toàn!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clearly Drawn Natural Yellow Sponge (Miếng bọt biển) */}
          {isCouched && spongePasses < targetSpongePasses && (
            <div
              onClick={handleSpongePress}
              className="absolute bottom-4 right-6 w-20 h-14 bg-gradient-to-b from-yellow-300 via-amber-300 to-yellow-400 rounded-2xl border-2 border-amber-500 shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            >
              {/* Sponge porous texture dots */}
              <div className="flex gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-amber-600/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
              </div>
              <span className="text-[9px] font-serif font-bold text-amber-950">
                Bọt biển
              </span>
            </div>
          )}
        </div>

        {/* Transition Button to Stage 11 (ALWAYS PRESENT & PROMINENT WHEN DRY) */}
        <div className="mt-6 flex items-center justify-between w-full max-w-md">
          {dryProgress >= 100 ? (
            <button
              onClick={() => {
                sound.playZenChime();
                onComplete();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-serif font-semibold text-sm transition-all shadow-xl cursor-pointer ring-4 ring-emerald-600/30 animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Bóc giấy khỏi ván · Chuyển sang Trang trí</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-stone-600">
              <span className="font-serif">
                {isCouched
                  ? spongePasses < targetSpongePasses
                    ? 'Hãy nhấp vào giấy/miếng bọt biển để thấm bớt nước'
                    : 'Đang hong khô dưới nắng ấm...'
                  : 'Hãy nhấp vào màng giấy để dán lên ván'}
              </span>

              <button
                onClick={() => {
                  sound.playZenChime();
                  onComplete();
                }}
                className="underline hover:text-stone-900 flex items-center gap-1 cursor-pointer shrink-0 ml-4"
              >
                <span>Bỏ qua phơi nhanh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
