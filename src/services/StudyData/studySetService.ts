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
  folderId?: string | null; // Có thể null
  cardCount: number;
  // Các trường khác...
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


// Omit<T, K> là một Utility Type của TypeScript. 
// Nó tạo ra một kiểu mới bằng cách lấy kiểu T và loại bỏ đi các thuộc tính K
export async function updateStudySet(studySetId: string, data: Partial<Omit<StudySetData, 'id' | 'userId'>>): Promise<void> {
  try {
    await updateDoc(doc(db, "studySets", studySetId), data);
  } catch (error) {
    console.error("Error updating study set:", error);
    throw new Error("Không thể cập nhật học phần");
  }
}

/**
 * UPDATE - Di chuyển study set vào một folder (hoặc ra ngoài)
 * @param studySetId ID của học phần cần di chuyển
 * @param folderId ID của thư mục mới, hoặc null để đưa ra ngoài
 */

export async function deleteStudySet(studySetId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "studySets", studySetId));
  } catch (error) {
    console.error("Error deleting study set document:", error);
    throw new Error("Không thể xóa document học phần");
  }
}


/**
 * Cập nhật thông tin của một bộ thẻ và các thẻ của nó một cách tối ưu.
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
    cardsToUpdate: { id: string, data: Partial<CardData> }[],
    cardIdsToDelete: string[]
) {
    const batch = writeBatch(db);

    const studySetRef = doc(db, 'studySets', studySetId);
    batch.update(studySetRef, studySetUpdateData);

    cardsToCreate.forEach(cardData => {
        const cardRef = doc(collection(db, `studySets/${studySetId}/cards`));
        batch.set(cardRef, cardData);
    });

    cardsToUpdate.forEach(cardUpdate => {
        const cardRef = doc(db, `studySets/${studySetId}/cards`, cardUpdate.id);
        batch.update(cardRef, cardUpdate.data);
    });

    cardIdsToDelete.forEach(cardId => {
        const cardRef = doc(db, `studySets/${studySetId}/cards`, cardId);
        batch.delete(cardRef);
    });

    await batch.commit();
}
