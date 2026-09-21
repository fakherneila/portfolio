import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// index.html applies the theme class before React mounts. Reading that class here keeps
// the first client render aligned with the anti-flash script instead of racing it.
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getThemeFromDocument(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getThemeFromDocument)

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    localStorage.setItem('portfolio-theme', nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  useEffect(() => {
    const storedTheme = localStorage.getItem('portfolio-theme')
    const hasStoredTheme = isTheme(storedTheme)

    if (hasStoredTheme) {
      setThemeState(storedTheme)
    } else {
      setThemeState(getThemeFromDocument())
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem('portfolio-theme')) {
        setThemeState(event.matches ? 'dark' : 'light')
      }
    }

    if (!hasStoredTheme) mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
