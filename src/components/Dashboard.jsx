import React, { useEffect, useState } from 'react';
import { Video, Film, Gamepad2, Smartphone, Heart, AlertCircle, Sparkles, Users } from 'lucide-react';
import Calendar from './Calendar';

export default function Dashboard({ myScore, friends, activeBestieEmail, setActiveBestieEmail, currentUser }) {
  const [bestieScore, setBestieScore] = useState(7.5);
  
  useEffect(() => {
    if (!activeBestieEmail) return;
    let isMounted = true;
    
    // A small animation interval that settles to a final score dynamically when switching friends
    const interval = setInterval(() => {
      setBestieScore(Math.max(1, Math.min(10, Math.random() * 10)));
    }, 150);

    const fetchScore = async () => {
      let finalScore = 5.0; // Default fallback
      try {
        const res = await fetch(`http://localhost:5001/api/user/${activeBestieEmail}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.latestRating !== null && data.user.latestRating !== undefined) {
            finalScore = data.user.latestRating;
          } else if (data.user && data.user.checkIns && data.user.checkIns.length > 0) {
            finalScore = data.user.checkIns[data.user.checkIns.length - 1].score;
          }
        }
      } catch (err) {
        console.error(err);
      }

      setTimeout(() => {
        if (!isMounted) return;
        clearInterval(interval);
        setBestieScore(finalScore);
      }, 1200);
    };
    
    fetchScore();
    
    // Auto-refresh bestie score every 5s without animation
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/user/${activeBestieEmail}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.latestRating !== null && data.user.latestRating !== undefined) {
            if (isMounted) setBestieScore(data.user.latestRating);
          } else if (data.user && data.user.checkIns && data.user.checkIns.length > 0) {
            if (isMounted) setBestieScore(data.user.checkIns[data.user.checkIns.length - 1].score);
          }
        }
      } catch (e) {}
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, [activeBestieEmail]);

  const bestieName = activeBestieEmail ? activeBestieEmail.split('@')[0] : 'Bestie';

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
            <h3 className="flex-center gap-1" style={{justifyContent: 'flex-start'}}><AlertCircle size={16} /> Bestie needs love! 🥺</h3>
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
            <h3 className="flex-center gap-1" style={{justifyContent: 'flex-start'}}><Sparkles size={16} /> High Vibe! 💖</h3>
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
            <h3 className="flex-center gap-1" style={{justifyContent: 'flex-start'}}><Heart size={16} /> Mid Vibe 🐶</h3>
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
      
      {/* Network Switcher */}
      {friends.length > 1 && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto' }}>
          <div className="flex-center gap-1" style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>
            <Users size={18} /> Squad:
          </div>
          {friends.map((f, i) => (
            <button 
              key={i}
              onClick={() => setActiveBestieEmail(f.email)}
              style={{
                background: activeBestieEmail === f.email ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                color: activeBestieEmail === f.email ? 'white' : 'var(--text-main)',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {f.email.split('@')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Cute Floating Notification */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        borderRadius: '20px',
        padding: '0.8rem 1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.8rem',
        margin: '0 auto',
        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.15)',
        animation: 'float 4s infinite ease-in-out'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🧸</span>
        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>Your bestie, {bestieName}, misses you!</span>
      </div>

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
          <div className="timestamp">Checked in today 🚀</div>
        </div>

        {/* Bestie's Vibe Card */}
        <div className="vibe-card glass-panel" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="vibe-label title-glow" style={{ fontSize: '1.4rem' }}>
            {bestieName}'s Vibe
          </div>
          
          <div className="relative flex-center" style={{ margin: '1rem 0' }}>
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

      <Calendar currentUser={currentUser} />
    </div>
  );
}
