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

      if (!isLogin) {
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="panel animate-fade-in" style={{ maxWidth: '440px', width: '100%', background: 'var(--surface-lowest)', boxShadow: '0 20px 60px -10px rgba(125, 77, 95, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p className="label-sm">Ethereal Connections</p>
          <h1 className="display-lg" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>VibeCheck</h1>
          <p className="on-surface-variant">
            {isLogin ? 'Login to sync your vibes' : 'Join the tactile dreamscape'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--primary-container)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <input 
              name="username" type="text" placeholder="Username" 
              value={formData.username} onChange={handleChange} required 
              style={{ padding: '1rem 1.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-high)', background: 'var(--surface-low)', outline: 'none' }}
            />
          )}
          <input 
            name="email" type="email" placeholder="Email Address" 
            value={formData.email} onChange={handleChange} required 
            style={{ padding: '1rem 1.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-high)', background: 'var(--surface-low)', outline: 'none' }}
          />
          <input 
            name="password" type="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} required 
            minLength="6"
            style={{ padding: '1rem 1.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-high)', background: 'var(--surface-low)', outline: 'none' }}
          />

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span className="on-surface-variant">{isLogin ? "New to the vibe? " : "Already synced? "}</span>
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }} 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Create Account' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}
