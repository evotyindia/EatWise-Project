
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Ensure button only renders client-side where theme is determined
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Button variant="outline" size="icon" className="h-9 w-9 opacity-0" disabled />; // Placeholder for SSR
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Need to export React for the useEffect.
import React from 'react';
