// src/services/studySetService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

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

// READ - Lấy tất cả study sets trong một folder
export async function getStudySetsInFolder(folderId: string): Promise<StudySetData[]> {
  try {
    const q = query(collection(db, "studySets"), where("folderId", "==", folderId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudySetData));
  } catch (error) {
    console.error("Error getting study sets in folder:", error);
    throw new Error("Không thể tải danh sách học phần");
  }
}

// UPDATE - Cập nhật thông tin của study set
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
export async function moveStudySetToFolder(studySetId: string, folderId: string | null): Promise<void> {
  try {
    await updateDoc(doc(db, "studySets", studySetId), { folderId: folderId });
  } catch (error) {
    console.error("Error moving study set:", error);
    throw new Error("Không thể di chuyển học phần");
  }
}

// DELETE - Chỉ xóa document study set (không xóa card)
// Thường được gọi bởi compositeService
export async function deleteStudySet(studySetId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "studySets", studySetId));
  } catch (error) {
    console.error("Error deleting study set document:", error);
    throw new Error("Không thể xóa document học phần");
  }
}