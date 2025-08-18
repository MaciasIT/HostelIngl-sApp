import React from "react";
import { classNames } from "../utils/helpers";

export function PhraseRow({ item, onFav, favs, onSpeakES, onSpeakEN }) {
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
