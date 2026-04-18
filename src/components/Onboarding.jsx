import React, { useState } from 'react';
import { Send, UserPlus, Clock } from 'lucide-react';

export default function Onboarding({ currentUser, pendingFriends, onInviteSent }) {
  const [email, setEmail] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsWaiting(true);
    setErrorMsg('');
    setMessage('');
    
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
        setErrorMsg(data.error || "An error occurred");
      } else {
        setMessage(data.message);
        onInviteSent();
        setEmail('');
      }
    } catch (err) {
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="panel animate-fade-in" style={{ maxWidth: '500px', width: '100%', background: 'var(--surface-lowest)', boxShadow: '0 20px 60px -10px rgba(125, 77, 95, 0.1)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p className="label-sm">Expanding the Circle</p>
          <h1 className="headline-sm" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Nominate Your Bestie</h1>
          <p className="on-surface-variant" style={{ marginTop: '0.5rem' }}>
            Sync vibes with your favorite person. They'll receive an email to join your dreamscape.
          </p>
          <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px', fontSize: '0.75rem', color: '#c53030', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
            <p><strong>Dev Note:</strong> Since we are using Resend's free tier, invitations will only be delivered to your own registered email address.</p>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'var(--primary-container)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
        
        {message && (
          <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid var(--primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="bestie@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isWaiting}
            style={{ padding: '1rem 1.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-high)', background: 'var(--surface-low)', outline: 'none' }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isWaiting}>
            {isWaiting ? 'Sending...' : 'Send Invitation'} <Send size={18} />
          </button>
        </form>

        {pendingFriends && pendingFriends.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4 className="label-sm" style={{ marginBottom: '1rem' }}>Pending Synced Circles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pendingFriends.map((f, i) => (
                <div key={i} className="flex-between card" style={{ padding: '0.8rem 1rem', background: 'var(--surface-low)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{f.email}</span>
                  <span className="flex-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                    <Clock size={14} /> PENDING
                  </span>
                </div>
              ))}
            </div>
            <p className="on-surface-variant" style={{ fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
               Automatically unlocks once accepted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
