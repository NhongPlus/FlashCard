// src/hooks/useStudySets.ts

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { StudySetInFolder } from '@/@types/folder';

export function useStudySets(userId: string | undefined) {
  const [studySets, setStudySets] = useState<StudySetInFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setStudySets([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Realtime listener for all study sets
    const q = query(
      collection(db, 'studySets'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const studySetsData: StudySetInFolder[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description || '',
            folderId: data.folderId || null,
            userId: data.userId,
            cardCount: data.cardCount || 0,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          };
        });

        setStudySets(studySetsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to study sets:', err);
        setError('Không thể tải danh sách bộ thẻ');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Helper function to get study sets by folder
  const getByFolder = (folderId: string | null) => {
    return studySets.filter(set => set.folderId === folderId);
  };

  // Helper function to get unclassified study sets
  const getUnclassified = () => {
    return studySets.filter(set => set.folderId === null);
  };

  return { 
    studySets, 
    loading, 
    error,
    getByFolder,
    getUnclassified
  };
}