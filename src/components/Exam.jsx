import React, { useEffect, useMemo, useState } from "react";
import { pickRandom } from "../utils/helpers";

export function Exam({ pool, onMetric }) {
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
    <div className="max-w-xl mx-auto bg-white rounded-2xl border shadow-sm p-5 bg-card-background border-border">
      <div className="text-lg font-semibold text-text-base">Configurar examen</div>
      <div className="mt-3 grid gap-3">
        <div>
          <div className="text-sm text-gray-600 text-text-muted mb-1">Dirección</div>
          <div className="flex items-center gap-2 text-sm text-text-base">
            <label className="inline-flex items-center gap-1"><input type="radio" name="dir" checked={dir==="es2en"} onChange={()=>setDir("es2en")} /> ES → EN</label>
            <label className="inline-flex items-center gap-1"><input type="radio" name="dir" checked={dir==="en2es"} onChange={()=>setDir("en2es")} /> EN → ES</label>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 text-text-muted mb-1">Número de preguntas</div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm bg-card-background border-border text-text-base" value={len} onChange={(e)=>setLen(Number(e.target.value))}>
            {[10,15,20].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-base">
          <input id="timed" type="checkbox" checked={timed} onChange={(e)=>setTimed(e.target.checked)} />
          <label htmlFor="timed">Activar tiempo (≈25s por pregunta)</label>
        </div>
        <button onClick={build} className="mt-1 px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm border-border text-text-muted hover:bg-card-background">Iniciar examen</button>
        <p className="text-xs text-gray-500 text-text-muted">El examen usa el **filtro actual** (categoría/búsqueda) como pool.</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="bg-white rounded-2xl border shadow-sm p-5 text-center bg-card-background border-border">
        <div className="text-2xl font-semibold text-text-base">Resultado: {score} / {items.length}</div>
        <div className="text-sm text-gray-600 text-text-muted mt-1">Aciertos: {score} · Fallos: {items.length - score}</div>
        <button onClick={()=>{ setStarted(false); }} className="mt-4 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Nuevo examen</button>
      </div>
      {mistakes.length > 0 && (
        <div className="mt-4 bg-white rounded-2xl border shadow-sm p-5 bg-card-background border-border">
          <div className="text-lg font-semibold text-text-base mb-2">Repaso de fallos</div>
          <div className="grid gap-2">
            {mistakes.map((m,i)=> (
              <div key={i} className="p-3 border rounded-xl border-border">
                <div className="text-xs text-gray-500 text-text-muted mb-1">{m.categoria}</div>
                <div className="text-sm text-text-base"><span className="font-medium">{m.prompt}</span></div>
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
    <div className="max-w-xl mx-auto mt-6 bg-white rounded-2xl border shadow-sm p-5 bg-card-background border-border">
      <div className="flex items-center justify-between text-xs text-gray-500 text-text-muted">
        <div>Pregunta {idx + 1} / {items.length}</div>
        {timed && <div>⏱ {Math.floor(secondsLeft/60).toString().padStart(2,'0')}:{(secondsLeft%60).toString().padStart(2,'0')}</div>}
      </div>
      <div className="mt-2 text-lg text-text-base">Traduce {dir === "es2en" ? "al inglés" : "al español"}:</div>
      <div className="mt-1 text-2xl font-semibold text-text-base">{q.prompt}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => onPick(opt)} className="text-left px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">{opt}</button>
        ))}
      </div>
    </div>
  );
}
