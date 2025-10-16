// src/pages/Learning/hooks/useLearningData.ts

import { useState, useEffect } from 'react';
import { getCardsInStudySet, getStudySet } from '@/services';
import type { CardData, StudySetData } from '@/@types/learning';

export function useLearningData(id: string) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [studySet, setStudySet] = useState<StudySetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [cardsData, studySetData] = await Promise.all([
          getCardsInStudySet(id),
          getStudySet(id),
        ]);

        // ✅ Ensure all cards have isMastered field
        const cardsWithMastery = cardsData.map(card => ({
          ...card,
          isMastered: card.isMastered ?? false, // Default to false if missing
        }));

        setCards(cardsWithMastery);
        setStudySet(studySetData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { 
    cards, 
    setCards, 
    studySet, 
    loading, 
    error 
  };
}