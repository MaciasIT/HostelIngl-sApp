import React from "react";

export function Paginator({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2 justify-end text-sm">
      <button onClick={prev} disabled={page === 1} aria-label="Ir a la página anterior" className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
      <span className="text-text-muted" aria-label={`Página ${page} de ${pages}`}>{page} / {pages}</span>
      <button onClick={next} disabled={page === pages} aria-label="Ir a la página siguiente" className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
    </div>
  );
}
