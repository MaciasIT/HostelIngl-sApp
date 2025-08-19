import React, { useEffect, useState } from "react";
import { pickRandom } from "../utils/helpers";
import { classNames } from "../utils/helpers"; // Import classNames

export function Quiz({ pool, onMetric }) {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // New state
  const [isCorrect, setIsCorrect] = useState(null); // New state

  useEffect(() => {
    const base = pickRandom(pool, Math.min(8, pool.length));
    const qs = base.map((item) => { const wrongs = pickRandom(pool.filter((x) => x.id !== item.id), 3).map((x) => x.en); const options = pickRandom([item.en, ...wrongs], Math.min(4, 1 + wrongs.length)); return { item, options }; });
    setQuestions(qs); setIdx(0); setScore(0); setDone(false);
    setSelectedAnswer(null); // Reset on new quiz
    setIsCorrect(null); // Reset on new quiz
  }, [pool]);

  if (!questions.length) return <p className="text-sm text-gray-500">No hay suficientes datos para el quiz.</p>;

  const q = questions[idx];
  const onPick = (opt) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    const correct = opt === q.item.en;
    setSelectedAnswer(opt);
    setIsCorrect(correct);
    onMetric({ reviews: 1, correct: correct ? 1 : 0 });

    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true);
      } else {
        setIdx(idx + 1);
        setSelectedAnswer(null); // Reset for next question
        setIsCorrect(null); // Reset for next question
      }
    }, 1000); // Delay to show feedback
  };

  if (done) return (
    <div className="max-w-xl mx-auto mt-6 text-center">
      <div className="text-2xl font-semibold text-text-base">Resultado: {score} / {questions.length}</div>
      <button onClick={() => { const base = pickRandom(pool, Math.min(8, pool.length)); const qs = base.map((item) => { const wrongs = pickRandom(pool.filter((x) => x.id !== item.id), 3).map((x) => x.en); const options = pickRandom([item.en, ...wrongs], Math.min(4, 1 + wrongs.length)); return { item, options }; }); setQuestions(qs); setIdx(0); setScore(0); setDone(false); setSelectedAnswer(null); setIsCorrect(null); }} aria-label="Reintentar el quiz" className="mt-4 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-50 border-border text-text-muted hover:bg-card-background">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white rounded-2xl border shadow-sm p-5 bg-card-background border-border">
      <div className="text-xs text-gray-500 text-text-muted">Pregunta {idx + 1} / {questions.length}</div>
      <div className="mt-2 text-lg text-text-base">Traduce al inglés:</div>
      <div className="mt-1 text-2xl font-semibold text-text-base">{q.item.es}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onPick(opt)}
            aria-label={`Seleccionar opción: ${opt}`}
            className={classNames(
              "text-left px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 border-border text-text-muted hover:bg-card-background",
              selectedAnswer !== null && (
                opt === q.item.en && "bg-green-100 text-green-800 border-green-300"
              ),
              selectedAnswer === opt && !isCorrect && "bg-red-100 text-red-800 border-red-300"
            )}
            disabled={selectedAnswer !== null}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
