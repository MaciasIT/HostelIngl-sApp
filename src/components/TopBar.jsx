import React, { useRef } from "react";
import { ThemeSelector } from "./ThemeSelector"; // Import ThemeSelector

export function TopBar({ onFileLoaded, total, loaded, onExport, onAdminUpload, dueCount, kpis, theme, setTheme, density, setDensity }) {
  const fileRef = useRef(null);
  const pdfRef = useRef(null);
  return (
    <div className="sticky top-0 z-20 bg-card-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-black text-white grid place-items-center font-bold">EN</div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-text-base">Inglés para Hostelería</h1>
            <p className="text-xs text-gray-500 text-text-muted">Dataset {loaded ? `(${total} frases)` : "no cargado"} · Hoy: {kpis.todayMin} min · Acierto: {kpis.acc}% · 🔥 {kpis.streak}d</p>
          </div>
        </div>
        <div className="flex-1" />
        <span className="hidden md:inline-flex items-center text-xs text-gray-600 text-text-muted mr-2" title="Tarjetas vencidas hoy">🔁 Estudio hoy: <b className="ml-1">{dueCount}</b></span>
        <button onClick={() => fileRef.current?.click()} title="Importar JSON" className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm border-border hover:bg-background text-text-base">Importar JSON</button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const text = await f.text(); try { const data = JSON.parse(text); const normalized = Array.isArray(data) ? data : data.items || []; onFileLoaded(normalized); window.dispatchEvent(new CustomEvent('toast', { detail: 'Dataset importado' })); } catch { alert("Archivo JSON inválido"); } }} />
        <button onClick={() => onExport("json")} title="Exportar JSON" className="⬇ JSON" className="ml-2 px-3 py-1.5 rounded-xl border border-gray-300 text-sm border-border text-text-base">⬇ JSON</button>
        <button onClick={() => onExport("csv")} title="Exportar CSV" className="⬇ CSV" className="px-3 py-1.5 rounded-xl border border-gray-300 text-sm border-border text-text-base">⬇ CSV</button>
        <button onClick={() => pdfRef.current?.click()} title="Subir PDF (Admin)" className="⬆ Admin PDF" className="ml-2 px-3 py-1.5 rounded-xl border border-gray-300 text-sm border-border text-text-base">⬆ Admin PDF</button>
        <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; onAdminUpload(f); window.dispatchEvent(new CustomEvent('toast', { detail: 'PDF subido (simulación)' })); }} />
        <div className="h-6 w-px bg-gray-200 mx-2 bg-border" />
        <ThemeSelector /> {/* New ThemeSelector component */}
        <select value={density} onChange={(e)=> setDensity(e.target.value)} title="Densidad de interfaz" className="px-2 py-1.5 rounded-xl border border-gray-300 text-sm border-border text-text-base">
          <option value="comfortable">Cómodo</option>
          <option value="compact">Compacto</option>
        </select>
      </div>
    </div>
  );
}