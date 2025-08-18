

import toast from 'react-hot-toast';

// ---------- Constantes/Utils ----------
export const LS_FAVS_KEY = "hosteleria:favs";
export const LS_SRS_KEY = "hosteleria:srs"; // id -> {ease, interval, reps, due}
export const LS_METRICS_KEY = "hosteleria:metrics"; // métricas de estudio
export const LS_AUDIO_KEY = "hosteleria:audio"; // { rate, mode, voiceES, voiceEN }
export const LS_THEME_KEY = "hosteleria:theme"; // 'light' | 'dark'
export const LS_DENSITY_KEY = "hosteleria:density"; // 'comfortable' | 'compact'

export function classNames(...xs) { return xs.filter(Boolean).join(" "); }
export function uniqueSorted(arr) { return Array.from(new Set(arr)).filter(Boolean).sort((a, b) => a.localeCompare(b)); }
export function pickRandom(arr, n) { const copy=[...arr], out=[]; while(copy.length && out.length<n){ out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); } return out; }

// --- CSV helpers (arregla comillas y saltos de línea) ---
function csvEscape(val) {
  const s = String(val ?? "");
  return '"' + s.replace(/"/g, '""') + '"';
}
export function toCSVString(items) {
  const header = "id,categoria,es,en,fuente";
  const rows = items.map(e => [e.id, csvEscape(e.categoria||""), csvEscape(e.es||""), csvEscape(e.en||""), csvEscape(e.fuente||"")].join(","));
  return [header, ...rows].join("\n");
}
export function exportFile(items, type = "json") {
  if (type === "json") {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="export.json"; a.click(); URL.revokeObjectURL(url);
    toast.success('Export JSON generado');
  } else if (type === "csv") {
    const csv = toCSVString(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="export.csv"; a.click(); URL.revokeObjectURL(url);
    toast.success('Export CSV generado');
  }
}

export const nowMs = () => Date.now();
export const daysToMs = (d) => d * 24 * 60 * 60 * 1000;
export const todayISO = () => new Date().toISOString().slice(0,10);

export function loadSRS() { try { return JSON.parse(localStorage.getItem(LS_SRS_KEY) || "{}"); } catch { return {}; } }
export function saveSRS(srs) { try { localStorage.setItem(LS_SRS_KEY, JSON.stringify(srs)); } catch {} }

export function loadMetrics(){
  try {
    const m = JSON.parse(localStorage.getItem(LS_METRICS_KEY) || "null");
    const tISO = todayISO();
    if (!m || !m.today || m.today.dateISO !== tISO) {
      return { lastStudyISO: m?.lastStudyISO || null, streak: m?.streak || 0, today: { dateISO: tISO, seconds: 0, reviews: 0, correct: 0 }, total: { seconds: m?.total?.seconds || 0, reviews: m?.total?.reviews || 0, correct: m?.total?.correct || 0 } };
    }
    return m;
  } catch { return { lastStudyISO: null, streak: 0, today: { dateISO: todayISO(), seconds: 0, reviews: 0, correct: 0 }, total: { seconds: 0, reviews: 0, correct: 0 } }; }
}
export function saveMetrics(m){ try { localStorage.setItem(LS_METRICS_KEY, JSON.stringify(m)); } catch {} }

// SM-2 simplificado
export function reviewSM2(card, quality) {
  const q = Math.max(0, Math.min(5, quality));
  let { ease=2.5, interval=0, reps=0 } = card || {};
  if (q < 3) { reps = 0; interval = 1; }
  else { ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)); if (ease < 1.3) ease = 1.3; if (reps === 0) interval = 1; else if (reps === 1) interval = 6; else interval = Math.round(interval * ease); reps += 1; }
  const due = nowMs() + daysToMs(interval);
  return { ease, interval, reps, due };
}

export function densityCls(density, comfy, compact){ return density==='compact' ? compact : comfy; }
