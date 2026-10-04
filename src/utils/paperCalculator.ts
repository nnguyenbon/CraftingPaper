import { MaterialConfig, PlayerActionStats, CalculatedPaperSpecs, AdditiveType, GrassType } from '../types/paper';

/**
 * Dynamically infers paper characteristics based on:
 * - Grass base type (Cỏ lá sả or Cỏ lá dứa)
 * - Additive materials (Vỏ cây Dó, Bã mía, Sậy tự nhiên - rơm nếp has been removed)
 * - Proportions (linear blending)
 * - Grinding level (coarse / medium / fine)
 * - Starch binder ratio (low / medium / high)
 * - Deckle forming skill & dip depth
 * - Botanical decoration type
 */

export function calculatePaperSpecs(
  materials: MaterialConfig,
  stats: PlayerActionStats
): CalculatedPaperSpecs {
  const { grassType, grassRatio, additiveRatio, additiveType } = materials;
  const { grindLevel, starchLevel, deckleUniformity, deckleThickness, decorationType } = stats;

  // 1. Color Calculation based on exact ingredient mixing rules
  // Base colors for 100% grass:
  // Cỏ lá sả: Xanh lá nhạt tự nhiên (soft light herbal green)
  // Cỏ lá dứa: Xanh lá đậm hơn (deeper rich pandan green)
  let grassR = grassType === 'pandan' ? 197 : 228;
  let grassG = grassType === 'pandan' ? 218 : 236;
  let grassB = grassType === 'pandan' ? 186 : 212;

  // Additive target colors:
  // Vỏ cây Dó: Nâu / be tự nhiên của vỏ Dó (warm rustic bark beige / light tan)
  // Bã mía: Màu sáng / ngả màu mía (bright pale ecru / sugarcane linen)
  // Sậy tự nhiên: Vàng / be tự nhiên của thân sậy (golden reed sand beige)
  let addR = grassR;
  let addG = grassG;
  let addB = grassB;

  if (additiveType === 'bark') {
    // Vỏ Dó: Rich earthy warm tan/beige (215, 192, 160)
    addR = 215;
    addG = 192;
    addB = 160;
  } else if (additiveType === 'bagasse') {
    // Bã mía: Bright light ecru linen (250, 246, 232)
    addR = 250;
    addG = 246;
    addB = 232;
  } else if (additiveType === 'reed') {
    // Sậy: Natural river reed golden-beige (234, 219, 186)
    addR = 234;
    addG = 219;
    addB = 186;
  }

  // Linear color interpolation based on actual percentages
  const factor = additiveType !== 'none' ? Math.min(0.4, additiveRatio / 100) : 0;
  const finalR = Math.round(grassR * (1 - factor) + addR * factor);
  const finalG = Math.round(grassG * (1 - factor) + addG * factor);
  const finalB = Math.round(grassB * (1 - factor) + addB * factor);

  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  const colorHex = `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`;

  // Color name description
  let colorName = '';
  if (additiveType === 'none') {
    colorName = grassType === 'pandan' ? 'Xanh lá dứa thanh dịu' : 'Xanh cỏ sả nhạt tự nhiên';
  } else if (additiveType === 'bark') {
    colorName = factor > 0.2 ? 'Nâu be vỏ Dó truyền thống' : 'Be ánh lục pha vỏ Dó';
  } else if (additiveType === 'bagasse') {
    colorName = factor > 0.2 ? 'Sáng ngà bã mía thanh khiết' : 'Kem sáng ánh cỏ';
  } else if (additiveType === 'reed') {
    colorName = factor > 0.2 ? 'Vàng be sậy bến nước' : 'Vàng ngà cỏ sậy';
  }

  // 2. Thickness Calculation (GSM)
  // Driven directly by deckleThickness (depth of dip in water) + additive fibers
  let thicknessGsm = Math.round(85 + (deckleThickness / 100) * 125);
  if (additiveType === 'bark') thicknessGsm += Math.round((additiveRatio / 100) * 25);
  if (additiveType === 'reed') thicknessGsm += Math.round((additiveRatio / 100) * 18);
  if (additiveType === 'bagasse') thicknessGsm -= Math.round((additiveRatio / 100) * 15);

  let thicknessDescription = 'Vừa vặn tiêu chuẩn (140-170 gsm)';
  if (thicknessGsm < 120) {
    thicknessDescription = `Mỏng nhẹ thanh thoát (${thicknessGsm} gsm - thích hợp viết thư, làm đèn hoa đăng)`;
  } else if (thicknessGsm > 180) {
    thicknessDescription = `Dày dặn chắc chắn (${thicknessGsm} gsm - thích hợp làm bìa sổ, tranh in mộc bản)`;
  } else {
    thicknessDescription = `Độ dày lý tưởng (${thicknessGsm} gsm - thích hợp thư pháp, vẽ màu nước, ép hoa)`;
  }

  // 3. Smoothness Score (0-100)
  let smoothnessBase = 50;
  if (grindLevel === 'coarse') smoothnessBase = 35;
  if (grindLevel === 'medium') smoothnessBase = 70;
  if (grindLevel === 'fine') smoothnessBase = 93;

  if (additiveType === 'bagasse') smoothnessBase += (additiveRatio / 100) * 10; // spongy softness
  if (additiveType === 'reed') smoothnessBase -= (additiveRatio / 100) * 12; // distinct ridges
  if (additiveType === 'bark') smoothnessBase -= (additiveRatio / 100) * 4;

  smoothnessBase += (deckleUniformity - 50) * 0.12;
  const smoothnessScore = Math.max(18, Math.min(99, Math.round(smoothnessBase)));

  let smoothnessDescription = '';
  if (smoothnessScore < 45) {
    smoothnessDescription = 'Thô mộc nguyên bản, thớ xơ nổi bật gồ ghề xúc giác';
  } else if (smoothnessScore < 75) {
    smoothnessDescription = 'Mịn vừa tự nhiên, chạm tay êm dịu, sợi đan cài hài hòa';
  } else {
    smoothnessDescription = 'Mịn màng lụa là, bề mặt phẳng êm tay, sợi xơ siêu nhuyễn';
  }

  // 4. Tensile Strength / Độ Dai (0-100)
  // Vỏ Dó brings legendary bast fiber tensile resilience!
  let tensileBase = 58;
  if (additiveType === 'bark') {
    tensileBase += (additiveRatio / 100) * 38; // Vỏ Dó makes it super tough
  } else if (additiveType === 'reed') {
    tensileBase += (additiveRatio / 100) * 16;
  } else if (additiveType === 'bagasse') {
    tensileBase -= (additiveRatio / 100) * 6;
  }

  if (starchLevel === 'low') tensileBase -= 6;
  if (starchLevel === 'high') tensileBase += 12;
  tensileBase += (deckleUniformity / 100) * 12;

  const tensileScore = Math.max(25, Math.min(99, Math.round(tensileBase)));
  let tensileDescription = '';
  if (tensileScore < 50) {
    tensileDescription = 'Mềm xốp, thích hợp xé dán nghệ thuật';
  } else if (tensileScore < 78) {
    tensileDescription = 'Độ dai khá tốt, thớ sợi liên kết bền bỉ';
  } else {
    tensileDescription = 'Dẻo dai vượt trội chuẩn giấy Dó truyền thống, chống ẩm rách';
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
    texturePhrases.push('gân xơ vỏ Dó đan chéo dẻo dai');
  } else if (grindLevel === 'coarse' || grindLevel === 'medium') {
    texturePhrases.push('texture sợi cỏ li ti phân bố đều');
  } else {
    texturePhrases.push('vân sợi vi mô lụa');
  }

  const textureDescription = texturePhrases.join(', ');

  // Fiber grain type
  const grassName = grassType === 'pandan' ? 'Cỏ lá dứa' : 'Cỏ lá sả';
  let fiberGrainType = `Sợi ${grassName.toLowerCase()} tự nhiên`;
  if (additiveType === 'bark') fiberGrainType = `Sợi ${grassName.toLowerCase()} phối xơ vỏ Dó dẻo dai`;
  if (additiveType === 'bagasse') fiberGrainType = `Sợi ${grassName.toLowerCase()} phối bã mía xốp mềm`;
  if (additiveType === 'reed') fiberGrainType = `Sợi ${grassName.toLowerCase()} phối gân sậy bền bỉ`;

  // Material summary
  const getAdditiveName = (type: AdditiveType) => {
    switch (type) {
      case 'bark': return 'Vỏ cây Dó';
      case 'bagasse': return 'Bã mía ngọt';
      case 'reed': return 'Sậy tự nhiên';
      default: return '';
    }
  };

  let materialSummary = `100% ${grassName} (${grassRatio}%)`;
  if (additiveType !== 'none' && additiveRatio > 0) {
    materialSummary = `${grassName} (${grassRatio}%) + ${getAdditiveName(additiveType)} (${additiveRatio}%)`;
  }

  // Decoration summary
  let decorationSummary = 'Mộc nguyên bản (Không trang trí)';
  if (decorationType === 'pressed_flowers') decorationSummary = 'Ép cánh hoa dại tự nhiên';
  if (decorationType === 'pressed_leaves') decorationSummary = 'Ép lá tre non & dương xỉ';
  if (decorationType === 'water_marbling') decorationSummary = 'Vân thủy ấn loang nước';
  if (decorationType === 'natural_specks') decorationSummary = 'Hạt cỏ thiên nhiên rải điểm';

  // 6. Dynamic Poetic Artisan Summary Generation
  const colorSentence = `Tờ giấy mang sắc ${colorName.toLowerCase()}`;
  const surfaceSentence = `bề mặt ${texturePhrases[0] || 'mịn vừa'}`;
  const fiberSentence = `texture ${texturePhrases[1] || 'sợi tự nhiên rõ nét'}`;
  const tensileSentence = `độ dai ${tensileScore > 78 ? 'rất tốt' : tensileScore > 50 ? 'khá tốt' : 'mềm xốp vừa vặn'}`;

  let ingredientSentence = `Thành phần gồm ${grassName.toLowerCase()} tự nhiên.`;
  if (additiveType !== 'none' && additiveRatio > 0) {
    ingredientSentence = `Thành phần gồm ${grassName.toLowerCase()} kết hợp với ${getAdditiveName(additiveType).toLowerCase()} (${additiveRatio}%).`;
  }

  let decoSentence = '';
  if (decorationType === 'pressed_flowers') {
    decoSentence = ' Điểm xuyết những cánh hoa ép dịu dàng ẩn hiện trong thớ giấy.';
  } else if (decorationType === 'pressed_leaves') {
    decoSentence = ' Mặt giấy lưu giữ dáng hình thanh mảnh của lá non ép thủ công.';
  } else if (decorationType === 'water_marbling') {
    decoSentence = ' Những dải vân nước thủy ấn bồng bềnh uốn lượn như tranh mây nước.';
  } else if (decorationType === 'natural_specks') {
    decoSentence = ' Họa tiết hạt cỏ tự nhiên rải đều mang đậm hơi thở đồng nội.';
  }

  const artisanDescription = `${colorSentence}, ${surfaceSentence}, ${fiberSentence} và ${tensileSentence}. ${ingredientSentence}${decoSentence}`;
  const translucency = Math.max(10, Math.min(80, Math.round(130 - thicknessGsm * 0.5)));

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
    translucency,
  };
}
