import React, { useState } from 'react';
import { MaterialConfig, StarchLevel } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, RotateCw, Check } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';

interface Stage8Props {
  materials: MaterialConfig;
  starchLevel: StarchLevel;
  onChangeStarch: (level: StarchLevel) => void;
  onComplete: () => void;
}

const STARCH_OPTIONS: {
  id: StarchLevel;
  name: string;
  desc: string;
  effect: string;
}[] = [
  {
    id: 'low',
    name: 'Hồ Nhẹ (Ít)',
    desc: 'Độ kết dính vừa phải',
    effect: 'Mặt giấy xốp mềm tự nhiên, tính thấm hút cao, mộc mạc.',
  },
  {
    id: 'medium',
    name: 'Hồ Tiêu Chuẩn (Vừa)',
    desc: 'Tỷ lệ vàng thợ giấy thủ công',
    effect: 'Sợi liên kết chặt chẽ tối ưu, bền dai, chống phai và không nhòe mực.',
  },
  {
    id: 'high',
    name: 'Hồ Đậm (Nhiều)',
    desc: 'Độ đanh chắc & cứng cáp',
    effect: 'Tờ giấy đanh giòn, mặt giấy bóng lì nhẹ, độ dai đạt mức tối đa.',
  },
];

export const Stage8VatMix: React.FC<Stage8Props> = ({
  materials,
  starchLevel,
  onChangeStarch,
  onComplete,
}) => {
  const [pouredPulp, setPouredPulp] = useState(false);
  const [pouredStarch, setPouredStarch] = useState(false);
  const [stirCount, setStirCount] = useState(0);
  const [isStirring, setIsStirring] = useState(false);
  const targetStirs = 4;

  const handlePourPulp = () => {
    sound.playWaterSplash();
    setPouredPulp(true);
  };

  const handlePourStarch = () => {
    sound.playWaterSplash();
    setPouredStarch(true);
  };

  const handleStir = () => {
    sound.playWaterSplash();
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 300);

    const next = stirCount + 1;
    setStirCount(next);

    if (next >= targetStirs) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const isReady = pouredPulp && pouredStarch;
  const progress = Math.min(100, Math.round((stirCount / targetStirs) * 100));

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <FirstPersonHands tool="stir" isActing={isStirring} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 08 · Chuẩn Bị Bể Seo
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Pha Bể Giấy Thủ Công
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Đổ bột giấy và hồ tinh bột vào bể nước sạch, dùng mái khuấy để các sợi xơ lơ lửng đều đặn mà không bị chìm xuống đáy.
        </p>
      </div>

      {/* Vat Container Deck */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-300">
        {/* Starch Binder Level Selector */}
        <div className="mb-6 bg-white rounded-2xl p-4 border border-stone-200">
          <div className="text-xs font-semibold text-stone-800 mb-2">
            Điều chỉnh lượng hồ tinh bột tự nhiên:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {STARCH_OPTIONS.map((opt) => {
              const isSelected = starchLevel === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    sound.playTap();
                    onChangeStarch(opt.id);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50 ring-1 ring-amber-600'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">{opt.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{opt.effect}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Vat Visual (Large Wooden Vat) */}
        <div className="w-full h-64 md:h-72 bg-amber-950/80 rounded-2xl border-4 border-amber-900 shadow-2xl relative overflow-hidden flex items-center justify-center p-4 mb-4">
          {/* Wood Planks Rim of Vat */}
          <div className="absolute inset-0 border-8 border-amber-900/60 pointer-events-none z-10"></div>

          {/* Water Pool */}
          <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-cyan-900 via-stone-800 to-amber-950 flex items-center justify-center overflow-hidden">
            {/* Water Ripple Layer */}
            {isStirring && (
              <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse pointer-events-none"></div>
            )}

            {/* Suspended Fibers Web */}
            {pouredPulp && (
              <div
                className={`relative w-full h-full flex flex-wrap items-center justify-center gap-2 p-6 transition-all duration-500 ${
                  isStirring ? 'rotate-12 scale-98' : ''
                }`}
              >
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${12 + (i % 5) * 6}px`,
                      height: `${2 + (i % 3)}px`,
                      transform: `rotate(${(i * 53) % 180}deg)`,
                      opacity: 0.4 + (stirCount / targetStirs) * 0.5,
                    }}
                    className="bg-amber-200/80 rounded-full shadow-xs"
                  ></div>
                ))}
              </div>
            )}

            {/* Prompt in empty vat */}
            {!pouredPulp && (
              <div className="text-amber-100/70 text-xs font-serif text-center">
                Bể nước sạch trong vắt đang chờ hòa bột giấy
              </div>
            )}
          </div>
        </div>

        {/* Interactive Steps Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!pouredPulp && (
            <button
              onClick={handlePourPulp}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-amber-100 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer animate-pulse"
            >
              <span>1. Đổ bột cỏ vào bể</span>
            </button>
          )}

          {pouredPulp && !pouredStarch && (
            <button
              onClick={handlePourStarch}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer animate-pulse"
            >
              <span>2. Thêm gáo hồ tinh bột</span>
            </button>
          )}

          {isReady && (
            <button
              onClick={handleStir}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-200 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer active:scale-95"
            >
              <RotateCw className={`w-4 h-4 ${isStirring ? 'animate-spin' : ''}`} />
              <span>3. Khuấy đều bể theo hình số 8 ({stirCount}/{targetStirs})</span>
            </button>
          )}
        </div>

        {/* Progress & Fast Forward */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between w-full max-w-md mx-auto gap-3 text-stone-700 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs">Độ phân tán sợi:</span>
            <div className="w-36 h-2 bg-stone-300 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-emerald-700 transition-all duration-300"
              ></div>
            </div>
            <span className="text-xs text-stone-500 font-mono">{progress}%</span>
          </div>

          <button
            onClick={() => {
              sound.playWaterSplash();
              onComplete();
            }}
            className="text-xs text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bỏ qua khuấy nhanh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
