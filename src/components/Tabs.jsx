import React from "react";
import { classNames } from "../utils/helpers";

export function Tabs({ mode, onMode, dueCount }) {
  const tabs = [
    { id: "browse", name: "Frases" },
    { id: "conversations", name: "Conversaciones" },
    { id: "flash", name: "Flashcards" },
    { id: "quiz", name: "Quiz" },
    { id: "exam", name: "Examen" },
    { id: "study", name: `Estudio${dueCount?` (${dueCount})`:''}` },
    { id: "dashboard", name: "Dashboard" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div role="tablist" className="inline-flex bg-gray-100 rounded-2xl p-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => onMode(t.id)} role="tab" aria-selected={mode === t.id} aria-controls={`tab-panel-${t.id}`} id={`tab-${t.id}`} className={classNames("px-3 py-1.5 rounded-xl text-sm", mode === t.id ? "bg-white border border-gray-300" : "text-gray-600 hover:text-gray-800")}>{t.name}</button>
        ))}
      </div>
    </div>
  );
}
