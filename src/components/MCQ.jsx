import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: "Sach sach batana, raat bhar reels scroll ki ya actual mein neend aayi?", options: [ { label: "Mummy ko mat batana, mushkil se 4 ghante (-1)", weight: -1 }, { label: "5-7 hours, thik thak yaar (2)", weight: 2 }, { label: "8+ hours, pura beauty sleep liya (3)", weight: 3 } ] },
  { id: 2, text: "Stress ka kya scene hai aaj? Zen mode ya ek choti baat pe rona aayega?", options: [ { label: "Life hi kyu chal rahi hai yaar (0)", weight: 0 }, { label: "Manage kar ri hu kisi tarah (1)", weight: 1 }, { label: "Ekdum chill, I am unbothered (3)", weight: 3 } ] },
  { id: 3, text: "Pani wani piya hai ya sirf cold coffee aur stress se zinda ho?", options: [ { label: "Pani kya hota hai? (0)", weight: 0 }, { label: "Ek do sip liye the mummy ke daantne pe (1)", weight: 1 }, { label: "Full hydrated girlie era! (2)", weight: 2 } ] },
  { id: 4, text: "Aaj thoda dhoop dekhi ya bistar se ek dum chipak ke rahi ho?", options: [ { label: "Main toh bistar ka hissa ban chuki hu (0)", weight: 0 }, { label: "Bas balcony tak chali gayi, badi baat hai (1)", weight: 1 }, { label: "Haan, finally ghoomne aayi! (2)", weight: 2 } ] },
  { id: 5, text: "Gym bro banne ka plan tha, uska kya hua aaj?", options: [ { label: "Zero steps, bas bed se fridge tak (0)", weight: 0 }, { label: "Thoda bohot stretch maar liya (1)", weight: 1 }, { label: "Proper workout kiya yaar! (2)", weight: 2 } ] },
  { id: 6, text: "Khane ka kya scene tha aaj? Maggie ya kuch actual healthy khaya?", options: [ { label: "Zomato/Maggie kha ke full guilt chal raha hai (0)", weight: 0 }, { label: "Ghar ka khana, basic dal chawal (1)", weight: 1 }, { label: "Full aesthetic, healthy and nutritious! (2)", weight: 2 } ] },
  { id: 7, text: "Aaj kisi insaan se baat ki ya dosto ko bas randomly reels bhej rahi ho?", options: [ { label: "Mera social battery puri dead hai (0)", weight: 0 }, { label: "Thode messages ka bas reply kiya (1)", weight: 1 }, { label: "Haan, bestie se mast 2 ghante gossip hui! (2)", weight: 2 } ] },
  { id: 8, text: "Dimaag chal raha hai ya dimag ka pura dahi ban chuka hai?", options: [ { label: "Dimaag ne toh jawab de diya hai (0)", weight: 0 }, { label: "Zinda rehne ke liye itna kaafi hai (1)", weight: 1 }, { label: "Full on lock-in. Ekdum productive! (2)", weight: 2 } ] },
  { id: 9, text: "Kaam ka pahad dekh ke rona aa raha hai ki procrastination on track hai?", options: [ { label: "Bohot pending kaam hai, samajh ni aa raha (0)", weight: 0 }, { label: "Kal kar lungi yaar, abhi mood nahi (1)", weight: 1 }, { label: "To-do list ki toh band baja di maine! (2)", weight: 2 } ] },
  { id: 10, text: "Dr. Bestie ka final sawal: Agar tumhari life aaj ek Bollywood movie hoti, toh kya hoti?", options: [ { label: "Devdas ka full on rona dhona (0)", weight: 0 }, { label: "Wake Up Sid wala phase, zero clue (1)", weight: 1 }, { label: "Main apni favourite hu! Full Geet vibes (3)", weight: 3 } ] },
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
      const MAX_WEIGHT = 23;
      const totalWeight = newAnswers.reduce((acc, curr) => acc + curr, weight);
      const score = (totalWeight / MAX_WEIGHT) * 10;
      onComplete(Number(score.toFixed(1)));
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh' }}>
      <div className="panel animate-fade-in" style={{ maxWidth: '600px', width: '100%', background: 'var(--surface-lowest)', boxShadow: '0 20px 60px -10px rgba(125, 77, 95, 0.1)' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <p className="label-sm">Daily Atmosphere Sync</p>
          <span className="label-sm" style={{ color: 'var(--on-surface-variant)' }}>{currentIndex + 1} OF {QUESTIONS.length}</span>
        </div>
        
        <div style={{ width: '100%', height: '6px', background: 'var(--surface-low)', borderRadius: '999px', overflow: 'hidden', marginBottom: '3rem' }}>
          <div style={{ height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'var(--transition-smooth)' }}></div>
        </div>

        <h2 className="headline-sm" style={{ fontSize: '1.8rem', marginBottom: '2.5rem', lineHeight: '1.3' }}>
          {currentQuestion.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQuestion.options.map((opt, i) => (
            <button 
              key={i} 
              className="card"
              onClick={() => handleAnswer(opt.weight)}
              style={{ 
                border: '1px solid var(--surface-high)', 
                textAlign: 'left', 
                padding: '1.2rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--on-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {opt.label}
              <ArrowRight size={18} style={{ opacity: 0.3 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
