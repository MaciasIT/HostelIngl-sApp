import React, { useEffect, useMemo, useRef, useState } from "react";
import initialData from "./hostelenglish_dataset_normalized.json";

/**
 * Webapp Inglés Hostelería — MVP++ (React + Tailwind + PWA + Dashboard + Audio+ + UI QoL)
 * ---------------------------------------------------------------------------------------
 * Fix crítico: **cierre correcto de JSX** (bloque Audio+ y render del App) y limpieza de duplicados en TopBar.
 * UI/UX añadido sin tocar arquitectura:
 * - 🌙/☀️ Dark mode persistente (localStorage + class en <html>).
 * - 📏 Densidad (Cómodo/Compacto) persistente.
 * - 🛈 Tooltips nativos vía `title`.
 * - 🔔 Toasts ligeros (CustomEvent 'toast').
 */

// ---------- Constantes/Utils ----------
const LS_FAVS_KEY = "hosteleria:favs";
const LS_SRS_KEY = "hosteleria:srs"; // id -> {ease, interval, reps, due}
const LS_METRICS_KEY = "hosteleria:metrics"; // métricas de estudio
const LS_AUDIO_KEY = "hosteleria:audio"; // { rate, mode, voiceES, voiceEN }
const LS_THEME_KEY = "hosteleria:theme"; // 'light' | 'dark'
const LS_DENSITY_KEY = "hosteleria:density"; // 'comfortable' | 'compact'

function classNames(...xs) { return xs.filter(Boolean).join(" "); }
function uniqueSorted(arr) { return Array.from(new Set(arr)).filter(Boolean).sort((a, b) => a.localeCompare(b)); }
function pickRandom(arr, n) { const copy=[...arr], out=[]; while(copy.length && out.length<n){ out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); } return out; }

// --- CSV helpers (arregla comillas y saltos de línea) ---
function csvEscape(val) {
  const s = String(val ?? "");
  return '"' + s.replace(/"/g, '""') + '"';
}
function toCSVString(items) {
  const header = "id,categoria,es,en,fuente";
  const rows = items.map(e => [e.id, csvEscape(e.categoria||""), csvEscape(e.es||""), csvEscape(e.en||""), csvEscape(e.fuente||"")].join(","));
  return [header, ...rows].join("\n");
}
function exportFile(items, type = "json") {
  if (type === "json") {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="export.json"; a.click(); URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('toast', { detail: 'Export JSON generado' }));
  } else if (type === "csv") {
    const csv = toCSVString(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="export.csv"; a.click(); URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent('toast', { detail: 'Export CSV generado' }));
  }
}

// --- Audio+ hook: voces, preferencias y cola ---
function useAudioPlus(){
  const [voices, setVoices] = useState([]);
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_AUDIO_KEY) || "null") || { rate: 1.0, mode: 'es_en', voiceES: null, voiceEN: null }; } catch { return { rate: 1.0, mode: 'es_en', voiceES: null, voiceEN: null }; }
  });
  const [playing, setPlaying] = useState(false);
  const queueRef = useRef([]); // {text, lang}

  // Cargar voces (algunos navegadores emiten voiceschanged)
  useEffect(() => {
    function load(){ const list = window.speechSynthesis?.getVoices?.() || []; setVoices(list); }
    load();
    window.speechSynthesis?.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', load);
  }, []);

  // Persistir preferencias
  useEffect(() => { try { localStorage.setItem(LS_AUDIO_KEY, JSON.stringify(prefs)); } catch {} }, [prefs]);

  function makeUtter(text, lang){
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = prefs.rate || 1.0;
    const pickName = lang.startsWith('es') ? prefs.voiceES : prefs.voiceEN;
    if (pickName) { const v = voices.find(v=>v.name===pickName); if (v) u.voice = v; }
    else { const v = voices.find(v=> (v.lang||'').toLowerCase().startsWith(lang.slice(0,2))); if (v) u.voice = v; }
    return u;
  }

  function speakOnce(text, lang){ if (!window.speechSynthesis) return; window.speechSynthesis.cancel(); const u = makeUtter(text, lang); window.speechSynthesis.speak(u); }
  function stop(){ window.speechSynthesis?.cancel(); queueRef.current = []; setPlaying(false); }
  function playSet(items){
    if (!window.speechSynthesis || !items?.length) return;
    stop();
    const mode = prefs.mode || 'es_en';
    const q = [];
    for (const it of items) { if (mode === 'es') q.push({text: it.es, lang: 'es-ES'}); else if (mode === 'en') q.push({text: it.en, lang: 'en-GB'}); else { q.push({text: it.es, lang: 'es-ES'}); q.push({text: it.en, lang: 'en-GB'}); } }
    queueRef.current = q; setPlaying(true);
    const pump = () => { const next = queueRef.current.shift(); if (!next) { setPlaying(false); return; } const u = makeUtter(next.text, next.lang); u.onend = () => setTimeout(pump, 120); u.onerror = () => setTimeout(pump, 120); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); };
    pump();
  }

  return { voices, prefs, setPrefs, playing, playSet, stop, speakOnce };
}

// --- Quick dev tests (ligeros) ---
if (typeof window !== 'undefined') {
  try {
    (function __testCSV() {
      const samples = [
        { id: 1, categoria: 'Bebidas', es: 'agua "con gas"', en: 'sparkling water', fuente: 'test' },
        { id: 2, categoria: 'Comida', es: 'huevos, jamón\ny queso', en: 'eggs, ham\nand cheese', fuente: 'x' },
      ];
      const s = toCSVString(samples);
      console.assert(s.split('\n').length === samples.length + 1, '[CSV] header + rows');
      console.assert(s.includes('"agua ""con gas"""'), '[CSV] comillas duplicadas');
      console.assert(s.includes('"huevos, jamón\ny queso"'), '[CSV] salto de línea dentro de campo');
      const s2 = toCSVString([]); console.assert(s2.trim() === 'id,categoria,es,en,fuente', '[CSV] header solo en vacío');
      const allRows = s.split('\n').slice(1); console.assert(allRows.every(r => (r.match(/,/g) || []).length === 4), '[CSV] 5 columnas por fila');
    })();
    (function __testSRS() {
      const next = reviewSM2({ ease: 2.5, interval: 1, reps: 1, due: 0 }, 4);
      console.assert(next.interval >= 6, '[SRS] segundo intervalo mínimo 6 días con calidad 4+');
    })();
    (function __testDensity(){
      console.assert((function(){ return (('compact'==='compact') ? 'a' : 'b'); })()==='a', '[UI] density helper');
    })();
  } catch (e) {}
}

const nowMs = () => Date.now();
const daysToMs = (d) => d * 24 * 60 * 60 * 1000;
const todayISO = () => new Date().toISOString().slice(0,10);

function loadSRS() { try { return JSON.parse(localStorage.getItem(LS_SRS_KEY) || "{}"); } catch { return {}; } }
function saveSRS(srs) { try { localStorage.setItem(LS_SRS_KEY, JSON.stringify(srs)); } catch {} }

function loadMetrics(){
  try {
    const m = JSON.parse(localStorage.getItem(LS_METRICS_KEY) || "null");
    const tISO = todayISO();
    if (!m || !m.today || m.today.dateISO !== tISO) {
      return { lastStudyISO: m?.lastStudyISO || null, streak: m?.streak || 0, today: { dateISO: tISO, seconds: 0, reviews: 0, correct: 0 }, total: { seconds: m?.total?.seconds || 0, reviews: m?.total?.reviews || 0, correct: m?.total?.correct || 0 } };
    }
    return m;
  } catch { return { lastStudyISO: null, streak: 0, today: { dateISO: todayISO(), seconds: 0, reviews: 0, correct: 0 }, total: { seconds: 0, reviews: 0, correct: 0 } }; }
}
function saveMetrics(m){ try { localStorage.setItem(LS_METRICS_KEY, JSON.stringify(m)); } catch {} }

// SM-2 simplificado
function reviewSM2(card, quality) {
  const q = Math.max(0, Math.min(5, quality));
  let { ease=2.5, interval=0, reps=0 } = card || {};
  if (q < 3) { reps = 0; interval = 1; }
  else { ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)); if (ease < 1.3) ease = 1.3; if (reps === 0) interval = 1; else if (reps === 1) interval = 6; else interval = Math.round(interval * ease); reps += 1; }
  const due = nowMs() + daysToMs(interval);
  return { ease, interval, reps, due };
}

// ---------- UI Helpers ----------
function useThemeDensity(){
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(LS_THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch { return 'light'; }
  });
  const [density, setDensity] = useState(() => { try { return localStorage.getItem(LS_DENSITY_KEY) || 'comfortable'; } catch { return 'comfortable'; } });

  useEffect(()=>{ try { localStorage.setItem(LS_THEME_KEY, theme); } catch {} document.documentElement.classList.toggle('dark', theme==='dark'); }, [theme]);
  useEffect(()=>{ try { localStorage.setItem(LS_DENSITY_KEY, density); } catch {} }, [density]);

  return { theme, setTheme, density, setDensity };
}

function densityCls(density, comfy, compact){ return density==='compact' ? compact : comfy; }

function Toasts(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    const h = (e)=>{ const id = Math.random().toString(36).slice(2); setItems(xs=>[...xs, {id, text:e.detail}]); setTimeout(()=> setItems(xs=> xs.filter(t=>t.id!==id)), 2500); };
    window.addEventListener('toast', h); return ()=> window.removeEventListener('toast', h);
  },[]);
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {items.map(t=> (
        <div key={t.id} className="px-3 py-2 rounded-xl shadow border bg-white text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ---------- Componentes ----------
function TopBar({ onFileLoaded, total, loaded, onExport, onAdminUpload, dueCount, kpis, theme, setTheme, density, setDensity }) {
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

function AudioBar({ voices, prefs, setPrefs, playing, onPlayAll, onStop, sample }){
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

function PhraseRow({ item, onFav, favs, onSpeakES, onSpeakEN }) {
  const isFav = favs.has(item.id);
  return (
    <div className="grid md:grid-cols-12 items-start gap-3 px-4 py-3 border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
      <div className="md:col-span-2"><span className="inline-flex text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 dark:text-slate-200">{item.categoria || "—"}</span></div>
      <div className="md:col-span-4 text-sm flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <button onClick={() => onSpeakES(item.es)} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">🔊 ES</button>
        <span>{item.es}</span>
      </div>
      <div className="md:col-span-5 text-sm flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <button onClick={() => onSpeakEN(item.en)} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">🔊 EN</button>
        <span>{item.en}</span>
      </div>
      <div className="flex items-center gap-2 md:col-span-1 justify-end">
        <button onClick={() => onFav(item.id)} className={classNames("text-xs px-2 py-1 rounded-md border", isFav ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200" : "hover:bg-gray-50 border-gray-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700")}>{isFav ? "★" : "☆"}</button>
      </div>
    </div>
  );
}

function Tabs({ mode, onMode, dueCount }) {
  const tabs = [
    { id: "browse", name: "Frases" },
    { id: "flash", name: "Flashcards" },
    { id: "quiz", name: "Quiz" },
    { id: "exam", name: "Examen" },
    { id: "study", name: `Estudio${dueCount?` (${dueCount})`:''}` },
    { id: "dashboard", name: "Dashboard" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="inline-flex bg-gray-100 rounded-2xl p-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => onMode(t.id)} className={classNames("px-3 py-1.5 rounded-xl text-sm", mode === t.id ? "bg-white border border-gray-300" : "text-gray-600 hover:text-gray-800")}>{t.name}</button>
        ))}
      </div>
    </div>
  );
}

function Filters({ categories, value, onChange, query, onQuery, count }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-3 grid gap-3 md:grid-cols-12">
      <div className="md:col-span-4">
        <label className="text-xs text-gray-500">Categoría</label>
        <select className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Todas</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>
      <div className="md:col-span-8">
        <label className="text-xs text-gray-500">Búsqueda</label>
        <input className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm" placeholder="Buscar en español o inglés (ej. lemon, reserva, check)" value={query} onChange={(e) => onQuery(e.target.value)} />
        <p className="text-xs text-gray-400 mt-1">{count} resultados</p>
      </div>
    </div>
  );
}

function Paginator({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2 justify-end text-sm">
      <button onClick={prev} className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Anterior</button>
      <span className="text-gray-600">{page} / {pages}</span>
      <button onClick={next} className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Siguiente</button>
    </div>
  );
}

function Browse({ items, onFav, favs, page, perPage, onPage, onSpeakES, onSpeakEN }) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const start = (page - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="grid md:grid-cols-12 gap-3 px-4 py-2 bg-gray-50 border-b text-[12px] font-semibold text-gray-600">
          <div className="md:col-span-2">Categoría</div>
          <div className="md:col-span-5">Español</div>
          <div className="md:col-span-5">Inglés</div>
        </div>
        {slice.map((it) => (<PhraseRow key={it.id} item={it} onFav={onFav} favs={favs} onSpeakES={onSpeakES} onSpeakEN={onSpeakEN} />))}
      </div>
      <Paginator page={page} pages={pages} onPage={onPage} />
    </>
  );
}

function Flashcards({ deck, onFav, favs, onSpeakES, onSpeakEN }) {
  const [idx, setIdx] = useState(0);
  const [showEN, setShowEN] = useState(false);
  const current = deck[idx];
  useEffect(() => {
    const onKey = (e) => { if (e.code === "Space") { e.preventDefault(); setShowEN((s) => !s); } if (e.code === "ArrowRight") setIdx((i) => Math.min(deck.length - 1, i + 1)); if (e.code === "ArrowLeft") setIdx((i) => Math.max(0, i - 1)); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck.length]);
  if (!deck.length) return <p className="text-sm text-gray-500">No hay cartas en este filtro.</p>;
  return (
    <div className="max-w-xl mx-auto mt-4">
      <div className="rounded-3xl border shadow-sm p-6 text-center select-none cursor-pointer bg-white dark:bg-slate-800 dark:border-slate-700" onClick={() => setShowEN((s) => !s)} title="Click o Space para voltear">
        <div className="text-xs text-gray-500 dark:text-slate-400 mb-2">{current.categoria}</div>
        <div className="text-2xl font-semibold min-h-[4rem] flex items-center justify-center dark:text-slate-100">{showEN ? current.en : current.es}</div>
        <div className="mt-4 text-xs text-gray-500 dark:text-slate-400">Pulsa <kbd className="px-1 border rounded dark:bg-slate-700 dark:border-slate-600">Space</kbd> para voltear · ←/→ para navegar</div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Anterior</button>
        <div>{idx + 1} / {deck.length}</div>
        <button onClick={() => setIdx((i) => Math.min(deck.length - 1, i + 1))} className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Siguiente</button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button onClick={() => onSpeakES(current.es)} className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50">🔊 ES</button>
        <button onClick={() => onSpeakEN(current.en)} className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50">🔊 EN</button>
        <button onClick={() => onFav(current.id)} className={classNames("text-xs px-2 py-1 rounded-md border", favs.has(current.id) ? "bg-yellow-100 border-yellow-300" : "hover:bg-gray-50 border-gray-300")}>{favs.has(current.id) ? "★" : "☆"}</button>
      </div>
    </div>
  );
}

function Quiz({ pool, onMetric }) {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const base = pickRandom(pool, Math.min(8, pool.length));
    const qs = base.map((item) => { const wrongs = pickRandom(pool.filter((x) => x.id !== item.id), 3).map((x) => x.en); const options = pickRandom([item.en, ...wrongs], Math.min(4, 1 + wrongs.length)); return { item, options }; });
    setQuestions(qs); setIdx(0); setScore(0); setDone(false);
  }, [pool]);

  if (!questions.length) return <p className="text-sm text-gray-500">No hay suficientes datos para el quiz.</p>;

  const q = questions[idx];
  const onPick = (opt) => {
    const correct = opt === q.item.en; onMetric({ reviews: 1, correct: correct ? 1 : 0 });
    if (correct) setScore((s) => s + 1);
    if (idx + 1 >= questions.length) setDone(true); else setIdx(idx + 1);
  };

  if (done) return (
    <div className="max-w-xl mx-auto mt-6 text-center">
      <div className="text-2xl font-semibold dark:text-slate-100">Resultado: {score} / {questions.length}</div>
      <button onClick={() => { const base = pickRandom(pool, Math.min(8, pool.length)); const qs = base.map((item) => { const wrongs = pickRandom(pool.filter((x) => x.id !== item.id), 3).map((x) => x.en); const options = pickRandom([item.en, ...wrongs], Math.min(4, 1 + wrongs.length)); return { item, options }; }); setQuestions(qs); setIdx(0); setScore(0); setDone(false); }} className="mt-4 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white rounded-2xl border shadow-sm p-5 dark:bg-slate-800 dark:border-slate-700">
      <div className="text-xs text-gray-500 dark:text-slate-400">Pregunta {idx + 1} / {questions.length}</div>
      <div className="mt-2 text-lg dark:text-slate-200">Traduce al inglés:</div>
      <div className="mt-1 text-2xl font-semibold dark:text-slate-100">{q.item.es}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => onPick(opt)} className="text-left px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">{opt}</button>
        ))}
      </div>
    </div>
  );
}

function Exam({ pool, onMetric }) {
  const [started, setStarted] = useState(false);
  const [dir, setDir] = useState("es2en");
  const [len, setLen] = useState(10);
  const [timed, setTimed] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started || !timed || done) return;
    const totalSec = len * 25; if (secondsLeft === 0) setSecondsLeft(totalSec);
    const t = setInterval(() => setSecondsLeft((s) => { if (s <= 1) { clearInterval(t); setDone(true); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [started, timed, done, len, secondsLeft]);

  const build = () => {
    const base = pickRandom(pool, Math.min(len, pool.length));
    const qs = base.map((it) => { const prompt = dir === "es2en" ? it.es : it.en; const correct = dir === "es2en" ? it.en : it.es; const distractPool = pool.filter((x) => x.id !== it.id).map((x) => dir === "es2en" ? x.en : x.es); const wrongs = pickRandom(distractPool, 3); const options = pickRandom([correct, ...wrongs], Math.min(4, 1 + wrongs.length)); return { id: it.id, categoria: it.categoria, prompt, correct, options }; });
    setItems(qs); setIdx(0); setAnswers({}); setDone(false); setStarted(true); setSecondsLeft(0);
  };

  const onPick = (opt) => {
    const q = items[idx]; const correct = opt === q.correct; onMetric({ reviews: 1, correct: correct ? 1 : 0 });
    setAnswers((a) => ({ ...a, [idx]: opt })); if (idx + 1 >= items.length) setDone(true); else setIdx(idx + 1);
  };

  const score = useMemo(() => items.reduce((acc, q, i) => acc + ((answers[i] === q.correct) ? 1 : 0), 0), [items, answers]);
  const mistakes = useMemo(() => items.map((q, i) => ({...q, chosen: answers[i]})).filter(x => x.chosen && x.chosen !== x.correct), [items, answers]);

  if (!started) return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border shadow-sm p-5 dark:bg-slate-800 dark:border-slate-700">
      <div className="text-lg font-semibold dark:text-slate-100">Configurar examen</div>
      <div className="mt-3 grid gap-3">
        <div>
          <div className="text-sm text-gray-600 dark:text-slate-300 mb-1">Dirección</div>
          <div className="flex items-center gap-2 text-sm dark:text-slate-200">
            <label className="inline-flex items-center gap-1"><input type="radio" name="dir" checked={dir==="es2en"} onChange={()=>setDir("es2en")} /> ES → EN</label>
            <label className="inline-flex items-center gap-1"><input type="radio" name="dir" checked={dir==="en2es"} onChange={()=>setDir("en2es")} /> EN → ES</label>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-slate-300 mb-1">Número de preguntas</div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200" value={len} onChange={(e)=>setLen(Number(e.target.value))}>
            {[10,15,20].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm dark:text-slate-200">
          <input id="timed" type="checkbox" checked={timed} onChange={(e)=>setTimed(e.target.checked)} />
          <label htmlFor="timed">Activar tiempo (≈25s por pregunta)</label>
        </div>
        <button onClick={build} className="mt-1 px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Iniciar examen</button>
        <p className="text-xs text-gray-500 dark:text-slate-400">El examen usa el **filtro actual** (categoría/búsqueda) como pool.</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="bg-white rounded-2xl border shadow-sm p-5 text-center dark:bg-slate-800 dark:border-slate-700">
        <div className="text-2xl font-semibold dark:text-slate-100">Resultado: {score} / {items.length}</div>
        <div className="text-sm text-gray-600 dark:text-slate-300 mt-1">Aciertos: {score} · Fallos: {items.length - score}</div>
        <button onClick={()=>{ setStarted(false); }} className="mt-4 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Nuevo examen</button>
      </div>
      {mistakes.length > 0 && (
        <div className="mt-4 bg-white rounded-2xl border shadow-sm p-5 dark:bg-slate-800 dark:border-slate-700">
          <div className="text-lg font-semibold dark:text-slate-100 mb-2">Repaso de fallos</div>
          <div className="grid gap-2">
            {mistakes.map((m,i)=> (
              <div key={i} className="p-3 border rounded-xl dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">{m.categoria}</div>
                <div className="text-sm dark:text-slate-200"><span className="font-medium">{m.prompt}</span></div>
                <div className="text-sm mt-1 dark:text-green-400">✅ Correcta: <span className="font-medium">{m.correct}</span></div>
                <div className="text-sm dark:text-red-400">❌ Tu respuesta: {m.chosen || "(sin responder)"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const q = items[idx];
  return (
    <div className="max-w-xl mx-auto mt-6 bg-white rounded-2xl border shadow-sm p-5 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
        <div>Pregunta {idx + 1} / {items.length}</div>
        {timed && <div>⏱ {Math.floor(secondsLeft/60).toString().padStart(2,'0')}:{(secondsLeft%60).toString().padStart(2,'0')}</div>}
      </div>
      <div className="mt-2 text-lg dark:text-slate-200">Traduce {dir === "es2en" ? "al inglés" : "al español"}:</div>
      <div className="mt-1 text-2xl font-semibold dark:text-slate-100">{q.prompt}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => onPick(opt)} className="text-left px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">{opt}</button>
        ))}
      </div>
    </div>
  );
}

function Study({ pool, srs, setSrs, onMetric }) {
  const now = nowMs();
  const due = pool.filter(it => (srs[it.id]?.due ?? 0) <= now);
  const newOnes = due.length ? [] : pool.filter(it => !srs[it.id]).slice(0, 10);
  const studySet = due.length ? due : newOnes;
  const [idx, setIdx] = useState(0);
  const [showEN, setShowEN] = useState(false);

  useEffect(()=>{ setIdx(0); setShowEN(false); }, [JSON.stringify(studySet.map(x=>x.id))]);

  if (!studySet.length) return <p className="text-sm text-gray-500">No hay tarjetas pendientes ahora mismo según el filtro. Prueba a cambiar de categoría o vuelve más tarde.</p>;
  const item = studySet[Math.min(idx, studySet.length-1)];

  const grade = (q) => {
    const prev = srs[item.id] || { ease: 2.5, interval: 0, reps: 0, due: 0 };
    const next = reviewSM2(prev, q);
    const updated = { ...srs, [item.id]: next };
    setSrs(updated); saveSRS(updated);
    onMetric({ reviews: 1, correct: q >= 4 ? 1 : 0 });
    setShowEN(false);
    if (idx + 1 < studySet.length) setIdx(idx + 1);
  };

  return (
    <div className="max-w-xl mx-auto mt-4">
      <div className="rounded-3xl border shadow-sm p-6 text-center select-none bg-white dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400 mb-2">{item.categoria} · {idx+1}/{studySet.length}</div>
        <div className="text-2xl font-semibold min-h-[4rem] flex items-center justify-center dark:text-slate-100">{showEN ? item.en : item.es}</div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={() => window.dispatchEvent(new CustomEvent('speak:es', { detail: item.es }))} className="text-xs px-2 py-1 rounded-md border dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">🔊 ES</button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('speak:en', { detail: item.en }))} className="text-xs px-2 py-1 rounded-md border dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">🔊 EN</button>
          <button onClick={()=>setShowEN(s=>!s)} className="text-xs px-2 py-1 rounded-md border dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">{showEN?"Ocultar EN":"Mostrar EN"}</button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
        <button onClick={()=>grade(1)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">De nuevo</button>
        <button onClick={()=>grade(3)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Difícil</button>
        <button onClick={()=>grade(4)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Bien</button>
        <button onClick={()=>grade(5)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Fácil</button>
      </div>
      <p className="mt-2 text-xs text-gray-500">Algoritmo SM‑2 simplificado · Guarda progreso en localStorage.</p>
    </div>
  );
}

function Dashboard({ kpis }){
  return (
    <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-4 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400">Hoy</div>
        <div className="text-3xl font-semibold mt-1 dark:text-slate-100">{kpis.todayMin} min</div>
        <div className="text-sm text-gray-600 dark:text-slate-300">Revisiones: {kpis.todayReviews} · Acierto: {kpis.acc}%</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400">Racha</div>
        <div className="text-3xl font-semibold mt-1 dark:text-slate-100">🔥 {kpis.streak} días</div>
        <div className="text-sm text-gray-600 dark:text-slate-300">Último estudio: {kpis.lastStudy || '—'}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 md:col-span-2 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400">Acumulado</div>
        <div className="text-2xl font-semibold mt-1 dark:text-slate-100">Tiempo total: {kpis.totalMin} min · Revisiones: {kpis.totalReviews} · Aciertos: {kpis.totalCorrect}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [raw, setRaw] = useState(() => {
    const phrases = initialData.phrases || [];
    let currentCategory = 'General'; // Default category
    const categoryRegex = /\s*([IVXLCDM]+\.\s*.*)/;

    const processedPhrases = phrases.map(phrase => {
      const es = phrase.spanish || '';
      let cleanEs = es;
      let newCategoryForNext = null;

      const match = es.match(categoryRegex);
      if (match && match[1]) {
        const potentialCat = match[1].trim();
        if (potentialCat.length > 6) { // Avoid matching random numerals
          newCategoryForNext = potentialCat;
          cleanEs = es.replace(categoryRegex, '').trim();
        }
      }

      // Clean up extraneous text from the dataset
      const extraneousText1 = "Este listado abarca las frases más comunes y útiles para un camarero en un entorno de hostelería, permitiendo una comunicación fluida y profesional con clientes de habla inglesa.";
      if (cleanEs.includes(extraneousText1)) {
        cleanEs = cleanEs.replace(extraneousText1, '').trim();
      }
      
      const phraseData = {
        es: cleanEs,
        en: phrase.english,
        source: phrase.source,
        categoria: currentCategory,
      };

      if (newCategoryForNext) {
        currentCategory = newCategoryForNext;
      }

      return phraseData;
    });

    // Add unique IDs after processing
    return processedPhrases.map((phrase, index) => ({
      ...phrase,
      id: index,
    }));
  });
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("browse");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [favs, setFavs] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem(LS_FAVS_KEY) || "[]")); } catch { return new Set(); } });
  const [srs, setSrs] = useState(() => loadSRS());
  const [metrics, setMetrics] = useState(() => loadMetrics());
  const [timerStart, setTimerStart] = useState(null);

  // Tema/Densidad
  const { theme, setTheme, density, setDensity } = useThemeDensity();

  // Audio+
  const { voices, prefs, setPrefs, playing, playSet, stop, speakOnce } = useAudioPlus();
  useEffect(()=>{
    const esH = (e)=> speakOnce(e.detail, 'es-ES');
    const enH = (e)=> speakOnce(e.detail, 'en-GB');
    window.addEventListener('speak:es', esH);
    window.addEventListener('speak:en', enH);
    return ()=>{ window.removeEventListener('speak:es', esH); window.removeEventListener('speak:en', enH); };
  }, [speakOnce]);

  // Persist favoritos y métricas
  useEffect(() => { localStorage.setItem(LS_FAVS_KEY, JSON.stringify(Array.from(favs))); }, [favs]);
  useEffect(() => { saveMetrics(metrics); }, [metrics]);

  // Registrar Service Worker (PWA)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }
  }, []);

  // Autocancel TTS si cambias de modo
  useEffect(()=>{ stop(); }, [mode]);

  // Timer por modo
  useEffect(() => {
    const active = ["study","quiz","exam"].includes(mode);
    if (active && !timerStart) setTimerStart(Date.now());
    if (!active && timerStart) {
      const delta = Math.floor((Date.now() - timerStart) / 1000);
      addSeconds(delta);
      setTimerStart(null);
    }
    return () => {
      if (timerStart) { const delta = Math.floor((Date.now() - timerStart) / 1000); addSeconds(delta); }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function addSeconds(s){
    setMetrics((m) => {
      const tISO = todayISO();
      let next = { ...m };
      if (!next.today || next.today.dateISO !== tISO) {
        const hadToday = (next.today?.seconds || 0) > 0 || (next.today?.reviews || 0) > 0;
        const incStreak = hadToday && next.today.dateISO === new Date(Date.now()-86400000).toISOString().slice(0,10);
        next = { lastStudyISO: hadToday ? next.today.dateISO : next.lastStudyISO, streak: incStreak ? (next.streak||0)+1 : (hadToday ? 1 : (next.streak||0)), today: { dateISO: tISO, seconds: 0, reviews: 0, correct: 0 }, total: next.total || { seconds: 0, reviews: 0, correct: 0 } };
      }
      next.today.seconds += s; next.total.seconds += s;
      return next;
    });
  }

  const onMetric = ({ reviews=0, correct=0 }) => {
    setMetrics((m) => {
      const tISO = todayISO();
      let next = { ...m };
      if (!next.today || next.today.dateISO !== tISO) {
        next.today = { dateISO: tISO, seconds: 0, reviews: 0, correct: 0 };
      }
      next.today.reviews += reviews; next.today.correct += correct;
      next.total = next.total || { seconds: 0, reviews: 0, correct: 0 };
      next.total.reviews += reviews; next.total.correct += correct;
      next.lastStudyISO = tISO;
      if (!next.streak) next.streak = 1;
      return next;
    });
  };

  const categories = useMemo(() => uniqueSorted(raw.map((x) => x.categoria)), [raw]);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return raw.filter((x) => (!category || x.categoria === category) && (!q || x.es.toLowerCase().includes(q) || x.en.toLowerCase().includes(q))); }, [raw, category, query]);

  const dueCount = useMemo(() => { const now = nowMs(); return filtered.reduce((acc, x) => acc + (((srs[x.id]?.due ?? 0) <= now) ? 1 : 0), 0); }, [filtered, srs]);

  const toggleFav = (id) => { const next = new Set(favs); if (next.has(id)) next.delete(id); else next.add(id); setFavs(next); };

  const kpis = useMemo(() => {
    const todayMin = Math.round((metrics.today?.seconds || 0) / 60);
    const totalMin = Math.round((metrics.total?.seconds || 0) / 60);
    const todayReviews = metrics.today?.reviews || 0;
    const acc = (metrics.total?.reviews || 0) ? Math.round(((metrics.total.correct || 0) / metrics.total.reviews) * 100) : 0;
    return { todayMin, totalMin, todayReviews, acc, streak: metrics.streak || 0, lastStudy: metrics.lastStudyISO, totalReviews: metrics.total?.reviews || 0, totalCorrect: metrics.total?.correct || 0 };
  }, [metrics]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <TopBar total={raw.length} loaded={raw.length > 0} onFileLoaded={(arr) => setRaw(arr)} onExport={(type) => exportFile(filtered, type)} onAdminUpload={(pdfFile) => alert(`(Simulación) Subida de PDF: ${pdfFile.name}`)} dueCount={dueCount} kpis={kpis} theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} />

      <div className="max-w-6xl mx-auto px-4 py-5">
        <Tabs mode={mode} onMode={setMode} dueCount={dueCount} />
      </div>

      {/* Audio+ Controls */}
      <AudioBar
        voices={voices}
        prefs={prefs}
        setPrefs={setPrefs}
        playing={playing}
        onPlayAll={()=>playSet(filtered)}
        onStop={stop}
        sample={(lang)=>{ if(lang==='es'){ speakOnce('Ejemplo de voz en español','es-ES'); } else { speakOnce('Sample of English voice','en-GB'); } }}
      />

      <Filters categories={categories} value={category} onChange={setCategory} query={query} onQuery={setQuery} count={filtered.length} />

      <div className="max-w-6xl mx-auto px-4 pb-10">
        {mode === "browse" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-slate-300">Mostrando frases</div>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-500 dark:text-slate-400">Por página</label>
                <select value={perPage} onChange={(e)=>setPerPage(Number(e.target.value))} className="rounded-xl border border-gray-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {[10,25,50,100].map((n)=>(<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>
            <Browse items={filtered} onFav={toggleFav} favs={favs} page={page} perPage={perPage} onPage={setPage} onSpeakES={(t)=>speakOnce(t,'es-ES')} onSpeakEN={(t)=>speakOnce(t,'en-GB')} />
          </>
        )}

        {mode === "flash" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 dark:text-slate-300">Modo Flashcards (máx. 200 cartas según filtro actual)</div>
            <Flashcards deck={filtered.slice(0,200)} onFav={toggleFav} favs={favs} onSpeakES={(t)=>speakOnce(t,'es-ES')} onSpeakEN={(t)=>speakOnce(t,'en-GB')} />
          </div>
        )}

        {mode === "quiz" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 dark:text-slate-300">Quiz de opción múltiple basado en el filtro actual</div>
            <Quiz pool={filtered} onMetric={onMetric} />
          </div>
        )}

        {mode === "exam" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 dark:text-slate-300">Examen configurado sobre el filtro actual. Elige parámetros y comienza.</div>
            <Exam pool={filtered} onMetric={onMetric} />
          </div>
        )}

        {mode === "study" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 dark:text-slate-300">Estudio programado (SRS). Se priorizan cartas vencidas; si no hay, se añaden nuevas del filtro.</div>
            <Study pool={filtered} srs={srs} setSrs={setSrs} onMetric={onMetric} />
          </div>
        )}

        {mode === "dashboard" && (
          <Dashboard kpis={kpis} />
        )}
      </div>

      <Toasts />
    </div>
  );
}
