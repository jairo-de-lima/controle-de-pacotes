"use client";

import { Switch } from "@/app/_components/ui/switch";
import { Label } from "@/app/_components/ui/label";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sincroniza o tema com o localStorage e a preferência do sistema
  useEffect(() => {
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && userPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // Alterna o tema e salva no localStorage
  const toggleTheme = () => {
    const isDark = !isDarkMode;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <div className="flex items-center justify-end space-x-2 p-2 absolute">
      <Switch id="switch-Mode" onClick={toggleTheme} />
      <Label htmlFor="switch-Mode">
        {isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
      </Label>
    </div>
  );
}
