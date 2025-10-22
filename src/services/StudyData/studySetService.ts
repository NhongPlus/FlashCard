// src/services/StudyData/studySetService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";

import type { CardData, StudySetData } from "@/@types/learning";


// CREATE - Tạo một study set rỗng (chưa có card)
export async function createStudySet(data: Omit<StudySetData, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "studySets"), {
      ...data,
      isPublic: data.isPublic ?? true, // Default là public
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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

// UPDATE - Cập nhật study set (bao gồm cả isPublic)
export async function updateStudySet(
  studySetId: string,
  data: Partial<Omit<StudySetData, 'id' | 'userId'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, "studySets", studySetId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating study set:", error);
    throw new Error("Không thể cập nhật học phần");
  }
}

// ✅ NEW: Toggle public/private status
export async function toggleStudySetVisibility(studySetId: string): Promise<boolean> {
  try {
    const studySetRef = doc(db, "studySets", studySetId);
    const studySetSnap = await getDoc(studySetRef);
    
    if (!studySetSnap.exists()) {
      throw new Error("Study set không tồn tại");
    }
    
    const currentIsPublic = studySetSnap.data().isPublic ?? true;
    const newIsPublic = !currentIsPublic;
    
    await updateDoc(studySetRef, {
      isPublic: newIsPublic,
      updatedAt: serverTimestamp(),
    });
    
    return newIsPublic;
  } catch (error) {
    console.error("Error toggling study set visibility:", error);
    throw new Error("Không thể thay đổi trạng thái công khai");
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

// ✅ Updated: Cập nhật thông tin của một bộ thẻ và các thẻ của nó
export async function updateStudySetWithCards(
  studySetId: string,
  studySetUpdateData: Partial<StudySetData>,
  cardsToCreate: Omit<CardData, 'id' | 'studySetId'>[],
  cardsToUpdate: { id: string; data: Partial<CardData> }[],
  cardIdsToDelete: string[]
) {
  const batch = writeBatch(db);

  try {
    const studySetRef = doc(db, "studySets", studySetId);
    const studySetSnap = await getDoc(studySetRef);

    if (!studySetSnap.exists()) {
      throw new Error("Study set không tồn tại");
    }

    const currentCardCount = studySetSnap.data()?.cardCount || 0;
    const newCardCount = currentCardCount + cardsToCreate.length - cardIdsToDelete.length;

    batch.update(studySetRef, {
      ...studySetUpdateData,
      cardCount: Math.max(0, newCardCount),
      updatedAt: serverTimestamp(),
    });

    cardsToCreate.forEach(cardData => {
      const cardRef = doc(collection(db, "cards"));
      batch.set(cardRef, {
        ...cardData,
        studySetId: studySetId,
        createdAt: serverTimestamp(),
      });
    });

    cardsToUpdate.forEach(cardUpdate => {
      const cardRef = doc(db, "cards", cardUpdate.id);
      batch.update(cardRef, {
        ...cardUpdate.data,
        updatedAt: serverTimestamp(),
      });
    });

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

// ✅ NEW: Lấy tất cả public study sets (để search/explore)
export async function getPublicStudySets(limitCount: number = 50): Promise<StudySetData[]> {
  try {
    const q = query(
      collection(db, "studySets"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as StudySetData));
  } catch (error) {
    console.error("Error getting public study sets:", error);
    throw new Error("Không thể tải danh sách học phần công khai");
  }
}

// ✅ NEW: Search public study sets theo keyword
export async function searchPublicStudySets(keyword: string): Promise<StudySetData[]> {
  try {
    // Firestore không hỗ trợ full-text search, nên phải lấy tất cả rồi filter
    const q = query(
      collection(db, "studySets"),
      where("isPublic", "==", true),
      limit(100) // Giới hạn để tránh quá tải
    );
    
    const querySnapshot = await getDocs(q);
    const allPublicSets = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as StudySetData));
    
    // Filter theo keyword (case-insensitive)
    const lowerKeyword = keyword.toLowerCase();
    return allPublicSets.filter(set => 
      set.title.toLowerCase().includes(lowerKeyword) ||
      set.description?.toLowerCase().includes(lowerKeyword)
    );
  } catch (error) {
    console.error("Error searching public study sets:", error);
    throw new Error("Không thể tìm kiếm học phần");
  }
}