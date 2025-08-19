import React from 'react';

export function Conversations({ conversations, onSelectConversation }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-text-base">Conversaciones</h2>
      <div className="space-y-4">
        {conversations.map((conv) => (
          <div key={conv.id} onClick={() => onSelectConversation(conv.id)} className="p-4 border border-border rounded-lg cursor-pointer hover:bg-background">
            <h3 className="text-lg font-semibold text-text-base">{conv.title}</h3>
            <p className="text-sm text-text-muted">{conv.scenario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
