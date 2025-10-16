// src/services/Folder/folderService.ts

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Folder, StudySetInFolder } from '@/@types/folder';

// ==================== CREATE ====================

export async function createFolder(
  userId: string,
  name: string,
  description?: string,
  color?: string
): Promise<string> {
  try {
    const folderRef = await addDoc(collection(db, 'folders'), {
      name,
      description: description || '',
      userId,
      studySetCount: 0,
      color: color || '#4dabf7',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return folderRef.id;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Không thể tạo thư mục');
  }
}

// ==================== READ ====================

export async function getFoldersByUser(userId: string): Promise<Folder[]> {
  try {
    const q = query(
      collection(db, 'folders'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        userId: data.userId,
        studySetCount: data.studySetCount || 0,
        color: data.color || '#4dabf7',
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as Folder;
    });
  } catch (error) {
    console.error('Error getting folders:', error);
    throw new Error('Không thể tải danh sách thư mục');
  }
}

export async function getFolder(folderId: string): Promise<Folder | null> {
  try {
    const docRef = doc(db, 'folders', folderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      userId: data.userId,
      studySetCount: data.studySetCount || 0,
      color: data.color || '#4dabf7',
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Folder;
  } catch (error) {
    console.error('Error getting folder:', error);
    throw new Error('Không thể tải thông tin thư mục');
  }
}

// ==================== UPDATE ====================

export async function updateFolder(
  folderId: string,
  data: Partial<Pick<Folder, 'name' | 'description' | 'color'>>
): Promise<void> {
  try {
    const folderRef = doc(db, 'folders', folderId);
    await updateDoc(folderRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating folder:', error);
    throw new Error('Không thể cập nhật thư mục');
  }
}

// ==================== DELETE ====================

export async function deleteFolder(folderId: string): Promise<void> {
  try {
    const batch = writeBatch(db);

    // 1. Get all study sets in this folder
    const studySetsQuery = query(
      collection(db, 'studySets'),
      where('folderId', '==', folderId)
    );
    const studySetsSnapshot = await getDocs(studySetsQuery);

    // 2. Move all study sets to unclassified (folderId = null)
    studySetsSnapshot.docs.forEach(docSnap => {
      batch.update(docSnap.ref, { folderId: null });
    });

    // 3. Delete folder
    const folderRef = doc(db, 'folders', folderId);
    batch.delete(folderRef);

    await batch.commit();
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw new Error('Không thể xóa thư mục');
  }
}

// ==================== STUDY SET OPERATIONS ====================

export async function getStudySetsInFolder(
  userId: string,
  folderId: string | null
): Promise<StudySetInFolder[]> {
  try {
    const q = folderId
      ? query(
          collection(db, 'studySets'),
          where('userId', '==', userId),
          where('folderId', '==', folderId)
        )
      : query(
          collection(db, 'studySets'),
          where('userId', '==', userId),
          where('folderId', '==', null)
        );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description || '',
        folderId: data.folderId || null,
        userId: data.userId,
        cardCount: data.cardCount || 0,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as StudySetInFolder;
    });
  } catch (error) {
    console.error('Error getting study sets:', error);
    throw new Error('Không thể tải danh sách bộ thẻ');
  }
}

export async function moveStudySetToFolder(
  studySetId: string,
  targetFolderId: string | null,
  sourceFolderId: string | null
): Promise<void> {
  try {
    // ✅ Validate target folder exists (if not null)
    if (targetFolderId) {
      const targetFolderRef = doc(db, 'folders', targetFolderId);
      const targetFolderSnap = await getDoc(targetFolderRef);
      if (!targetFolderSnap.exists()) {
        throw new Error('Target folder does not exist');
      }
    }

    const batch = writeBatch(db);

    // 1. Update study set's folderId
    const studySetRef = doc(db, 'studySets', studySetId);
    batch.update(studySetRef, { folderId: targetFolderId });

    // 2. Decrease source folder's studySetCount
    if (sourceFolderId) {
      const sourceFolderRef = doc(db, 'folders', sourceFolderId);
      const sourceFolderSnap = await getDoc(sourceFolderRef);
      if (sourceFolderSnap.exists()) {
        const currentCount = sourceFolderSnap.data().studySetCount || 0;
        batch.update(sourceFolderRef, {
          studySetCount: Math.max(0, currentCount - 1),
          updatedAt: serverTimestamp(),
        });
      }
    }

    // 3. Increase target folder's studySetCount
    if (targetFolderId) {
      const targetFolderRef = doc(db, 'folders', targetFolderId);
      const targetFolderSnap = await getDoc(targetFolderRef);
      if (targetFolderSnap.exists()) {
        const currentCount = targetFolderSnap.data().studySetCount || 0;
        batch.update(targetFolderRef, {
          studySetCount: currentCount + 1,
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Error moving study set:', error);
    throw new Error('Không thể di chuyển bộ thẻ');
  }
}

// ==================== BATCH OPERATIONS ====================

export async function moveMultipleStudySets(
  studySetIds: string[],
  targetFolderId: string | null,
  sourceFolderId: string | null
): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Update all study sets
    studySetIds.forEach(id => {
      const studySetRef = doc(db, 'studySets', id);
      batch.update(studySetRef, { folderId: targetFolderId });
    });

    // Update folder counts
    if (sourceFolderId) {
      const sourceFolderRef = doc(db, 'folders', sourceFolderId);
      const sourceFolderSnap = await getDoc(sourceFolderRef);
      if (sourceFolderSnap.exists()) {
        const currentCount = sourceFolderSnap.data().studySetCount || 0;
        batch.update(sourceFolderRef, {
          studySetCount: Math.max(0, currentCount - studySetIds.length),
          updatedAt: serverTimestamp(),
        });
      }
    }

    if (targetFolderId) {
      const targetFolderRef = doc(db, 'folders', targetFolderId);
      const targetFolderSnap = await getDoc(targetFolderRef);
      if (targetFolderSnap.exists()) {
        const currentCount = targetFolderSnap.data().studySetCount || 0;
        batch.update(targetFolderRef, {
          studySetCount: currentCount + studySetIds.length,
          updatedAt: serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Error moving multiple study sets:', error);
    throw new Error('Không thể di chuyển các bộ thẻ');
  }
}