import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Waves, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';
import { MaterialConfig } from '../../types/paper';

interface Stage9Props {
  materials: MaterialConfig;
  vatWaterLevel: number;
  onComplete: (uniformity: number, thickness: number) => void;
}

type DeckleStep = 'ready_to_dip' | 'dipping' | 'shaking' | 'drained';

export const Stage9DeckleForm: React.FC<Stage9Props> = ({
  materials,
  vatWaterLevel,
  onComplete,
}) => {
  const [step, setStep] = useState<DeckleStep>('ready_to_dip');
  const [dipDepthPercent, setDipDepthPercent] = useState<number>(20); // 15% - 100%
  const [isPressingLeftMouse, setIsPressingLeftMouse] = useState<boolean>(false);
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [uniformity, setUniformity] = useState<number>(35);
  const [mouldPos, setMouldPos] = useState({ x: 0, y: 0 });
  const [isDraining, setIsDraining] = useState(false);

  const dipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const isPandan = materials.grassType === 'pandan';

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (dipTimerRef.current) clearInterval(dipTimerRef.current);
    };
  }, []);

  // 1. Mouse Down on Mould (Left click starts dipping, depth increases gradually)
  const handleMouldMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== 'ready_to_dip') return;

    // Only respond to left button (e.button === 0)
    if (e.button === 0) {
      sound.playWaterSplash();
      setIsPressingLeftMouse(true);
      setStep('dipping');

      // Gradually increase dip depth from current up to 100%
      if (dipTimerRef.current) clearInterval(dipTimerRef.current);
      dipTimerRef.current = setInterval(() => {
        setDipDepthPercent((prev) => {
          if (prev >= 100) {
            if (dipTimerRef.current) clearInterval(dipTimerRef.current);
            return 100;
          }
          return Math.min(100, prev + 2.5);
        });
      }, 50);
    }
  };

  // 2. Mouse Up (Releasing left click freezes depth and lifts mould to shaking phase)
  const handleMouldMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step === 'dipping' && isPressingLeftMouse) {
      if (dipTimerRef.current) {
        clearInterval(dipTimerRef.current);
        dipTimerRef.current = null;
      }
      setIsPressingLeftMouse(false);
      sound.playDeckleLift();
      setStep('shaking');
    }
  };

  // 3. Right Click cancels dipping and resets mould back to pre-dip state
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevent browser context menu
    if (dipTimerRef.current) {
      clearInterval(dipTimerRef.current);
      dipTimerRef.current = null;
    }
    sound.playTap();
    setIsPressingLeftMouse(false);
    setDipDepthPercent(20);
    setStep('ready_to_dip');
    setMouldPos({ x: 0, y: 0 });
    setUniformity(35);
  };

  // 4. Handle shaking mould across axes
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== 'shaking') return;

    if (lastMousePos.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 6) {
        setMouldPos({
          x: Math.max(-50, Math.min(50, dx * 1.5)),
          y: Math.max(-30, Math.min(30, dy * 1.5)),
        });

        setUniformity((prev) => Math.min(99, prev + 3));
        setShakeCount((prev) => prev + 1);

        if (shakeCount % 5 === 0) {
          sound.playWaterSplash();
        }
      }
    }
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleFinishShaking = () => {
    setIsDraining(true);
    sound.playDeckleLift();
    setStep('drained');

    const calculatedThickness = Math.round(dipDepthPercent);
    const calculatedUniformity = Math.round(Math.max(45, uniformity));

    setTimeout(() => {
      onComplete(calculatedUniformity, calculatedThickness);
    }, 1500);
  };

  // Visual sink distance in vat according to dip depth (0 to 65px)
  const visualSinkY = (dipDepthPercent / 100) * 65;

  // Shade of paper film based on dip depth:
  // Shallow dip (mỏng) -> light pale shade (opacity 0.45)
  // Deep dip (dày) -> deep rich saturated shade (opacity 0.95)
  const filmOpacity = 0.4 + (dipDepthPercent / 100) * 0.55;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouldMouseUp}
      onContextMenu={handleContextMenu}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none"
    >
      {/* 2 Hollow Indicator Circles for two-handed deckle mould grip */}
      <ActionIndicator
        count={2}
        isActing={step === 'dipping' || isDraining}
        offsetX={mouldPos.x}
        offsetY={mouldPos.y}
      />

      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 09 · Trọng Tâm Workshop
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Seo Giấy Bằng Khuôn Tre & Màn Lưới
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          <strong>Nhấn & giữ chuột trái</strong> để nhúng khuôn sâu dần vào bể nước. <strong>Nhả chuột</strong> để nhấc khuôn lên. <strong>Click chuột phải</strong> để hủy và nhúng lại.
        </p>
      </div>

      {/* Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 flex flex-col items-center">
        {/* Real-time Indicators: Thickness & Uniformity */}
        <div className="w-full max-w-lg bg-white rounded-2xl p-3.5 shadow-sm border border-stone-200 mb-4 flex items-center justify-between gap-6 text-xs">
          <div className="flex-1">
            <div className="flex justify-between font-semibold text-stone-800 mb-1">
              <span>Độ sâu nhúng (% mực nước):</span>
              <span className="font-mono text-amber-800 font-bold">{Math.round(dipDepthPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${dipDepthPercent}%` }}
                className="h-full bg-amber-600 transition-all duration-75"
              ></div>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              {dipDepthPercent > 70 ? 'Nhúng sâu → Giấy dày (Màu đậm)' : dipDepthPercent < 45 ? 'Nhúng nông → Giấy mỏng (Màu nhạt)' : 'Độ dày tiêu chuẩn'}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between font-semibold text-stone-800 mb-1">
              <span>Độ đồng đều xơ sợi:</span>
              <span className="font-mono text-emerald-800">{Math.round(uniformity)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${uniformity}%` }}
                className="h-full bg-emerald-600 transition-all duration-100"
              ></div>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              {step === 'shaking' ? 'Lắc đều tay để đạt 90%+' : 'Sẽ phân bố khi lắc khuôn'}
            </div>
          </div>
        </div>

        {/* Vat Container with Floating Deckle Mould */}
        <div className="w-full h-80 md:h-96 bg-gradient-to-b from-stone-900 via-stone-850 to-amber-950 rounded-2xl border-8 border-amber-900 shadow-2xl relative overflow-hidden flex items-center justify-center p-4">
          {/* Water Pool in Vat */}
          <div
            style={{ height: `${vatWaterLevel}%` }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-950 via-cyan-900/90 to-cyan-800/60 pointer-events-none"
          ></div>

          {/* THE DECKLE MOULD (Khuôn seo tre bọc màng lụa) */}
          <div
            onMouseDown={handleMouldMouseDown}
            onContextMenu={handleContextMenu}
            style={{
              transform: `translate(${mouldPos.x}px, ${
                step === 'dipping' ? visualSinkY : mouldPos.y
              }px) rotate(${mouldPos.x * 0.08}deg)`,
            }}
            className={`relative w-80 h-56 md:w-96 md:h-64 rounded-xl border-8 border-amber-800 bg-stone-900/90 shadow-2xl transition-all duration-150 flex items-center justify-center overflow-hidden ${
              step === 'ready_to_dip'
                ? 'cursor-pointer hover:border-amber-600 hover:scale-102 ring-4 ring-amber-500/20'
                : step === 'dipping'
                ? 'opacity-85 ring-4 ring-cyan-400/40'
                : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {/* Bamboo mesh grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#78350f25_1px,transparent_1px),linear-gradient(to_bottom,#78350f25_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none"></div>

            {/* Wet Pulp Film with visual light/dark shade directly reflecting dip depth */}
            {(step === 'shaking' || step === 'drained') && (
              <div
                style={{
                  opacity: filmOpacity,
                }}
                className={`relative w-full h-full p-4 flex flex-wrap items-center justify-center gap-1 transition-all duration-300 ${
                  isPandan
                    ? 'bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-400'
                    : 'bg-gradient-to-b from-lime-100 via-amber-100 to-emerald-200'
                }`}
              >
                {/* Embedded fibers */}
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${14 + (i % 5) * 6}px`,
                      height: `${1 + (dipDepthPercent / 100)}px`,
                      transform: `rotate(${(i * 43 + mouldPos.x) % 180}deg)`,
                      opacity: 0.65 + (uniformity / 100) * 0.35,
                    }}
                    className={`rounded-full ${
                      isPandan ? 'bg-emerald-800' : 'bg-lime-800'
                    }`}
                  ></div>
                ))}

                {isDraining && (
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-cyan-200/50 blur-xs animate-pulse"></div>
                )}
              </div>
            )}

            {/* Prompts on the mould */}
            {step === 'ready_to_dip' && (
              <div className="text-amber-200 text-xs font-serif text-center px-4 bg-stone-950/75 py-2.5 rounded-xl border border-amber-600/40 shadow-lg pointer-events-none">
                <div className="font-semibold">Nhấn & giữ chuột trái để nhúng khuôn</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Nhả chuột để nhấc lên · Click phải để hủy</div>
              </div>
            )}

            {step === 'dipping' && (
              <div className="text-cyan-200 text-xs font-serif text-center px-4 bg-stone-950/80 py-2 rounded-xl border border-cyan-400/50 shadow-lg pointer-events-none animate-pulse">
                Đang chìm xuống ({Math.round(dipDepthPercent)}%) · Nhả chuột khi đạt độ sâu mong muốn
              </div>
            )}

            {step === 'shaking' && (
              <div className="absolute top-2.5 text-[10px] font-mono text-stone-900 bg-white/90 px-3 py-1 rounded-full shadow-md border border-stone-200 pointer-events-none">
                Rê chuột lắc khuôn để dàn đều bột ({shakeCount} nhịp)
              </div>
            )}

            {step === 'drained' && (
              <div className="text-emerald-950 font-serif font-semibold text-xs flex items-center gap-1.5 bg-amber-50/95 px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Nước đã róc sạch · Màng giấy đã định hình!</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Reset Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between w-full max-w-lg gap-3">
          {step === 'shaking' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  setStep('ready_to_dip');
                  setDipDepthPercent(20);
                  setMouldPos({ x: 0, y: 0 });
                }}
                className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer"
                title="Nhúng lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                <span>Nhúng lại</span>
              </button>

              <button
                onClick={handleFinishShaking}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-amber-100 px-5 py-2 rounded-xl font-medium text-xs transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Bột đã đều · Nhấc khuôn róc nước</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-stone-500 font-serif">
              Click phải chuột bất kỳ lúc nào để hủy thao tác nhúng.
            </div>
          )}

          <button
            onClick={() => {
              sound.playDeckleLift();
              onComplete(88, dipDepthPercent);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer ml-auto"
          >
            <span>Bỏ qua seo nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
