import { useEffect, useRef, useState } from "react";
import { LS_AUDIO_KEY } from "../utils/helpers";

// --- Audio+ hook: voces, preferencias y cola ---
export function useAudioPlus(){
  const [voices, setVoices] = useState([]);
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_AUDIO_KEY) || "null") || { rate: 1.0, mode: 'es_en', voiceES: null, voiceEN: null }; } catch { return { rate: 1.0, mode: 'es_en', voiceES: null, voiceEN: null }; }
  });
  const [playing, setPlaying] = useState(false);
  const queueRef = useRef([]); // {text, lang}

  // Cargar voces (algunos navegadores emiten voiceschanged)
  useEffect(() => {
    function load(){ const list = window.speechSynthesis?.getVoices?.() || []; setVoices(list); }
    load();
    window.speechSynthesis?.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', load);
  }, []);

  // Persistir preferencias
  useEffect(() => { try { localStorage.setItem(LS_AUDIO_KEY, JSON.stringify(prefs)); } catch {} }, [prefs]);

  function makeUtter(text, lang){
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = prefs.rate || 1.0;
    const pickName = lang.startsWith('es') ? prefs.voiceES : prefs.voiceEN;
    if (pickName) { const v = voices.find(v=>v.name===pickName); if (v) u.voice = v; }
    else { const v = voices.find(v=> (v.lang||'').toLowerCase().startsWith(lang.slice(0,2))); if (v) u.voice = v; }
    return u;
  }

  function speakOnce(text, lang){ if (!window.speechSynthesis) return; window.speechSynthesis.cancel(); const u = makeUtter(text, lang); window.speechSynthesis.speak(u); }
  function stop(){ window.speechSynthesis?.cancel(); queueRef.current = []; setPlaying(false); }
  function playSet(items){
    if (!window.speechSynthesis || !items?.length) return;
    stop();
    const mode = prefs.mode || 'es_en';
    const q = [];
    for (const it of items) { if (mode === 'es') q.push({text: it.es, lang: 'es-ES'}); else if (mode === 'en') q.push({text: it.en, lang: 'en-GB'}); else { q.push({text: it.es, lang: 'es-ES'}); q.push({text: it.en, lang: 'en-GB'}); } }
    queueRef.current = q; setPlaying(true);
    const pump = () => { const next = queueRef.current.shift(); if (!next) { setPlaying(false); return; } const u = makeUtter(next.text, next.lang); u.onend = () => setTimeout(pump, 120); u.onerror = () => setTimeout(pump, 120); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); };
    pump();
  }

  return { voices, prefs, setPrefs, playing, playSet, stop, speakOnce };
}
