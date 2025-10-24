import React, { useEffect } from 'react'
import { useDocumentStore } from '../store/document'
import { ThemeProviderContext, type Theme } from '../contexts/theme-context'

type ThemeProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

export function ThemeProvider({
  children,
  storageKey = 'ade-ui-theme',
  ...props
}: ThemeProviderProps) {
  const { theme, toggleTheme } = useDocumentStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      if (newTheme !== theme) {
        toggleTheme()
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

