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
        onInviteSent(); // trigger parent refresh
        setEmail('');
      }
    } catch (err) {
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="onboarding-card glass animate-slide-in">
      
      <div className="flex-center" style={{ marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
          <UserPlus size={40} color="var(--accent-blue)" />
        </div>
      </div>
      <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Nominate Your Bestie</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        You must have an accepted friend to use the app. They will receive an email to accept. (Limit: 2 per day)
      </p>

      {errorMsg && (
        <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid var(--accent-pink)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}
      
      {message && (
        <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid var(--accent-green)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="col gap-2">
        <input 
          type="email" 
          className="input-glass" 
          placeholder="bestie@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isWaiting}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isWaiting}>
          {isWaiting ? 'Sending...' : 'Send Invitation'} <Send size={18} />
        </button>
      </form>

      {pendingFriends && pendingFriends.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding:'1rem', borderRadius: '12px' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Mails Sent - Waiting for Acceptance</h4>
          {pendingFriends.map((f, i) => (
            <div key={i} className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>{f.email}</span>
              <span className="flex-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--accent-orange)' }}>
                <Clock size={14} /> Pending
              </span>
            </div>
          ))}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            The app will automatically unlock once someone accepts.
          </p>
        </div>
      )}
    </div>
  );
}
