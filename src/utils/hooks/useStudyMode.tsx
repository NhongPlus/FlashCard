// src/utils/hooks/useStudyMode.tsx - FIXED VERSION

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
  const resetReviewedCount = useCallback(() => {
    setReviewedCount(0);
  }, []);
  // Handle Mastery (Thuộc/Chưa thuộc)
  const handleMastery = useCallback(async (mastered: boolean) => {
    const currentCard = displayCards[index];
    if (!currentCard) return;

    try {
      // ✅ 1. Update LOCAL STATE FIRST (Optimistic Update)
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === currentCard.id ? { ...card, isMastered: mastered } : card
        )
      );

      // ✅ 2. Update Firestore in background
      await updateCardMastery(currentCard.id, mastered);

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
      
      // ✅ Rollback on error
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === currentCard.id ? { ...card, isMastered: !mastered } : card
        )
      );
    }
  }, [displayCards, index, reviewedCount, setCards, closeFlip, onComplete, setIndex]);

  // ✅ FIXED: Reset All Mastery (Đặt lại thẻ ghi nhớ)
  const handleReset = useCallback(async (onResetComplete?: () => void) => {
    try {
      // ✅ 1. Update LOCAL STATE IMMEDIATELY (Optimistic)
      const resetCards = cards.map(c => ({ ...c, isMastered: false }));
      setCards(resetCards);
      
      // ✅ 2. Shuffle and restart UI
      const shuffled = [...resetCards].sort(() => Math.random() - 0.5);
      setDisplayCards(shuffled);
      setReviewedCount(0);
      setIndex(0);

      // ✅ 3. Update Firestore in BACKGROUND
      // Không cần await ở đây - UI đã update xong
      Promise.all(cards.map(c => updateCardMastery(c.id, false)))
        .catch(error => {
          console.error("Lỗi khi reset Firestore:", error);
          // Optionally: Notify user nếu sync failed
        });

      // ✅ 4. Callback để đóng modal
      if (onResetComplete) {
        onResetComplete();
      }
    } catch (error) {
      console.error("Lỗi khi reset thẻ:", error);
    }
  }, [cards, setCards, setDisplayCards, setIndex]);

  const handleContinue = useCallback(() => {
    // ✅ Use CURRENT cards state, not stale closure
    setCards(prevCards => {
      const unmasteredCards = prevCards.filter(card => !card.isMastered);
      
      if (unmasteredCards.length > 0) {
        // Shuffle unmastered cards
        const shuffled = [...unmasteredCards].sort(() => Math.random() - 0.5);
        setDisplayCards(shuffled);
        setReviewedCount(0);
        setIndex(0);
      }
      
      return prevCards; // Return unchanged
    });
  }, [setCards, setDisplayCards, setIndex]);

  return {
    reviewedCount,
    handleMastery,
    handleReset,
    handleContinue,
    resetReviewedCount
  };
}