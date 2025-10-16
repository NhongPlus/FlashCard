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

    const handleNext = useCallback(() => {
        const currentCard = displayCards[index];
        if (!currentCard) return;

        if (!viewedCardIds.has(currentCard.id)) {
            const newViewedSet = new Set(viewedCardIds);
            newViewedSet.add(currentCard.id);
            setViewedCardIds(newViewedSet);

            if (newViewedSet.size >= displayCards.length) {
                setTimeout(() => onComplete(), 300);
                closeFlip();
                return;
            }
        }

        closeFlip();

        if (index < displayCards.length - 1) {
            setIndex(prev => prev + 1);
        }
    }, [displayCards, index, viewedCardIds, onComplete, closeFlip, setIndex]);

    const handlePrev = useCallback(() => {
        if (index === 0) return;

        closeFlip();

        const prevCard = displayCards[index - 1];
        if (prevCard && viewedCardIds.has(prevCard.id)) {
            const newViewedSet = new Set(viewedCardIds);
            newViewedSet.delete(prevCard.id);
            setViewedCardIds(newViewedSet);
        }

        setIndex(prev => prev - 1);
    }, [index, displayCards, viewedCardIds, closeFlip, setIndex]);

    const handleShuffle = useCallback(() => {
        if (isShuffled) {
            setDisplayCards([...originalCards]);
            setIsShuffled(false);
        } else {
            const shuffled = [...displayCards].sort(() => Math.random() - 0.5);
            setDisplayCards(shuffled);
            setIsShuffled(true);
        }
        closeFlip();
    }, [isShuffled, displayCards, originalCards, setDisplayCards, closeFlip]);
    const handleRestart = useCallback(() => {
        setViewedCardIds(new Set());
        setIndex(0);
        closeFlip();
    }, [setIndex, closeFlip]);


    const canGoNext = viewedCardIds.size < displayCards.length;
    const canGoPrev = index > 0;

    return {
        handleRestart,
        viewedCardIds,
        isShuffled,
        handleNext,
        handlePrev,
        handleShuffle,
        canGoNext,
        canGoPrev
    };
}