import React, { useEffect, useState } from 'react';
import { Video, Film, Gamepad2, Smartphone, Heart, AlertCircle, Sparkles, Users } from 'lucide-react';
import Calendar from './Calendar';

export default function Dashboard({ myScore, friends, activeBestieEmail, setActiveBestieEmail, currentUser }) {
  const [bestieScore, setBestieScore] = useState(7.5);
  
  useEffect(() => {
    if (!activeBestieEmail) return;
    let isMounted = true;
    
    const interval = setInterval(() => {
      setBestieScore(Math.max(1, Math.min(10, Math.random() * 10)));
    }, 150);

    const fetchScore = async () => {
      let finalScore = 5.0;
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
    
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/user/${activeBestieEmail}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user?.latestRating !== null && data.user?.latestRating !== undefined) {
            if (isMounted) setBestieScore(data.user.latestRating);
          } else if (data.user?.checkIns?.length > 0) {
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

  const renderActionCard = (score) => {
    if (score < 5) {
      return (
        <div className="card" style={{ background: 'var(--primary-container)', color: 'var(--primary)' }}>
          <div className="flex-center gap-1" style={{ marginBottom: '0.5rem' }}>
            <AlertCircle size={20} />
            <h3 className="headline-sm" style={{ margin: 0, color: 'var(--primary)' }}>Cheer Up Mission 🎀</h3>
          </div>
          <p style={{ opacity: 0.8 }}>{bestieName} is feeling a bit blue. Send a funny Reel or start a video call to fix the soul.</p>
          <div className="flex-center gap-2" style={{ marginTop: '1rem' }}>
            <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              <Video size={16} /> Call Now
            </button>
          </div>
        </div>
      );
    } else if (score >= 8) {
      return (
        <div className="card" style={{ background: 'rgba(181, 5, 82, 0.1)', color: 'var(--tertiary)' }}>
          <div className="flex-center gap-1" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={20} />
            <h3 className="headline-sm" style={{ margin: 0, color: 'var(--tertiary)' }}>Our Vibe 💖</h3>
          </div>
          <p style={{ opacity: 0.8 }}>Vibes are immaculate! Time to book a bowling date or a movie night.</p>
          <button className="btn-primary" style={{ marginTop: '1rem', background: 'var(--tertiary)', padding: '0.6rem 1.2rem' }}>
             <Gamepad2 size={16} /> Plan Date
          </button>
        </div>
      );
    } else {
      return (
        <div className="card" style={{ background: 'var(--secondary-container)', color: 'var(--secondary)' }}>
          <div className="flex-center gap-1" style={{ marginBottom: '0.5rem' }}>
            <Heart size={20} />
            <h3 className="headline-sm" style={{ margin: 0, color: 'var(--secondary)' }}>Stay Connected ☕</h3>
          </div>
          <p style={{ opacity: 0.8 }}>Just an average day. Grab a coffee together or hop on a quick catch-up call!</p>
          <button className="btn-secondary" style={{ marginTop: '1rem' }}>
            <Smartphone size={16} /> Send Vibe
          </button>
        </div>
      );
    }
  };

  const getVibeStatus = (score) => {
    if (score >= 8) return 'Living her best life ✨';
    if (score >= 5) return 'Chilling and thriving ☕';
    return 'Feeling a bit blue 🥺';
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      
      {/* Squad Switcher - Editorial Pill Style */}
      {friends.length > 1 && (
        <div className="flex-center gap-2" style={{ overflowX: 'auto', padding: '0.5rem' }}>
          {friends.map((f, i) => (
            <button 
              key={i}
              onClick={() => setActiveBestieEmail(f.email)}
              className={activeBestieEmail === f.email ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
            >
              {f.email.split('@')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid - Intentional Asymmetry */}
      <div className="panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', alignItems: 'start' }}>
        
        {/* Personal Stats Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
           <h2 className="headline-sm">My Current Vibe</h2>
           <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
             <p className="label-sm">Daily Score</p>
             <h1 className="display-lg" style={{ margin: '0.5rem 0', color: 'var(--primary)' }}>
               {myScore.toFixed(1)}
             </h1>
             <p className="on-surface-variant">Thriving today! 🚀</p>
           </div>
           
           <div className="card" style={{ background: 'var(--surface-high)' }}>
             <p className="label-sm">Activity</p>
             <p className="on-surface" style={{ marginTop: '0.5rem', fontWeight: 500 }}>3 day streak with {bestieName} 🔥</p>
           </div>
        </div>

        {/* Bestie Section - The "Morning, bestie" feel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <h2 className="headline-sm">{bestieName}'s Atmosphere</h2>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--primary-container)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-container)', overflow: 'hidden' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bestieName}`} alt="avatar" />
              </div>
              <div>
                <h3 className="headline-sm" style={{ margin: 0, fontSize: '1.2rem' }}>{bestieName}</h3>
                <p className="label-sm" style={{ fontSize: '0.65rem' }}>{getVibeStatus(bestieScore)}</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                 <p className="label-sm">Score</p>
                 <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{bestieScore.toFixed(1)}</span>
              </div>
            </div>
            
            {renderActionCard(bestieScore)}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="headline-sm">Timeline & Mood History</h2>
        <Calendar currentUser={currentUser} />
      </div>

      {/* Sync Activities - Imported from Stitch project */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', background: 'var(--surface-high)' }}>
          <div className="flex-between">
            <h2 className="headline-sm" style={{ fontSize: '1.2rem', margin: 0 }}>Vibe-Sync Playlists</h2>
            <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'var(--primary-container)' }}>
               <Film size={18} color="var(--primary)" />
            </div>
          </div>
          <p className="on-surface-variant" style={{ fontSize: '0.9rem' }}>Curating a shared soundscape based on your collective aura.</p>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px' }}></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Late Night Gossips</p>
              <p className="label-sm" style={{ fontSize: '0.6rem' }}>8 Tracks • Updated today</p>
            </div>
          </div>
          <button className="btn-secondary" style={{ width: '100%' }}>Open Player</button>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', background: 'var(--secondary-container)' }}>
          <div className="flex-between">
            <h2 className="headline-sm" style={{ fontSize: '1.2rem', margin: 0 }}>Cosy Puzzles</h2>
             <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'var(--surface-lowest)' }}>
               <Gamepad2 size={18} color="var(--secondary)" />
            </div>
          </div>
          <p className="on-surface-variant" style={{ fontSize: '0.9rem' }}>Unwind together with low-stress interactive challenges.</p>
          <div className="card" style={{ border: '1px solid var(--secondary)', background: 'transparent' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--secondary)' }}>Weekly Challenge: Pastel Garden</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{bestieName} is waiting for your move!</p>
          </div>
          <button className="btn-primary" style={{ width: '100%', background: 'var(--secondary)' }}>Start Game</button>
        </div>
      </div>
    </div>
  );
}
