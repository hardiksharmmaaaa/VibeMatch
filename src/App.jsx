import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import MCQ from './components/MCQ';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeBestieEmail, setActiveBestieEmail] = useState(null);
  const [myScore, setMyScore] = useState(null);

  const refreshUser = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5001/api/user/${currentUser.email}`);
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        const acceptedFriends = data.user.friends.filter(f => f.status === 'accepted');
        if (acceptedFriends.length > 0 && !activeBestieEmail) {
          setActiveBestieEmail(acceptedFriends[0].email);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(refreshUser, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser, activeBestieEmail]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    const acceptedFriends = user.friends?.filter(f => f.status === 'accepted') || [];
    if (acceptedFriends.length > 0) {
      setActiveBestieEmail(acceptedFriends[0].email);
    }
    if (user.checkIns?.length > 0) {
      const lastCheckIn = user.checkIns[user.checkIns.length - 1];
      if (new Date(lastCheckIn.date).toDateString() === new Date().toDateString()) {
        setMyScore(lastCheckIn.score);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveBestieEmail(null);
    setMyScore(null);
  };

  const handleMCQComplete = async (score) => {
    try {
      await fetch(`http://localhost:5001/api/user/${currentUser.email}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      });
      setMyScore(score);
      refreshUser();
    } catch (err) {
      console.error('Failed to save score:', err);
      setMyScore(score);
    }
  };

  const acceptedFriends = currentUser?.friends?.filter(f => f.status === 'accepted') || [];
  const pendingFriends = currentUser?.friends?.filter(f => f.status === 'pending') || [];
  
  const showLanding = !currentUser;
  const showOnboarding = currentUser && acceptedFriends.length === 0;
  const showMCQ = currentUser && acceptedFriends.length > 0 && myScore === null;
  const showDashboard = currentUser && acceptedFriends.length > 0 && myScore !== null;

  return (
    <div className="animate-fade-in">
      {showLanding ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <div className="app-container">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <p className="label-sm">Tactile Dreamscape</p>
                <h1 className="display-lg">VibeCheck</h1>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-[#ac2d5e] hover:underline"
              >
                Sign Out
              </button>
            </div>
            <p className="on-surface-variant">Checking in with your circle, {currentUser?.username || 'Bestie'}</p>

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
        </div>
      )}
    </div>
  );
}

export default App;
