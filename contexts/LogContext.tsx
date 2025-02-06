"use client"

import { createContext, useContext, ReactNode } from 'react'

interface LogContextType {
  // Add your context types here
}

const LogContext = createContext<LogContextType | undefined>(undefined)

export function LogProvider({ children }: { children: ReactNode }) {
  return (
    <LogContext.Provider value={{}}>
      {children}
    </LogContext.Provider>
  )
}

export function useLog() {
  const context = useContext(LogContext)
  if (context === undefined) {
    throw new Error('useLog must be used within a LogProvider')
  }
  return context
} 