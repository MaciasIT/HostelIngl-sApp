import React, { useRef } from "react";

export function TopBar({ onFileLoaded, total, loaded, onExport, onAdminUpload, dueCount, kpis, theme, setTheme, density, setDensity }) {
  const fileRef = useRef(null);
  const pdfRef = useRef(null);
  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-black text-white grid place-items-center font-bold">EN</div>
          <div>
            <h1 className="text-lg font-semibold leading-tight dark:text-slate-100">Inglés para Hostelería</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">Dataset {loaded ? `(${total} frases)` : "no cargado"} · Hoy: {kpis.todayMin} min · Acierto: {kpis.acc}% · 🔥 {kpis.streak}d</p>
          </div>
        </div>
        <div className="flex-1" />
        <span className="hidden md:inline-flex items-center text-xs text-gray-600 dark:text-slate-300 mr-2" title="Tarjetas vencidas hoy">🔁 Estudio hoy: <b className="ml-1">{dueCount}</b></span>
        <button onClick={() => fileRef.current?.click()} title="Importar JSON" className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-100">Importar JSON</button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const text = await f.text(); try { const data = JSON.parse(text); const normalized = Array.isArray(data) ? data : data.items || []; onFileLoaded(normalized); window.dispatchEvent(new CustomEvent('toast', { detail: 'Dataset importado' })); } catch { alert("Archivo JSON inválido"); } }} />
        <button onClick={() => onExport("json")} title="Exportar JSON" className="ml-2 px-3 py-1.5 rounded-xl border border-gray-300 text-sm dark:border-slate-700 dark:text-slate-100">⬇ JSON</button>
        <button onClick={() => onExport("csv")} title="Exportar CSV" className="px-3 py-1.5 rounded-xl border border-gray-300 text-sm dark:border-slate-700 dark:text-slate-100">⬇ CSV</button>
        <button onClick={() => pdfRef.current?.click()} title="Subir PDF (Admin)" className="ml-2 px-3 py-1.5 rounded-xl border border-gray-300 text-sm dark:border-slate-700 dark:text-slate-100">⬆ Admin PDF</button>
        <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; onAdminUpload(f); window.dispatchEvent(new CustomEvent('toast', { detail: 'PDF subido (simulación)' })); }} />
        <div className="h-6 w-px bg-gray-200 mx-2 dark:bg-slate-700" />
        <button onClick={()=> setTheme(theme==='dark'?'light':'dark')} title={theme==='dark'?'Cambiar a claro':'Cambiar a oscuro'} className="px-2 py-1.5 rounded-xl border border-gray-300 text-sm dark:border-slate-700 dark:text-slate-100">{theme==='dark'?'☀️':'🌙'}</button>
        <select value={density} onChange={(e)=> setDensity(e.target.value)} title="Densidad de interfaz" className="px-2 py-1.5 rounded-xl border border-gray-300 text-sm dark:border-slate-700 dark:text-slate-100">
          <option value="comfortable">Cómodo</option>
          <option value="compact">Compacto</option>
        </select>
      </div>
    </div>
  );
}
