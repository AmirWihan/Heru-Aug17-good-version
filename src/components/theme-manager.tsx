'use client';

import { useGlobalData } from '@/context/GlobalDataContext';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ThemeManager() {
  const { theme, isLoaded } = useGlobalData();

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.className = '';
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme, isLoaded]);

  return null; // This component doesn't render anything
}
