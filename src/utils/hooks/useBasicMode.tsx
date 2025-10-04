// src/pages/Learning/hooks/useBasicMode.ts

import { useState, useCallback } from 'react';
import type { CardData, BasicModeState } from '@/@types/learning';

interface UseBasicModeParams {
  displayCards: CardData[];
  index: number;
  setIndex: (value: number | ((prev: number) => number)) => void;
  setDisplayCards: (cards: CardData[]) => void;
  originalCards: CardData[];
  onComplete: () => void;
  closeFlip: () => void;
}

export function useBasicMode({
  displayCards,
  index,
  setIndex,
  setDisplayCards,
  originalCards,
  onComplete,
  closeFlip
}: UseBasicModeParams): BasicModeState {
  const [viewedCardIds, setViewedCardIds] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);

  // Handle Next Card
  const handleNext = useCallback(() => {
    const currentCard = displayCards[index];
    if (!currentCard) return;

    // Mark current card as viewed (if not already)
    if (!viewedCardIds.has(currentCard.id)) {
      const newViewedSet = new Set(viewedCardIds);
      newViewedSet.add(currentCard.id);
      setViewedCardIds(newViewedSet);

      // Check if all cards have been viewed
      if (newViewedSet.size >= displayCards.length) {
        setTimeout(() => onComplete(), 300);
        closeFlip();
        return;
      }
    }

    closeFlip();
    
    // Move to next card
    if (index < displayCards.length - 1) {
      setIndex(prev => prev + 1);
    }
  }, [displayCards, index, viewedCardIds, onComplete, closeFlip, setIndex]);

  // Handle Previous Card
  const handlePrev = useCallback(() => {
    if (index === 0) return;

    closeFlip();

    // Remove previous card from viewed list
    const prevCard = displayCards[index - 1];
    if (prevCard && viewedCardIds.has(prevCard.id)) {
      const newViewedSet = new Set(viewedCardIds);
      newViewedSet.delete(prevCard.id);
      setViewedCardIds(newViewedSet);
    }

    setIndex(prev => prev - 1);
  }, [index, displayCards, viewedCardIds, closeFlip, setIndex]);

  // Handle Shuffle
  const handleShuffle = useCallback(() => {
    if (isShuffled) {
      // Un-shuffle: restore original order
      setDisplayCards([...originalCards]);
      setIsShuffled(false);
    } else {
      // Shuffle cards randomly
      const shuffled = [...displayCards].sort(() => Math.random() - 0.5);
      setDisplayCards(shuffled);
      setIsShuffled(true);
    }
    closeFlip();
  }, [isShuffled, displayCards, originalCards, setDisplayCards, closeFlip]);

  // Calculate if navigation is possible
  const canGoNext = viewedCardIds.size < displayCards.length;
  const canGoPrev = index > 0;

  return {
    viewedCardIds,
    isShuffled,
    handleNext,
    handlePrev,
    handleShuffle,
    canGoNext,
    canGoPrev
  };
}