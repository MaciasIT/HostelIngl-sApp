import React, { useState, useEffect } from 'react';

// Simple Markdown to HTML converter
const markdownToHtml = (text) => {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n/g, '<br />');
};

export function Documentation({ onClose }) {
  const [userManual, setUserManual] = useState('');
  const [techDocs, setTechDocs] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    fetch('DOCUMENTACION/MANUAL_DE_USUARIO.md')
      .then(res => res.text())
      .then(text => setUserManual(markdownToHtml(text)));
    fetch('DOCUMENTACION/DOCUMENTACION_TECNICA.md')
      .then(res => res.text())
      .then(text => setTechDocs(markdownToHtml(text)));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card-background text-text-base rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Ayuda y Documentación</h2>
          <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-background">Cerrar</button>
        </div>
        <div className="p-4 border-b border-border">
          <button onClick={() => setActiveTab('user')} className={`px-4 py-2 ${activeTab === 'user' ? 'border-b-2 border-primary' : ''}`}>Manual de Usuario</button>
          <button onClick={() => setActiveTab('tech')} className={`px-4 py-2 ${activeTab === 'tech' ? 'border-b-2 border-primary' : ''}`}>Doc. Técnica</button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'user' && <div dangerouslySetInnerHTML={{ __html: userManual }} />}
          {activeTab === 'tech' && <div dangerouslySetInnerHTML={{ __html: techDocs }} />}
        </div>
      </div>
    </div>
  );
}
