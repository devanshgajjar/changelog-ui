"use client"

import { createContext, useContext, ReactNode, useState } from 'react'

interface AppContextType {
  refreshPendingCount: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const refreshPendingCount = async () => {
    // Implement your refresh logic here
  }

  return (
    <AppContext.Provider value={{ refreshPendingCount }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 