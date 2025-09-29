// src/utils/hooks/useUserProfile.tsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/config/firebase';
import useAuth from './useAuth';
import type { UserData } from '@/services/User/userService';

interface UseUserProfileResult {
  profile: UserData | null;
  loading: boolean;
  error: string | null;
  isProfileComplete: boolean;
  refetch: () => void;
}

function useUserProfile(): UseUserProfileResult {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed value để check profile có đầy đủ không
  const isProfileComplete = Boolean(
    profile?.displayName && 
    profile?.email && 
    profile?.dob
  );

  // Function để refetch data manually
  const refetch = () => {
    if (user?.uid) {
      setLoading(true);
      setError(null);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.uid) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Real-time listener cho user document
    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe: Unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserData;
            setProfile(userData);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
          setError('Lỗi khi tải thông tin người dùng');
          setProfile(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to user document:', err);
        setError('Không thể tải thông tin người dùng');
        setProfile(null);
        setLoading(false);
      }
    );

    // Cleanup listener khi component unmount hoặc user thay đổi
    return () => unsubscribe();
  }, [isAuthenticated, user?.uid]);

  return {
    profile,
    loading,
    error,
    isProfileComplete,
    refetch,
  };
}

export default useUserProfile;