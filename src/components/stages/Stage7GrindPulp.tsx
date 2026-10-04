import React, { useState } from 'react';
import { GrindLevel } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, RotateCw, Check } from 'lucide-react';

interface Stage7Props {
  currentGrind: GrindLevel;
  onChangeGrind: (grind: GrindLevel) => void;
  onComplete: () => void;
}

const GRIND_OPTIONS: {
  id: GrindLevel;
  title: string;
  subtitle: string;
  effect: string;
  textureNote: string;
}[] = [
  {
    id: 'coarse',
    title: 'Nghiền Thô (Coarse)',
    subtitle: 'Giữ nguyên cấu trúc sợi dài',
    effect: 'Tạo bề mặt giấy thô mộc, lộ rõ từng thớ xơ thảo mộc hoang sơ, mang đậm dấu ấn tự nhiên.',
    textureNote: 'Độ mịn: ~35/100 · Texture sợi rất rõ',
  },
  {
    id: 'medium',
    title: 'Nghiền Vừa (Medium)',
    subtitle: 'Cân bằng hoàn hảo chuẩn nghệ nhân',
    effect: 'Độ mịn hài hòa, các sợi đan kết vững chắc, chạm tay êm ái thích hợp cho đa số mục đích viết vẽ.',
    textureNote: 'Độ mịn: ~70/100 · Cân đối độ bền & độ êm',
  },
  {
    id: 'fine',
    title: 'Nghiền Mịn (Fine)',
    subtitle: 'Nhuyễn như kem lụa',
    effect: 'Xơ sợi phân rã siêu nhỏ, bề mặt giấy cực kỳ phẳng mượt, bắt mực sắc sảo và thanh nhã.',
    textureNote: 'Độ mịn: ~95/100 · Bề mặt phẳng mượt như lụa',
  },
];

export const Stage7GrindPulp: React.FC<Stage7Props> = ({
  currentGrind,
  onChangeGrind,
  onComplete,
}) => {
  const [grindActionCount, setGrindActionCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleMillTurn = () => {
    sound.playGrind();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 260);
    setGrindActionCount((prev) => prev + 1);
  };

  const handleSelectGrind = (level: GrindLevel) => {
    sound.playTap();
    onChangeGrind(level);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 07 · Chế Biến Bột Giấy
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Nghiền Bột Giấy
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Mức độ nghiền quyết định trực tiếp độ mịn bề mặt và texture của tờ giấy. Hãy chọn mức độ bạn mong muốn và xoay cối nghiền.
        </p>
      </div>

      {/* Main Grinding Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-300">
        {/* Level Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {GRIND_OPTIONS.map((opt) => {
            const isSelected = currentGrind === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectGrind(opt.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50 shadow-md ring-2 ring-amber-600/20'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-semibold text-stone-900 text-sm">
                    {opt.title}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-amber-800" />}
                </div>
                <div className="text-xs text-amber-800 font-medium mb-1">
                  {opt.subtitle}
                </div>
                <div className="text-xs text-stone-600 mb-2">
                  {opt.effect}
                </div>
                <div className="text-[11px] text-stone-500 font-mono bg-stone-100/80 px-2 py-1 rounded-md">
                  {opt.textureNote}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Stone Mill Visual */}
        <div className="w-full h-56 bg-stone-800 rounded-2xl border-4 border-stone-900 shadow-inner relative flex items-center justify-center overflow-hidden mb-6">
          {/* Rotating Millstone */}
          <div
            onClick={handleMillTurn}
            className={`relative w-44 h-44 rounded-full bg-gradient-to-b from-stone-600 via-stone-700 to-stone-800 border-4 border-stone-500 shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-300 ${
              isSpinning ? 'rotate-90 scale-95' : 'hover:scale-102'
            }`}
          >
            {/* Wooden Handle of Millstone */}
            <div className="absolute top-3 right-6 w-5 h-8 bg-amber-700 rounded-full shadow-md border border-amber-900 flex items-center justify-center text-[10px] text-amber-200">
              ●
            </div>

            {/* Pulp Slurry Center Preview */}
            <div className="w-24 h-24 rounded-full bg-amber-950/80 p-2 flex items-center justify-center overflow-hidden border border-amber-800/40">
              <div
                className={`w-full h-full rounded-full transition-all duration-300 flex flex-wrap items-center justify-center ${
                  currentGrind === 'coarse'
                    ? 'bg-emerald-800/80 blur-[1px]'
                    : currentGrind === 'medium'
                    ? 'bg-amber-700/80 blur-[2px]'
                    : 'bg-amber-200/90 blur-[3px]'
                }`}
              >
                <div className="text-[10px] text-center font-serif text-stone-900 font-semibold">
                  {currentGrind === 'coarse' ? 'Sợi thô' : currentGrind === 'medium' ? 'Bột vừa' : 'Nhuyễn mịn'}
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="absolute -bottom-8 text-[11px] text-stone-400 font-mono flex items-center gap-1">
              <RotateCw className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>Chạm để xoay cối ({grindActionCount} vòng)</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              sound.playTap();
              onComplete();
            }}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-100 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer"
          >
            <span>Đã nghiền xong · Pha bể giấy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
