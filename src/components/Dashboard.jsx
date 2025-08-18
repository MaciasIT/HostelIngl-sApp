import React from "react";

export function Dashboard({ kpis }){
  return (
    <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border bg-white p-4 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400">Hoy</div>
        <div className="text-3xl font-semibold mt-1 dark:text-slate-100">{kpis.todayMin} min</div>
        <div className="text-sm text-gray-600 dark:text-slate-300">Revisiones: {kpis.todayReviews} · Acierto: {kpis.acc}%</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400">Racha</div>
        <div className="text-3xl font-semibold mt-1 dark:text-slate-100">🔥 {kpis.streak} días</div>
        <div className="text-sm text-gray-600 dark:text-slate-300">Último estudio: {kpis.lastStudy || '—'}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4 md:col-span-2 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-xs text-gray-500 dark:text-slate-400">Acumulado</div>
        <div className="text-2xl font-semibold mt-1 dark:text-slate-100">Tiempo total: {kpis.totalMin} min · Revisiones: {kpis.totalReviews} · Aciertos: {kpis.totalCorrect}</div>
      </div>
    </div>
  );
}
