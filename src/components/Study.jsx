import React, { useEffect, useState } from "react";
import { nowMs, reviewSM2, saveSRS } from "../utils/helpers";
import { classNames } from "../utils/helpers"; // Import classNames

export function Study({ pool, srs, setSrs, onMetric }) {
  const now = nowMs();
  const due = pool.filter(it => (srs[it.id]?.due ?? 0) <= now);
  const newOnes = due.length ? [] : pool.filter(it => !srs[it.id]).slice(0, 10);
  const studySet = due.length ? due : newOnes;
  const [idx, setIdx] = useState(0);
  const [showEN, setShowEN] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'

  useEffect(()=>{ 
    setIdx(0);
    setShowEN(false);
    setFeedback(null); // Reset feedback on study set change
  }, [JSON.stringify(studySet.map(x=>x.id))]);

  if (!studySet.length) return <p className="text-sm text-gray-500">No hay tarjetas pendientes ahora mismo según el filtro. Prueba a cambiar de categoría o vuelve más tarde.</p>;
  const item = studySet[Math.min(idx, studySet.length-1)];

  const grade = (q) => {
    const prev = srs[item.id] || { ease: 2.5, interval: 0, reps: 0, due: 0 };
    const next = reviewSM2(prev, q);
    const updated = { ...srs, [item.id]: next };
    setSrs(updated); saveSRS(updated);
    onMetric({ reviews: 1, correct: q >= 4 ? 1 : 0 });

    setFeedback(q >= 4 ? 'correct' : 'incorrect'); // Set feedback based on quality

    setTimeout(() => {
      setShowEN(false);
      setFeedback(null); // Clear feedback after delay
      if (idx + 1 < studySet.length) {
        setIdx(idx + 1);
      }
    }, 1000); // Delay to show feedback
  };

  return (
    <div className="max-w-xl mx-auto mt-4">
      <div
        className={classNames(
          "rounded-3xl border shadow-sm p-6 text-center select-none bg-card-background border-border",
          feedback === 'correct' && 'border-green-500 ring-2 ring-green-500',
          feedback === 'incorrect' && 'border-red-500 ring-2 ring-red-500'
        )}
      >
        <div className="text-xs text-gray-500 text-text-muted mb-2">{item.categoria} · {idx+1}/{studySet.length}</div>
        <div className="text-2xl font-semibold min-h-[4rem] flex items-center justify-center text-text-base">{showEN ? item.en : item.es}</div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={() => window.dispatchEvent(new CustomEvent('speak:es', { detail: item.es }))} className="text-xs px-2 py-1 rounded-md border border-border text-text-muted hover:bg-card-background">🔊 ES</button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('speak:en', { detail: item.en }))} className="text-xs px-2 py-1 rounded-md border border-border text-text-muted hover:bg-card-background">🔊 EN</button>
          <button onClick={()=>setShowEN(s=>!s)} className="text-xs px-2 py-1 rounded-md border border-border text-text-muted hover:bg-card-background">
            {showEN?"Ocultar EN":"Mostrar EN"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
        <button onClick={()=>grade(1)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">De nuevo</button>
        <button onClick={()=>grade(3)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">Difícil</button>
        <button onClick={()=>grade(4)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">Bien</button>
        <button onClick={()=>grade(5)} className="px-3 py-2 rounded-xl border hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">Fácil</button>
      </div>
      <p className="mt-2 text-xs text-gray-500">Algoritmo SM‑2 simplificado · Guarda progreso en localStorage.</p>
    </div>
  );
}