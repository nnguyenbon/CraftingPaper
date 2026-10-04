export type GrassType = 'lemongrass' | 'pandan'; // Cỏ lá sả hoặc Cỏ lá dứa
export type AdditiveType = 'none' | 'bark' | 'bagasse' | 'reed'; // Vỏ cây Dó, Bã mía, Sậy (xóa hoàn toàn rơm nếp)

export interface MaterialConfig {
  grassType: GrassType;
  additiveType: AdditiveType;
  grassRatio: number; // 60-100%
  additiveRatio: number; // 0-40%
}

export type GrindLevel = 'coarse' | 'medium' | 'fine';

export type StarchLevel = 'low' | 'medium' | 'high';

export type DecorationType = 'none' | 'pressed_flowers' | 'pressed_leaves' | 'water_marbling' | 'natural_specks';

export interface FlowerItem {
  id: string;
  type: 'daisy' | 'peach' | 'pea' | 'fern' | 'bamboo_leaf';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number; // degrees
  scale: number;
}

export interface PlayerActionStats {
  cutAccuracy: number; // 0-100
  rinseThoroughness: number; // 0-100
  boilTime: number; // seconds cooked
  poundStrength: number; // 0-100
  grindCount: number; // number of grinds
  grindLevel: GrindLevel;
  vatWaterLevel: number; // 40-100%
  starchLevel: StarchLevel;
  deckleUniformity: number; // 0-100 from swaying/shaking
  deckleThickness: number; // 0-100 from dip depth %
  decorations: FlowerItem[];
  decorationType: DecorationType;
}

export interface CalculatedPaperSpecs {
  colorHex: string;
  colorName: string;
  thicknessGsm: number; // e.g., 80 - 240 gsm
  thicknessDescription: string;
  smoothnessScore: number; // 0 - 100
  smoothnessDescription: string;
  tensileScore: number; // 0 - 100 (độ dai)
  tensileDescription: string;
  textureDescription: string;
  fiberGrainType: string;
  materialSummary: string;
  decorationSummary: string;
  artisanDescription: string;
  porosity: number; // 0 - 100 (độ xốp)
  translucency: number; // 0 - 100
}

export type WorkshopStep = 
  | 1  // Chọn nguyên liệu
  | 2  // Cắt cỏ
  | 3  // Rửa sạch
  | 4  // Cắt nhỏ
  | 5  // Nấu với nước tro
  | 6  // Đập dập
  | 7  // Nghiền bột
  | 8  // Pha bể giấy
  | 9  // Seo giấy (Core)
  | 10 // Phơi giấy
  | 11 // Trang trí
  | 12; // Hoàn thành

export interface SavedPaper {
  id: string;
  date: string;
  name: string;
  materials: MaterialConfig;
  stats: PlayerActionStats;
  specs: CalculatedPaperSpecs;
  canvasDrawing?: string;
}
