// src/services/cardService.ts
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
  writeBatch,
  updateDoc
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Interface của bạn
export interface CardData {
  id: string;
  studySetId: string;
  front: string;
  back: string;
  order: number;
  isMastered: boolean;
  // Các trường khác...
}

/**
 * CREATE - Thêm một card mới vào study set và cập nhật cardCount
 * Sử dụng Transaction để đảm bảo tính toàn vẹn.
 */
export async function createCard(studySetId: string, cardData: Omit<CardData, 'id' | 'studySetId'>): Promise<string> {
  const studySetRef = doc(db, "studySets", studySetId);
  const cardsCollectionRef = collection(db, "cards");
  
  try {
    let newCardId = '';
    await runTransaction(db, async (transaction) => {
      const studySetDoc = await transaction.get(studySetRef);
      if (!studySetDoc.exists()) {
        throw "Học phần không tồn tại!";
      }

      const currentCardCount = studySetDoc.data().cardCount || 0;
      
      // Tạo card mới
      const newCardRef = doc(cardsCollectionRef); // Tự tạo ID trước
      newCardId = newCardRef.id;
      transaction.set(newCardRef, { ...cardData, studySetId });
      
      // Cập nhật cardCount
      transaction.update(studySetRef, { cardCount: currentCardCount + 1 });
    });
    return newCardId;
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Không thể tạo thẻ");
  }
}

// READ - Lấy tất cả cards trong một study set
export async function getCardsInStudySet(studySetId: string): Promise<CardData[]> {
  try {
    const q = query(collection(db, "cards"), where("studySetId", "==", studySetId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CardData));
  } catch (error) {
    console.error("Error getting cards:", error);
    throw new Error("Không thể tải danh sách thẻ");
  }
}

// UPDATE - Cập nhật một card
export async function updateCard(cardId: string, data: Partial<Omit<CardData, 'id' | 'studySetId'>>): Promise<void> {
  try {
    await updateDoc(doc(db, "cards", cardId), data);
  } catch (error) {
    console.error("Error updating card:", error);
    throw new Error("Không thể cập nhật thẻ");
  }
}

/**
 * UPDATE - Cập nhật trạng thái mastered của một card (giống Quizlet)
 * @param cardId - ID của card cần cập nhật
 * @param isMastered - true nếu đã thuộc, false nếu chưa thuộc
 */
export async function updateCardMastery(cardId: string, isMastered: boolean): Promise<void> {
  try {
    const cardRef = doc(db, "cards", cardId);
    await updateDoc(cardRef, { 
      isMastered: isMastered,
      lastReviewed: new Date().toISOString() // Thêm timestamp khi review
    });
  } catch (error) {
    console.error("Error updating card mastery:", error);
    throw new Error("Không thể cập nhật trạng thái thẻ");
  }
}

/**
 * DELETE - Xóa một card và cập nhật cardCount
 * Sử dụng Transaction để đảm bảo tính toàn vẹn.
 */
export async function deleteCard(cardId: string, studySetId: string): Promise<void> {
  const cardRef = doc(db, "cards", cardId);
  const studySetRef = doc(db, "studySets", studySetId);
  
  try {
    await runTransaction(db, async (transaction) => {
      const studySetDoc = await transaction.get(studySetRef);
      if (!studySetDoc.exists()) {
        // Nếu study set không còn nhưng vẫn muốn xóa card thì bỏ throw
        throw "Học phần không tồn tại!";
      }

      const currentCardCount = studySetDoc.data().cardCount || 0;
      
      transaction.delete(cardRef);
      transaction.update(studySetRef, { cardCount: Math.max(0, currentCardCount - 1) });
    });
  } catch (error) {
    console.error("Error deleting card:", error);
    throw new Error("Không thể xóa thẻ");
  }
}

// UTILITY - Chỉ xóa tất cả cards trong study set (không cập nhật cardCount)
// Thường dùng trong compositeService khi xóa cả study set
export async function deleteAllCardsInStudySet(studySetId: string): Promise<void> {
    const batch = writeBatch(db);
    const q = query(collection(db, "cards"), where("studySetId", "==", studySetId));
    
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        console.error("Error bulk deleting cards:", error);
        throw new Error("Không thể xóa hàng loạt các thẻ");
    }
}