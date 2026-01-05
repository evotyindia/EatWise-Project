
"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

declare global {
  interface Window {
    Android?: {
      onThemeChanged: (theme: string) => void
    }
  }
}

interface ThemeContextProps {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

function sendThemeToAndroid(theme: string) {
  console.log("Attempting to send theme to Android: " + theme)
  if (typeof window !== "undefined" && window.Android && typeof window.Android.onThemeChanged === "function") {
    window.Android.onThemeChanged(theme)
    console.log("Successfully called Android.onThemeChanged.")
  } else {
    console.error("The Android interface is not available on the window object.")
  }
}

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      setTheme("dark") // Default to dark mode
    }
  }, [])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
    sendThemeToAndroid(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
