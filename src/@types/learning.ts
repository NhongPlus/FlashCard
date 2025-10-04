// src/pages/Learning/types.ts

export type LearningMode = 'basic' | 'study' | null;

export interface CardData {
  id: string;
  studySetId: string;
  front: string;
  back: string;
  order: number;
  isMastered: boolean;
}

export interface StudySetData {
  id: string;
  title: string;
  description?: string;
  userId: string;
  folderId?: string | null;
  cardCount: number;
}

export interface BasicModeState {
  viewedCardIds: Set<string>;
  isShuffled: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  handleShuffle: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export interface StudyModeState {
  reviewedCount: number;
  handleMastery: (mastered: boolean) => Promise<void>;
  handleReset: () => Promise<void>;
  handleContinue: () => void;
}