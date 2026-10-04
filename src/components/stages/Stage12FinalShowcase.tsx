import React, { useState, useRef, useEffect } from 'react';
import { CalculatedPaperSpecs, MaterialConfig, PlayerActionStats, SavedPaper } from '../../types/paper';
import { sound } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Sun,
  PenTool,
  BookmarkPlus,
  CheckCircle,
} from 'lucide-react';

interface Stage12Props {
  materials: MaterialConfig;
  stats: PlayerActionStats;
  specs: CalculatedPaperSpecs;
  onRestart: () => void;
  onSaveToBook: (paper: SavedPaper) => void;
}

export const Stage12FinalShowcase: React.FC<Stage12Props> = ({
  materials,
  stats,
  specs,
  onRestart,
  onSaveToBook,
}) => {
  const [isBacklight, setIsBacklight] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPainting = useRef(false);

  useEffect(() => {
    sound.playZenChime();
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    isPainting.current = true;
    sound.playInkStroke();
    draw(e);
  };

  const handleStopDraw = () => {
    isPainting.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPainting.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1c1917';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (Math.random() > 0.7) {
      sound.playInkStroke();
    }
  };

  const handleClearInk = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      sound.playTap();
    }
  };

  const handleSave = () => {
    sound.playZenChime();
    setIsSaved(true);
    const canvas = canvasRef.current;
    const drawingData = canvas ? canvas.toDataURL() : undefined;

    const paperRecord: SavedPaper = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      name: `Giấy ${materials.grassType === 'pandan' ? 'Lá Dứa' : 'Lá Sả'} · ${specs.colorName}`,
      materials,
      stats,
      specs,
      canvasDrawing: drawingData,
    };

    onSaveToBook(paperRecord);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none pb-12">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1">
          Công đoạn 12 · Tác Phẩm Hoàn Thành
        </div>
        <h2 className="text-2xl md:text-4xl font-serif text-stone-900 font-medium">
          Thành Phẩm Giấy Cỏ Thủ Công
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl mx-auto">
          Chính sự kết hợp nguyên liệu và kỹ năng thao tác của bạn đã nhào nặn nên đặc tính độc bản
          của tờ giấy này.
        </p>
      </div>

      {/* Main Grid: Interactive Paper Viewport & Dynamic Specifications */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Close-up Paper Viewer (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Controls Bar */}
          <div className="w-full flex items-center justify-between bg-white rounded-2xl p-2.5 shadow-sm border border-stone-200 mb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playTap();
                  setIsBacklight(!isBacklight);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                  isBacklight
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Soi xuyên sáng</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  setIsDrawingMode(!isDrawingMode);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                  isDrawingMode
                    ? 'bg-stone-900 text-amber-100 shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Thử viết mực</span>
              </button>
            </div>

            {isDrawingMode && (
              <button
                onClick={handleClearInk}
                className="text-[11px] text-stone-500 hover:text-stone-900 underline cursor-pointer"
              >
                Xóa nét vẽ
              </button>
            )}
          </div>

          {/* The Paper Sheet Presentation Frame */}
          <div className="w-full h-96 md:h-[460px] bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 rounded-3xl p-6 shadow-2xl border-4 border-stone-800 flex items-center justify-center relative overflow-hidden">
            {/* Backlight Glow when toggled */}
            {isBacklight && (
              <div className="absolute inset-0 bg-radial from-amber-200/40 via-yellow-100/20 to-transparent pointer-events-none animate-pulse"></div>
            )}

            {/* Directional Sunlight Cast */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>

            {/* THE HANDMADE PAPER SHEET */}
            <div
              style={{
                backgroundColor: specs.colorHex,
                transform: `perspective(1000px) rotateY(${tiltAngle}deg)`,
                boxShadow: isBacklight
                  ? '0 0 35px rgba(254, 240, 138, 0.45), 0 20px 40px rgba(0,0,0,0.5)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              }}
              className="relative w-72 h-88 md:w-84 md:h-[400px] rounded-sm p-6 flex flex-col justify-between transition-all duration-300 border border-stone-400/30 overflow-hidden"
            >
              {/* Deckle raw edge line */}
              <div className="absolute inset-0 border border-dashed border-stone-400/20 pointer-events-none"></div>

              {/* Natural Plant Fiber Grid & Organic Flecks */}
              <div
                style={{
                  opacity: isBacklight ? 0.85 : 0.45,
                }}
                className="absolute inset-0 pointer-events-none"
              >
                {Array.from({ length: 65 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      left: `${(i * 17) % 95}%`,
                      top: `${(i * 23) % 92}%`,
                      width: `${12 + (i % 6) * 5}px`,
                      height: `${1 + (i % 2) * 0.8}px`,
                      transform: `rotate(${(i * 61) % 180}deg)`,
                    }}
                    className={`absolute rounded-full ${
                      i % 4 === 0
                        ? 'bg-amber-900/40'
                        : materials.grassType === 'pandan'
                        ? 'bg-emerald-900/35'
                        : 'bg-emerald-800/25'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Water Marbling SVG Layer (Visible and clear on final sheet) */}
              {stats.decorationType === 'water_marbling' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
                  <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                    <path
                      d="M-20,80 C80,30 160,130 260,70 C340,10 420,90 440,60"
                      fill="none"
                      stroke="#854d0e"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-10,160 C100,100 180,210 280,140 C360,80 410,160 430,130"
                      fill="none"
                      stroke="#1e3a8a"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-30,240 C70,190 170,290 270,220 C350,170 410,240 440,210"
                      fill="none"
                      stroke="#78350f"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-20,320 C90,260 190,360 290,290 C360,250 400,320 430,300"
                      fill="none"
                      stroke="#047857"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* Natural Specks */}
              {stats.decorationType === 'natural_specks' && (
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

              {/* Botanical Decorations Pressed Inside Paper */}
              {stats.decorations.map((item) => (
                <div
                  key={item.id}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                    opacity: isBacklight ? 0.95 : 0.82,
                  }}
                  className="absolute pointer-events-none transition-transform duration-200"
                >
                  {item.type === 'daisy' && (
                    <div className="text-2xl filter drop-shadow-xs">🌼</div>
                  )}
                  {item.type === 'peach' && (
                    <div className="text-2xl filter drop-shadow-xs">🌸</div>
                  )}
                  {item.type === 'pea' && (
                    <div className="text-2xl filter drop-shadow-xs">🌺</div>
                  )}
                  {item.type === 'fern' && (
                    <div className="text-3xl filter drop-shadow-xs">🌿</div>
                  )}
                  {item.type === 'bamboo_leaf' && (
                    <div className="text-3xl filter drop-shadow-xs">🍃</div>
                  )}
                </div>
              ))}

              {/* Calligraphy Canvas Overlay */}
              <canvas
                ref={canvasRef}
                width={336}
                height={400}
                onMouseDown={handleStartDraw}
                onMouseMove={draw}
                onMouseUp={handleStopDraw}
                onMouseLeave={handleStopDraw}
                onTouchStart={handleStartDraw}
                onTouchMove={draw}
                onTouchEnd={handleStopDraw}
                className={`absolute inset-0 z-10 w-full h-full ${
                  isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'
                }`}
              />

              {/* Artisan Seal Stamp on Bottom Right */}
              <div className="relative z-0 self-end mt-auto flex flex-col items-center border-2 border-red-700/60 p-1.5 rounded-sm bg-red-900/5 rotate-2">
                <span className="text-[10px] font-serif text-red-800/90 font-bold uppercase tracking-wider">
                  Thủ Công
                </span>
                <span className="text-[8px] font-serif text-red-800/80">
                  Việt Nam
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Tilt Slider */}
          <div className="w-full flex items-center justify-center gap-3 mt-3 text-xs text-stone-600">
            <span>Nghiêng trái</span>
            <input
              type="range"
              min="-20"
              max="20"
              value={tiltAngle}
              onChange={(e) => setTiltAngle(Number(e.target.value))}
              className="w-36 accent-stone-700 cursor-pointer"
            />
            <span>Nghiêng phải (soi thớ)</span>
          </div>
        </div>

        {/* Right Column: Dynamic Spec Sheet & Artisan Deduction Summary (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Poetic Artisan Deduction Summary */}
          <div className="bg-amber-50/90 rounded-3xl p-6 border-2 border-amber-800/20 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-900 font-semibold mb-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Lời Bình Nghệ Nhân</span>
            </div>
            <blockquote className="font-serif italic text-stone-800 text-sm md:text-base leading-relaxed mb-3">
              “{specs.artisanDescription}”
            </blockquote>
            <div className="text-xs text-stone-500 font-medium">
              Suy luận tự động từ tỷ lệ nguyên liệu & thao tác seo giấy thủ công.
            </div>
          </div>

          {/* Detailed Property Cards List */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-3.5">
            <h3 className="font-serif font-semibold text-stone-900 text-sm border-b border-stone-100 pb-2">
              Đặc Tính Giấy Thành Phẩm
            </h3>

            {/* 1. Màu sắc */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Màu sắc:</span>
              <div className="flex items-center gap-2 text-right">
                <span
                  style={{ backgroundColor: specs.colorHex }}
                  className="w-4 h-4 rounded-full border border-stone-300 shadow-xs"
                ></span>
                <span className="font-semibold text-stone-900">{specs.colorName}</span>
              </div>
            </div>

            {/* 2. Độ dày */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Độ dày:</span>
              <div className="text-right">
                <div className="font-semibold text-stone-900">{specs.thicknessGsm} GSM</div>
                <div className="text-[11px] text-stone-500">{specs.thicknessDescription}</div>
              </div>
            </div>

            {/* 3. Độ mịn */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Độ mịn:</span>
              <div className="text-right">
                <div className="font-semibold text-stone-900">{specs.smoothnessScore}/100</div>
                <div className="text-[11px] text-stone-500">{specs.smoothnessDescription}</div>
              </div>
            </div>

            {/* 4. Độ dai (Tensile Strength) */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Độ dai:</span>
              <div className="text-right">
                <div className="font-semibold text-stone-900">{specs.tensileScore}/100</div>
                <div className="text-[11px] text-stone-500">{specs.tensileDescription}</div>
              </div>
            </div>

            {/* 5. Texture */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Texture:</span>
              <div className="font-semibold text-stone-900 text-right capitalize">
                {specs.textureDescription}
              </div>
            </div>

            {/* 6. Thành phần nguyên liệu */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Thành phần:</span>
              <div className="font-semibold text-stone-900 text-right">
                {specs.materialSummary}
              </div>
            </div>

            {/* 7. Kiểu trang trí */}
            <div className="flex items-start justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">Trang trí:</span>
              <div className="font-semibold text-stone-900 text-right">
                {specs.decorationSummary}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-semibold transition-all shadow-md cursor-pointer ${
                isSaved
                  ? 'bg-emerald-800 text-white'
                  : 'bg-amber-800 hover:bg-amber-700 text-amber-100'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Đã lưu vào Sổ Tay</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Lưu Sổ Tay Tác Phẩm</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playTap();
                onRestart();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-medium bg-stone-900 hover:bg-stone-800 text-amber-100 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm tờ giấy mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
