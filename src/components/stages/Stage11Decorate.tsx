import React, { useState } from 'react';
import { DecorationType, FlowerItem } from '../../types/paper';
import { sound } from '../../utils/audio';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { FirstPersonHands } from '../FirstPersonHands';

interface Stage11Props {
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
    subtitle: 'Vân mực loang tự nhiên',
    icon: '🌊',
    desc: 'Dòng nước tạo những đường vân mềm mại, gợn sóng bồng bềnh như mây trời.',
  },
  {
    id: 'natural_specks',
    title: 'Tạo Họa Tiết Hạt Cỏ',
    subtitle: 'Hạt cỏ dại & vụn xơ vàng',
    icon: '🌾',
    desc: 'Lấm tấm những hạt cỏ và vụn sợi vàng rải rác gợi nhớ đồng cỏ trưa hè.',
  },
  {
    id: 'none',
    title: 'Không Trang Trí (Để Mộc)',
    subtitle: 'Nét tối giản nguyên bản',
    icon: '📜',
    desc: 'Tôn vinh trọn vẹn chất cảm thuần túy của sợi cỏ tự nhiên.',
  },
];

export const Stage11Decorate: React.FC<Stage11Props> = ({
  currentType,
  decorations,
  onChangeType,
  onUpdateDecorations,
  onComplete,
}) => {
  const [selectedPetal, setSelectedPetal] = useState<'daisy' | 'peach' | 'pea' | 'fern' | 'bamboo_leaf'>('daisy');
  const [isPlacing, setIsPlacing] = useState(false);

  const handleSelectMode = (type: DecorationType) => {
    sound.playTap();
    onChangeType(type);

    if (type === 'pressed_flowers') {
      onUpdateDecorations([
        { id: '1', type: 'daisy', x: 28, y: 35, rotation: 15, scale: 1 },
        { id: '2', type: 'peach', x: 68, y: 45, rotation: -25, scale: 0.9 },
        { id: '3', type: 'pea', x: 45, y: 72, rotation: 40, scale: 0.85 },
      ]);
    } else if (type === 'pressed_leaves') {
      onUpdateDecorations([
        { id: '1', type: 'fern', x: 30, y: 40, rotation: -20, scale: 1.1 },
        { id: '2', type: 'bamboo_leaf', x: 65, y: 60, rotation: 35, scale: 1 },
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
    setTimeout(() => setIsPlacing(false), 200);

    const newItem: FlowerItem = {
      id: Date.now().toString(),
      type: currentType === 'pressed_flowers' ? selectedPetal : 'fern',
      x,
      y,
      rotation: Math.floor(Math.random() * 360),
      scale: 0.8 + Math.random() * 0.4,
    };

    onUpdateDecorations([...decorations, newItem]);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      <FirstPersonHands tool="tweezers" isActing={isPlacing} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 11 · Điểm Xuyết Nghệ Thuật
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium">
          Trang Trí Tờ Giấy Cỏ
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-xl mx-auto">
          Chọn một phong cách hoàn thiện để thổi hồn nét đẹp văn hóa truyền thống vào tác phẩm của bạn.
        </p>
      </div>

      {/* Decoration Workspace */}
      <div className="w-full bg-stone-100 rounded-3xl p-6 md:p-8 shadow-xl border border-stone-300">
        {/* Style Selection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-6">
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

        {/* Paper Canvas Preview with Interactive Tap to Place */}
        <div className="w-full flex flex-col items-center">
          <div
            onClick={handleAddFlowerOnPaper}
            className="relative w-72 h-64 md:w-96 md:h-72 rounded-sm shadow-2xl border-2 border-amber-950/20 flex items-center justify-center p-4 cursor-pointer overflow-hidden bg-[#f4ecd8] group"
          >
            {/* Paper Texture Fibers */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none"></div>

            {/* Water Marbling Layer */}
            {currentType === 'water_marbling' && (
              <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-stone-600 to-transparent"></div>
            )}

            {/* Natural Specks Layer */}
            {currentType === 'natural_specks' && (
              <div className="absolute inset-0 pointer-events-none flex flex-wrap gap-4 p-4 opacity-70">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '3px',
                      height: '3px',
                      transform: `translate(${(i * 19) % 50}px, ${(i * 29) % 50}px)`,
                    }}
                    className="bg-amber-800 rounded-full"
                  ></div>
                ))}
              </div>
            )}

            {/* Placed Pressed Flowers & Leaves */}
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
                  <div className="text-xl filter drop-shadow-sm">🌼</div>
                )}
                {item.type === 'peach' && (
                  <div className="text-xl filter drop-shadow-sm">🌸</div>
                )}
                {item.type === 'pea' && (
                  <div className="text-xl filter drop-shadow-sm">🌺</div>
                )}
                {item.type === 'fern' && (
                  <div className="text-2xl filter drop-shadow-sm">🌿</div>
                )}
                {item.type === 'bamboo_leaf' && (
                  <div className="text-2xl filter drop-shadow-sm">🍃</div>
                )}
              </div>
            ))}

            {/* Guidance Overlay */}
            {(currentType === 'pressed_flowers' || currentType === 'pressed_leaves') && (
              <div className="absolute bottom-3 bg-stone-900/70 text-amber-100 text-[11px] px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none group-hover:bg-stone-900 transition-colors">
                Nhấp bất kỳ điểm nào trên giấy để đặt thêm cánh hoa/lá
              </div>
            )}
          </div>
        </div>

        {/* Completion Proceed Button */}
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
