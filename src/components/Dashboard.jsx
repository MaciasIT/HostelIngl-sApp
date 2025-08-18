import React from "react";

export function Dashboard({ kpis }){
  return (
    <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-4 bg-card-background border-border">
        <div className="text-xs text-gray-500 text-text-muted">Hoy</div>
        <div className="text-3xl font-semibold mt-1 text-text-base">{kpis.todayMin} min</div>
        <div className="text-sm text-gray-600 text-text-muted">Revisiones: {kpis.todayReviews} · Acierto: {kpis.acc}%</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 bg-card-background border-border">
        <div className="text-xs text-gray-500 text-text-muted">Racha</div>
        <div className="text-3xl font-semibold mt-1 text-text-base">🔥 {kpis.streak} días</div>
        <div className="text-sm text-gray-600 text-text-muted">Último estudio: {kpis.lastStudy || '—'}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 md:col-span-2 bg-card-background border-border">
        <div className="text-xs text-gray-500 text-text-muted">Acumulado</div>
        <div className="text-2xl font-semibold mt-1 text-text-base">Tiempo total: {kpis.totalMin} min · Revisiones: {kpis.totalReviews} · Aciertos: {kpis.totalCorrect}</div>
      </div>
    </div>
  );
}
