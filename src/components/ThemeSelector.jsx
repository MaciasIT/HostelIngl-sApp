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
    <div className="flex items-center gap-2">
      <label htmlFor="theme-selector" className="text-sm text-text-muted">Tema:</label>
      <select
        id="theme-selector"
        value={theme}
        onChange={handleThemeChange}
        aria-label="Seleccionar Tema"
        className="px-2 py-1.5 rounded-xl border border-border text-sm bg-card-background text-text-base"
      >
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
