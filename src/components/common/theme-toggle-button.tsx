"use client"

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // The button is disabled until mounted, so this only runs on the client
    setTheme(theme === "light" ? "dark" : "light")
  }

  // To fix hydration errors, we render a disabled button on the server and during
  // the initial client render. After the component mounts on the client, it becomes
  // enabled and its content dynamically reflects the current theme.
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      disabled={!mounted}
      className="w-[88px]"
    >
      {mounted && theme === "light" ? (
        <>
          <Moon />
          <span>Dark</span>
        </>
      ) : (
        // This is the default state shown on server and initial client render
        <>
          <Sun />
          <span>Light</span>
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
