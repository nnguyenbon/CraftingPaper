import React, { useState } from 'react';
import { DecorationType, FlowerItem, MaterialConfig } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { ActionIndicator } from '../ActionIndicator';

interface Stage11Props {
  materials: MaterialConfig;
  currentType: DecorationType;
  decorations: FlowerItem[];
  onChangeType: (type: DecorationType) => void;
  onUpdateDecorations: (items: FlowerItem[]) => void;
  onComplete: () => void;
}

const DECORATION_MODES: {
  id: DecorationType;
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: 'pressed_flowers',
    title: 'Ép Hoa Tự Nhiên',
    subtitle: 'Cánh cúc, hoa đào & đậu biếc',
    icon: '🌸',
    desc: 'Cánh hoa ép mộc mạc lưu giữ sắc màu dịu dàng hòa vào thớ giấy.',
  },
  {
    id: 'pressed_leaves',
    title: 'Ép Lá Thảo Mộc',
    subtitle: 'Lá tre non & dương xỉ',
    icon: '🍃',
    desc: 'Những chiếc lá non thanh mảnh mang trọn vẻ đẹp thiền định của thiên nhiên.',
  },
  {
    id: 'water_marbling',
    title: 'Tạo Vân Nước Thủy Ấn',
    subtitle: 'Dòng vân mực bồng bềnh',
    icon: '🌊',
    desc: 'Vân thủy ấn gợn sóng mềm mại như mây trời loang trên bề mặt giấy.',
  },
  {
    id: 'natural_specks',
    title: 'Họa Tiết Hạt Cỏ',
    subtitle: 'Hạt cỏ dại & vụn xơ vàng',
    icon: '🌾',
    desc: 'Lấm tấm những hạt cỏ và vụn sợi vàng rải rác gợi nhớ đồng quê mùa gặt.',
  },
  {
    id: 'none',
    title: 'Không Trang Trí (Để Mộc)',
    subtitle: 'Tối giản nguyên bản',
    icon: '📜',
    desc: 'Tôn vinh trọn vẹn chất cảm thuần túy của sợi cỏ tự nhiên.',
  },
];

export const Stage11Decorate: React.FC<Stage11Props> = ({
  materials,
  currentType,
  decorations,
  onChangeType,
  onUpdateDecorations,
  onComplete,
}) => {
  const [selectedPetal, setSelectedPetal] = useState<'daisy' | 'peach' | 'pea' | 'fern' | 'bamboo_leaf'>('daisy');
  const [isPlacing, setIsPlacing] = useState(false);
  const [placePos, setPlacePos] = useState<{ x: number; y: number } | null>(null);

  const isPandan = materials.grassType === 'pandan';

  const handleSelectMode = (type: DecorationType) => {
    sound.playTap();
    onChangeType(type);

    if (type === 'pressed_flowers') {
      onUpdateDecorations([
        { id: '1', type: 'daisy', x: 30, y: 35, rotation: 15, scale: 1 },
        { id: '2', type: 'peach', x: 70, y: 45, rotation: -25, scale: 0.9 },
        { id: '3', type: 'pea', x: 45, y: 70, rotation: 40, scale: 0.85 },
      ]);
    } else if (type === 'pressed_leaves') {
      onUpdateDecorations([
        { id: '1', type: 'fern', x: 32, y: 40, rotation: -20, scale: 1.1 },
        { id: '2', type: 'bamboo_leaf', x: 68, y: 60, rotation: 35, scale: 1 },
      ]);
    } else {
      onUpdateDecorations([]);
    }
  };

  const handleAddFlowerOnPaper = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentType !== 'pressed_flowers' && currentType !== 'pressed_leaves') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    sound.playTap();
    setIsPlacing(true);
    setPlacePos({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });

    setTimeout(() => {
      setIsPlacing(false);
      setPlacePos(null);
    }, 200);

    const newItem: FlowerItem = {
      id: Date.now().toString(),
      type: currentType === 'pressed_flowers' ? selectedPetal : 'bamboo_leaf',
      x,
      y,
      rotation: Math.floor(Math.random() * 360),
      scale: 0.85 + Math.random() * 0.35,
    };

    onUpdateDecorations([...decorations, newItem]);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* 1 Hollow Circle Indicator at petal placement point */}
      {isPlacing && placePos && (
        <ActionIndicator
          count={1}
          isActing={true}
          label="Gắp ép hoa lá"
          offsetX={placePos.x}
          offsetY={placePos.y}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 11 · Trang Trí Thủ Công
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white font-medium">
          Trang Trí Tờ Giấy Cỏ
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-xl mx-auto">
          Chọn một phong cách hoàn thiện để lưu dấu nét nghệ thuật truyền thống lên bề mặt tờ giấy của bạn.
        </p>
      </div>

      {/* Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200">
        {/* Style Selection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-6">
          {DECORATION_MODES.map((mode) => {
            const isSelected = currentType === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelectMode(mode.id)}
                className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50 shadow-md ring-2 ring-amber-600/20'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="text-2xl mb-1">{mode.icon}</div>
                <div className="font-serif font-semibold text-stone-900 text-xs">
                  {mode.title}
                </div>
                <div className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                  {mode.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Paper Canvas Preview with Clear, High-Fidelity Decoration Rendering */}
        <div className="w-full flex flex-col items-center">
          <div
            onClick={handleAddFlowerOnPaper}
            className={`relative w-72 h-64 md:w-96 md:h-76 rounded-sm shadow-2xl border-2 border-amber-950/20 flex items-center justify-center p-4 cursor-pointer overflow-hidden group ${
              isPandan ? 'bg-[#d8e8cd]' : 'bg-[#e7eed8]'
            }`}
          >
            {/* Paper Texture Fibers */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none"></div>

            {/* 1. VISIBLE REALISTIC WATER MARBLING (Vân nước thủy ấn sắc nét) */}
            {currentType === 'water_marbling' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg className="w-full h-full opacity-65" viewBox="0 0 400 320" preserveAspectRatio="none">
                  {/* Organic wave ribbons */}
                  <path
                    d="M-20,60 C80,20 160,110 260,50 C340,0 420,80 440,50"
                    fill="none"
                    stroke="#854d0e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  <path
                    d="M-10,120 C100,70 180,170 280,110 C360,60 410,130 430,100"
                    fill="none"
                    stroke="#1e3a8a"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="opacity-35"
                  />
                  <path
                    d="M-30,180 C70,140 170,230 270,170 C350,120 410,190 440,160"
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="opacity-35"
                  />
                  <path
                    d="M-20,240 C90,190 190,280 290,220 C360,180 400,240 430,220"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="7"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  <path
                    d="M0,280 C110,240 210,310 310,270 C370,240 410,290 430,280"
                    fill="none"
                    stroke="#92400e"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="opacity-30"
                  />
                </svg>
              </div>
            )}

            {/* 2. NATURAL SPECKS (Hạt cỏ tự nhiên) */}
            {currentType === 'natural_specks' && (
              <div className="absolute inset-0 pointer-events-none flex flex-wrap gap-4 p-4 opacity-75">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${(i % 3) + 2}px`,
                      height: `${(i % 3) + 2}px`,
                      transform: `translate(${(i * 23) % 60}px, ${(i * 31) % 60}px)`,
                    }}
                    className={`rounded-full ${
                      i % 2 === 0 ? 'bg-amber-800' : 'bg-amber-600'
                    }`}
                  ></div>
                ))}
              </div>
            )}

            {/* 3. PRESSED FLOWERS & LEAVES */}
            {decorations.map((item) => (
              <div
                key={item.id}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                }}
                className="absolute pointer-events-none transition-transform duration-200"
              >
                {item.type === 'daisy' && (
                  <div className="text-2xl filter drop-shadow-sm">🌼</div>
                )}
                {item.type === 'peach' && (
                  <div className="text-2xl filter drop-shadow-sm">🌸</div>
                )}
                {item.type === 'pea' && (
                  <div className="text-2xl filter drop-shadow-sm">🌺</div>
                )}
                {item.type === 'fern' && (
                  <div className="text-3xl filter drop-shadow-sm">🌿</div>
                )}
                {item.type === 'bamboo_leaf' && (
                  <div className="text-3xl filter drop-shadow-sm">🍃</div>
                )}
              </div>
            ))}

            {/* Placement prompt */}
            {(currentType === 'pressed_flowers' || currentType === 'pressed_leaves') && (
              <div className="absolute bottom-2.5 bg-stone-900/80 text-amber-100 text-[10px] px-3 py-1 rounded-full backdrop-blur-xs pointer-events-none">
                Nhấp lên giấy để gắp đặt thêm cánh hoa/lá
              </div>
            )}
          </div>
        </div>

        {/* Proceed to Stage 12 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              sound.playZenChime();
              onComplete();
            }}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-100 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hoàn thành & Xem thành phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
