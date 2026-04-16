import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User } from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success
      if (!isLogin) {
        // Switch to login if registered
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      } else {
        // Authenticate
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-card glass animate-slide-in" style={{ maxWidth: '400px' }}>
      <div className="flex-center relative" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
        <span style={{ position: 'absolute', left: '-10px', top: '-20px', fontSize: '1.8rem', animation: 'float 3s infinite ease-in-out' }}>💖</span>
        <span style={{ position: 'absolute', right: '-10px', top: '5px', fontSize: '1.8rem', animation: 'float 4s infinite ease-in-out', animationDelay: '1s' }}>🧸</span>
        <h1 className="title-glow flex-center gap-2" style={{ fontSize: '2.5rem' }}>
          VibeCheck <Sparkles color="var(--accent-blue)" />
        </h1>
      </div>
      
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        {isLogin ? 'Log in to check your daily vibes.' : 'Join now to sync vibes with your bestie.'}
      </p>

      {error && (
        <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid var(--accent-pink)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-main)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="col gap-2">
        {!isLogin && (
          <div className="relative">
            <input 
              name="username" type="text" className="input-glass" placeholder="Username" 
              value={formData.username} onChange={handleChange} required 
            />
          </div>
        )}
        <div className="relative">
          <input 
            name="email" type="email" className="input-glass" placeholder="Email Address" 
            value={formData.email} onChange={handleChange} required 
          />
        </div>
        <div className="relative">
          <input 
            name="password" type="password" className="input-glass" placeholder="Password" 
            value={formData.password} onChange={handleChange} required 
            minLength="6"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
        </button>
      </form>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 'bold' }} 
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </span>
      </div>
    </div>
  );
}
