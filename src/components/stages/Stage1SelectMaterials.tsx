import React from 'react';
import { MaterialConfig, AdditiveType } from '../../types/paper';
import { sound } from '../../utils/audio';
import { Sparkles, ArrowRight, Info } from 'lucide-react';

interface Stage1Props {
  materials: MaterialConfig;
  onChangeMaterials: (materials: MaterialConfig) => void;
  onNext: () => void;
}

const ADDITIVE_OPTIONS: {
  id: AdditiveType;
  name: string;
  sub: string;
  effect: string;
  colorPreview: string;
  iconSymbol: string;
}[] = [
  {
    id: 'none',
    name: '100% Cỏ mộc',
    sub: 'Thuần khiết đồng nội',
    effect: 'Tờ giấy thuần sợi cỏ tự nhiên, màu kem thảo mộc thanh thoát, độ dai cân bằng.',
    colorPreview: 'bg-emerald-100 border-emerald-300',
    iconSymbol: '🌾',
  },
  {
    id: 'bark',
    name: 'Vỏ cây Dướng',
    sub: 'Tăng độ dai & kết cấu',
    effect: 'Chứa sợi xơ dài dẻo dai; tăng độ bền chắc, bề mặt hiện gân vỏ mộc mạc và sắc be ấm.',
    colorPreview: 'bg-amber-100 border-amber-400',
    iconSymbol: '🪵',
  },
  {
    id: 'bagasse',
    name: 'Bã mía',
    sub: 'Tăng độ sáng & xốp nhẹ',
    effect: 'Tạo màu ngà sáng dịu, trọng lượng nhẹ, bề mặt hơi xốp êm ái, thấm mực mượt mà.',
    colorPreview: 'bg-stone-100 border-stone-300',
    iconSymbol: '🎋',
  },
  {
    id: 'reed',
    name: 'Sậy tự nhiên',
    sub: 'Tăng texture & thớ sợi',
    effect: 'Gân sậy cứng cáp đan xen tạo những đường thớ sợi nổi bật, giấy đanh chắc có cá tính.',
    colorPreview: 'bg-lime-100 border-lime-400',
    iconSymbol: '🌾',
  },
  {
    id: 'straw',
    name: 'Rơm nếp',
    sub: 'Tăng sắc vàng & thô mộc',
    effect: 'Màu vàng rơm óng ả đồng quê, vụn rơm li ti tạo chất cảm thủ công mộc mạc.',
    colorPreview: 'bg-yellow-100 border-yellow-400',
    iconSymbol: '🌾',
  },
];

export const Stage1SelectMaterials: React.FC<Stage1Props> = ({
  materials,
  onChangeMaterials,
  onNext,
}) => {
  const handleSelectAdditive = (type: AdditiveType) => {
    sound.playTap();
    if (type === 'none') {
      onChangeMaterials({
        additiveType: 'none',
        grassRatio: 100,
        additiveRatio: 0,
      });
    } else {
      onChangeMaterials({
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

  const selectedInfo = ADDITIVE_OPTIONS.find((o) => o.id === materials.additiveType);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Workshop Desk Canvas Header */}
      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 01 · Workshop Bắt Đầu
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Chọn Nguyên Liệu Làm Giấy
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Cỏ sả tươi là nguyên liệu nền bắt buộc. Bạn có thể phối thêm nguyên liệu thảo mộc phụ trợ
          để quyết định độ dai, màu sắc và texture cho tờ giấy của mình.
        </p>
      </div>

      {/* First-Person Table Workspace */}
      <div className="w-full bg-gradient-to-b from-amber-50 to-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-amber-900/10 backdrop-blur-sm">
        {/* Ingredient Baskets Shelf */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          {ADDITIVE_OPTIONS.map((opt) => {
            const isSelected = materials.additiveType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectAdditive(opt.id)}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-700 bg-amber-100/80 shadow-md scale-102 ring-2 ring-amber-600/20'
                    : 'border-stone-200 bg-white/70 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="text-3xl mb-1">{opt.iconSymbol}</div>
                <div className="font-serif font-medium text-stone-900 text-sm whitespace-nowrap">
                  {opt.name}
                </div>
                <div className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                  {opt.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Mix Proportion Adjustment */}
        {materials.additiveType !== 'none' && (
          <div className="bg-white/80 rounded-2xl p-5 border border-stone-200 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-stone-800">
                Tỷ lệ phối nguyên liệu:
              </span>
              <div className="flex items-center gap-2 text-xs font-serif">
                <span className="text-emerald-800 font-semibold">Cỏ nền: {materials.grassRatio}%</span>
                <span>·</span>
                <span className="text-amber-800 font-semibold">{selectedInfo?.name}: {materials.additiveRatio}%</span>
              </div>
            </div>

            {/* Visual Dual-Color Bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner mb-3">
              <div
                style={{ width: `${materials.grassRatio}%` }}
                className="bg-emerald-600 transition-all duration-200 flex items-center justify-center text-[10px] text-emerald-100 font-medium"
              >
                Cỏ {materials.grassRatio}%
              </div>
              <div
                style={{ width: `${materials.additiveRatio}%` }}
                className="bg-amber-600 transition-all duration-200 flex items-center justify-center text-[10px] text-amber-100 font-medium"
              >
                Phối {materials.additiveRatio}%
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">Ít phụ trợ (10%)</span>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={materials.additiveRatio}
                onChange={(e) => handleRatioChange(Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <span className="text-xs text-stone-500">Nhiều phụ trợ (40%)</span>
            </div>
          </div>
        )}

        {/* Artisan Note Callout */}
        <div className="flex items-start gap-3 p-4 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-950 mb-6">
          <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{selectedInfo?.name}: </span>
            {selectedInfo?.effect}
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
