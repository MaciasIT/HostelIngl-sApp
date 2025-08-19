import fs from "fs";

const IN = "src/hostelenglish_dataset.json"; // Input dataset path
const OUT = "src/hostelenglish_dataset_cleannew.json";

const MIN_LEN = 2;
const MAX_LEN = 120; // si pasa de esto y el otro idioma es muy corto, sospechoso

const normalize = (s="") =>
  s.replace(/\s+/g, " ").trim();

const stripPunct = (s="") =>
  s.replace(/^[,.;:¡!¿?\-–—]+|[,.;:¡!¿?\-–—]+$/g, "").trim();

const looksMeta = (s="") => {
  const t = s.toLowerCase();
  return (
    t.startsWith("el dominio de") ||
    t.startsWith("importancia") ||
    t.startsWith("aplicaciones") ||
    t.startsWith("frases esenciales") ||
    t.startsWith("guía de estudio") ||
    t.includes("estas frases") ||
    t.includes("capacidad de manejar diálogos") ||
    /\b(capítulo|sección|introducción|resumen)\b/.test(t)
  );
};

const numericOnly = (s="") => /^[\d\s.,:;-]+$/.test(s);

const cleanText = (s="") => stripPunct(normalize(s));

// heurística: si uno es un párrafo largo y el otro muy corto, probablemente es meta
const paragraphMismatch = (es, en) =>
  (es.length > MAX_LEN && en.length < 10) ||
  (en.length > MAX_LEN && es.length < 10);

const categoryRegex = /^[IVXLCDM]+\.\s*(.*)/; // Regex to capture category text

function main() {
  const raw = JSON.parse(fs.readFileSync(IN, "utf8"));
  const phrases = raw.phrases || raw || [];

  let kept = [];
  let removed = { empty:0, numeric:0, meta:0, mismatch:0, categoryLines: 0 };
  const seen = new Set(); // dedupe por par es|en

  let currentCategory = 'General'; // Default category

  for (const p of phrases) {
    let es = p.spanish || p.es || ""; // Keep original for category check
    let en = p.english || p.en || ""; // Keep original for category check
    const source = p.source || "";

    const match = es.match(categoryRegex);
    if (match) {
      // This is a category phrase, update currentCategory and skip adding to kept
      currentCategory = match[1].trim();
      removed.categoryLines++;
      continue;
    }

    // Normalizations for regular phrases
    es = cleanText(es);
    en = cleanText(en);

    if (!es || !en) { removed.empty++; continue; }
    if (numericOnly(es) || numericOnly(en)) { removed.numeric++; continue; }
    if (looksMeta(es) || looksMeta(en)) { removed.meta++; continue; }
    if (paragraphMismatch(es, en)) { removed.mismatch++; continue; }

    const key = `${es}||${en}`;
    if (seen.has(key)) continue;
    seen.add(key);

    kept.push({
      id: kept.length,                // id secuencial estable para esta build
      es, en,
      source,
      categoria: currentCategory // Assign the current category
    });
  }

  fs.writeFileSync(OUT, JSON.stringify({ phrases: kept }, null, 2));
  console.log("✅ Dataset limpio generado:", OUT);
  console.log("  Total original:", phrases.length);
  console.log("  Total limpio  :", kept.length);
  console.log("  Removidos     :", removed);
}

main();

