// src/pages/Learning/hooks/useStudyMode.ts

import { useState, useCallback } from 'react';
import { updateCardMastery } from '@/services';
import type { CardData, StudyModeState } from '@/@types/learning';

interface UseStudyModeParams {
  displayCards: CardData[];
  index: number;
  setIndex: (value: number | ((prev: number) => number)) => void;
  cards: CardData[];
  setCards: (cards: CardData[] | ((prev: CardData[]) => CardData[])) => void;
  setDisplayCards: (cards: CardData[]) => void;
  onComplete: () => void;
  closeFlip: () => void;
}

export function useStudyMode({
  displayCards,
  index,
  setIndex,
  cards,
  setCards,
  setDisplayCards,
  onComplete,
  closeFlip
}: UseStudyModeParams): StudyModeState {
  const [reviewedCount, setReviewedCount] = useState(0);

  // Handle Mastery (Thuộc/Chưa thuộc)
  const handleMastery = useCallback(async (mastered: boolean) => {
    const currentCard = displayCards[index];
    if (!currentCard) return;

    try {
      // Update Firestore
      await updateCardMastery(currentCard.id, mastered);
      
      // Update local state
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === currentCard.id ? { ...card, isMastered: mastered } : card
        )
      );

      // Increment reviewed count
      const newReviewedCount = reviewedCount + 1;
      setReviewedCount(newReviewedCount);

      closeFlip();

      // Check if all cards have been reviewed
      if (newReviewedCount >= displayCards.length) {
        setTimeout(() => onComplete(), 300);
        return;
      }

      // Auto move to next card
      setIndex(prev => prev + 1);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thẻ:", error);
    }
  }, [displayCards, index, reviewedCount, setCards, closeFlip, onComplete, setIndex]);

  // Reset All Mastery (Đặt lại thẻ ghi nhớ)
  const handleReset = useCallback(async () => {
    try {
      // Reset all cards to unmastered in Firestore
      await Promise.all(cards.map(c => updateCardMastery(c.id, false)));
      
      // Update local state
      const resetCards = cards.map(c => ({ ...c, isMastered: false }));
      setCards(resetCards);
      
      // Shuffle and restart
      const shuffled = [...resetCards].sort(() => Math.random() - 0.5);
      setDisplayCards(shuffled);
      setReviewedCount(0);
      setIndex(0);
    } catch (error) {
      console.error("Lỗi khi reset thẻ:", error);
    }
  }, [cards, setCards, setDisplayCards, setIndex]);

  // Continue with Unmastered Cards (Tập trung vào thẻ còn lại)
  const handleContinue = useCallback(() => {
    // Filter only unmastered cards
    const unmasteredCards = cards.filter(card => !card.isMastered);
    
    if (unmasteredCards.length > 0) {
      // Shuffle unmastered cards
      const shuffled = [...unmasteredCards].sort(() => Math.random() - 0.5);
      setDisplayCards(shuffled);
      setReviewedCount(0);
      setIndex(0);
    }
  }, [cards, setDisplayCards, setIndex]);

  return {
    reviewedCount,
    handleMastery,
    handleReset,
    handleContinue
  };
}