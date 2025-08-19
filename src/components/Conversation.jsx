import React, { useState } from 'react';

export function Conversation({ conversation, onBack, onSpeak, onPlayAll }) {
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (index) => {
    setRevealed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 px-3 py-1.5 rounded-xl border border-border text-sm text-text-base hover:bg-background">← Volver a conversaciones</button>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-text-base">{conversation.title}</h2>
          <p className="text-sm text-text-muted mb-4">{conversation.scenario}</p>
        </div>
        <button onClick={onPlayAll} className="px-3 py-1.5 rounded-xl border border-border text-sm text-text-base hover:bg-background">▶ Reproducir todo</button>
      </div>
      
      <div className="space-y-4">
        {conversation.dialogue.map((line, index) => (
          <div key={index} className="p-3 border-b border-border">
            <p className="font-semibold text-text-base">{line.speaker}:</p>
            <p className="text-text-base cursor-pointer" onClick={() => toggleReveal(index)}>{line.es}</p>
            {revealed[index] && <p className="text-text-muted">{line.en}</p>}
            <div className="flex gap-2 mt-2">
              <button onClick={() => onSpeak(line.es, 'es')} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 ES</button>
              <button onClick={() => onSpeak(line.en, 'en')} className="px-2 py-1 text-xs border rounded-md hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">🔊 EN</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
