import React, { useEffect, useState } from 'react';
import { Video, Film, Gamepad2, Smartphone, Heart, AlertCircle, Sparkles } from 'lucide-react';
import Calendar from './Calendar';

export default function Dashboard({ myScore, bestieEmail }) {
  // Simulate Bestie's score for demonstration (oscillates around 6-9)
  const [bestieScore, setBestieScore] = useState(7.5);
  
  useEffect(() => {
    // A small animation interval that settles to a final score
    const interval = setInterval(() => {
      setBestieScore(Math.max(1, Math.min(10, Math.random() * 10)));
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      // final simulated score (let's show a dynamic one based on time)
      const mockFinal = [3.2, 6.5, 9.1][Math.floor(Math.random() * 3)];
      setBestieScore(mockFinal);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const bestieName = bestieEmail.split('@')[0];

  const getMyScoreClass = (s) => {
    if (s >= 8) return 'score-high';
    if (s >= 5) return 'score-mid';
    return 'score-low';
  };

  const renderActionCard = (score) => {
    if (score < 5) {
      return (
        <div className="action-card" style={{ borderLeft: '4px solid var(--accent-pink)' }}>
          <div className="action-icon">
            <Smartphone color="var(--accent-pink)" />
          </div>
          <div className="action-content">
            <h3 className="flex-center gap-1" style={{justifyContent: 'flex-start'}}><AlertCircle size={16} /> Action Required</h3>
            <p>Score is low! Send a funny Reel to {bestieName} right now, or start a Video call.</p>
          </div>
        </div>
      );
    } else if (score >= 8) {
      return (
        <div className="action-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
          <div className="action-icon">
            <Gamepad2 color="var(--accent-green)" />
          </div>
          <div className="action-content">
            <h3 className="flex-center gap-1" style={{justifyContent: 'flex-start'}}><Sparkles size={16} /> High Vibe!</h3>
            <p>Vibes are immaculate. Time to book an Arcade session or a Movie Date!</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="action-card" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
          <div className="action-icon">
            <Video color="var(--accent-orange)" />
          </div>
          <div className="action-content">
            <h3 className="flex-center gap-1" style={{justifyContent: 'flex-start'}}><Heart size={16} /> Mid Vibe</h3>
            <p>Just an average day. Grab a coffee together or hop on a quick catch-up call!</p>
          </div>
        </div>
      );
    }
  };

  const getVibeText = (score) => {
    if (score >= 8) return 'Radiant ✨';
    if (score >= 5) return 'Chilling ☕';
    return 'Needs Love 🤍';
  };

  return (
    <div className="dashboard-container animate-slide-in">
      <div className="dashboard-split">
        {/* My Vibe Card */}
        <div className="vibe-card glass-panel">
          <div className="vibe-label" style={{ color: 'var(--accent-blue)' }}>My Vibe</div>
          <div className={`score-display ${getMyScoreClass(myScore)}`}>
            {myScore.toFixed(1)}
          </div>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 500 }}>
            {getVibeText(myScore)}
          </p>
          <div className="timestamp">Last Checked In: Just now</div>
        </div>

        {/* Bestie's Vibe Card */}
        <div className="vibe-card glass-panel" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="vibe-label title-glow" style={{ fontSize: '1.4rem' }}>
            {bestieName}'s Vibe
          </div>
          
          <div className="relative flex-center" style={{ margin: '1rem 0' }}>
            {/* Glowing gauge effect behind the score */}
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: bestieScore >= 8 ? 'var(--accent-green)' : bestieScore >= 5 ? 'var(--accent-orange)' : 'var(--accent-pink)',
              filter: 'blur(30px)',
              opacity: 0.3,
              zIndex: 0
            }}></div>
            <div className={`score-display ${getMyScoreClass(bestieScore)}`} style={{ position: 'relative', zIndex: 1 }}>
              {typeof bestieScore === 'number' ? bestieScore.toFixed(1) : bestieScore}
            </div>
          </div>
          
          <p style={{ color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: 'bold' }}>
            {getVibeText(bestieScore)}
          </p>
          
          {renderActionCard(bestieScore)}
        </div>
      </div>

      <Calendar />
    </div>
  );
}
