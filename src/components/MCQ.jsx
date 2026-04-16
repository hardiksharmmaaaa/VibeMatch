import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: "How many hours of sleep did you get?", options: [ { label: "< 5 hours (-1)", weight: -1 }, { label: "5-7 hours (2)", weight: 2 }, { label: "8+ hours (3)", weight: 3 } ] },
  { id: 2, text: "How stressed are you right now?", options: [ { label: "Very stressed (0)", weight: 0 }, { label: "A little (1)", weight: 1 }, { label: "Not at all (3)", weight: 3 } ] },
  { id: 3, text: "How much water have you drank today?", options: [ { label: "Barely any (0)", weight: 0 }, { label: "A few glasses (1)", weight: 1 }, { label: "Stayed hydrated! (2)", weight: 2 } ] },
  { id: 4, text: "Did you step outside today?", options: [ { label: "No (0)", weight: 0 }, { label: "For a bit (1)", weight: 1 }, { label: "Yes, got some sun! (2)", weight: 2 } ] },
  { id: 5, text: "Have you exercised or moved your body?", options: [ { label: "Not yet (0)", weight: 0 }, { label: "Light walk/stretch (1)", weight: 1 }, { label: "Full workout (2)", weight: 2 } ] },
  { id: 6, text: "How healthy were your meals?", options: [ { label: "Junk food (0)", weight: 0 }, { label: "Average (1)", weight: 1 }, { label: "Nutritious (2)", weight: 2 } ] },
  { id: 7, text: "Did you have any social interaction?", options: [ { label: "Isolated (0)", weight: 0 }, { label: "A few chats (1)", weight: 1 }, { label: "Good hangouts/calls (2)", weight: 2 } ] },
  { id: 8, text: "How is your focus level today?", options: [ { label: "Scattered (0)", weight: 0 }, { label: "Okay (1)", weight: 1 }, { label: "Locked in (2)", weight: 2 } ] },
  { id: 9, text: "Are you feeling overwhelmed by tasks?", options: [ { label: "Yes, very (0)", weight: 0 }, { label: "Somewhat (1)", weight: 1 }, { label: "Under control (2)", weight: 2 } ] },
  { id: 10, text: "Overall, what's your vibe right now?", options: [ { label: "Struggling (0)", weight: 0 }, { label: "Surviving (1)", weight: 1 }, { label: "Thriving (3)", weight: 3 } ] },
];

export default function MCQ({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex) / QUESTIONS.length) * 100;

  const handleAnswer = (weight) => {
    const newAnswers = [...answers, weight];
    if (currentIndex < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate final score S out of 10
      // Max possible weight for these questions is 3+3+2+2+2+2+2+2+2+3 = 23
      const MAX_WEIGHT = 23;
      const totalWeight = newAnswers.reduce((acc, curr) => acc + curr, weight);
      const score = (totalWeight / MAX_WEIGHT) * 10;
      onComplete(Number(score.toFixed(1)));
    }
  };

  return (
    <div className="mcq-container glass animate-slide-in">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Daily Check-In</span>
        <span style={{ fontWeight: 'bold' }}>{currentIndex + 1} / {QUESTIONS.length}</span>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>
        {currentQuestion.text}
      </h2>

      <div className="mcq-options">
        {currentQuestion.options.map((opt, i) => (
          <button 
            key={i} 
            className="mcq-option"
            onClick={() => handleAnswer(opt.weight)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
