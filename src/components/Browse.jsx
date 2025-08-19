import React from "react";
import { PhraseRow } from "./PhraseRow";
import { Paginator } from "./Paginator";

export function Browse({ items, onFav, favs, page, perPage, onPage, onSpeakES, onSpeakEN }) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const start = (page - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return (
    <>
      <div role="table" aria-label="Tabla de frases" className="max-w-6xl mx-auto bg-card-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <div role="rowgroup">
          <div role="row" className="grid md:grid-cols-12 gap-3 px-4 py-2 bg-gray-50 border-b text-[12px] font-semibold text-gray-600">
            <div role="columnheader" className="md:col-span-2">Categoría</div>
            <div role="columnheader" className="md:col-span-5">Español</div>
            <div role="columnheader" className="md:col-span-5">Inglés</div>
          </div>
        </div>
        <div role="rowgroup">
          {slice.map((it) => (<PhraseRow key={it.id} item={it} onFav={onFav} favs={favs} onSpeakES={onSpeakES} onSpeakEN={onSpeakEN} />))}
        </div>
      </div>
      <Paginator page={page} pages={pages} onPage={onPage} />
    </>
  );
}