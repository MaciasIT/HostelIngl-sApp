import React from "react";
import { classNames } from "../utils/helpers";

export function Tabs({ mode, onMode, dueCount }) {
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
