// src/utils/hooks/usePublicStudySets.tsx

import { useState, useEffect, useCallback } from 'react';
import { getPublicStudySets, searchPublicStudySets } from '@/services';
import type { StudySetData } from '@/@types/learning';

interface UsePublicStudySetsResult {
  studySets: StudySetData[];
  loading: boolean;
  error: string | null;
  search: (keyword: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePublicStudySets(): UsePublicStudySetsResult {
  const [studySets, setStudySets] = useState<StudySetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial public study sets
  const loadPublicStudySets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicStudySets(50);
      setStudySets(data);
    } catch (err) {
      console.error('Error loading public study sets:', err);
      setError('Không thể tải danh sách học phần công khai');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search function
  const search = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      // If empty, reload all public sets
      await loadPublicStudySets();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchPublicStudySets(keyword);
      setStudySets(results);
    } catch (err) {
      console.error('Error searching study sets:', err);
      setError('Không thể tìm kiếm học phần');
    } finally {
      setLoading(false);
    }
  }, [loadPublicStudySets]);

  // Refresh function
  const refresh = useCallback(async () => {
    await loadPublicStudySets();
  }, [loadPublicStudySets]);

  // Initial load
  useEffect(() => {
    loadPublicStudySets();
  }, [loadPublicStudySets]);

  return {
    studySets,
    loading,
    error,
    search,
    refresh,
  };
}