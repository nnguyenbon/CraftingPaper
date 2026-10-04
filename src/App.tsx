/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  WorkshopStep,
  MaterialConfig,
  PlayerActionStats,
  GrindLevel,
  StarchLevel,
  DecorationType,
  FlowerItem,
  SavedPaper,
} from './types/paper';
import { calculatePaperSpecs } from './utils/paperCalculator';
import { sound } from './utils/audio';

import { HeaderNav } from './components/HeaderNav';
import { WorkshopEnvironment } from './components/WorkshopEnvironment';
import { CraftBookDrawer } from './components/CraftBookDrawer';

// Stage Components
import { Stage1SelectMaterials } from './components/stages/Stage1SelectMaterials';
import { Stage2CutGrass } from './components/stages/Stage2CutGrass';
import { Stage3RinseGrass } from './components/stages/Stage3RinseGrass';
import { Stage4ChopFine } from './components/stages/Stage4ChopFine';
import { Stage5BoilLye } from './components/stages/Stage5BoilLye';
import { Stage6PoundFiber } from './components/stages/Stage6PoundFiber';
import { Stage7GrindPulp } from './components/stages/Stage7GrindPulp';
import { Stage8VatMix } from './components/stages/Stage8VatMix';
import { Stage9DeckleForm } from './components/stages/Stage9DeckleForm';
import { Stage10Drying } from './components/stages/Stage10Drying';
import { Stage11Decorate } from './components/stages/Stage11Decorate';
import { Stage12FinalShowcase } from './components/stages/Stage12FinalShowcase';

const INITIAL_MATERIALS: MaterialConfig = {
  additiveType: 'none',
  grassRatio: 100,
  additiveRatio: 0,
};

const INITIAL_STATS: PlayerActionStats = {
  cutAccuracy: 90,
  rinseThoroughness: 100,
  boilTime: 12,
  poundStrength: 90,
  grindLevel: 'medium',
  starchLevel: 'medium',
  deckleUniformity: 85,
  deckleThickness: 50,
  decorations: [],
  decorationType: 'none',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<WorkshopStep>(1);
  const [materials, setMaterials] = useState<MaterialConfig>(INITIAL_MATERIALS);
  const [stats, setStats] = useState<PlayerActionStats>(INITIAL_STATS);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBookOpen, setIsBookOpen] = useState<boolean>(false);
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>(() => {
    try {
      const stored = localStorage.getItem('artisan_grass_papers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Calculate dynamic paper specs whenever materials or stats update
  const calculatedSpecs = calculatePaperSpecs(materials, stats);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const handleReset = () => {
    sound.playTap();
    setMaterials(INITIAL_MATERIALS);
    setStats(INITIAL_STATS);
    setCurrentStep(1);
  };

  const handleSaveToBook = (paper: SavedPaper) => {
    const updated = [paper, ...savedPapers];
    setSavedPapers(updated);
    try {
      localStorage.setItem('artisan_grass_papers', JSON.stringify(updated));
    } catch {
      // Storage safe ignore
    }
  };

  const handleDeletePaper = (id: string) => {
    const updated = savedPapers.filter((p) => p.id !== id);
    setSavedPapers(updated);
    try {
      localStorage.setItem('artisan_grass_papers', JSON.stringify(updated));
    } catch {
      // Storage safe ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar Contract (3 Zones) */}
      <HeaderNav
        currentStep={currentStep}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenBook={() => {
          sound.playTap();
          setIsBookOpen(true);
        }}
        onReset={handleReset}
        savedCount={savedPapers.length}
      />

      {/* Main Artisan Workshop Canvas */}
      <WorkshopEnvironment>
        {/* Step 1: Chọn nguyên liệu */}
        {currentStep === 1 && (
          <Stage1SelectMaterials
            materials={materials}
            onChangeMaterials={setMaterials}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2: Cắt cỏ */}
        {currentStep === 2 && (
          <Stage2CutGrass
            onComplete={(accuracy) => {
              setStats((prev) => ({ ...prev, cutAccuracy: accuracy }));
              setCurrentStep(3);
            }}
          />
        )}

        {/* Step 3: Rửa sạch */}
        {currentStep === 3 && (
          <Stage3RinseGrass
            onComplete={(rinseScore) => {
              setStats((prev) => ({ ...prev, rinseThoroughness: rinseScore }));
              setCurrentStep(4);
            }}
          />
        )}

        {/* Step 4: Cắt nhỏ */}
        {currentStep === 4 && (
          <Stage4ChopFine
            materials={materials}
            onComplete={() => setCurrentStep(5)}
          />
        )}

        {/* Step 5: Nấu với nước tro */}
        {currentStep === 5 && (
          <Stage5BoilLye
            onComplete={() => setCurrentStep(6)}
          />
        )}

        {/* Step 6: Đập dập */}
        {currentStep === 6 && (
          <Stage6PoundFiber
            onComplete={(strength) => {
              setStats((prev) => ({ ...prev, poundStrength: strength }));
              setCurrentStep(7);
            }}
          />
        )}

        {/* Step 7: Nghiền bột */}
        {currentStep === 7 && (
          <Stage7GrindPulp
            currentGrind={stats.grindLevel}
            onChangeGrind={(grind: GrindLevel) =>
              setStats((prev) => ({ ...prev, grindLevel: grind }))
            }
            onComplete={() => setCurrentStep(8)}
          />
        )}

        {/* Step 8: Pha bể giấy */}
        {currentStep === 8 && (
          <Stage8VatMix
            materials={materials}
            starchLevel={stats.starchLevel}
            onChangeStarch={(starch: StarchLevel) =>
              setStats((prev) => ({ ...prev, starchLevel: starch }))
            }
            onComplete={() => setCurrentStep(9)}
          />
        )}

        {/* Step 9: Seo giấy (Core mechanic) */}
        {currentStep === 9 && (
          <Stage9DeckleForm
            materials={materials}
            onComplete={(uniformity, thickness) => {
              setStats((prev) => ({
                ...prev,
                deckleUniformity: uniformity,
                deckleThickness: thickness,
              }));
              setCurrentStep(10);
            }}
          />
        )}

        {/* Step 10: Phơi giấy */}
        {currentStep === 10 && (
          <Stage10Drying
            materials={materials}
            onComplete={() => setCurrentStep(11)}
          />
        )}

        {/* Step 11: Trang trí */}
        {currentStep === 11 && (
          <Stage11Decorate
            currentType={stats.decorationType}
            decorations={stats.decorations}
            onChangeType={(type: DecorationType) =>
              setStats((prev) => ({ ...prev, decorationType: type }))
            }
            onUpdateDecorations={(items: FlowerItem[]) =>
              setStats((prev) => ({ ...prev, decorations: items }))
            }
            onComplete={() => setCurrentStep(12)}
          />
        )}

        {/* Step 12: Hoàn thành & Thưởng lãm */}
        {currentStep === 12 && (
          <Stage12FinalShowcase
            materials={materials}
            stats={stats}
            specs={calculatedSpecs}
            onRestart={handleReset}
            onSaveToBook={handleSaveToBook}
          />
        )}
      </WorkshopEnvironment>

      {/* Sổ tay nghệ nhân modal drawer */}
      <CraftBookDrawer
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        savedPapers={savedPapers}
        onDeletePaper={handleDeletePaper}
      />
    </div>
  );
}
