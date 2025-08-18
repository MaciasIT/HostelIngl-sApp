import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Claro' },
    { id: 'dark', name: 'Oscuro' },
    { id: 'blue-theme', name: 'Azul' },
    { id: 'green-theme', name: 'Verde' },
  ];

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    // Remove all theme classes from html element
    document.documentElement.classList.remove('light', 'dark', 'blue-theme', 'green-theme');
    // Add the selected theme class
    document.documentElement.classList.add(selectedTheme);
  };

  return (
    <select
      value={theme}
      onChange={handleThemeChange}
      title="Seleccionar Tema"
      className="px-2 py-1.5 rounded-xl border border-border text-sm bg-card-background text-text-base"
    >
      {themes.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
