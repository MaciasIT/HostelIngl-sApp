import { useEffect, useState } from "react";
import { LS_THEME_KEY, LS_DENSITY_KEY } from "../utils/helpers";

export function useThemeDensity(){
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(LS_THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch { return 'light'; }
  });
  const [density, setDensity] = useState(() => { try { return localStorage.getItem(LS_DENSITY_KEY) || 'comfortable'; } catch { return 'comfortable'; } });

  useEffect(()=>{ try { localStorage.setItem(LS_THEME_KEY, theme); } catch {} document.documentElement.classList.toggle('dark', theme==='dark'); }, [theme]);
  useEffect(()=>{ try { localStorage.setItem(LS_DENSITY_KEY, density); } catch {} }, [density]);

  return { theme, setTheme, density, setDensity };
}
