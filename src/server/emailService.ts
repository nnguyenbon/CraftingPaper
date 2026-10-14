import nodemailer from 'nodemailer';

export interface SendEmailPayload {
  recipientEmail: string;
  playerName?: string;
  paperImageBase64: string; // "data:image/png;base64,..."
  specs?: {
    colorName?: string;
    colorHex?: string;
    thicknessGsm?: number;
    thicknessDescription?: string;
    smoothnessScore?: number;
    smoothnessDescription?: string;
    tensileScore?: number;
    tensileDescription?: string;
    textureDescription?: string;
    materialSummary?: string;
    decorationSummary?: string;
    artisanDescription?: string;
  };
  materials?: {
    grassType?: string;
    additiveType?: string;
    grassRatio?: number;
    additiveRatio?: number;
  };
  date?: string;
}

export interface EmailServiceResult {
  status: number;
  success: boolean;
  message: string;
  code?: string;
  messageId?: string;
  devHint?: string;
}

/**
 * Get configured Gmail credentials from environment variables
 */
export function getGmailConfig() {
  const user = (
    process.env.GMAIL_USER ||
    process.env.EMAIL_USER ||
    process.env.VITE_GMAIL_USER ||
    ''
  ).trim();

  const rawPass = (
    process.env.GMAIL_APP_PASSWORD ||
    process.env.GMAIL_PASSWORD ||
    process.env.GMAIL_PASS ||
    process.env.EMAIL_PASS ||
    process.env.VITE_GMAIL_APP_PASSWORD ||
    ''
  ).trim();

  // Strip spaces often present in Google App Passwords (e.g., "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
  const pass = rawPass.replace(/\s+/g, '');

  const senderName =
    process.env.GMAIL_SENDER_NAME || 'Tiệm Giấy Thủ Công CraftingPaper';

  const isConfigured = Boolean(
    user &&
      pass &&
      !user.includes('your_email') &&
      !user.includes('example.com') &&
      !pass.includes('xxxx') &&
      pass.length >= 8
  );

  return {
    user,
    pass,
    senderName,
    isConfigured,
  };
}

/**
 * Send paper artwork and certificate to recipient email via Google Mail (Gmail SMTP)
 */
export async function sendPaperEmail(payload: SendEmailPayload): Promise<EmailServiceResult> {
  const { recipientEmail, playerName = 'Nghệ nhân', paperImageBase64, specs, materials, date } = payload;

  // 1. Validate recipient email
  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
    return {
      status: 400,
      success: false,
      code: 'INVALID_EMAIL',
      message: 'Địa chỉ email người nhận không hợp lệ. Vui lòng kiểm tra lại.',
    };
  }

  // 2. Validate image payload
  if (!paperImageBase64 || !paperImageBase64.includes('base64,')) {
    return {
      status: 400,
      success: false,
      code: 'INVALID_IMAGE',
      message: 'Chưa có dữ liệu hình ảnh thành phẩm hợp lệ để gửi đính kèm.',
    };
  }

  // 3. Check Gmail environment variables
  const config = getGmailConfig();

  if (!config.isConfigured) {
    console.warn(
      '[EmailService] Google Mail credentials are not configured in .env. GMAIL_USER or GMAIL_APP_PASSWORD missing.'
    );
    return {
      status: 400,
      success: false,
      code: 'MISSING_GMAIL_KEYS',
      message:
        'Chưa cấu hình tài khoản Google Mail trong file .env. Vui lòng thêm GMAIL_USER và GMAIL_APP_PASSWORD để gửi email trực tiếp.',
      devHint:
        'Mở file .env ở thư mục gốc của dự án, điền GMAIL_USER=<email_cua_ban> và GMAIL_APP_PASSWORD=<mat_khau_ung_dung_16_ky_tu>.',
    };
  }

  try {
    // 4. Extract Base64 buffer
    const base64Data = paperImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 5. Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.GMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.GMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const completionDate =
      date ||
      new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const safeName = playerName.trim() || 'Nghệ nhân';
    const paperTitle = `Giấy ${materials?.grassType === 'pandan' ? 'Lá Dứa' : 'Lá Sả'} · ${specs?.colorName || 'Màu Tự Nhiên'}`;
    const sanitizedFileName = safeName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_');

    // 6. Build Luxury Handcrafted HTML Email Template
    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Tác Phẩm Giấy Thủ Công</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f4; margin: 0; padding: 20px; color: #1c1917; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e7e5e4; }
    .header { background: linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%); padding: 36px 24px; text-align: center; color: #fef3c7; }
    .header-badge { display: inline-block; padding: 4px 12px; background-color: rgba(254, 243, 199, 0.15); border: 1px solid rgba(254, 243, 199, 0.3); border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 12px; }
    .header h1 { margin: 0; font-size: 26px; font-family: 'Times New Roman', Times, serif; font-weight: 600; letter-spacing: 0.5px; color: #ffffff; }
    .header p { margin: 8px 0 0; font-size: 13px; color: #fde68a; opacity: 0.9; }
    
    .body { padding: 32px 24px; }
    .greeting { font-size: 16px; font-weight: 600; color: #1c1917; margin-bottom: 12px; }
    .intro { font-size: 14px; line-height: 1.6; color: #44403c; margin-bottom: 24px; }
    
    .artwork-box { background: linear-gradient(to bottom, #1c1917, #292524); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 28px; border: 3px solid #78350f; }
    .artwork-img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
    .artwork-caption { color: #fde68a; font-size: 12px; margin-top: 12px; font-style: italic; }
    
    .specs-card { background-color: #fefce8; border: 1px solid #fef08a; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
    .specs-title { font-size: 14px; font-weight: 700; color: #854d0e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .specs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .specs-table td { padding: 8px 0; border-bottom: 1px dashed #fef08a; }
    .specs-table td:last-child { text-align: right; font-weight: 600; color: #1c1917; }
    .specs-table tr:last-child td { border-bottom: none; }
    .color-swatch { display: inline-block; width: 12px; height: 12px; border-radius: 50%; vertical-align: middle; margin-right: 6px; border: 1px solid #d6d3d1; }
    
    .artisan-quote { background-color: #fafaf9; border-left: 4px solid #b45309; padding: 14px 18px; border-radius: 4px 12px 12px 4px; margin-bottom: 24px; }
    .artisan-quote-text { font-family: 'Times New Roman', Times, serif; font-style: italic; font-size: 14px; color: #44403c; line-height: 1.6; margin: 0; }
    
    .seal-section { text-align: right; padding-top: 12px; border-top: 1px solid #e7e5e4; }
    .seal-stamp { display: inline-block; border: 2px solid #b91c1c; padding: 6px 14px; border-radius: 4px; background-color: #fef2f2; text-align: center; }
    .seal-title { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #991b1b; font-weight: 700; }
    .seal-name { font-size: 13px; font-weight: 700; color: #7f1d1d; font-family: 'Times New Roman', Times, serif; }
    
    .footer { background-color: #fafaf9; padding: 20px 24px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #f5f5f4; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="header-badge">Chứng Nhận Chế Tác Độc Bản</div>
      <h1>XƯỞNG GIẤY THỦ CÔNG TRUYỀN THỐNG</h1>
      <p>Dự án Bảo Tồn & Sáng Tạo Nghệ Thuật Giấy Cỏ Việt Nam</p>
    </div>

    <!-- Body -->
    <div class="body">
      <div class="greeting">Kính gửi Nghệ nhân ${safeName},</div>
      <div class="intro">
        Chúc mừng bạn đã hoàn thành xuất sắc <strong>12 công đoạn</strong> chế tác giấy cỏ thủ công truyền thống. 
        Chính sự phối hợp nguyên liệu và kỹ năng nhào nặn của bạn đã tạo nên tác phẩm độc bản <em>"${paperTitle}"</em> vào ngày ${completionDate}.
      </div>

      <!-- Artwork Image Preview -->
      <div class="artwork-box">
        <img class="artwork-img" src="cid:paper_artwork" alt="Thành phẩm giấy thủ công" />
        <div class="artwork-caption">Tác phẩm của nghệ nhân ${safeName} (Hình ảnh độ phân giải cao cũng được đính kèm bên dưới thư)</div>
      </div>

      <!-- Specifications -->
      <div class="specs-card">
        <div class="specs-title">Đặc Tính Kỹ Thuật Tác Phẩm</div>
        <table class="specs-table">
          <tr>
            <td style="color: #78716c;">Màu sắc thành phẩm</td>
            <td>
              <span class="color-swatch" style="background-color: ${specs?.colorHex || '#d6c8b0'};"></span>
              ${specs?.colorName || 'Màu mộc tự nhiên'}
            </td>
          </tr>
          <tr>
            <td style="color: #78716c;">Định lượng giấy</td>
            <td>${specs?.thicknessGsm || 120} GSM (${specs?.thicknessDescription || 'Tiêu chuẩn'})</td>
          </tr>
          <tr>
            <td style="color: #78716c;">Độ mịn bề mặt</td>
            <td>${specs?.smoothnessScore || 80}/100 (${specs?.smoothnessDescription || 'Mịn màng'})</td>
          </tr>
          <tr>
            <td style="color: #78716c;">Độ dai thớ sợi</td>
            <td>${specs?.tensileScore || 85}/100 (${specs?.tensileDescription || 'Bền dai'})</td>
          </tr>
          <tr>
            <td style="color: #78716c;">Thành phần xơ sợi</td>
            <td>${specs?.materialSummary || '100% Cỏ tự nhiên'}</td>
          </tr>
          <tr>
            <td style="color: #78716c;">Họa tiết trang trí</td>
            <td>${specs?.decorationSummary || 'Giấy mộc nguyên bản'}</td>
          </tr>
        </table>
      </div>

      ${
        specs?.artisanDescription
          ? `
      <div class="artisan-quote">
        <p class="artisan-quote-text">“${specs.artisanDescription}”</p>
      </div>
      `
          : ''
      }

      <!-- Red Seal Stamp -->
      <div class="seal-section">
        <div class="seal-stamp">
          <div class="seal-title">Nghệ Nhân Chế Tác</div>
          <div class="seal-name">${safeName}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Thư này được gửi tự động từ <strong>CraftingPaper · Trải Nghiệm Giấy Cỏ Thủ Công</strong>.</p>
      <p>Bạn có thể tải file ảnh đính kèm để in ấn làm bưu thiếp, tranh lưu niệm hoặc bìa sổ tay cá nhân.</p>
    </div>
  </div>
</body>
</html>
    `;

    // 7. Send the email via Gmail SMTP
    const info = await transporter.sendMail({
      from: `"${config.senderName}" <${config.user}>`,
      to: recipientEmail.trim(),
      subject: `📜 [CraftingPaper] Chúc mừng nghệ nhân ${safeName} - Tác phẩm Giấy Thủ Công độc bản của bạn!`,
      html: htmlContent,
      attachments: [
        {
          filename: `Giay-Thu-Cong-${sanitizedFileName}-${Date.now()}.png`,
          content: imageBuffer,
          cid: 'paper_artwork', // Inline embedded reference in the HTML
        },
      ],
    });

    console.log(`[EmailService] Email sent successfully to ${recipientEmail}: ${info.messageId}`);

    return {
      status: 200,
      success: true,
      message: `Đã gửi ảnh thành phẩm thành công về hòm thư ${recipientEmail}!`,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('[EmailService] Error sending email via Google Mail:', error);

    // Friendly diagnostics for common Gmail errors
    const errorMessage = error?.message || String(error);

    if (errorMessage.includes('535') || errorMessage.includes('Invalid login') || errorMessage.includes('EAUTH')) {
      return {
        status: 401,
        success: false,
        code: 'AUTH_FAILED',
        message:
          'Xác thực tài khoản Google Mail không thành công. Hãy đảm bảo bạn đã dùng Mật Khẩu Ứng Dụng (Google App Password 16 ký tự), không phải mật khẩu tài khoản Google thông thường.',
        devHint:
          'Vào myaccount.google.com/security -> Bật 2-Step Verification -> Tạo App Password 16 chữ cái và dán vào GMAIL_APP_PASSWORD trong .env.',
      };
    }

    return {
      status: 500,
      success: false,
      code: 'SEND_FAILED',
      message: `Không thể gửi email: ${errorMessage}`,
    };
  }
}
