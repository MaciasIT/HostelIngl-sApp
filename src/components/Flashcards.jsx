import React, { useEffect, useState } from "react";
import { classNames } from "../utils/helpers";

export function Flashcards({ deck, onFav, favs, onSpeakES, onSpeakEN }) {
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
