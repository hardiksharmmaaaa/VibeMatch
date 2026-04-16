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

  // Re-fetch user to check for updated statuses
  const refreshUser = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5001/api/user/${currentUser.email}`);
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        
        // Auto-select first accepted friend if none selected
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
      // Poll every 5 seconds to automatically advance when friend accepts
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
    
    // Check if user already checked in today
    if (user.checkIns && user.checkIns.length > 0) {
      const lastCheckIn = user.checkIns[user.checkIns.length - 1];
      const today = new Date().toDateString();
      if (new Date(lastCheckIn.date).toDateString() === today) {
        setMyScore(lastCheckIn.score);
      }
    }
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

  const showLanding = !currentUser;
  
  // They are in Onboarding if they have NO accepted friends, 
  // OR explicitly if we added a specific active state (but for now, if no accepted friends we lock them to Onboarding).
  const acceptedFriends = currentUser?.friends?.filter(f => f.status === 'accepted') || [];
  const pendingFriends = currentUser?.friends?.filter(f => f.status === 'pending') || [];
  
  const showOnboarding = currentUser && acceptedFriends.length === 0;
  
  const showMCQ = currentUser && acceptedFriends.length > 0 && myScore === null;
  const showDashboard = currentUser && acceptedFriends.length > 0 && myScore !== null;

  return (
    <>
      <div className="app-bg"></div>
      <div className="app-container">
        {!showLanding && (
          <header className="animate-slide-in">
            <h1 className="title-glow flex-center gap-2">
              VibeCheck
            </h1>
            <p>Your daily friendship sync, {currentUser?.username || 'User'}</p>
          </header>
        )}

        {showLanding && (
          <LandingPage onLogin={handleLogin} />
        )}

        {showOnboarding && (
          <Onboarding 
            currentUser={currentUser}
            pendingFriends={pendingFriends}
            onInviteSent={refreshUser}
          />
        )}

        {showMCQ && (
          <MCQ onComplete={handleMCQComplete} />
        )}

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
    </>
  );
}

export default App;
