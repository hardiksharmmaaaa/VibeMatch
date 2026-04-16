import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import MCQ from './components/MCQ';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [bestieEmail, setBestieEmail] = useState('');
  const [myScore, setMyScore] = useState(null);

  // When a user logs in, we check if they already have a bestie setup
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.bestieEmail) {
      setBestieEmail(user.bestieEmail);
    }
  };

  // Flow control
  const showLanding = !currentUser;
  const showOnboarding = currentUser && !bestieEmail;
  const showMCQ = currentUser && bestieEmail && myScore === null;
  const showDashboard = currentUser && bestieEmail && myScore !== null;

  return (
    <div className="app-container">
      {/* Header hidden on landing page since landing page has its own big header */}
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
          onAccept={(email) => setBestieEmail(email)} 
        />
      )}

      {showMCQ && (
        <MCQ onComplete={(score) => setMyScore(score)} />
      )}

      {showDashboard && (
        <Dashboard myScore={myScore} bestieEmail={bestieEmail} />
      )}
    </div>
  );
}

export default App;
