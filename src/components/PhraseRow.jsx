import React from "react";
import { classNames } from "../utils/helpers";

export function PhraseRow({ item, onFav, favs, onSpeakES, onSpeakEN }) {
  const isFav = favs.has(item.id);
  return (
    <div role="row" className="grid md:grid-cols-12 items-start gap-3 px-4 py-3 border-b border-border hover:bg-card-background">
      <div role="cell" className="md:col-span-2"><span className="inline-flex text-[11px] px-2 py-1 rounded-full bg-gray-100 bg-card-background text-text-base">{item.categoria || "—"}</span></div>
      <div role="cell" className="md:col-span-4 text-sm flex items-center gap-2 text-slate-800 text-text-base">
        <button onClick={() => onSpeakES(item.es)} aria-label={`Reproducir en español: ${item.es}`} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 ES</button>
        <span>{item.es}</span>
      </div>
      <div role="cell" className="md:col-span-5 text-sm flex items-center gap-2 text-slate-600 text-text-muted">
        <button onClick={() => onSpeakEN(item.en)} aria-label={`Reproducir en inglés: ${item.en}`} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 EN</button>
        <span>{item.en}</span>
      </div>
      <div role="cell" className="flex items-center gap-2 md:col-span-1 justify-end">
        <button onClick={() => onFav(item.id)} aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"} className={classNames("text-xs px-2 py-1 rounded-md border", isFav ? "bg-yellow-100 border-yellow-300 bg-yellow-900/50 border-yellow-700 text-yellow-200" : "hover:bg-gray-50 border-gray-300 border-border text-text-muted hover:bg-card-background")}>{isFav ? "★" : "☆"}</button>
      </div>
    </div>
  );
}