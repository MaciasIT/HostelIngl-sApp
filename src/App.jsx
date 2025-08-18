import React, { useEffect, useMemo, useState } from "react";
import initialData from "./hostelenglish_dataset_normalized.json";
import { LS_FAVS_KEY, saveMetrics, loadSRS, loadMetrics, todayISO, uniqueSorted, nowMs, exportFile } from "./utils/helpers";
import { useTheme } from "./context/ThemeContext";

import { useAudioPlus } from "./hooks/useAudioPlus";
import { TopBar } from "./components/TopBar";
import { Tabs } from "./components/Tabs";
import { AudioBar } from "./components/AudioBar";
import { Filters } from "./components/Filters";
import { Browse } from "./components/Browse";
import { Flashcards } from "./components/Flashcards";
import { Quiz } from "./components/Quiz";
import { Exam } from "./components/Exam";
import { Study } from "./components/Study";
import { Dashboard } from "./components/Dashboard";
import { Toasts } from "./components/Toasts";

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
  const [isFocusMode, setIsFocusMode] = useState(false); // New state for focus mode

  // Tema/Densidad
  const { theme, setTheme, density, setDensity } = useTheme();

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
    <div className="min-h-screen bg-background">
      {!isFocusMode && (
        <TopBar total={raw.length} loaded={raw.length > 0} onFileLoaded={(arr) => setRaw(arr)} onExport={(type) => exportFile(filtered, type)} onAdminUpload={(pdfFile) => alert(`(Simulación) Subida de PDF: ${pdfFile.name}`)} dueCount={dueCount} kpis={kpis} theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
      )}

      {!isFocusMode && (
        <div className="max-w-6xl mx-auto px-4 py-5">
          <Tabs mode={mode} onMode={setMode} dueCount={dueCount} />
        </div>
      )}

      {/* Audio+ Controls */}
      {!isFocusMode && (
        <AudioBar
          voices={voices}
          prefs={prefs}
          setPrefs={setPrefs}
          playing={playing}
          onPlayAll={()=>playSet(filtered)}
          onStop={stop}
          sample={(lang)=>{ if(lang==='es'){ speakOnce('Ejemplo de voz en español','es-ES'); } else { speakOnce('Sample of English voice','en-GB'); } }}
        />
      )}

      {!isFocusMode && (
        <Filters categories={categories} value={category} onChange={setCategory} query={query} onQuery={setQuery} count={filtered.length} />
      )}

      <div className="max-w-6xl mx-auto px-4 pb-10">
        {mode === "browse" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 text-text-muted">Mostrando frases</div>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-500 text-text-muted">Por página</label>
                <select value={perPage} onChange={(e)=>setPerPage(Number(e.target.value))} className="rounded-xl border border-gray-300 px-2 py-1 border-border bg-card-background text-text-base">
                  {[10,25,50,100].map((n)=>(<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>
            <Browse items={filtered} onFav={toggleFav} favs={favs} page={page} perPage={perPage} onPage={setPage} onSpeakES={(t)=>speakOnce(t,'es-ES')} onSpeakEN={(t)=>speakOnce(t,'en-GB')} />
          </>
        )}

        {mode === "flash" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 text-text-muted">Modo Flashcards (máx. 200 cartas según filtro actual)</div>
            <Flashcards deck={filtered.slice(0,200)} onFav={toggleFav} favs={favs} onSpeakES={(t)=>speakOnce(t,'es-ES')} onSpeakEN={(t)=>speakOnce(t,'en-GB')} />
          </div>
        )}

        {mode === "quiz" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 text-text-muted">Quiz de opción múltiple basado en el filtro actual</div>
            <Quiz pool={filtered} onMetric={onMetric} />
          </div>
        )}

        {mode === "exam" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 text-text-muted">Examen configurado sobre el filtro actual. Elige parámetros y comienza.</div>
            <Exam pool={filtered} onMetric={onMetric} />
          </div>
        )}

        {mode === "study" && (
          <div>
            <div className="mb-2 text-sm text-gray-600 text-text-muted">Estudio programado (SRS). Se priorizan cartas vencidas; si no hay, se añaden nuevas del filtro.</div>
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