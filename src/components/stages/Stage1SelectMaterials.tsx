import React from 'react';
import { MaterialConfig, AdditiveType, GrassType } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, Info, Check } from 'lucide-react';

interface Stage1Props {
  materials: MaterialConfig;
  onChangeMaterials: (materials: MaterialConfig) => void;
  onNext: () => void;
}

const GRASS_OPTIONS: {
  id: GrassType;
  name: string;
  sub: string;
  colorPreview: string;
  desc: string;
}[] = [
  {
    id: 'lemongrass',
    name: 'Cỏ Lá Sả',
    sub: 'Lá mảnh dài, thơm dịu',
    colorPreview: 'bg-emerald-100 border-emerald-400 text-emerald-950',
    desc: 'Nguyên liệu nền truyền thống với thớ sợi mảnh đều, cho màu giấy xanh nhạt tự nhiên thanh thoát.',
  },
  {
    id: 'pandan',
    name: 'Cỏ Lá Dứa',
    sub: 'Sắc diệp lục đậm, xơ dẻo',
    colorPreview: 'bg-emerald-200 border-emerald-500 text-emerald-950',
    desc: 'Lá dứa dồi dào diệp lục, sợi dẻo mềm, cho màu giấy xanh lá đậm hơn và bề mặt mịn êm.',
  },
];

const ADDITIVE_OPTIONS: {
  id: AdditiveType;
  name: string;
  sub: string;
  effect: string;
  colorBadge: string;
}[] = [
  {
    id: 'none',
    name: '100% Cỏ mộc',
    sub: 'Không phối thêm',
    effect: 'Tờ giấy thuần túy sợi cỏ tự nhiên, màu xanh nhạt hoặc xanh lá dứa mộc mạc.',
    colorBadge: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  },
  {
    id: 'bark',
    name: 'Vỏ Cây Dó',
    sub: 'Di sản giấy Dó Việt',
    effect: 'Chứa bó sợi xơ dài dẻo dai bậc nhất; tăng độ bền dai vượt trội, gân xơ rõ và ánh màu nâu be trầm.',
    colorBadge: 'bg-amber-100 border-amber-400 text-amber-950',
  },
  {
    id: 'bagasse',
    name: 'Bã Mía',
    sub: 'Xốp nhẹ & sáng màu',
    effect: 'Giúp giấy sáng màu, nhẹ tơi, bề mặt hơi xốp mềm mại, khả năng thấm hút mực êm ái.',
    colorBadge: 'bg-stone-100 border-stone-300 text-stone-900',
  },
  {
    id: 'reed',
    name: 'Sậy Tự Nhiên',
    sub: 'Gân sợi nổi bật',
    effect: 'Thân sậy dẻo dai tạo những đường thớ sợi dọc sắc nét, sắc vàng be tự nhiên của bến bãi ven sông.',
    colorBadge: 'bg-lime-50 border-lime-400 text-lime-950',
  },
];

export const Stage1SelectMaterials: React.FC<Stage1Props> = ({
  materials,
  onChangeMaterials,
  onNext,
}) => {
  const handleSelectGrass = (type: GrassType) => {
    sound.playTap();
    onChangeMaterials({
      ...materials,
      grassType: type,
    });
  };

  const handleSelectAdditive = (type: AdditiveType) => {
    sound.playTap();
    if (type === 'none') {
      onChangeMaterials({
        ...materials,
        additiveType: 'none',
        grassRatio: 100,
        additiveRatio: 0,
      });
    } else {
      onChangeMaterials({
        ...materials,
        additiveType: type,
        grassRatio: 80,
        additiveRatio: 20,
      });
    }
  };

  const handleRatioChange = (additiveVal: number) => {
    const grassVal = 100 - additiveVal;
    onChangeMaterials({
      ...materials,
      grassRatio: grassVal,
      additiveRatio: additiveVal,
    });
  };

  const selectedAdditiveInfo = ADDITIVE_OPTIONS.find((o) => o.id === materials.additiveType);
  const selectedGrassInfo = GRASS_OPTIONS.find((g) => g.id === materials.grassType);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 01 · Khởi Đầu Workshop
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Chọn Cỏ & Nguyên Liệu Phối
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Chọn loại cỏ làm nền chính và phối thêm nguyên liệu thảo mộc truyền thống để quyết định màu sắc, độ dai và cấu trúc sợi của tờ giấy.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full bg-stone-50 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200">
        {/* Step A: Chọn loại cỏ nền */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-stone-900 font-serif">
              1. Chọn loại cỏ làm nền chính (Bắt buộc):
            </span>
            <span className="text-xs text-emerald-800 font-medium">
              Đang chọn: {selectedGrassInfo?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GRASS_OPTIONS.map((grass) => {
              const isSelected = materials.grassType === grass.id;
              return (
                <button
                  key={grass.id}
                  onClick={() => handleSelectGrass(grass.id)}
                  className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/80 shadow-md ring-2 ring-emerald-600/20'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xl shrink-0 mt-0.5">
                      🌾
                    </div>
                    <div>
                      <div className="font-serif font-semibold text-stone-900 text-sm">
                        {grass.name}
                      </div>
                      <div className="text-xs text-emerald-800 font-medium mt-0.5">
                        {grass.sub}
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                        {grass.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step B: Chọn nguyên liệu phối */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-stone-900 font-serif">
              2. Chọn nguyên liệu phối phụ trợ (Tùy chọn):
            </span>
            <span className="text-xs text-amber-800 font-medium">
              {selectedAdditiveInfo?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {ADDITIVE_OPTIONS.map((opt) => {
              const isSelected = materials.additiveType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAdditive(opt.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50 shadow-md ring-2 ring-amber-600/20'
                      : 'border-stone-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-semibold text-stone-900 text-xs">
                        {opt.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                    </div>
                    <div className="text-[11px] text-amber-800 font-medium mb-1">
                      {opt.sub}
                    </div>
                    <div className="text-[11px] text-stone-500 leading-normal line-clamp-3">
                      {opt.effect}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step C: Điều chỉnh tỷ lệ nếu có phối */}
        {materials.additiveType !== 'none' && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-3 text-xs">
              <span className="font-semibold text-stone-800">
                Tỷ lệ phối nguyên liệu:
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-emerald-800 font-semibold">
                  {selectedGrassInfo?.name}: {materials.grassRatio}%
                </span>
                <span>·</span>
                <span className="text-amber-800 font-semibold">
                  {selectedAdditiveInfo?.name}: {materials.additiveRatio}%
                </span>
              </div>
            </div>

            {/* Visual Dual-Color Bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner mb-3">
              <div
                style={{ width: `${materials.grassRatio}%` }}
                className="bg-emerald-600 transition-all duration-200 flex items-center justify-center text-[10px] text-emerald-100 font-medium"
              >
                {selectedGrassInfo?.name} {materials.grassRatio}%
              </div>
              <div
                style={{ width: `${materials.additiveRatio}%` }}
                className="bg-amber-600 transition-all duration-200 flex items-center justify-center text-[10px] text-amber-100 font-medium"
              >
                {selectedAdditiveInfo?.name} {materials.additiveRatio}%
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">Ít phối (10%)</span>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={materials.additiveRatio}
                onChange={(e) => handleRatioChange(Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <span className="text-xs text-stone-500">Nhiều phối (40%)</span>
            </div>
          </div>
        )}

        {/* Artisan Note */}
        <div className="flex items-start gap-3 p-4 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-stone-800 mb-6">
          <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Đặc tính phối: </span>
            {selectedGrassInfo?.name} phối cùng {selectedAdditiveInfo?.name.toLowerCase()} sẽ tạo nên cấu trúc sợi dẻo dai và màu sắc đặc trưng sau quá trình nấu kiềm và seo màng giấy.
          </div>
        </div>

        {/* Proceed Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              sound.playTap();
              onNext();
            }}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-100 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Tiến hành cắt cỏ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
