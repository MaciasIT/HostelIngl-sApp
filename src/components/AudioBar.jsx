import React from "react";

export function AudioBar({ voices, prefs, setPrefs, playing, onPlayAll, onStop, sample }){
  const voicesES = voices.filter(v => (v.lang||'').toLowerCase().startsWith('es'));
  const voicesEN = voices.filter(v => (v.lang||'').toLowerCase().startsWith('en'));
  return (
    <div className="max-w-6xl mx-auto px-4 py-3 mt-2 rounded-2xl bg-card-background border shadow-sm border-border">
      <div className="text-sm font-medium mb-2 text-text-base">Audio+</div>
      <div className="grid gap-3 md:grid-cols-12 items-center">
        <div className="md:col-span-3">
          <label htmlFor="audio-mode" className="text-xs text-gray-500 text-text-muted">Modo</label>
          <select id="audio-mode" value={prefs.mode} onChange={(e)=>setPrefs(p=>({...p, mode:e.target.value}))} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm border-border bg-card-background text-text-base">
            <option value="es_en">ES → EN</option>
            <option value="es">Solo ES</option>
            <option value="en">Solo EN</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="voice-es" className="text-xs text-gray-500 text-text-muted">Voz ES</label>
          <select id="voice-es" value={prefs.voiceES || ''} onChange={(e)=>setPrefs(p=>({...p, voiceES:e.target.value||null}))} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm border-border bg-card-background text-text-base">
            <option value=""> (Automática)</option>
            {voicesES.map(v=> <option key={v.name} value={v.name}>{v.name}</option>)} 
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="voice-en" className="text-xs text-gray-500 text-text-muted">Voz EN</label>
          <select id="voice-en" value={prefs.voiceEN || ''} onChange={(e)=>setPrefs(p=>({...p, voiceEN:e.target.value||null}))} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm border-border bg-card-background text-text-base">
            <option value="">(Automática)</option>
            {voicesEN.map(v=> <option key={v.name} value={v.name}>{v.name}</option>)} 
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="rate-slider" className="text-xs text-gray-500 text-text-muted">Velocidad: {prefs.rate.toFixed(2)}×</label>
          <input id="rate-slider" type="range" min={0.6} max={1.4} step={0.05} value={prefs.rate} onChange={(e)=>setPrefs(p=>({...p, rate: Number(e.target.value)}))} className="w-full" />
          <div className="mt-1 flex gap-2 text-xs">
            <button onClick={()=>sample('es')} aria-label="Probar voz en español" className="px-2 py-1 rounded border border-border text-text-base">Probar ES</button>
            <button onClick={()=>sample('en')} aria-label="Probar voz en inglés" className="px-2 py-1 rounded border border-border text-text-base">Probar EN</button>
          </div>
        </div>
        <div className="md:col-span-12 flex items-center gap-2">
          <button onClick={onPlayAll} aria-label="Reproducir todas las frases filtradas" className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm border-border hover:bg-background text-text-base">▶ Reproducir set filtrado</button>
          <button onClick={onStop} disabled={!playing} aria-label="Detener la reproducción" className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm disabled:opacity-50 border-border hover:bg-background text-text-base">⏹ Detener</button>
          {playing && <span className="text-xs text-gray-500 text-text-muted" aria-live="polite">Reproduciendo…</span>}
        </div>
      </div>
    </div>
  );
}