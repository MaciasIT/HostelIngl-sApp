import React from "react";

export function Paginator({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2 justify-end text-sm">
      <button onClick={prev} className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Anterior</button>
      <span className="text-text-muted">{page} / {pages}</span>
      <button onClick={next} className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50">Siguiente</button>
    </div>
  );
}
