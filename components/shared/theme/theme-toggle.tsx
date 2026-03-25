"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import {
  applyTheme,
  DEFAULT_THEME,
  getStoredTheme,
  type Theme,
} from "@/lib/theme";

type ThemeToggleProps = {
  mobile?: boolean;
};

export function ThemeToggle({ mobile = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const nextTheme = getStoredTheme();
    applyTheme(nextTheme);

    const frame = window.requestAnimationFrame(() => {
      setTheme(nextTheme);
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
  }, [mounted, theme]);

  function handleToggle() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  const isDark = mounted && theme === "dark";
  const themeLabel = isDark ? "Switch to light theme" : "Switch to dark theme";

  if (mobile) {
    return (
      <button
        type="button"
        aria-label={themeLabel}
        onClick={handleToggle}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-current px-5 py-3 text-sm font-medium transition-all duration-200"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span>{isDark ? "Light Theme" : "Dark Theme"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={themeLabel}
      onClick={handleToggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current transition-all duration-200 hover:cursor-pointer"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
