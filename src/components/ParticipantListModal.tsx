import React, { useState, useMemo } from 'react';
import { ParticipantRecord } from '../types/paper';
import { sound } from '../utils/audio';
import {
  X,
  Users,
  Search,
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Award,
  Layers,
  Leaf,
} from 'lucide-react';

interface ParticipantListModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ParticipantRecord[];
  onDeleteParticipant: (id: string) => void;
  onClearAll: () => void;
}

export const ParticipantListModal: React.FC<ParticipantListModalProps> = ({
  isOpen,
  onClose,
  participants,
  onDeleteParticipant,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter participants by search term
  const filteredParticipants = useMemo(() => {
    if (!searchTerm.trim()) return participants;
    const term = searchTerm.toLowerCase();
    return participants.filter(
      (p) =>
        p.playerName.toLowerCase().includes(term) ||
        p.paperName.toLowerCase().includes(term) ||
        p.colorName.toLowerCase().includes(term)
    );
  }, [participants, searchTerm]);

  // Statistics
  const totalCount = participants.length;
  const lemongrassCount = participants.filter((p) => p.grassType === 'lemongrass').length;
  const pandanCount = participants.filter((p) => p.grassType === 'pandan').length;

  if (!isOpen) return null;

  // Export CSV with UTF-8 BOM for Excel support
  const handleExportCSV = () => {
    sound.playTap();
    if (participants.length === 0) return;

    const headers = [
      'STT',
      'Họ và Tên Người Chơi',
      'Thời Gian Hoàn Thành',
      'Tên Tác Phẩm Giấy',
      'Loại Cỏ',
      'Phụ Gia',
      'Định Lượng (GSM)',
      'Màu Sắc',
      'Lời Bình Nghệ Nhân',
    ];

    const rows = participants.map((p, index) => [
      index + 1,
      `"${p.playerName.replace(/"/g, '""')}"`,
      `"${p.completedAt}"`,
      `"${p.paperName.replace(/"/g, '""')}"`,
      p.grassType === 'pandan' ? 'Cỏ Lá Dứa' : 'Cỏ Lá Sả',
      p.additiveType === 'bark'
        ? 'Vỏ Cây Dó'
        : p.additiveType === 'bagasse'
        ? 'Bã Mía'
        : p.additiveType === 'reed'
        ? 'Cây Sậy'
        : 'Thuần Cỏ',
      p.thicknessGsm,
      `"${p.colorName}"`,
      `"${p.artisanDescription.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh_sach_nguoi_choi_xuong_giay_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-amber-50 rounded-3xl p-5 md:p-7 shadow-2xl border-2 border-amber-900/30 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/15 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-800 text-amber-100 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">
                  Sổ Ghi Danh Người Tham Gia
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-800/15 text-amber-900 text-xs font-semibold font-mono">
                  {totalCount} lượt
                </span>
              </div>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Danh sách người chơi đã hoàn thành trọn vẹn 12 công đoạn làm giấy cỏ thủ công
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-amber-200/60 text-stone-600 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Tổng số người chơi</div>
              <div className="text-lg font-serif font-bold text-stone-900">
                {totalCount} <span className="text-xs font-normal text-stone-500">người</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Cỏ Sả / Cỏ Lá Dứa</div>
              <div className="text-sm font-semibold text-stone-900 font-mono">
                {lemongrassCount} sả · {pandanCount} dứa
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-[11px] text-stone-500 font-medium">Người chơi gần nhất</div>
              <div className="text-sm font-semibold text-stone-900 truncate">
                {participants.length > 0 ? participants[0].playerName : 'Chưa có'}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên người chơi, tên giấy..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={participants.length === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                participants.length === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
              }`}
              title="Xuất danh sách ra file CSV tương thích Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-1.5 bg-red-100 p-1 rounded-xl">
                <span className="text-[11px] text-red-800 font-medium px-1">Xác nhận xóa?</span>
                <button
                  onClick={() => {
                    sound.playTap();
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-1 bg-red-700 text-white rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors cursor-pointer"
                >
                  Xóa hết
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sound.playTap();
                  setConfirmClear(true);
                }}
                disabled={participants.length === 0}
                className={`p-2 rounded-xl text-xs transition-colors border ${
                  participants.length === 0
                    ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                    : 'border-stone-300 text-stone-500 hover:text-red-700 hover:bg-red-50 hover:border-red-300 cursor-pointer'
                }`}
                title="Xóa toàn bộ danh sách người chơi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Participants Records List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {filteredParticipants.length === 0 ? (
            <div className="py-16 text-center text-stone-500 font-serif">
              <Users className="w-12 h-12 text-stone-400 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-stone-700">
                {participants.length === 0
                  ? 'Chưa có lượt chơi nào được ghi nhận'
                  : 'Không tìm thấy người chơi phù hợp'}
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                {participants.length === 0
                  ? 'Khi hoàn thành xong 12 công đoạn, hệ thống sẽ lưu tên nghệ nhân và thành phẩm tại đây.'
                  : 'Thử tìm kiếm với từ khóa khác.'}
              </p>
            </div>
          ) : (
            filteredParticipants.map((p, index) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-amber-400 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
              >
                {/* Left: Turn index & Player info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-900 font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
                    #{participants.length - (participants.findIndex((item) => item.id === p.id))}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-stone-900 text-sm">
                        {p.playerName}
                      </h4>
                      <span className="text-[10px] font-serif px-2 py-0.5 rounded-sm bg-red-100 text-red-800 border border-red-300/50">
                        Nghệ nhân
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 font-sans">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {p.completedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Paper details & Delete action */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: p.colorHex }}
                      className="w-5 h-5 rounded-md border border-stone-300 shadow-inner shrink-0"
                      title={p.colorName}
                    />
                    <div className="text-right">
                      <div className="text-xs font-semibold text-stone-800">{p.paperName}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {p.thicknessGsm} GSM · {p.colorName}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playTap();
                      onDeleteParticipant(p.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                    title="Xóa lượt này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-3 border-t border-amber-900/15 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-800" />
            Dữ liệu tự động lưu trong trình duyệt (Local Storage)
          </span>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-100 rounded-xl font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
