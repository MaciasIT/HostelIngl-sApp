import React, { useState } from 'react';

export function Conversation({ conversation, onBack, onSpeak, onPlayAll, onAddToStudy }) {
  const [revealed, setRevealed] = useState({});
  const [role, setRole] = useState('all');

  const toggleReveal = (index) => {
    setRevealed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const participants = ['all', ...conversation.participants];

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 px-3 py-1.5 rounded-xl border border-border text-sm text-text-base hover:bg-background">← Volver a conversaciones</button>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-text-base">{conversation.title}</h2>
          <p className="text-sm text-text-muted">{conversation.scenario}</p>
        </div>
        <button onClick={onPlayAll} className="px-3 py-1.5 rounded-xl border border-border text-sm text-text-base hover:bg-background">▶ Reproducir todo</button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="role-selector" className="text-sm font-medium text-text-base">Tu Rol:</label>
        <select id="role-selector" value={role} onChange={(e) => setRole(e.target.value)} className="px-2 py-1.5 rounded-xl border border-border text-sm bg-card-background text-text-base">
          {participants.map((p, i) => (
            <option key={i} value={p}>{p === 'all' ? 'Todos' : p}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        {conversation.dialogue.map((line, index) => {
          const isHidden = role !== 'all' && line.speaker === role;
          return (
            <div key={index} className="p-3 border-b border-border">
              <p className="font-semibold text-text-base">{line.speaker}:</p>
              {isHidden ? (
                <button onClick={() => toggleReveal(index)} className="text-sm text-blue-500 hover:underline">
                  {revealed[index] ? line.es : 'Mostrar línea'}
                </button>
              ) : (
                <p className="text-text-base cursor-pointer" onClick={() => toggleReveal(index)}>{line.es}</p>
              )}
              {revealed[index] && <p className="text-text-muted">{line.en}</p>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => onSpeak(line.es, 'es')} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 ES</button>
                <button onClick={() => onSpeak(line.en, 'en')} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 EN</button>
                <button onClick={() => onAddToStudy(line)} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">⭐ Añadir a estudio</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}