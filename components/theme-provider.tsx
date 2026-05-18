'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // next-themes injects an inline <script> to prevent theme flicker on SSR.
  // React 19 warns about script tags inside components — this is a known
  // false positive. The script runs correctly during SSR hydration.
  React.useEffect(() => {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Encountered a script tag while rendering React component')
      ) {
        return;
      }
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
