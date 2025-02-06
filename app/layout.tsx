"use client"

import "./globals.css"
import { LogProvider } from "../contexts/LogContext"
import { AppProvider } from "../contexts/AppContext"
import Link from "next/link"
import { cn } from "../lib/utils"
import { usePathname } from "next/navigation"
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="flex items-center gap-4">
      <Link 
        href="/pending" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-gray-900",
          pathname === '/pending' ? 'text-gray-900' : 'text-gray-500'
        )}
      >
        Pending
      </Link>
      <Link 
        href="/approved" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-gray-900",
          pathname === '/approved' ? 'text-gray-900' : 'text-gray-500'
        )}
      >
        Approved
      </Link>
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("h-full bg-white", inter.className)}>
      <body className="min-h-screen bg-white">
        <AppProvider>
          <LogProvider>
            <div className="min-h-screen">
              <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="max-w-screen-2xl mx-auto flex h-16 items-center px-10 sm:justify-between">
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/" 
                      className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Changelog Manager
                    </Link>
                    <Navigation />
                  </div>
                </div>
              </header>
              <main className="w-full">
                <div className="max-w-screen-2xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </LogProvider>
        </AppProvider>
      </body>
    </html>
  )
} 