import React from "react";
import { PhraseRow } from "./PhraseRow";
import { Paginator } from "./Paginator";

export function Browse({ items, onFav, favs, page, perPage, onPage, onSpeakES, onSpeakEN }) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const start = (page - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="grid md:grid-cols-12 gap-3 px-4 py-2 bg-gray-50 border-b text-[12px] font-semibold text-gray-600">
          <div className="md:col-span-2">Categoría</div>
          <div className="md:col-span-5">Español</div>
          <div className="md:col-span-5">Inglés</div>
        </div>
        {slice.map((it) => (<PhraseRow key={it.id} item={it} onFav={onFav} favs={favs} onSpeakES={onSpeakES} onSpeakEN={onSpeakEN} />))}
      </div>
      <Paginator page={page} pages={pages} onPage={onPage} />
    </>
  );
}
