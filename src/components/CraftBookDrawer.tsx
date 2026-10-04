import React from 'react';
import { SavedPaper } from '../types/paper';
import { sound } from '../utils/audio';
import { X, BookOpen, Trash2, Calendar, FileText } from 'lucide-react';

interface CraftBookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPapers: SavedPaper[];
  onDeletePaper: (id: string) => void;
}

export const CraftBookDrawer: React.FC<CraftBookDrawerProps> = ({
  isOpen,
  onClose,
  savedPapers,
  onDeletePaper,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-amber-900/30 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/15 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-900" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Sổ Tay Nghệ Nhân Làm Giấy
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-amber-200/60 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Papers Collection List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {savedPapers.length === 0 ? (
            <div className="py-16 text-center text-stone-500 font-serif">
              <FileText className="w-12 h-12 text-stone-400 mx-auto mb-2 opacity-50" />
              <p>Chưa có tờ giấy nào được lưu vào sổ tay.</p>
              <p className="text-xs text-stone-400 mt-1">
                Hãy hoàn thành các công đoạn làm giấy và nhấn "Lưu Sổ Tay Tác Phẩm" ở bước cuối cùng!
              </p>
            </div>
          ) : (
            savedPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:border-amber-400 transition-all"
              >
                {/* Paper Swatch Mini View */}
                <div
                  style={{ backgroundColor: paper.specs.colorHex }}
                  className="w-24 h-28 rounded-md border border-stone-300 shadow-inner flex flex-col items-center justify-between p-2 shrink-0 relative overflow-hidden"
                >
                  <div className="text-[9px] font-mono text-stone-700 font-medium">
                    {paper.specs.thicknessGsm} GSM
                  </div>
                  {paper.canvasDrawing && (
                    <img
                      src={paper.canvasDrawing}
                      alt="Nét chữ thư pháp"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  )}
                  <div className="text-[8px] text-red-800 font-serif border border-red-700/40 px-1 py-0.5 mt-auto">
                    Thủ Công
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-left w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-serif font-semibold text-stone-900 text-sm">
                      {paper.name}
                    </h4>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {paper.date}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 italic line-clamp-2 mb-2 font-serif">
                    “{paper.specs.artisanDescription}”
                  </p>

                  <div className="flex flex-wrap gap-2 text-[10px] text-stone-500 font-medium">
                    <span className="bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded-md">
                      {paper.specs.materialSummary}
                    </span>
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                      Độ mịn: {paper.specs.smoothnessScore}/100
                    </span>
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                      Độ dai: {paper.specs.tensileScore}/100
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => {
                    sound.playTap();
                    onDeletePaper(paper.id);
                  }}
                  className="p-2 text-stone-400 hover:text-red-700 transition-colors cursor-pointer self-end sm:self-center"
                  title="Xóa tờ giấy này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
