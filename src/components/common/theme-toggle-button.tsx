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
}
