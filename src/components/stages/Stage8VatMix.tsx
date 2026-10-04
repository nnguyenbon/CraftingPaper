import React, { useState, useRef } from 'react';
import { MaterialConfig, StarchLevel } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, Waves, CheckCircle2 } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';

interface Stage8Props {
  materials: MaterialConfig;
  starchLevel: StarchLevel;
  onChangeStarch: (level: StarchLevel) => void;
  vatWaterLevel: number;
  onChangeWaterLevel: (level: number) => void;
  onComplete: () => void;
}

export const Stage8VatMix: React.FC<Stage8Props> = ({
  materials,
  starchLevel,
  onChangeStarch,
  vatWaterLevel,
  onChangeWaterLevel,
  onComplete,
}) => {
  const [pouredGrass, setPouredGrass] = useState(false);
  const [pouredAdditive, setPouredAdditive] = useState(false);
  const [pouredStarch, setPouredStarch] = useState(false);
  const [selectedStarchDose, setSelectedStarchDose] = useState<StarchLevel>(starchLevel || 'medium');
  const [stirProgress, setStirProgress] = useState(0); // 0-100%
  const [isStirring, setIsStirring] = useState(false);
  const [stirPos, setStirPos] = useState({ x: 0, y: 0 });

  const vatRef = useRef<HTMLDivElement | null>(null);
  const prevLobe = useRef<'left' | 'right' | null>(null);
  const lobeSwitchCount = useRef<number>(0);
  const soundCooldown = useRef<number>(0);

  const isPandan = materials.grassType === 'pandan';
  const hasAdditive = materials.additiveType !== 'none';

  // 100 Grass pulp elements evenly distributed across the entire rectangular vat
  // (grid of 10 cols x 10 rows with random jitter)
  const grassVatFibers = useRef(
    Array.from({ length: 100 }).map((_, i) => {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const xPercent = 6 + col * 9 + (Math.random() * 4 - 2); // 6% to 94%
      const yPercent = 8 + row * 8.5 + (Math.random() * 4 - 2); // 8% to 92%
      const length = 12 + (i % 6) * 4;
      const angle = (i * 37) % 180;
      const animDelay = (i * 0.12) % 4; // staggered drift phase
      const animDuration = 4 + (i % 3) * 1.5; // slow gentle 4-7s drift
      return { xPercent, yPercent, length, angle, animDelay, animDuration };
    })
  ).current;

  // 40 Additive fibers distributed evenly across the vat
  const additiveVatFibers = useRef(
    Array.from({ length: 40 }).map((_, i) => {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const xPercent = 8 + col * 11 + (Math.random() * 5 - 2.5);
      const yPercent = 10 + row * 16 + (Math.random() * 5 - 2.5);
      const length = 14 + (i % 5) * 5;
      const angle = (i * 47) % 180;
      const animDelay = (i * 0.18) % 4;
      const animDuration = 4.5 + (i % 3) * 1.5;
      return { xPercent, yPercent, length, angle, animDelay, animDuration };
    })
  ).current;

  // Additive basin details
  const getAdditiveInfo = () => {
    switch (materials.additiveType) {
      case 'bark':
        return { name: 'Vỏ Dó', color: 'bg-amber-800', badge: 'Thau xơ vỏ Dó đã xử lý' };
      case 'bagasse':
        return { name: 'Bã mía', color: 'bg-stone-200', badge: 'Thau xơ bã mía đã xử lý' };
      case 'reed':
        return { name: 'Sậy', color: 'bg-amber-300', badge: 'Thau xơ sậy đã xử lý' };
      default:
        return null;
    }
  };
  const additiveInfo = getAdditiveInfo();

  const handlePourGrass = () => {
    if (pouredGrass) return;
    sound.playWaterSplash();
    setPouredGrass(true);
  };

  const handlePourAdditive = () => {
    if (pouredAdditive) return;
    sound.playWaterSplash();
    setPouredAdditive(true);
  };

  const handlePourStarch = () => {
    if (pouredStarch) return;
    sound.playWaterSplash();
    onChangeStarch(selectedStarchDose);
    setPouredStarch(true);
  };

  // Figure-8 (hình số 8) motion tracking
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Can stir if grass and starch (and additive if selected) are poured
    const ready = pouredGrass && pouredStarch && (!hasAdditive || pouredAdditive);
    if (!ready) return;

    setIsStirring(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    prevLobe.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isStirring || !vatRef.current) return;

    const rect = vatRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    setStirPos({ x: dx * 0.7, y: dy * 0.7 });

    const currentLobe = dx < 0 ? 'left' : 'right';

    if (prevLobe.current !== null && prevLobe.current !== currentLobe) {
      lobeSwitchCount.current += 1;
      const targetSwitches = 10; // ~5 complete figure-8 cycles
      const next = Math.min(100, Math.round((lobeSwitchCount.current / targetSwitches) * 100));
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
    prevLobe.current = currentLobe;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsStirring(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe ignore
    }
  };

  const allIngredientsPoured = pouredGrass && pouredStarch && (!hasAdditive || pouredAdditive);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* CSS gentle drifting animation for floating water fibers */}
      <style>{`
        @keyframes fiberDrift {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(3px, -4px) rotate(4deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
      `}</style>

      {/* 1 Hollow Circle Indicator tracking figure-8 stirring */}
      {isStirring && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Khuấy hình số 8"
          offsetX={stirPos.x}
          offsetY={stirPos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 08 · Pha Bể Giấy
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Pha Bột & Hồ Vào Bể Seo
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Click trực tiếp vào từng thau nguyên liệu để cho vào bể, chọn định lượng hồ tinh bột, sau đó <strong>giữ chuột và di chuyển theo hình số 8 (∞)</strong> để khuấy đều.
        </p>
      </div>

      {/* Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 flex flex-col items-center">
        {/* Row of Graphical Ingredient Basins and the Center Vat */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-5 mb-4">
          {/* Left Column: Basins (Grass Pulp + Additive Pulp if chosen) */}
          <div className="flex flex-row lg:flex-col gap-4 items-center">
            {/* 1. Graphic Basin of Grass Pulp (100 fibers) */}
            <div
              onClick={handlePourGrass}
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center p-2 transition-all cursor-pointer relative shadow-xl overflow-hidden ${
                pouredGrass
                  ? 'border-stone-500 bg-stone-850 opacity-60 cursor-default'
                  : 'border-emerald-600 bg-stone-900 hover:scale-105 hover:border-emerald-400 ring-2 ring-emerald-500/20'
              }`}
            >
              <div className="absolute inset-1 rounded-full border border-stone-600/40 pointer-events-none"></div>

              {!pouredGrass ? (
                <div className="relative w-28 h-28 flex items-center justify-center pointer-events-none">
                  {/* 100 fibers rendered */}
                  {Array.from({ length: 48 }).map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${10 + (idx % 4) * 4}px`,
                        height: '1.4px',
                        transform: `rotate(${(idx * 37) % 360}deg) translate(${((idx % 6) * 5)}px)`,
                      }}
                      className={`absolute rounded-full shadow-xs ${
                        isPandan ? 'bg-emerald-500' : 'bg-lime-400'
                      }`}
                    ></div>
                  ))}
                  <div className="absolute -bottom-1 bg-stone-950/90 text-emerald-200 text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-sm whitespace-nowrap">
                    Bột {isPandan ? 'cỏ lá dứa' : 'cỏ lá sả'}
                  </div>
                </div>
              ) : (
                <div className="text-stone-400 text-xs font-serif flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Đã đổ vào bể</span>
                </div>
              )}
            </div>

            {/* 2. Graphic Basin of Processed Additive Material (If selected) */}
            {hasAdditive && additiveInfo && (
              <div
                onClick={handlePourAdditive}
                className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center p-2 transition-all cursor-pointer relative shadow-xl overflow-hidden ${
                  pouredAdditive
                    ? 'border-stone-500 bg-stone-850 opacity-60 cursor-default'
                    : 'border-amber-600 bg-stone-900 hover:scale-105 hover:border-amber-400 ring-2 ring-amber-500/20'
                }`}
              >
                <div className="absolute inset-1 rounded-full border border-stone-600/40 pointer-events-none"></div>

                {!pouredAdditive ? (
                  <div className="relative w-28 h-28 flex items-center justify-center pointer-events-none">
                    {/* Processed additive fibers */}
                    {Array.from({ length: 36 }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: `${12 + (idx % 4) * 4}px`,
                          height: '1.6px',
                          transform: `rotate(${(idx * 43) % 360}deg) translate(${((idx % 5) * 5)}px)`,
                        }}
                        className={`absolute rounded-full shadow-xs ${additiveInfo.color}`}
                      ></div>
                    ))}
                    <div className="absolute -bottom-1 bg-stone-950/90 text-amber-200 text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-500/40 shadow-sm whitespace-nowrap">
                      {additiveInfo.badge}
                    </div>
                  </div>
                ) : (
                  <div className="text-stone-400 text-xs font-serif flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Đã hòa {additiveInfo.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center: Large Rectangular Wooden Paper Vat with Water Gauge */}
          <div className="flex-1 w-full flex items-center gap-3">
            {/* Water Level Selector Gauge on Vat Wall */}
            <div className="flex flex-col items-center gap-1 text-[10px] font-mono text-stone-600">
              <span className="font-semibold text-stone-800">Mực nước</span>
              <div className="flex flex-col gap-1.5 p-1.5 bg-white rounded-xl border border-stone-200 shadow-sm">
                {[
                  { level: 90, label: 'Đầy (90%)' },
                  { level: 70, label: 'Vừa (70%)' },
                  { level: 50, label: 'Nông (50%)' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => {
                      sound.playWaterSplash();
                      onChangeWaterLevel(item.level);
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                      Math.abs(vatWaterLevel - item.level) < 15
                        ? 'bg-cyan-700 text-white font-bold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* The Vat Interior Canvas */}
            <div
              ref={vatRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative flex-1 h-72 md:h-80 bg-gradient-to-b from-stone-900 via-stone-850 to-amber-950 rounded-2xl border-8 border-amber-900 shadow-2xl flex items-center justify-center overflow-hidden touch-none ${
                allIngredientsPoured ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
            >
              {/* Visual Water Fill scaled by vatWaterLevel */}
              <div
                style={{
                  height: `${vatWaterLevel}%`,
                }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-950 via-cyan-900/90 to-cyan-850/80 transition-all duration-500 flex items-center justify-center overflow-hidden"
              >
                {/* Figure-8 Guide Graphic inside vat */}
                {allIngredientsPoured && stirProgress < 100 && (
                  <div className="absolute inset-4 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/60 -mr-6"></div>
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/60 -ml-6"></div>
                    <span className="absolute bottom-2 text-[10px] font-mono text-cyan-200 bg-stone-950/70 px-2 py-0.5 rounded-full">
                      Khuấy theo hình ∞ ({stirProgress}%)
                    </span>
                  </div>
                )}

                {/* Floating Suspended Fibers Distributed Evenly with Gentle Drift Animation */}
                {pouredGrass && (
                  <div className="absolute inset-0 pointer-events-none">
                    {grassVatFibers.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: `${p.xPercent}%`,
                          top: `${p.yPercent}%`,
                          width: `${p.length}px`,
                          height: '1.3px',
                          transform: `rotate(${p.angle + stirProgress * 1.8}deg)`,
                          animation: `fiberDrift ${p.animDuration}s ease-in-out infinite`,
                          animationDelay: `${p.animDelay}s`,
                          opacity: 0.55 + (stirProgress / 100) * 0.4,
                        }}
                        className={`absolute rounded-full shadow-xs ${
                          isPandan ? 'bg-emerald-400' : 'bg-lime-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Evenly distributed Additive fibers */}
                {pouredAdditive && additiveInfo && (
                  <div className="absolute inset-0 pointer-events-none">
                    {additiveVatFibers.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: `${p.xPercent}%`,
                          top: `${p.yPercent}%`,
                          width: `${p.length}px`,
                          height: '1.5px',
                          transform: `rotate(${p.angle + stirProgress * 1.8}deg)`,
                          animation: `fiberDrift ${p.animDuration}s ease-in-out infinite`,
                          animationDelay: `${p.animDelay}s`,
                          opacity: 0.65,
                        }}
                        className={`absolute rounded-full shadow-xs ${additiveInfo.color}`}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Starch Viscosity cloud */}
                {pouredStarch && (
                  <div
                    style={{
                      opacity: selectedStarchDose === 'high' ? 0.25 : selectedStarchDose === 'medium' ? 0.15 : 0.08,
                    }}
                    className="absolute inset-0 bg-white blur-md pointer-events-none transition-opacity duration-300"
                  ></div>
                )}

                {/* Prompt in empty vat */}
                {!pouredGrass && (
                  <div className="text-cyan-200/80 text-xs font-serif text-center px-4">
                    Bể nước sạch đang chờ tiếp nhận nguyên liệu & hồ
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Graphic Starch Basin with Dosage Selector */}
          <div className="flex flex-col items-center gap-2">
            {/* Dosage Selector prior to pouring */}
            {!pouredStarch && (
              <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center">
                <span className="text-[10px] font-semibold text-stone-800 mb-1">
                  Định lượng hồ:
                </span>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high'] as StarchLevel[]).map((dose) => {
                    const isSelected = selectedStarchDose === dose;
                    const label = dose === 'low' ? 'Ít' : dose === 'medium' ? 'Vừa' : 'Nhiều';
                    return (
                      <button
                        key={dose}
                        onClick={() => {
                          sound.playTap();
                          setSelectedStarchDose(dose);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-800 text-white font-bold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Starch Graphic Basin */}
            <div
              onClick={handlePourStarch}
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center p-2 transition-all cursor-pointer relative shadow-xl overflow-hidden ${
                pouredStarch
                  ? 'border-stone-500 bg-stone-850 opacity-60 cursor-default'
                  : 'border-amber-500 bg-stone-900 hover:scale-105 hover:border-amber-400 ring-2 ring-amber-400/20'
              }`}
            >
              <div className="absolute inset-1 rounded-full border border-stone-600/40 pointer-events-none"></div>

              {!pouredStarch ? (
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-b from-stone-100 via-amber-50 to-stone-200 border-2 border-amber-300/50 flex flex-col items-center justify-center shadow-inner pointer-events-none">
                  {/* Viscous starch ripples */}
                  <div
                    style={{
                      transform: `scale(${selectedStarchDose === 'high' ? 1.15 : selectedStarchDose === 'low' ? 0.75 : 0.95})`,
                    }}
                    className="w-16 h-16 rounded-full bg-white/90 border border-amber-200/80 shadow-sm flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100/60 blur-xs"></div>
                  </div>
                  <div className="absolute -bottom-1 bg-stone-950/90 text-amber-200 text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-500/40 shadow-sm whitespace-nowrap">
                    Thau hồ ({selectedStarchDose === 'low' ? 'Ít' : selectedStarchDose === 'medium' ? 'Vừa' : 'Nhiều'})
                  </div>
                </div>
              ) : (
                <div className="text-stone-400 text-xs font-serif flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Đã hòa hồ ({selectedStarchDose})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Status & Skip */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-md gap-3 text-stone-700 text-xs">
          <div className="flex items-center gap-2.5">
            <Waves className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-stone-900">Độ phân tán sợi:</span>
            <div className="w-36 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${stirProgress}%` }}
                className="h-full bg-emerald-600 transition-all duration-150"
              ></div>
            </div>
            <span className="font-mono text-stone-600">{stirProgress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playWaterSplash();
              onChangeStarch(selectedStarchDose);
              onComplete();
            }}
            className="text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua khuấy nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
