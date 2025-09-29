// src/utils/hooks/useDocumentExists.tsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

type UseDocumentExistsResult = [
  exists: boolean | null, 
  loading: boolean, 
  error: Error | null
];

function useDocumentExists(collection: string, documentId: string): UseDocumentExistsResult {
  const [exists, setExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Nếu không có documentId, không làm gì cả
    if (!documentId) {
      setExists(false);
      setLoading(false);
      return;
    }

    const checkExistence = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const docRef = doc(db, collection, documentId);
        const docSnap = await getDoc(docRef);
        
        // Cập nhật state dựa trên kết quả
        setExists(docSnap.exists());

      } catch (err) {
        console.error("Error checking document existence:", err);
        setError(err as Error);
        setExists(false); // Coi như không tồn tại nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
    checkExistence();
  }, [collection, documentId]);

  return [exists, loading, error];
}

export default useDocumentExists;