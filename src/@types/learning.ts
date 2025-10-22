export type LearningMode = "basic" | "study" | null;

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
  isPublic?: boolean; // ← Add
  language?: { front: string; back: string }; // ← Add
  settings?: { allowCopy?: boolean; shuffleCards?: boolean }; // ← Add
  statistics?: { views?: number; copies?: number; learners?: number }; // ← Add
  rating?: { average?: number; count?: number }; // ← Add
  tags?: string[]; // ← Add
  createdAt?: unknown;
  updatedAt?: unknown;
}
export interface BasicModeState {
  viewedCardIds: Set<string>;
  isShuffled: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  handleShuffle: () => void;
  handleRestart: () => void; // ✅ THÊM
  canGoNext: boolean;
  canGoPrev: boolean;
}

export interface StudyModeState {
  reviewedCount: number;
  handleMastery: (mastered: boolean) => Promise<void>;
  handleReset: (onResetComplete?: () => void) => Promise<void>;
  handleContinue: (onContinueComplete?: () => void) => void; // ✅ SỬA
  resetReviewedCount: () => void;
}
