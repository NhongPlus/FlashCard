// src/hooks/useFolders.ts

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Folder } from '@/@types/folder';

export function useFolders(userId: string | undefined) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setFolders([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Realtime listener
    const q = query(
      collection(db, 'folders'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const foldersData: Folder[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description || '',
            userId: data.userId,
            studySetCount: data.studySetCount || 0,
            color: data.color || '#4dabf7',
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          };
        });

        setFolders(foldersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to folders:', err);
        setError('Không thể tải danh sách thư mục');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { folders, loading, error };
}