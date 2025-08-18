import React, { useEffect, useState } from "react";

export function Toasts(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    const h = (e)=>{ const id = Math.random().toString(36).slice(2); setItems(xs=>[...xs, {id, text:e.detail}]); setTimeout(()=> setItems(xs=> xs.filter(t=>t.id!==id)), 2500); };
    window.addEventListener('toast', h); return ()=> window.removeEventListener('toast', h);
  },[]);
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {items.map(t=> (
        <div key={t.id} className="px-3 py-2 rounded-xl shadow border bg-white text-sm bg-card-background text-text-base border-border">
          {t.text}
        </div>
      ))}
    </div>
  );
}
