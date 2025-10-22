// src/services/compositeService.ts
import { writeBatch, doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

// SỬA LỖI 2: Sử dụng "import type" cho các interface
import { getStudySet } from "./studySetService";
import { getCardsInStudySet, } from "./cardService";
import type { StudySetData , CardData } from "@/@types/learning";
// SỬA LỖI 1: Các hàm 'deleteAllCardsInStudySet' và 'deleteStudySet' đã bị xóa khỏi đây
// vì logic của chúng được thực hiện trực tiếp trong 'writeBatch' để đảm bảo tính toàn vẹn.


/**
 * Tác vụ phức hợp: Tạo một học phần mới cùng với các thẻ của nó
 * Sử dụng writeBatch để đảm bảo tất cả được tạo hoặc không gì cả.
 */
export async function createStudySetWithCards(
  studySetData: Omit<StudySetData, 'id' | 'cardCount'>,
  cardsData: Omit<CardData, 'id' | 'studySetId'>[]
): Promise<string> {
  const batch = writeBatch(db);
  
  try {
    const newStudySetRef = doc(collection(db, "studySets"));
    const newStudySetId = newStudySetRef.id;

    batch.set(newStudySetRef, {
      ...studySetData,
      cardCount: cardsData.length,
    });

    cardsData.forEach(card => {
      const newCardRef = doc(collection(db, "cards"));
      batch.set(newCardRef, {
        ...card,
        studySetId: newStudySetId,
      });
    });

    await batch.commit();
    return newStudySetId;
  } catch (error) {
    console.error("Error creating study set with cards:", error);
    throw new Error("Không thể tạo học phần và các thẻ");
  }
}

/**
 * Tác vụ phức hợp: Xóa hoàn toàn một học phần (bao gồm tất cả thẻ bên trong)
 * Sử dụng writeBatch để đảm bảo tính toàn vẹn.
 */
export async function deleteStudySetCompletely(studySetId: string): Promise<void> {
  const batch = writeBatch(db);
  try {
    const cardsQuery = query(collection(db, "cards"), where("studySetId", "==", studySetId));
    const cardsSnapshot = await getDocs(cardsQuery);
    cardsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    const studySetRef = doc(db, "studySets", studySetId);
    batch.delete(studySetRef);

    await batch.commit();
  } catch (error) {
    console.error("Error deleting study set completely:", error);
    throw new Error("Không thể xóa học phần hoàn toàn");
  }
}

/**
 * Tác vụ phức hợp: Sao chép một học phần hoàn chỉnh (kể cả cards)
 */
export async function copyStudySetCompletely(
  originalStudySetId: string,
  newUserId: string,
  newTitle?: string
): Promise<string> {
  const batch = writeBatch(db);
  try {
    const originalStudySet = await getStudySet(originalStudySetId);
    const originalCards = await getCardsInStudySet(originalStudySetId);

    if (!originalStudySet) {
      throw new Error("Học phần gốc không tồn tại");
    }

    const newStudySetRef = doc(collection(db, "studySets"));
    const newStudySetId = newStudySetRef.id;

    const newStudySetData = {
      ...originalStudySet,
      userId: newUserId,
      title: newTitle || `Bản sao của ${originalStudySet.title}`,
      folderId: null,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (newStudySetData as any).id;

    batch.set(newStudySetRef, newStudySetData);

    originalCards.forEach(card => {
      const newCardRef = doc(collection(db, "cards"));
      const newCardData = { ...card, studySetId: newStudySetId };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (newCardData as any).id;
      batch.set(newCardRef, newCardData);
    });

    await batch.commit();
    return newStudySetId;
  } catch (error) {
    console.error("Error copying study set completely:", error);
    throw new Error("Không thể sao chép học phần");
  }
}