import React from "react";

export function AudioBar({ voices, prefs, setPrefs, playing, onPlayAll, onStop, sample }){
  const voicesES = voices.filter(v => (v.lang||'').toLowerCase().startsWith('es'));
  const voicesEN = voices.filter(v => (v.lang||'').toLowerCase().startsWith('en'));
  return (
    <div className="max-w-6xl mx-auto px-4 py-3 mt-2 rounded-2xl bg-white border shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="text-sm font-medium mb-2 dark:text-slate-100">Audio+</div>
      <div className="grid gap-3 md:grid-cols-12 items-center">
        <div className="md:col-span-3">
          <label className="text-xs text-gray-500 dark:text-slate-400">Modo</label>
          <select value={prefs.mode} onChange={(e)=>setPrefs(p=>({...p, mode:e.target.value}))} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <option value="es_en">ES → EN</option>
            <option value="es">Solo ES</option>
            <option value="en">Solo EN</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-xs text-gray-500 dark:text-slate-400">Voz ES</label>
          <select value={prefs.voiceES || ''} onChange={(e)=>setPrefs(p=>({...p, voiceES:e.target.value||null}))} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <option value="">(Automática)</option>
            {voicesES.map(v=> <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-xs text-gray-500 dark:text-slate-400">Voz EN</label>
          <select value={prefs.voiceEN || ''} onChange={(e)=>setPrefs(p=>({...p, voiceEN:e.target.value||null}))} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <option value="">(Automática)</option>
            {voicesEN.map(v=> <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-xs text-gray-500 dark:text-slate-400">Velocidad: {prefs.rate.toFixed(2)}×</label>
          <input type="range" min={0.6} max={1.4} step={0.05} value={prefs.rate} onChange={(e)=>setPrefs(p=>({...p, rate: Number(e.target.value)}))} className="w-full" />
          <div className="mt-1 flex gap-2 text-xs">
            <button onClick={()=>sample('es')} className="px-2 py-1 rounded border dark:border-slate-700 dark:text-slate-100">Probar ES</button>
            <button onClick={()=>sample('en')} className="px-2 py-1 rounded border dark:border-slate-700 dark:text-slate-100">Probar EN</button>
          </div>
        </div>
        <div className="md:col-span-12 flex items-center gap-2">
          <button onClick={onPlayAll} className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-100">▶ Reproducir set filtrado</button>
          <button onClick={onStop} disabled={!playing} className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-100">⏹ Detener</button>
          {playing && <span className="text-xs text-gray-500 dark:text-slate-400">Reproduciendo…</span>}
        </div>
      </div>
    </div>
  );
}
