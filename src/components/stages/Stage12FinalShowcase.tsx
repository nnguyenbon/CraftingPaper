import React, { useState, useRef, useEffect } from 'react';
import {
  CalculatedPaperSpecs,
  MaterialConfig,
  PlayerActionStats,
  SavedPaper,
  ParticipantRecord,
} from '../../types/paper';
import { sound } from '../../utils/audio';
import {
  RotateCcw,
  Sparkles,
  Sun,
  PenTool,
  BookmarkPlus,
  CheckCircle,
  Award,
  UserCheck,
  CheckCircle2,
  Edit3,
  X,
  User,
  Mail,
  Send,
  Download,
  Loader2,
  AlertCircle,
  Key,
  HelpCircle,
  Check,
  ExternalLink,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface Stage12Props {
  materials: MaterialConfig;
  stats: PlayerActionStats;
  specs: CalculatedPaperSpecs;
  onRestart: () => void;
  onSaveToBook: (paper: SavedPaper) => void;
  onRecordParticipant: (playerName: string) => ParticipantRecord;
  totalParticipants: number;
  currentParticipant?: ParticipantRecord | null;
}

export const Stage12FinalShowcase: React.FC<Stage12Props> = ({
  materials,
  stats,
  specs,
  onRestart,
  onSaveToBook,
  onRecordParticipant,
  totalParticipants,
  currentParticipant,
}) => {
  const [isBacklight, setIsBacklight] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Player Name and Participant Tracking
  const [playerName, setPlayerName] = useState(currentParticipant?.playerName || '');
  const [nameInput, setNameInput] = useState(currentParticipant?.playerName || '');
  const [showNameModal, setShowNameModal] = useState(!currentParticipant);
  const [isEditingName, setIsEditingName] = useState(false);
  const [savedParticipant, setSavedParticipant] = useState<ParticipantRecord | null>(
    currentParticipant || null
  );

  // Paper Element Reference for Image Export
  const paperSheetRef = useRef<HTMLDivElement | null>(null);

  // Email and Image Export States
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);
  const [isGmailConfigured, setIsGmailConfigured] = useState<boolean | null>(null);
  const [connectedUserEmail, setConnectedUserEmail] = useState<string>('');
  const [showSetupGuideModal, setShowSetupGuideModal] = useState(false);
  const [copiedEnvSnippet, setCopiedEnvSnippet] = useState(false);

  // Email Confirmation & Verification Modal States
  type EmailModalStep = 'confirm' | 'sending' | 'success' | 'failed' | null;
  const [emailModalStep, setEmailModalStep] = useState<EmailModalStep>(null);
  const [sentResultData, setSentResultData] = useState<{
    recipientEmail: string;
    senderEmail?: string;
    messageId?: string;
    timestamp?: string;
    paperTitle?: string;
    errorDetail?: string;
  } | null>(null);

  // Query backend status for Gmail credentials
  const checkEmailConfig = async () => {
    try {
      const res = await fetch('/api/email-config-status');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.isConfigured === 'boolean') {
          setIsGmailConfigured(data.isConfigured);
          if (data.userEmail) {
            setConnectedUserEmail(data.userEmail);
          }
        }
      }
    } catch {
      // Backend status query failsafe
    }
  };

  useEffect(() => {
    checkEmailConfig();
  }, []);

  // Capture the handmade paper sheet into a 2x Retina PNG data URL
  const generatePaperImage = async (): Promise<string> => {
    if (!paperSheetRef.current) {
      throw new Error('Không tìm thấy khung tranh giấy thành phẩm.');
    }

    const node = paperSheetRef.current;
    const originalTransform = node.style.transform;
    const originalTransition = node.style.transition;

    // Temporarily straighten up paper for export snapshot
    node.style.transform = 'none';
    node.style.transition = 'none';

    try {
      await new Promise((resolve) => setTimeout(resolve, 80));
      const dataUrl = await toPng(node, {
        quality: 0.96,
        pixelRatio: 2,
        cacheBust: true,
      });
      return dataUrl;
    } finally {
      node.style.transform = originalTransform;
      node.style.transition = originalTransition;
    }
  };

  // Step 1: Validate email and prompt user for confirmation before sending
  const handlePromptSendEmail = (customEmail?: string) => {
    const emailToSend = (customEmail || emailInput).trim();
    if (!emailToSend) {
      setSendErrorMessage('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToSend)) {
      setSendErrorMessage('Địa chỉ email chưa đúng định dạng (ví dụ: nghenhan@gmail.com).');
      return;
    }

    setSendErrorMessage(null);
    setEmailModalStep('confirm');
  };

  // Step 2: Execute actual send via Google Mail API and record verifiable result
  const handleExecuteSendEmail = async (customEmail?: string) => {
    const emailToSend = (customEmail || emailInput).trim();
    if (!emailToSend) return;

    setIsSendingEmail(true);
    setEmailModalStep('sending');
    setSendErrorMessage(null);
    setSendSuccessMessage(null);

    try {
      const dataUrl = await generatePaperImage();

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: emailToSend,
          playerName: playerName.trim() || nameInput.trim() || 'Nghệ nhân',
          paperImageBase64: dataUrl,
          specs,
          materials,
          date: new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const timeStr = `${new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })} · ${new Date().toLocaleDateString('vi-VN')}`;

        setSentResultData({
          recipientEmail: emailToSend,
          senderEmail: connectedUserEmail || 'mocxinh.handmade@gmail.com',
          messageId: data.messageId || 'MSG-' + Date.now(),
          timestamp: timeStr,
          paperTitle: `Giấy ${materials.grassType === 'pandan' ? 'Lá Dứa' : 'Lá Sả'} · ${specs.colorName}`,
        });
        setSendSuccessMessage(`Đã gửi thành phẩm thành công tới ${emailToSend}!`);
        setIsGmailConfigured(true);
        setEmailModalStep('success');
        sound.playZenChime();
      } else {
        if (data.code === 'MISSING_GMAIL_KEYS') {
          setIsGmailConfigured(false);
          setSentResultData({
            recipientEmail: emailToSend,
            errorDetail: 'Chưa cấu hình tài khoản Google Mail trong file .env.',
          });
          setEmailModalStep('failed');
        } else if (data.code === 'AUTH_FAILED') {
          setSentResultData({
            recipientEmail: emailToSend,
            errorDetail: 'Xác thực Gmail thất bại. Vui lòng kiểm tra lại Google App Password 16 ký tự.',
          });
          setEmailModalStep('failed');
        } else {
          setSentResultData({
            recipientEmail: emailToSend,
            errorDetail: data.message || 'Không thể gửi email. Vui lòng thử lại.',
          });
          setEmailModalStep('failed');
        }
      }
    } catch (err: any) {
      setSentResultData({
        recipientEmail: emailToSend,
        errorDetail: 'Lỗi khi gửi email: ' + (err?.message || 'Không kết nối được tới máy chủ'),
      });
      setEmailModalStep('failed');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Backwards compatible alias
  const handleSendEmail = handlePromptSendEmail;

  // Handle direct PNG download to local device
  const handleDownloadImage = async () => {
    setIsDownloadingImage(true);
    try {
      const dataUrl = await generatePaperImage();
      const safeName = (playerName || nameInput || 'Nghe-Nhan')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '-');
      const link = document.createElement('a');
      link.download = `Giay-Thu-Cong-${safeName}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      sound.playZenChime();
    } catch (err: any) {
      alert('Không thể xuất ảnh: ' + (err?.message || 'Lỗi không xác định'));
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleCopyEnvTemplate = () => {
    const template = `GMAIL_USER="your_email@gmail.com"\nGMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"`;
    navigator.clipboard.writeText(template);
    setCopiedEnvSnippet(true);
    setTimeout(() => setCopiedEnvSnippet(false), 2500);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPainting = useRef(false);

  useEffect(() => {
    sound.playZenChime();
  }, []);

  useEffect(() => {
    if (currentParticipant) {
      setPlayerName(currentParticipant.playerName);
      setNameInput(currentParticipant.playerName);
      setSavedParticipant(currentParticipant);
    }
  }, [currentParticipant]);

  const handleRegisterName = (nameToSave: string) => {
    const trimmed = nameToSave.trim() || `Nghệ nhân #${totalParticipants + 1}`;
    setPlayerName(trimmed);
    setNameInput(trimmed);
    const record = onRecordParticipant(trimmed);
    setSavedParticipant(record);
    setShowNameModal(false);
    setIsEditingName(false);
    sound.playZenChime();
  };

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

    let finalPlayerName = playerName.trim() || nameInput.trim();
    if (!savedParticipant) {
      finalPlayerName = finalPlayerName || `Nghệ nhân #${totalParticipants + 1}`;
      handleRegisterName(finalPlayerName);
    }

    const paperRecord: SavedPaper = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      name: `Giấy ${materials.grassType === 'pandan' ? 'Lá Dứa' : 'Lá Sả'} · ${specs.colorName}`,
      playerName: finalPlayerName || undefined,
      materials,
      stats,
      specs,
      canvasDrawing: drawingData,
    };

    onSaveToBook(paperRecord);
  };

  const handleRestartClick = () => {
    sound.playTap();
    if (!savedParticipant && (playerName.trim() || nameInput.trim())) {
      handleRegisterName(playerName.trim() || nameInput.trim());
    }
    onRestart();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none pb-12">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Công đoạn 12 · Tác Phẩm Hoàn Thành
        </div>
        <h2 className="text-2xl md:text-4xl font-serif text-white font-medium">
          Thành Phẩm Giấy Cỏ Thủ Công
        </h2>
        <p className="text-sm text-stone-100 mt-1 max-w-2xl mx-auto">
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
              ref={paperSheetRef}
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
              <div className="relative z-0 self-end mt-auto flex flex-col items-center border-2 border-red-700/75 p-1.5 rounded-sm bg-red-900/10 rotate-2 max-w-[120px] text-center select-none shadow-2xs">
                <span className="text-[8px] font-serif text-red-800/80 font-bold uppercase tracking-widest leading-tight">
                  Nghệ Nhân
                </span>
                <span className="text-[10px] font-serif text-red-950 font-bold truncate max-w-[100px] px-1 leading-tight">
                  {playerName || 'Thủ Công'}
                </span>
                <span className="text-[7px] font-serif text-red-700/70 leading-tight">
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

          {/* Artisan Identity & Participant Registration Card */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-stone-900">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Ghi Danh Nghệ Nhân Chế Tác</span>
              </div>
              {savedParticipant ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Lượt #{savedParticipant.turnNumber}
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  Chưa ghi danh
                </span>
              )}
            </div>

            {savedParticipant && !isEditingName ? (
              <div className="flex items-center justify-between bg-amber-50/80 rounded-2xl p-3 border border-amber-200/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-100 font-serif font-bold text-xs flex items-center justify-center shrink-0">
                    {playerName ? playerName.charAt(0).toUpperCase() : 'N'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{playerName}</div>
                    <div className="text-[11px] text-stone-500 font-sans">
                      Đã lưu vào danh sách người chơi ({savedParticipant.completedAt})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Chỉnh sửa tên người chơi"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Đổi tên</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegisterName(nameInput);
                }}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Nhập họ và tên người chơi..."
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{savedParticipant ? 'Cập nhật' : 'Lưu tên'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-stone-500 italic">
                  * Tên sẽ được khắc triện đỏ trên giấy và lưu vào danh sách người tham gia workshop.
                </div>
              </form>
            )}
          </div>

          {/* Gửi Thành Phẩm Về Email & Xuất Ảnh Chất Lượng Cao */}
          <div className="bg-gradient-to-br from-white via-amber-50/40 to-white rounded-3xl p-5 border-2 border-amber-900/20 shadow-lg space-y-3.5 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-800/10 text-amber-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs md:text-sm text-stone-900 leading-tight">
                    Nhận Ảnh Thành Phẩm Qua Email
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Gửi ảnh độ phân giải cao & chứng nhận chế tác trực tiếp về hộp thư
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {isGmailConfigured === true ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {connectedUserEmail ? connectedUserEmail : 'Gmail sẵn sàng'}
                </span>
              ) : isGmailConfigured === false ? (
                <button
                  onClick={() => setShowSetupGuideModal(true)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Bấm để xem hướng dẫn thêm key"
                >
                  <Key className="w-3 h-3 text-amber-700" />
                  Cần thêm key .env
                </button>
              ) : null}
            </div>

            {/* Input & Send Action */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendEmail();
              }}
              className="space-y-2.5"
            >
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (sendErrorMessage) setSendErrorMessage(null);
                  }}
                  placeholder="Nhập email của bạn (ví dụ: nghenhan@gmail.com)..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs md:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 shadow-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 hover:brightness-110 active:scale-98 text-amber-50 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Đang xuất ảnh & gửi mail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-amber-200" />
                      <span>Gửi Ảnh Qua Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isDownloadingImage}
                  title="Tải ảnh PNG độ nét cao về thiết bị"
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 border border-stone-200 shrink-0 disabled:opacity-60"
                >
                  {isDownloadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span className="hidden sm:inline">Tải ảnh PNG</span>
                </button>
              </div>
            </form>

            {/* Success Message Banner */}
            {sendSuccessMessage && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">{sendSuccessMessage}</span>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    * Nếu không thấy trong Hộp thư đến, vui lòng kiểm tra thêm mục Thư rác (Spam) hoặc Quảng cáo.
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {sendErrorMessage && (
              <div className="flex items-start justify-between gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 animate-fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{sendErrorMessage}</div>
                    {isGmailConfigured === false && (
                      <button
                        type="button"
                        onClick={() => setShowSetupGuideModal(true)}
                        className="text-[11px] text-amber-900 underline font-semibold mt-1 flex items-center gap-1 hover:text-amber-700 cursor-pointer"
                      >
                        <Key className="w-3 h-3" />
                        <span>Xem hướng dẫn thêm key Gmail vào file .env</span>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSendErrorMessage(null)}
                  className="text-red-400 hover:text-red-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Setup Guide Link */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-900/10 text-[11px]">
              <span className="text-stone-500">Dịch vụ gửi: Google Mail (Gmail SMTP)</span>
              <button
                type="button"
                onClick={() => setShowSetupGuideModal(true)}
                className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Cấu hình key Gmail</span>
              </button>
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
              onClick={handleRestartClick}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-medium bg-stone-900 hover:bg-stone-800 text-amber-100 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm tờ giấy mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Congratulatory & Player Name Registration Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-amber-50 rounded-3xl p-6 md:p-7 shadow-2xl border-2 border-amber-900/30 text-stone-900">
            <button
              onClick={() => setShowNameModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-200/60 text-stone-500 cursor-pointer transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-800/10 text-amber-900 mx-auto flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-amber-800" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Chúc Mừng Nghệ Nhân!
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Bạn đã hoàn thành xuất sắc 12 công đoạn làm giấy thủ công. Mời bạn nhập tên để khắc triện đỏ lên tác phẩm và lưu danh vào số lượng người tham gia!
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegisterName(nameInput);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-serif font-bold text-stone-700 mb-1.5">
                  Họ và tên nghệ nhân / người chơi:
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A..."
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs md:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 shadow-xs"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Email nhận ảnh thành phẩm:</span>
                  <span className="text-[10px] text-stone-400 font-normal font-sans">(Tùy chọn)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nghenhan@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs md:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 shadow-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleRegisterName(nameInput || `Nghệ nhân #${totalParticipants + 1}`);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer transition-colors"
                >
                  Để sau / Ẩn danh
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Khắc triện & Ghi danh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Google Mail Setup Guide Modal */}
      {showSetupGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-7 shadow-2xl border-2 border-amber-900/30 text-stone-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSetupGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-800/10 text-amber-800 flex items-center justify-center shrink-0">
                <Key className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Hướng Dẫn Thêm Key Google Mail
                </h3>
                <p className="text-xs text-stone-500">
                  Chỉ cần 1 phút thiết lập trong file <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-800 font-mono">.env</code> là dùng được ngay
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-stone-700 leading-relaxed mb-5">
              {/* Step 1 */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center">1</span>
                  <span>Mở file .env ở thư mục gốc dự án</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  File <code className="font-mono text-amber-900 font-semibold">.env</code> đã được tạo sẵn ở thư mục gốc của dự án CraftingPaper.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center">2</span>
                  <span>Lấy Mật Khẩu Ứng Dụng (App Password) từ Google</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px]">
                  <li>
                    Truy cập trang bảo mật Google:{' '}
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      myaccount.google.com/security <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Bật <strong>Xác minh 2 bước</strong> (2-Step Verification) nếu tài khoản chưa bật.</li>
                  <li>
                    Tìm mục <strong>Mật khẩu ứng dụng</strong> (App passwords) và tạo mật khẩu mới tên <em>CraftingPaper</em>.
                  </li>
                  <li>Google sẽ cấp mã <strong>16 ký tự</strong> (ví dụ: <code className="font-mono bg-white px-1 border rounded">abcd efgh ijkl mnop</code>).</li>
                </ol>
              </div>

              {/* Step 3 */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center">3</span>
                  <span>Dán cấu hình vào file .env</span>
                </div>
                <div className="relative mt-2">
                  <pre className="p-3 bg-stone-900 text-amber-100 rounded-xl text-[11px] font-mono overflow-x-auto">
{`GMAIL_USER="your_email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"`}
                  </pre>
                  <button
                    onClick={handleCopyEnvTemplate}
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copiedEnvSnippet ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy mẫu</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  sound.playTap();
                  await checkEmailConfig();
                  setShowSetupGuideModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Kiểm tra lại kết nối</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSetupGuideModal(false)}
                className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Email Confirmation, Sending, & Result Verification Modal */}
      {emailModalStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-2xl border-2 border-amber-900/30 text-stone-900 overflow-hidden">
            {/* Close button (only when not in active sending state) */}
            {emailModalStep !== 'sending' && (
              <button
                onClick={() => setEmailModalStep(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* STEP 1: CONFIRM BEFORE SENDING */}
            {emailModalStep === 'confirm' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-800/10 text-amber-800 mx-auto flex items-center justify-center mb-3">
                    <Mail className="w-7 h-7 text-amber-800" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Xác Nhận Gửi Thành Phẩm
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    Bạn có muốn tiến hành gửi hình ảnh thành phẩm giấy cỏ độc bản cùng Giấy chứng nhận nghệ nhân tới địa chỉ email dưới đây?
                  </p>
                </div>

                {/* Recipient box */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Hòm thư nhận:</span>
                    <span className="font-bold text-amber-950 font-mono text-sm break-all">{emailInput}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/50">
                    <span className="text-stone-500 font-medium">Gửi từ:</span>
                    <span className="text-stone-700 font-medium">{connectedUserEmail || 'mocxinh.handmade@gmail.com'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/50">
                    <span className="text-stone-500 font-medium">Định dạng gửi:</span>
                    <span className="text-emerald-700 font-medium">Ảnh PNG Retina 2x + Thư HTML</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailModalStep(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Kiểm tra lại
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteSendEmail(emailInput)}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 hover:brightness-110 active:scale-98 text-amber-50 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-200" />
                    <span>Xác nhận & Gửi ngay</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ACTIVE SENDING PROGRESS */}
            {emailModalStep === 'sending' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-800/10 text-amber-800 mx-auto flex items-center justify-center relative">
                  <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Đang Tiến Hành Gửi Email...
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    Hệ thống đang xuất ảnh độ phân giải cao và kết nối tới máy chủ Google Mail để chuyển thư. Quá trình này mất khoảng 2-3 giây.
                  </p>
                </div>
                <div className="bg-stone-50 rounded-xl p-3 text-[11px] text-stone-500 font-mono">
                  Đang gửi tới: <span className="text-stone-900 font-bold">{emailInput}</span>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {emailModalStep === 'success' && (
              <div className="space-y-4 text-stone-900">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-inner">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Đã Gửi Thành Công
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mt-2">
                    Xác Nhận Email Đã Gửi!
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Tác phẩm giấy cỏ và Giấy chứng nhận nghệ nhân đã được chuyển tiếp thành công tới hòm thư của bạn.
                  </p>
                </div>

                {/* Delivery Receipt Card */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Địa chỉ nhận:</span>
                    <span className="font-bold text-emerald-950 font-mono break-all">
                      {sentResultData?.recipientEmail}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50">
                    <span className="text-stone-500 font-medium">Trạng thái:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Google Mail đã tiếp nhận (250 OK)
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/50">
                    <span className="text-stone-500 font-medium">Thời gian gửi:</span>
                    <span className="text-stone-700 font-medium">{sentResultData?.timestamp}</span>
                  </div>
                  {sentResultData?.messageId && (
                    <div className="pt-1 border-t border-emerald-200/50">
                      <div className="text-[11px] text-stone-400">Mã định danh thư (Message-ID):</div>
                      <div className="font-mono text-[10px] text-stone-600 break-all bg-white/70 p-1 rounded mt-0.5 border border-emerald-100">
                        {sentResultData.messageId}
                      </div>
                    </div>
                  )}
                </div>

                {/* Helpful tip */}
                <div className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                  💡 <strong>Lưu ý:</strong> Vui lòng mở hộp thư Gmail của bạn. Nếu chưa thấy trong mục <em>Hộp thư đến (Inbox)</em>, bạn hãy kiểm tra thêm mục <em>Thư rác (Spam)</em> hoặc <em>Quảng cáo</em>.
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex gap-2">
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-100 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      <span>Mở hộp thư Gmail</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      disabled={isDownloadingImage}
                      className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
                      title="Tải thêm bản sao PNG về máy"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Lưu bản PNG</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEmailModalStep(null)}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors text-center"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: FAILURE CONFIRMATION */}
            {emailModalStep === 'failed' && (
              <div className="space-y-4 text-stone-900">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3 shadow-inner">
                    <AlertCircle className="w-9 h-9 text-red-600" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    Gửi Chưa Thành Công
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mt-2">
                    Xác Nhận Gửi Thất Bại
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Hệ thống chưa thể chuyển email tới địa chỉ <strong>{sentResultData?.recipientEmail}</strong>.
                  </p>
                </div>

                {/* Error Box */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="font-bold text-red-900">Nguyên nhân chi tiết:</div>
                  <div className="text-red-700 font-mono text-[11px] leading-relaxed break-words bg-white/70 p-2 rounded border border-red-200">
                    {sentResultData?.errorDetail || 'Không nhận được phản hồi từ dịch vụ Google Mail.'}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExecuteSendEmail(sentResultData?.recipientEmail || emailInput)}
                    className="w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Thử gửi lại ngay</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className="flex-1 py-2.5 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-600" />
                      <span>Tải ảnh PNG về máy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmailModalStep(null);
                        setShowSetupGuideModal(true);
                      }}
                      className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-800" />
                      <span>Kiểm tra key .env</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEmailModalStep(null)}
                    className="w-full py-2 text-stone-400 hover:text-stone-600 text-[11px] text-center"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
