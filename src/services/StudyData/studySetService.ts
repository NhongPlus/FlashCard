import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { CardData } from "./cardService";

// Interface của bạn
export interface StudySetData {
  id: string;
  title: string;
  description?: string;
  userId: string;
  folderId?: string | null;
  cardCount: number;
}

// CREATE - Tạo một study set rỗng (chưa có card)
export async function createStudySet(data: Omit<StudySetData, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "studySets"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating study set:", error);
    throw new Error("Không thể tạo học phần");
  }
}

// READ - Lấy study set theo ID
export async function getStudySet(studySetId: string): Promise<StudySetData | null> {
  try {
    const docSnap = await getDoc(doc(db, "studySets", studySetId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as StudySetData;
    }
    return null;
  } catch (error) {
    console.error("Error getting study set:", error);
    throw new Error("Không thể tải học phần");
  }
}

// UPDATE - Cập nhật study set
export async function updateStudySet(
  studySetId: string,
  data: Partial<Omit<StudySetData, 'id' | 'userId'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, "studySets", studySetId), data);
  } catch (error) {
    console.error("Error updating study set:", error);
    throw new Error("Không thể cập nhật học phần");
  }
}

// DELETE - Xóa study set document
export async function deleteStudySet(studySetId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "studySets", studySetId));
  } catch (error) {
    console.error("Error deleting study set document:", error);
    throw new Error("Không thể xóa document học phần");
  }
}

/**
 * ✅ FIXED: Cập nhật thông tin của một bộ thẻ và các thẻ của nó một cách tối ưu.
 * @param studySetId - ID của bộ thẻ cần cập nhật.
 * @param studySetUpdateData - Dữ liệu mới cho bộ thẻ.
 * @param cardsToCreate - Các thẻ mới cần tạo.
 * @param cardsToUpdate - Các thẻ cần cập nhật.
 * @param cardIdsToDelete - ID của các thẻ cần xóa.
 */
export async function updateStudySetWithCards(
  studySetId: string,
  studySetUpdateData: Partial<StudySetData>,
  cardsToCreate: Omit<CardData, 'id' | 'studySetId'>[],
  cardsToUpdate: { id: string; data: Partial<CardData> }[],
  cardIdsToDelete: string[]
) {
  const batch = writeBatch(db);

  try {
    // 1. ✅ FIXED: Lấy cardCount hiện tại từ document
    const studySetRef = doc(db, "studySets", studySetId);
    const studySetSnap = await getDoc(studySetRef);

    if (!studySetSnap.exists()) {
      throw new Error("Study set không tồn tại");
    }

    const currentCardCount = studySetSnap.data()?.cardCount || 0;
    const newCardCount = currentCardCount + cardsToCreate.length - cardIdsToDelete.length;

    // 2. ✅ FIXED: Update Study Set với cardCount mới và updatedAt
    batch.update(studySetRef, {
      ...studySetUpdateData,
      cardCount: Math.max(0, newCardCount),
      updatedAt: serverTimestamp(),
    });

    // 3. ✅ FIXED: Create new cards - dùng collection(db, "cards") thay vì subcollection path
    cardsToCreate.forEach(cardData => {
      const cardRef = doc(collection(db, "cards"));
      batch.set(cardRef, {
        ...cardData,
        studySetId: studySetId,
        createdAt: serverTimestamp(),
      });
    });

    // 4. Update existing cards
    cardsToUpdate.forEach(cardUpdate => {
      const cardRef = doc(db, "cards", cardUpdate.id);
      batch.update(cardRef, {
        ...cardUpdate.data,
        updatedAt: serverTimestamp(),
      });
    });

    // 5. Delete cards
    cardIdsToDelete.forEach(cardId => {
      const cardRef = doc(db, "cards", cardId);
      batch.delete(cardRef);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error updating study set with cards:", error);
    throw new Error("Không thể cập nhật bộ thẻ");
  }
}