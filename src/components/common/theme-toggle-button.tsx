"use client"

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // A placeholder to prevent layout shift.
    return <div className="h-9 w-20 rounded-md" />;
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {theme === "light" ? (
        <>
          <Moon />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun />
          <span>Light</span>
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
