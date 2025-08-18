import React from "react";

export function Filters({ categories, value, onChange, query, onQuery, count }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-3 grid gap-3 md:grid-cols-12">
      <div className="md:col-span-4">
        <label className="text-xs text-text-muted">Categoría</label>
        <select className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Todas</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>
      <div className="md:col-span-8">
        <label className="text-xs text-text-muted">Búsqueda</label>
        <input className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm" placeholder="Buscar en español o inglés (ej. lemon, reserva, check)" value={query} onChange={(e) => onQuery(e.target.value)} />
        <p className="text-xs text-gray-400 mt-1 text-text-muted">{count} resultados</p>
      </div>
    </div>
  );
}
