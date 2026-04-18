import React, { useState, useEffect } from 'react';
import { Heart, Settings, Sparkles } from 'lucide-react';
import './App.css';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import MCQ from './components/MCQ';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vibecheck_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeBestieEmail, setActiveBestieEmail] = useState(null);
  const [myScore, setMyScore] = useState(() => {
    const saved = localStorage.getItem('vibecheck_score');
    return saved ? parseFloat(saved) : null;
  });
  const [currentView, setCurrentView] = useState('dashboard');

  const refreshUser = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5001/api/user/${currentUser.email}`);
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('vibecheck_user', JSON.stringify(data.user));
        
        const acceptedFriends = data.user.friends?.filter(f => f.status === 'accepted') || [];
        if (acceptedFriends.length > 0 && !activeBestieEmail) {
          setActiveBestieEmail(acceptedFriends[0].email);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Re-sync active bestie on mount if user is already logged in
    if (currentUser && !activeBestieEmail) {
      const acceptedFriends = currentUser.friends?.filter(f => f.status === 'accepted') || [];
      if (acceptedFriends.length > 0) {
        setActiveBestieEmail(acceptedFriends[0].email);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(refreshUser, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser, activeBestieEmail]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('vibecheck_user', JSON.stringify(user));

    const acceptedFriends = user.friends?.filter(f => f.status === 'accepted') || [];
    if (acceptedFriends.length > 0) {
      setActiveBestieEmail(acceptedFriends[0].email);
    }
    if (user.checkIns?.length > 0) {
      const lastCheckIn = user.checkIns[user.checkIns.length - 1];
      if (new Date(lastCheckIn.date).toDateString() === new Date().toDateString()) {
        setMyScore(lastCheckIn.score);
        localStorage.setItem('vibecheck_score', lastCheckIn.score.toString());
      }
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveBestieEmail(null);
    setMyScore(null);
    setCurrentView('dashboard');
    localStorage.removeItem('vibecheck_user');
    localStorage.removeItem('vibecheck_score');
  };

  const handleMCQComplete = async (score) => {
    try {
      await fetch(`http://localhost:5001/api/user/${currentUser.email}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      });
      setMyScore(score);
      localStorage.setItem('vibecheck_score', score.toString());
      refreshUser();
    } catch (err) {
      console.error('Failed to save score:', err);
      setMyScore(score);
      localStorage.setItem('vibecheck_score', score.toString());
    }
  };

  const acceptedFriends = currentUser?.friends?.filter(f => f.status === 'accepted') || [];
  const pendingFriends = currentUser?.friends?.filter(f => f.status === 'pending') || [];
  
  const showLanding = !currentUser;
  const showOnboarding = currentUser && acceptedFriends.length === 0;
  const showMCQ = currentUser && acceptedFriends.length > 0 && myScore === null;
  const showDashboard = currentUser && acceptedFriends.length > 0 && myScore !== null && currentView === 'dashboard';
  const showProfile = currentUser && currentView === 'profile';

  return (
    <div className="animate-fade-in">
      {showLanding ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <div className="app-container" style={{ justifyContent: 'flex-start', paddingTop: '0', gap: '0.5rem' }}>
          {/* New Navbar */}
          <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 0',
            marginBottom: '1rem',
            width: '100%',
            borderBottom: '1px solid rgba(172, 45, 94, 0.05)'
          }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <div 
                onClick={() => setCurrentView('dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', cursor: 'pointer' }}
              >
                <Sparkles size={24} color="var(--primary)" />
                <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--primary)' }}>VibeCheck</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <span 
                  onClick={() => setCurrentView('dashboard')}
                  style={{ 
                    color: currentView === 'dashboard' ? 'var(--primary)' : '#94a3b8', 
                    fontWeight: 700, 
                    fontSize: '0.9rem', 
                    cursor: 'pointer', 
                    borderBottom: currentView === 'dashboard' ? '2px solid var(--primary)' : 'none', 
                    paddingBottom: '0.2rem' 
                  }}
                >
                  Dashboard
                </span>
                <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Gallery</span>
                <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Timeline</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
               <Heart size={20} color="var(--primary)" style={{ cursor: 'pointer', opacity: 0.8 }} />
               <Settings size={20} color="var(--primary)" style={{ cursor: 'pointer', opacity: 0.8 }} />
               <div 
                 onClick={() => setCurrentView('profile')}
                 style={{ 
                   width: '38px', 
                   height: '38px', 
                   borderRadius: '10px', 
                   border: currentView === 'profile' ? '2px solid var(--primary)' : '1px solid var(--primary-container)', 
                   overflow: 'hidden', 
                   cursor: 'pointer',
                   background: 'var(--surface-container-high)',
                   transition: 'all 0.2s ease'
                 }}>
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'User'}`} alt="profile" />
               </div>
               <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-[#ac2d5e] hover:underline"
                style={{ marginLeft: '0.5rem' }}
              >
                Sign Out
              </button>
            </div>
          </nav>

          {showOnboarding && (
            <Onboarding 
              currentUser={currentUser}
              pendingFriends={pendingFriends}
              onInviteSent={refreshUser}
            />
          )}

          {showMCQ && <MCQ onComplete={handleMCQComplete} />}

          {showDashboard && (
            <Dashboard 
              myScore={myScore} 
              friends={acceptedFriends}
              activeBestieEmail={activeBestieEmail}
              setActiveBestieEmail={setActiveBestieEmail}
              currentUser={currentUser}
            />
          )}

          {showProfile && (
             <Profile 
                currentUser={currentUser} 
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  localStorage.setItem('vibecheck_user', JSON.stringify(updated));
                }}
             />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
