import React, { useEffect, useState } from "react";
import { pickRandom } from "../utils/helpers";

export function Quiz({ pool, onMetric }) {
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
      <div className="text-2xl font-semibold text-text-base">Resultado: {score} / {questions.length}</div>
      <button onClick={() => { const base = pickRandom(pool, Math.min(8, pool.length)); const qs = base.map((item) => { const wrongs = pickRandom(pool.filter((x) => x.id !== item.id), 3).map((x) => x.en); const options = pickRandom([item.en, ...wrongs], Math.min(4, 1 + wrongs.length)); return { item, options }; }); setQuestions(qs); setIdx(0); setScore(0); setDone(false); }} className="mt-4 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white rounded-2xl border shadow-sm p-5 bg-card-background border-border">
      <div className="text-xs text-gray-500 text-text-muted">Pregunta {idx + 1} / {questions.length}</div>
      <div className="mt-2 text-lg text-text-base">Traduce al inglés:</div>
      <div className="mt-1 text-2xl font-semibold text-text-base">{q.item.es}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => onPick(opt)} className="text-left px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">{opt}</button>
        ))}
      </div>
    </div>
  );
}
