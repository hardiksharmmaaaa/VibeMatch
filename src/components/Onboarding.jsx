import React, { useState } from 'react';
import { Send, UserPlus } from 'lucide-react';

export default function Onboarding({ currentUser, onAccept }) {
  const [email, setEmail] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsWaiting(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myEmail: currentUser.email,
          myName: currentUser.username,
          bestieEmail: email
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Invite error:", data.error);
        // Fall back gracefully if server errors
      } else {
        setMessage(data.message);
      }
      
      // Give a slight delay to let user see the waiting animation and message before moving to MCQ
      setTimeout(() => {
        onAccept(email);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      // Fallback transition
      setTimeout(() => {
        onAccept(email);
      }, 1500);
    }
  };

  return (
    <div className="onboarding-card glass animate-slide-in">
      {!isWaiting ? (
        <>
          <div className="flex-center" style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
              <UserPlus size={40} color="var(--accent-blue)" />
            </div>
          </div>
          <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Nominate Your Bestie</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Link your accounts to start sharing your daily vibes and stay connected.
          </p>
          
          <form onSubmit={handleSubmit} className="col gap-2">
            <input 
              type="email" 
              className="input-glass" 
              placeholder="bestie@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Send Invitation <Send size={18} />
            </button>
          </form>
        </>
      ) : (
        <div className="col flex-center animate-pulse gap-3" style={{ padding: '2rem 0' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Send size={32} color="white" />
          </div>
          <h2>Waiting for Acceptance...</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            We've sent a nomination email to {email}. Hang tight!
          </p>
          {message && <p style={{ color: 'var(--accent-green)', fontSize: '0.9rem', marginTop: '1rem' }}>{message}</p>}
        </div>
      )}
    </div>
  );
}
