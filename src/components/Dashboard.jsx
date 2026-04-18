import React, { useEffect, useState } from 'react';
import { Video, Film, Gamepad2, Smartphone, Heart, AlertCircle, Sparkles, Users, Calendar as CalendarIcon, Coffee, Trophy, Cat, ArrowRight } from 'lucide-react';
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

  const getVibeStatus = (score) => {
    if (score >= 8) return 'Living her best life ✨';
    if (score >= 5) return 'Chilling and thriving ☕';
    return 'Feeling a bit blue 🥺';
  };

  const [gameSession, setGameSession] = useState(null);

  // Poll for game session status
  useEffect(() => {
    if (!currentUser?.email || !activeBestieEmail) return;
    
    const pollGame = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/game/status/${currentUser.email}/${activeBestieEmail}`);
        if (res.ok) {
          const data = await res.json();
          setGameSession(data.session);
          
          // If status is ready, redirect
          if (data.session?.status === 'ready') {
            const emails = [currentUser.email, activeBestieEmail].sort();
            const roomId = emails.map(e => e.split('@')[0]).join('-').replace(/[^a-zA-Z0-9-]/g, '');
            // Small delay to ensure both see the status before redirecting
            setTimeout(() => {
               window.location.href = `http://localhost:3000/room/${roomId}`;
            }, 800);
          }
        }
      } catch (err) {}
    };

    pollGame();
    const interval = setInterval(pollGame, 3000);
    return () => clearInterval(interval);
  }, [currentUser?.email, activeBestieEmail]);

  const initiateGame = async () => {
    await fetch('http://localhost:5001/api/game/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: currentUser.email, to: activeBestieEmail })
    });
  };

  const joinGame = async () => {
    await fetch('http://localhost:5001/api/game/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: currentUser.email, to: activeBestieEmail })
    });
  };

  const cancelGame = async () => {
    await fetch('http://localhost:5001/api/game/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: currentUser.email, to: activeBestieEmail })
    });
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* Hero Header */}
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="display-lg" style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
          Morning, {currentUser?.username?.split(' ')[0] || 'bestie'}.
        </h1>
        <p style={{ color: 'var(--secondary)', fontWeight: 500, fontStyle: 'italic', opacity: 0.8 }}>
          Check the vibes, stay connected.
        </p>
      </header>

      {/* Squad Switcher */}
      {friends.length > 1 && (
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', padding: '0.5rem 0', marginBottom: '2rem' }}>
          {friends.map((f, i) => (
            <button 
              key={i}
              onClick={() => setActiveBestieEmail(f.email)}
              className={activeBestieEmail === f.email ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.8rem', padding: '0.6rem 1.4rem', whiteSpace: 'nowrap' }}
            >
              {f.email.split('@')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Main Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Personal Vibe Card */}
        <div className="card" style={{ 
          background: 'var(--surface-container-lowest)', 
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'var(--primary-container)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>
           <div>
              <div className="flex-center gap-3" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
                 <div style={{ width: '56px', height: '56px', borderRadius: '1rem', overflow: 'hidden', background: 'var(--surface-container-high)' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.avatarSeed || currentUser?.email || 'User'}`} alt="me" />
                 </div>
                 <div>
                    <h2 className="headline-sm" style={{ margin: 0, fontSize: '1.4rem' }}>My Aura</h2>
                    <p className="label-sm" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>Radiating energy</p>
                 </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                 <span className="display-lg" style={{ color: 'var(--primary)', fontSize: '5rem' }}>{myScore?.toFixed(0)}</span>
                 <span className="headline-sm" style={{ opacity: 0.2 }}>/10</span>
              </div>
           </div>
           <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.5rem 1rem', background: 'var(--primary-container)', opacity: 0.4, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>✨ Thriving</span>
              <span style={{ padding: '0.5rem 1rem', background: 'var(--secondary-container)', opacity: 0.4, borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>🔥 Streak 3</span>
           </div>
        </div>

        {/* Bestie Vibe Card */}
        <div className="card" style={{ 
          background: 'var(--surface-container-lowest)', 
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          border: bestieScore < 5 ? '2px solid var(--primary-container)' : 'none'
        }}>
           {bestieScore < 5 && (
             <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <AlertCircle size={32} color="var(--primary-container)" opacity={0.3} />
             </div>
           )}
           <div>
              <div className="flex-center gap-3" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
                 <div style={{ width: '56px', height: '56px', borderRadius: '1rem', overflow: 'hidden', background: 'var(--primary-container)' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bestieName}`} alt="bestie" />
                 </div>
                 <div>
                    <h2 className="headline-sm" style={{ margin: 0, fontSize: '1.4rem' }}>{bestieName}</h2>
                    <p className="label-sm" style={{ color: bestieScore < 5 ? 'var(--tertiary)' : 'var(--primary)', fontSize: '0.65rem' }}>
                      {getVibeStatus(bestieScore)}
                    </p>
                 </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                 <span className="display-lg" style={{ color: bestieScore < 5 ? 'var(--tertiary)' : 'var(--primary)', fontSize: '5rem' }}>
                    {bestieScore.toFixed(0)}
                 </span>
                 <span className="headline-sm" style={{ opacity: 0.2 }}>/10</span>
              </div>
           </div>
           <div style={{ marginTop: '2rem' }}>
              {bestieScore < 5 ? (
                <button className="btn-primary" style={{ width: '100%', padding: '1rem', background: 'var(--tertiary)' }}>Send a Hug</button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <span style={{ padding: '0.5rem 1rem', background: 'rgba(172, 45, 94, 0.1)', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>🎧 Listening</span>
                   <span style={{ padding: '0.5rem 1rem', background: 'rgba(172, 45, 94, 0.1)', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>☕ Coffee soon</span>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Vibe Trail */}
      <div className="panel" style={{ 
        background: 'rgba(24, 24, 27, 0.9)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        marginBottom: '2rem'
      }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div className="flex-center gap-2">
             <CalendarIcon size={20} color="var(--primary-container)" />
             <h2 className="headline-sm" style={{ margin: 0, color: 'white' }}>Timeline & Mood History</h2>
          </div>
          <p className="label-sm" style={{ opacity: 0.5, color: 'white' }}>2026 Season</p>
        </div>
        <Calendar currentUser={currentUser} />
      </div>

      {/* Cheer Up Mission Section */}
      <section>
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h3 className="headline-sm" style={{ fontSize: '1.8rem' }}>Cheer Up Mission 🎀</h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-container)', padding: '0.4rem 1rem', borderRadius: '99px', opacity: 0.6 }}>4 Suggestions</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="card group" style={{ background: 'var(--surface-container-lowest)', padding: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ height: '240px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1PKs2H785Rzt1rX4hdxWvM0VkHSqHhy2Q_KLQTfvlrPzg0Jgg6Mziyyfel-hkiujH30gII5OLKmQpcHtefwj9oovcxsuL8k-q1guUiQX8y-lXH0eKy9CBMEHpSKdlA_Q45PT-W9Cyu7DLoV-9lIez_Wha_C3rjtyQvtmQ18Hila1ASzunSGrIK9G4s7dQWEvOlH75FlPI7pLEiBBsPsR0-MDttaNTlzYMfzjhmC74OKcNIS4Q01qnqAOVKUvtcZke9u96rsw_C8Qr" alt="Cafe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}><Coffee color="white" /></div>
             </div>
             <h4 className="headline-sm" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Cafe Date</h4>
             <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Pastries and gossip to fix the soul.</p>
             <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                Let's Go <ArrowRight size={14} />
             </button>
          </div>

          {/* Bowling Date */}
          <div className="card group" style={{ background: 'var(--surface-container-lowest)', padding: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ height: '240px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEpTbKk1ejSfieQxXytaNMmzHP-X5292-fu2CzoZS2UHOfSk4cC_BuuUICimTDDNvyXJI4ZZ7Ne4k_Eq5j6o3WjMXTD_mGTH439-u05b5Js-Vq6LqyMSu3hWKCVLJ2FK3MzZDBDC4fubP_B0Dkj0zRqSwU0iUWq3sQlE5h1AspHLB8SGHLex36IWRFnVDzVJJEeHTnPZkeniqursJxRjnaiMoYS9tq8zRiOAwpeUhAgLYh0FOidvTEKfSlZiryNhXRdMKitE9jrRY6" alt="Bowling" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}><Trophy color="white" /></div>
             </div>
             <h4 className="headline-sm" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Bowling Date</h4>
             <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Strike away the bad feelings.</p>
             <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                Let's Go <ArrowRight size={14} />
             </button>
          </div>

          {/* Maggie Date */}
          <div className="card group" style={{ background: 'var(--surface-container-lowest)', padding: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ height: '240px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKeFE5umib--Qjs9s3gf6vHzKfd2h2jggh1PotIXHlVSsLMcVNenQWI0ClJAHXCaGdocFQQs8VUVo_J8HRNUyNkWZ1cQgvIHS1UCtOG8jBJ1TGFO1qR4YKCYLlai0h_Y9gYj_deWvJ6jKgyQzsWKJWnhGiHGLKZznceigG4P5agtV0y9_6GP6BdrGQoEahMnku-0pq8mgzvQxxXl3sUSYrU-XrsxWl_Z16Dy6Az-QBydPsaeuxkaPBcIygVEAXF90vWIw4DdOSChLP" alt="Maggie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}><Cat color="white" /></div>
             </div>
             <h4 className="headline-sm" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Maggie Date</h4>
             <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Cuddles with the world's best cat.</p>
             <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                Let's Go <ArrowRight size={14} />
             </button>
          </div>

          {/* Game Date */}
          <div className="card group" style={{ background: 'var(--surface-container-lowest)', padding: '1.5rem', transition: 'transform 0.3s ease' }}>
             <div style={{ height: '240px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPG33cyexoek0ks75whrlnfbtzLPi_sWnQuxxMOWI32RIfQSdAcO1RbQrjIFflZDtxDYYm1kVW3PxZEVjMX_Z3yjUwTxBzuNr9vDPgq9AoSjpHUFPY19HXkN-tarHDoYthhPkdjpLUYnpyEyv1v6-XyK4HthpZC46TI-qBa3lEz1xzI9tBgENJXt6klitLTPOsE96X-eH9epSx58D40EE6Z5gIXY5nJQRUtKCNAFp6eUNSLuGdC55-Apkqzpld7-uikvNx3Fk9FC3" alt="Game" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}><Gamepad2 color="white" /></div>
             </div>
             <h4 className="headline-sm" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Game Date</h4>
             
             {!gameSession ? (
               <>
                 <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Play cute mini-games and level up.</p>
                 <button 
                    onClick={initiateGame}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                 >
                    Send Invite <ArrowRight size={14} />
                 </button>
               </>
             ) : gameSession.status === 'waiting' ? (
               gameSession.initiatedBy === currentUser.email ? (
                 <>
                   <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Waiting for {bestieName} to join...</p>
                   <button 
                      onClick={cancelGame}
                      style={{ background: 'none', border: 'none', color: 'var(--tertiary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                   >
                      Cancel
                   </button>
                 </>
               ) : (
                 <>
                   <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>{bestieName} wants to play!</p>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                     <button 
                        onClick={joinGame}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                     >
                        Join Now <ArrowRight size={14} />
                     </button>
                     <button 
                        onClick={cancelGame}
                        style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.5, cursor: 'pointer' }}
                     >
                        Decline
                     </button>
                   </div>
                 </>
               )
             ) : (
               <p className="on-surface-variant" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Opening DuoSpace...</p>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
