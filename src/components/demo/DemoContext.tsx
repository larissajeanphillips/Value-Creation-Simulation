/**
 * DemoContext - Indicates when the app is in demo mode (click-through, no backend).
 * Used by useSocket and useAdmin to return mock implementations.
 */

import React, { createContext, useContext, useMemo } from 'react';

interface DemoContextValue {
  isDemo: boolean;
}

const defaultValue: DemoContextValue = { isDemo: false };

const DemoContext = createContext<DemoContextValue>(defaultValue);

interface DemoProviderProps {
  children: React.ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const value = useMemo(() => ({ isDemo: true }), []);
  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  return useContext(DemoContext);
}
