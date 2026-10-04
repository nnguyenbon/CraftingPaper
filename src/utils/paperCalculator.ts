import { MaterialConfig, PlayerActionStats, CalculatedPaperSpecs, AdditiveType } from '../types/paper';

/**
 * Dynamically infers paper characteristics based on:
 * - Ingredient proportions (Grass base + Bark / Bagasse / Reed / Straw)
 * - Grinding level (coarse / medium / fine)
 * - Starch binder ratio (low / medium / high)
 * - Deckle forming skill (shaking uniformity & dipping thickness)
 * - Botanical decoration type
 */

export function calculatePaperSpecs(
  materials: MaterialConfig,
  stats: PlayerActionStats
): CalculatedPaperSpecs {
  const { grassRatio, additiveRatio, additiveType } = materials;
  const { grindLevel, starchLevel, deckleUniformity, deckleThickness, decorationType } = stats;

  // 1. Color Calculation
  // Base grass color is warm natural herbal cream / light sage
  let baseR = 242;
  let baseG = 238;
  let baseB = 224;
  let colorName = 'Kem thảo mộc tự nhiên';

  if (additiveType === 'bark') {
    // Tree bark warms it toward toasted sandalwood / amber beige
    const factor = additiveRatio / 100;
    baseR = Math.round(242 * (1 - factor) + 218 * factor);
    baseG = Math.round(238 * (1 - factor) + 204 * factor);
    baseB = Math.round(224 * (1 - factor) + 180 * factor);
    colorName = factor > 0.15 ? 'Vàng be vỏ cây trầm' : 'Kem ngà pha vỏ cây';
  } else if (additiveType === 'bagasse') {
    // Sugarcane bagasse brightens toward soft clean ecru / linen white
    const factor = additiveRatio / 100;
    baseR = Math.round(242 * (1 - factor) + 248 * factor);
    baseG = Math.round(238 * (1 - factor) + 246 * factor);
    baseB = Math.round(224 * (1 - factor) + 236 * factor);
    colorName = factor > 0.15 ? 'Trắng ngà bã mía dịu sáng' : 'Kem sáng tự nhiên';
  } else if (additiveType === 'reed') {
    // Reed adds river earthy grey-green undertone
    const factor = additiveRatio / 100;
    baseR = Math.round(242 * (1 - factor) + 228 * factor);
    baseG = Math.round(238 * (1 - factor) + 230 * factor);
    baseB = Math.round(224 * (1 - factor) + 208 * factor);
    colorName = factor > 0.15 ? 'Xanh ngà sậy bến nước' : 'Kem ánh lục sậy';
  } else if (additiveType === 'straw') {
    // Straw warms toward rich golden honey amber
    const factor = additiveRatio / 100;
    baseR = Math.round(242 * (1 - factor) + 244 * factor);
    baseG = Math.round(238 * (1 - factor) + 226 * factor);
    baseB = Math.round(224 * (1 - factor) + 188 * factor);
    colorName = factor > 0.15 ? 'Vàng ấm rơm nếp thu hoạch' : 'Vàng kem ánh rơm';
  }

  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  const colorHex = `#${toHex(baseR)}${toHex(baseG)}${toHex(baseB)}`;

  // 2. Thickness Calculation (GSM)
  // Base gsm driven by deckleThickness (40-100) + additive fibers
  let thicknessGsm = Math.round(100 + (deckleThickness / 100) * 110);
  if (additiveType === 'bark') thicknessGsm += Math.round((additiveRatio / 100) * 25);
  if (additiveType === 'reed') thicknessGsm += Math.round((additiveRatio / 100) * 20);
  if (additiveType === 'bagasse') thicknessGsm -= Math.round((additiveRatio / 100) * 15); // lighter

  let thicknessDescription = 'Vừa vặn tiêu chuẩn (150-180 gsm)';
  if (thicknessGsm < 130) {
    thicknessDescription = `Mỏng nhẹ thanh thoát (${thicknessGsm} gsm - thích hợp viết thư, gấp origami)`;
  } else if (thicknessGsm > 190) {
    thicknessDescription = `Dày dặn chắc chắn (${thicknessGsm} gsm - thích hợp làm bìa sổ, tranh khắc bản)`;
  } else {
    thicknessDescription = `Độ dày lý tưởng (${thicknessGsm} gsm - thích hợp thư pháp, vẽ màu nước, in ấn)`;
  }

  // 3. Smoothness Score (0-100)
  // Heavily influenced by GrindLevel, slightly modulated by Deckle Uniformity and Additives
  let smoothnessBase = 50;
  if (grindLevel === 'coarse') smoothnessBase = 32;
  if (grindLevel === 'medium') smoothnessBase = 68;
  if (grindLevel === 'fine') smoothnessBase = 92;

  // Additives modulate smoothness
  if (additiveType === 'bagasse') smoothnessBase += (additiveRatio / 100) * 8; // spongy soft
  if (additiveType === 'straw' || additiveType === 'reed') smoothnessBase -= (additiveRatio / 100) * 12; // rustic rough
  if (additiveType === 'bark') smoothnessBase -= (additiveRatio / 100) * 6;

  // Uniformity impact
  smoothnessBase += (deckleUniformity - 50) * 0.15;
  const smoothnessScore = Math.max(15, Math.min(99, Math.round(smoothnessBase)));

  let smoothnessDescription = '';
  if (smoothnessScore < 45) {
    smoothnessDescription = 'Thô mộc nguyên bản, thớ xơ nổi bật gồ ghề xúc giác';
  } else if (smoothnessScore < 75) {
    smoothnessDescription = 'Mịn vừa tự nhiên, chạm tay dễ chịu, sợi đan xen hài hòa';
  } else {
    smoothnessDescription = 'Mịn màng lụa là, bề mặt phẳng êm tay, sợi xơ siêu nhuyễn';
  }

  // 4. Tensile Strength / Độ Dai (0-100)
  // Influenced by: Bark (+), Starch Level (+), Deckle Uniformity (cross-linking +), Grass natural fiber
  let tensileBase = 60;
  if (additiveType === 'bark') {
    tensileBase += (additiveRatio / 100) * 35; // bark has legendary long bast fibers!
  } else if (additiveType === 'reed') {
    tensileBase += (additiveRatio / 100) * 15;
  } else if (additiveType === 'bagasse') {
    tensileBase -= (additiveRatio / 100) * 8; // bagasse is shorter fiber
  } else if (additiveType === 'straw') {
    tensileBase -= (additiveRatio / 100) * 5;
  }

  // Starch binder contribution
  if (starchLevel === 'low') tensileBase -= 8;
  if (starchLevel === 'high') tensileBase += 12;

  // Deckle uniformity (fiber interlocking)
  tensileBase += (deckleUniformity / 100) * 12;

  const tensileScore = Math.max(25, Math.min(98, Math.round(tensileBase)));
  let tensileDescription = '';
  if (tensileScore < 50) {
    tensileDescription = 'Mềm xốp, dễ xé gấp thủ công';
  } else if (tensileScore < 75) {
    tensileDescription = 'Độ dai khá tốt, thớ sợi liên kết chắc chắn';
  } else {
    tensileDescription = 'Rất dai và dẻo dai vượt trội, khó rách cả khi ẩm ướt';
  }

  // 5. Texture & Porosity
  let porosity = 50;
  if (additiveType === 'bagasse') porosity += Math.round((additiveRatio / 100) * 35);
  if (starchLevel === 'high') porosity -= 20;

  const texturePhrases: string[] = [];
  if (additiveType === 'bagasse' && additiveRatio > 10) {
    texturePhrases.push('bề mặt hơi xốp nhẹ');
  } else if (grindLevel === 'coarse') {
    texturePhrases.push('bề mặt mộc gồ ghề tự nhiên');
  } else if (grindLevel === 'fine') {
    texturePhrases.push('bề mặt phẳng êm');
  } else {
    texturePhrases.push('bề mặt mịn tự nhiên');
  }

  if (additiveType === 'reed' && additiveRatio > 10) {
    texturePhrases.push('texture gân sậy dài sắc nét');
  } else if (additiveType === 'bark' && additiveRatio > 10) {
    texturePhrases.push('gân xơ vỏ cây đan chéo dẻo');
  } else if (additiveType === 'straw' && additiveRatio > 10) {
    texturePhrases.push('vụn rơm vàng lấm tấm mộc mạc');
  } else if (grindLevel === 'coarse' || grindLevel === 'medium') {
    texturePhrases.push('texture sợi cỏ li ti phân bố đều');
  } else {
    texturePhrases.push('vân sợi vi mô lụa');
  }

  const textureDescription = texturePhrases.join(', ');

  // Fiber grain type
  let fiberGrainType = 'Sợi cỏ tự nhiên';
  if (additiveType === 'bark') fiberGrainType = 'Sợi cỏ phối xơ vỏ cây dẻo dai';
  if (additiveType === 'bagasse') fiberGrainType = 'Sợi cỏ phối bã mía xốp mềm';
  if (additiveType === 'reed') fiberGrainType = 'Sợi cỏ phối gân sậy bền bỉ';
  if (additiveType === 'straw') fiberGrainType = 'Sợi cỏ phối rơm vàng đồng quê';

  // Material summary
  const getAdditiveName = (type: AdditiveType) => {
    switch (type) {
      case 'bark': return 'Vỏ cây Dướng';
      case 'bagasse': return 'Bã mía ngọt';
      case 'reed': return 'Sậy tự nhiên';
      case 'straw': return 'Rơm nếp vàng';
      default: return '';
    }
  };

  let materialSummary = `100% Cỏ mộc (${grassRatio}%)`;
  if (additiveType !== 'none' && additiveRatio > 0) {
    materialSummary = `Cỏ (${grassRatio}%) + ${getAdditiveName(additiveType)} (${additiveRatio}%)`;
  }

  // Decoration summary
  let decorationSummary = 'Mộc nguyên bản (Không trang trí)';
  if (decorationType === 'pressed_flowers') decorationSummary = 'Ép cánh hoa dại tự nhiên';
  if (decorationType === 'pressed_leaves') decorationSummary = 'Ép lá tre & dương xỉ';
  if (decorationType === 'water_marbling') decorationSummary = 'Vân thủy ấn loang nước';
  if (decorationType === 'natural_specks') decorationSummary = 'Rắc họa tiết hạt cỏ thiên nhiên';

  // 6. Dynamic Poetic Artisan Summary Generation
  // Following the exact prompt requirement:
  // "Tờ giấy có màu kem tự nhiên, bề mặt hơi xốp, texture sợi rõ và độ dai khá tốt. Thành phần gồm cỏ kết hợp với bã mía."
  const colorSentence = `Tờ giấy mang sắc ${colorName.toLowerCase()}`;
  const surfaceSentence = `bề mặt ${texturePhrases[0] || 'mịn vừa'}`;
  const fiberSentence = `texture ${texturePhrases[1] || 'sợi tự nhiên rõ nét'}`;
  const tensileSentence = `độ dai ${tensileScore > 75 ? 'rất cao' : tensileScore > 50 ? 'khá tốt' : 'mềm xốp vừa vặn'}`;
  
  let ingredientSentence = 'Thành phần hoàn toàn từ cỏ tự nhiên.';
  if (additiveType !== 'none' && additiveRatio > 0) {
    ingredientSentence = `Thành phần gồm cỏ kết hợp với ${getAdditiveName(additiveType).toLowerCase()} (${additiveRatio}%).`;
  }

  let decoSentence = '';
  if (decorationType === 'pressed_flowers') {
    decoSentence = ' Điểm xuyết những cánh hoa ép dịu dàng ẩn hiện trong thớ giấy.';
  } else if (decorationType === 'pressed_leaves') {
    decoSentence = ' Mặt giấy lưu giữ dáng hình thanh mảnh của lá non ép thủ công.';
  } else if (decorationType === 'water_marbling') {
    decoSentence = ' Hoa văn vân nước bồng bềnh uốn lượn gợi nét thủy mặc.';
  } else if (decorationType === 'natural_specks') {
    decoSentence = ' Họa tiết hạt cỏ tự nhiên rải đều mang đậm hơi thở đồng nội.';
  }

  const artisanDescription = `${colorSentence}, ${surfaceSentence}, ${fiberSentence} và ${tensileSentence}. ${ingredientSentence}${decoSentence}`;

  const translucency = Math.max(10, Math.min(80, Math.round(120 - thicknessGsm * 0.45)));

  return {
    colorHex,
    colorName,
    thicknessGsm,
    thicknessDescription,
    smoothnessScore,
    smoothnessDescription,
    tensileScore,
    tensileDescription,
    textureDescription,
    fiberGrainType,
    materialSummary,
    decorationSummary,
    artisanDescription,
    porosity,
    translucency
  };
}
