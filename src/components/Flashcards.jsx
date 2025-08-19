import React, { useEffect, useState } from "react";
import { classNames } from "../utils/helpers";

export function Flashcards({ deck, onFav, favs, onSpeakES, onSpeakEN }) {
  const [idx, setIdx] = useState(0);
  const [showEN, setShowEN] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'
  const current = deck[idx];

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setShowEN((s) => !s);
        setFeedback(null); // Reset feedback on flip
      }
      if (e.code === "ArrowRight") {
        setIdx((i) => Math.min(deck.length - 1, i + 1));
        setShowEN(false); // Reset on navigation
        setFeedback(null); // Reset feedback on navigation
      }
      if (e.code === "ArrowLeft") {
        setIdx((i) => Math.max(0, i - 1));
        setShowEN(false); // Reset on navigation
        setFeedback(null); // Reset feedback on navigation
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck.length]);

  const handleFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => {
      setIdx((i) => Math.min(deck.length - 1, i + 1));
      setShowEN(false);
      setFeedback(null);
    }, 1000); // Show feedback for 1 second
  };

  if (!deck.length) return <p className="text-sm text-gray-500">No hay cartas en este filtro.</p>;

  return (
    <div className="max-w-xl mx-auto mt-4">
      <div
        className={classNames(
          "rounded-3xl border shadow-sm p-6 text-center select-none cursor-pointer bg-card-background border-border",
          feedback === 'correct' && 'border-green-500 ring-2 ring-green-500',
          feedback === 'incorrect' && 'border-red-500 ring-2 ring-red-500'
        )}
        onClick={() => setShowEN((s) => !s)}
        title="Click o pulsa la barra espaciadora para voltear la tarjeta"
        aria-live="polite"
      >
        <div className="text-xs text-gray-500 text-text-muted mb-2">{current.categoria}</div>
        <div className="text-2xl font-semibold min-h-[4rem] flex items-center justify-center text-text-base">{showEN ? current.en : current.es}</div>
        <div className="mt-4 text-xs text-gray-500 text-text-muted">Pulsa <kbd className="px-1 border rounded bg-card-background border-border">Espacio</kbd> para voltear · <kbd className="px-1 border rounded bg-card-background border-border">←</kbd> / <kbd className="px-1 border rounded bg-card-background border-border">→</kbd> para navegar</div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} aria-label="Ir a la tarjeta anterior" className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Anterior</button>
        <div aria-live="polite">{idx + 1} / {deck.length}</div>
        <button onClick={() => setIdx((i) => Math.min(deck.length - 1, i + 1))} aria-label="Ir a la siguiente tarjeta" className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Siguiente</button>
      </div>
      {showEN && ( // Show feedback buttons only when English is shown
        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={() => handleFeedback('correct')} aria-label="Marcar como correcto" className="px-3 py-1.5 rounded-xl bg-green-500 text-white">Correcto</button>
          <button onClick={() => handleFeedback('incorrect')} aria-label="Marcar como incorrecto" className="px-3 py-1.5 rounded-xl bg-red-500 text-white">Incorrecto</button>
        </div>
      )}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button onClick={() => onSpeakES(current.es)} aria-label={`Reproducir en español: ${current.es}`} className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 ES</button>
        <button onClick={() => onSpeakEN(current.en)} aria-label={`Reproducir en inglés: ${current.en}`} className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 EN</button>
        <button onClick={() => onFav(current.id)} aria-label={favs.has(current.id) ? "Quitar de favoritos" : "Añadir a favoritos"} className={classNames("text-xs px-2 py-1 rounded-md border", favs.has(current.id) ? "bg-yellow-100 border-yellow-300" : "hover:bg-gray-50 border-gray-300 border-border text-text-muted hover:bg-card-background")}>{favs.has(current.id) ? "★" : "☆"}</button>
      </div>
    </div>
  );
}
