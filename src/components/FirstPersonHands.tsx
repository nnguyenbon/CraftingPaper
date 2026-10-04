import React from 'react';
import { ActionIndicator } from './ActionIndicator';

interface FirstPersonHandsProps {
  tool: 'knife' | 'stir' | 'mallet' | 'pestle' | 'deckle' | 'brush' | 'tweezers' | 'none' | 'holding_paper';
  isActing: boolean;
  actionType?: string;
  offsetX?: number;
  offsetY?: number;
}

export const FirstPersonHands: React.FC<FirstPersonHandsProps> = ({
  tool,
  isActing,
  offsetX = 0,
  offsetY = 0,
}) => {
  // If holding deckle or holding paper, two hands are needed (count = 2)
  // For knife, mallet, stir, brush, tweezers: 1 hand is needed (count = 1)
  const count = (tool === 'deckle' || tool === 'holding_paper') ? 2 : 1;

  return (
    <ActionIndicator
      count={count}
      isActing={isActing}
      offsetX={offsetX}
      offsetY={offsetY}
    />
  );
};
