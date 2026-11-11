import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import type { CmsSectionKey } from '../types';

export function useSectionEditor<T>(section: CmsSectionKey, fallbackData: T) {
  const [data, setData] = useState<T>(fallbackData);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<T>(`/content/${section}`);
      if (res.data && typeof res.data === 'object') {
        setData({ ...fallbackData, ...res.data });
      }
    } catch {
      toast.error(`Failed to load ${section} content from server; using local defaults.`);
    } finally {
      setIsLoading(false);
      setInitialLoaded(true);
    }
  }, [section]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setIsSaving(true);
    try {
      const res = await api.put(`/content/${section}`, data);
      if (res.data?.success) {
        toast.success('Changes published live to Cognirex Solutions!');
      } else {
        toast.success('Section saved.');
      }
    } catch {
      toast.error('Failed to publish changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setData(fallbackData);
    toast.info('Reset fields in editor — click Save & Publish to push defaults live.');
  };

  return {
    data,
    setData,
    isLoading,
    initialLoaded,
    isSaving,
    save,
    reload: load,
    resetToDefaults,
  };
}
