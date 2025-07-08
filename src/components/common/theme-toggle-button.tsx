<<<<<<< HEAD

"use client"

import React, { useState, useEffect } from "react"; // Consolidated and corrected React import
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
  }, []) // Empty dependency array ensures this runs once on mount, on the client

  if (!mounted) {
    // Render a simple div placeholder with the same dimensions as the button
    // to prevent layout shift and minimize differences from server render.
    // The Button with size="icon" and h-9 w-9 classes results in a 36px by 36px element.
    return <div className="h-9 w-9" />; 
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
=======
"use client"

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/theme-context";
import './theme-toggle-button.css';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to prevent layout shift
    return <div style={{ width: '60px', height: '32px' }} />;
  }

  const isChecked = theme === 'dark';

  const handleChange = () => {
    setTheme(isChecked ? 'light' : 'dark');
  };

  return (
    <label className="switch">
      <input
        className="switch__input"
        type="checkbox"
        role="switch"
        name="dark"
        checked={isChecked}
        onChange={handleChange}
      />
      <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
        <use href="#light" />
      </svg>
      <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
        <use href="#dark" />
      </svg>
      <span className="switch__inner"></span>
      <span className="switch__inner-icons">
        <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
          <use href="#light" />
        </svg>
        <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
          <use href="#dark" />
        </svg>
      </span>
      <span className="switch__sr">Toggle Theme</span>
    </label>
  );
>>>>>>> finalprotest
}
