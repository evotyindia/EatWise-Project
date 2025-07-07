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
    // A placeholder to prevent layout shift and hydration errors.
    // It's a disabled button that is structurally similar to the final one.
    // A fixed width prevents content shift between "Light" and "Dark".
    return <Button variant="outline" size="sm" disabled className="w-[88px]" />;
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} className="w-[88px]">
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
