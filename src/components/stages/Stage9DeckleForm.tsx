import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';
import { ArrowRight, Waves, Sparkles, CheckCircle2 } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';
import { MaterialConfig } from '../../types/paper';

interface Stage9Props {
  materials: MaterialConfig;
  onComplete: (uniformity: number, thickness: number) => void;
}

type DeckleStep = 'ready' | 'dipping' | 'lifting' | 'shaking' | 'drained';

export const Stage9DeckleForm: React.FC<Stage9Props> = ({ materials, onComplete }) => {
  const [step, setStep] = useState<DeckleStep>('ready');
  const [dipDepth, setDipDepth] = useState(50); // dip amount determines thickness
  const [shakeCount, setShakeCount] = useState(0);
  const [uniformity, setUniformity] = useState(30);
  const [mouldPos, setMouldPos] = useState({ x: 0, y: 0 });
  const [isDraining, setIsDraining] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  // Handle mould movement during shaking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== 'shaking') return;

    if (lastMousePos.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        setMouldPos({
          x: Math.max(-60, Math.min(60, dx * 1.5)),
          y: Math.max(-40, Math.min(40, dy * 1.5)),
        });

        // Increase uniformity smoothly
        setUniformity((prev) => Math.min(98, prev + 3));
        setShakeCount((prev) => prev + 1);

        if (shakeCount % 5 === 0) {
          sound.playWaterSplash();
        }
      }
    }
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleStartDip = () => {
    sound.playWaterSplash();
    setStep('dipping');
    setTimeout(() => {
      sound.playDeckleLift();
      setStep('shaking');
    }, 1200);
  };

  const handleFinishShaking = () => {
    setIsDraining(true);
    sound.playDeckleLift();
    setStep('drained');

    const calculatedThickness = Math.round(50 + (dipDepth / 100) * 50);
    const calculatedUniformity = Math.round(Math.max(40, uniformity));

    setTimeout(() => {
      onComplete(calculatedUniformity, calculatedThickness);
    }, 1500);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none"
    >
      <FirstPersonHands
        tool="deckle"
        isActing={step === 'dipping' || isDraining}
        offsetX={mouldPos.x}
        offsetY={mouldPos.y}
      />

      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 09 · Trọng Tâm Workshop
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Seo Giấy Bằng Khuôn Tre & Màn Lưới
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Cầm liềm seo nhúng nghiêng vào bể bột, nhấc thẳng lên và lắc nhẹ qua lại để nước róc đi, các sợi cỏ đan kết đều đặn trên mặt khuôn.
        </p>
      </div>

      {/* Main Vat & Deckle Stage */}
      <div className="w-full relative bg-amber-950/20 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-900/20 flex flex-col items-center">
        {/* Real-time Artisan Gauges */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-stone-200 mb-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Độ đồng đều của sợi:</span>
              <span className="font-mono text-emerald-800">{Math.round(uniformity)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${uniformity}%` }}
                className="h-full bg-emerald-600 transition-all duration-150"
              ></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1">
              <span>Độ dày màng giấy:</span>
              <span className="font-mono text-amber-800">
                {dipDepth > 65 ? 'Dày' : dipDepth < 35 ? 'Mỏng' : 'Vừa'}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${dipDepth}%` }}
                className="h-full bg-amber-600 transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>

        {/* Paper Vat with Deckle Mould inside */}
        <div className="w-full h-80 md:h-96 bg-gradient-to-b from-stone-900 via-stone-800 to-amber-950 rounded-2xl border-4 border-amber-950 shadow-inner relative overflow-hidden flex items-center justify-center p-4">
          {/* Water ripples and pulp suspension in vat */}
          <div className="absolute inset-0 bg-cyan-950/40 pointer-events-none"></div>

          {/* THE DECKLE MOULD (Khuôn seo tre bọc lưới lụa) */}
          <div
            style={{
              transform: `translate(${mouldPos.x}px, ${
                step === 'dipping' ? 60 : mouldPos.y
              }px) rotate(${mouldPos.x * 0.1}deg)`,
            }}
            className={`relative w-80 h-56 md:w-96 md:h-64 rounded-xl border-8 border-amber-800 bg-stone-900/90 shadow-2xl transition-all duration-200 flex items-center justify-center overflow-hidden ${
              step === 'dipping' ? 'opacity-70 scale-95 blur-[1px]' : 'opacity-100 scale-100'
            }`}
          >
            {/* Bamboo mesh grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#78350f25_1px,transparent_1px),linear-gradient(to_bottom,#78350f25_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none"></div>

            {/* Wet Pulp Film forming on mould */}
            {(step === 'shaking' || step === 'drained') && (
              <div
                style={{
                  opacity: Math.min(1, 0.4 + (uniformity / 100) * 0.6),
                }}
                className={`relative w-full h-full p-4 flex flex-wrap items-center justify-center gap-1 transition-all duration-300 ${
                  step === 'drained'
                    ? 'bg-amber-100/90'
                    : 'bg-emerald-100/60'
                }`}
              >
                {/* Embedded grass fibers */}
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${16 + (i % 4) * 8}px`,
                      height: '2px',
                      transform: `rotate(${(i * 41 + mouldPos.x) % 180}deg)`,
                      opacity: 0.6 + (uniformity / 100) * 0.35,
                    }}
                    className={`rounded-full ${
                      materials.additiveType === 'straw'
                        ? 'bg-amber-600'
                        : materials.additiveType === 'bark'
                        ? 'bg-amber-800'
                        : 'bg-emerald-700'
                    }`}
                  ></div>
                ))}

                {/* Water dripping particles when draining */}
                {isDraining && (
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-cyan-200/50 blur-sm animate-pulse"></div>
                )}
              </div>
            )}

            {/* State indicators on deckle */}
            {step === 'ready' && (
              <div className="text-amber-200 text-xs font-serif text-center px-4">
                Khuôn seo tre đang ở trên mặt bể · Sẵn sàng nhúng
              </div>
            )}

            {step === 'dipping' && (
              <div className="text-cyan-200 text-xs font-serif text-center px-4 animate-pulse">
                Đang chìm dưới dòng nước đón bột giấy...
              </div>
            )}

            {step === 'shaking' && (
              <div className="absolute top-3 text-[11px] font-mono text-stone-800 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                Rê chuột / Lắc khuôn để dàn đều bột ({shakeCount} nhịp)
              </div>
            )}

            {step === 'drained' && (
              <div className="text-emerald-950 font-serif font-medium text-xs flex items-center gap-1.5 bg-amber-50/90 px-3 py-1.5 rounded-full shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Nước đã róc hoàn toàn · Màng giấy hoàn hảo!</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {step === 'ready' && (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl text-xs text-stone-700">
                <span>Chọn độ sâu nhúng múc:</span>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={dipDepth}
                  onChange={(e) => setDipDepth(Number(e.target.value))}
                  className="w-28 accent-amber-700 cursor-pointer"
                />
                <span className="font-mono">{dipDepth > 50 ? 'Dày' : 'Mỏng'}</span>
              </div>

              <button
                onClick={handleStartDip}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-100 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer animate-pulse"
              >
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>Nhúng khuôn xuống bể</span>
              </button>
            </div>
          )}

          {step === 'shaking' && (
            <button
              onClick={handleFinishShaking}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-amber-100 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Bột đã dàn đều · Nhấc khuôn róc nước</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playDeckleLift();
              onComplete(88, dipDepth);
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua seo nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
