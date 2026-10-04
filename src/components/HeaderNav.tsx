import React from 'react';
import { Volume2, VolumeX, BookOpen, RotateCcw } from 'lucide-react';
import { WorkshopStep } from '../types/paper';

interface HeaderNavProps {
  currentStep: WorkshopStep;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBook: () => void;
  onReset: () => void;
  savedCount: number;
}

const STEP_LABELS: Record<WorkshopStep, string> = {
  1: '01. Chọn nguyên liệu',
  2: '02. Cắt cỏ',
  3: '03. Rửa sạch',
  4: '04. Cắt nhỏ',
  5: '05. Nấu nước tro',
  6: '06. Đập dập',
  7: '07. Nghiền bột',
  8: '08. Pha bể giấy',
  9: '09. Seo giấy',
  10: '10. Phơi giấy',
  11: '11. Trang trí',
  12: '12. Hoàn thành',
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStep,
  isMuted,
  onToggleMute,
  onOpenBook,
  onReset,
  savedCount,
}) => {
  return (
    <header className="w-full bg-stone-900/90 backdrop-blur-md border-b border-amber-900/30 text-amber-50 px-4 md:px-8 py-3.5 flex items-center justify-between z-30 sticky top-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-amber-100 whitespace-nowrap">
          Xưởng Giấy Cỏ
        </span>
      </div>

      {/* Zone 2: Progress indicator */}
      <div className="hidden md:flex items-center gap-2 text-xs font-serif text-amber-200/80">
        <span className="font-semibold text-amber-300">{STEP_LABELS[currentStep]}</span>
        <span aria-hidden="true" className="text-stone-600">|</span>
        <span className="text-stone-400 font-mono">Bước {currentStep}/12</span>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-750 text-amber-200 border border-stone-700/60 transition-colors cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
        </button>

        {/* Saved Papers Book */}
        <button
          onClick={onOpenBook}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 border border-amber-800/40 text-xs font-medium transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Sổ Tay</span>
          {savedCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-600 text-stone-950 font-bold text-[10px] flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        {/* Restart Workshop */}
        <button
          onClick={onReset}
          className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition-colors cursor-pointer"
          title="Bắt đầu lại workshop"
          aria-label="Bắt đầu lại workshop"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
