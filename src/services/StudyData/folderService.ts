// src/services/folderService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Interface đã được đơn giản hóa, không còn studySetIds
export interface FolderData {
  id: string;
  name: string;
  description?: string;
  userId: string;
}

// CREATE - Tạo folder mới
export async function createFolder(data: Omit<FolderData, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "folders"), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Không thể tạo thư mục");
  }
}

// READ - Lấy folder theo ID
export async function getFolder(folderId: string): Promise<FolderData | null> {
  try {
    const docSnap = await getDoc(doc(db, "folders", folderId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FolderData;
    }
    return null;
  } catch (error) {
    console.error("Error getting folder:", error);
    throw new Error("Không thể tải thư mục");
  }
}

// READ - Lấy tất cả folders của user
export async function getUserFolders(userId: string): Promise<FolderData[]> {
  try {
    const q = query(collection(db, "folders"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FolderData));
  } catch (error) {
    console.error("Error getting user folders:", error);
    throw new Error("Không thể tải danh sách thư mục");
  }
}

// UPDATE - Cập nhật folder (ví dụ: đổi tên)
export async function updateFolder(folderId: string, data: Partial<Omit<FolderData, 'id' | 'userId'>>): Promise<void> {
  try {
    await updateDoc(doc(db, "folders", folderId), data);
  } catch (error) {
    console.error("Error updating folder:", error);
    throw new Error("Không thể cập nhật thư mục");
  }
}

/**
 * DELETE - Xóa một thư mục và đưa tất cả các học phần bên trong ra ngoài (folderId = null)
 * Sử dụng writeBatch để đảm bảo tính toàn vẹn.
 */
export async function deleteFolderAndOrphanStudySets(folderId: string): Promise<void> {
  const batch = writeBatch(db);
  try {
    // 1. Tìm tất cả study sets trong folder này
    const studySetsQuery = query(collection(db, "studySets"), where("folderId", "==", folderId));
    const studySetsSnapshot = await getDocs(studySetsQuery);

    // 2. Cập nhật folderId của chúng thành null trong batch
    studySetsSnapshot.forEach(doc => {
      batch.update(doc.ref, { folderId: null });
    });

    // 3. Xóa folder trong batch
    const folderRef = doc(db, "folders", folderId);
    batch.delete(folderRef);

    // 4. Commit batch
    await batch.commit();
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error("Không thể xóa thư mục");
  }
}