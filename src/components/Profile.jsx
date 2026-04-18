import React, { useState } from 'react';
import { User, Mail, Phone, AtSign, Check, Camera, Flower2, Heart } from 'lucide-react';

export default function Profile({ currentUser, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+91 98765 43210', // Default placeholder with Indian prefix
    bio: currentUser?.bio || 'Just a vibe check bestie 🌸'
  });
  const [avatarSeed, setAvatarSeed] = useState(currentUser?.username || 'User');

  const avatars = ['Anya', 'Jasper', 'Kiki', 'Luna', 'Milo', 'Coco', 'Oliver', 'Zoe'];

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/user/${currentUser.email}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateUser(data.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const changeAvatar = () => {
    const newSeed = avatars[Math.floor(Math.random() * avatars.length)] + Math.floor(Math.random() * 100);
    setAvatarSeed(newSeed);
  };

  return (
    <div className="animate-fade-in" style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      background: 'white',
      borderRadius: '2rem',
      boxShadow: '0 20px 40px rgba(172, 45, 94, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Indian Touch Decor */}
      <div style={{ 
        position: 'absolute', 
        top: '-50px', 
        right: '-50px', 
        width: '200px', 
        height: '200px', 
        background: 'var(--primary-container)', 
        opacity: 0.1, 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Flower2 size={120} color="var(--primary)" />
      </div>

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '2rem', 
            overflow: 'hidden', 
            border: '4px solid var(--primary-container)',
            background: 'var(--surface-container-high)',
            transform: 'rotate(-3deg)'
          }}>
            <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
               alt="Avatar" 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <button 
            onClick={changeAvatar}
            style={{ 
              position: 'absolute', 
              bottom: '-10px', 
              right: '-10px', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              padding: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
            <Camera size={18} />
          </button>
        </div>
        <h1 className="headline-lg" style={{ color: 'var(--primary)', margin: 0 }}>Namaste, {formData.username.split(' ')[0]} 🙏</h1>
        <p className="on-surface-variant" style={{ fontStyle: 'italic' }}>{formData.bio}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Username Field */}
        <div className="card" style={{ background: 'var(--surface-container-lowest)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ padding: '0.8rem', borderRadius: '1rem', background: 'rgba(255, 179, 0, 0.1)' }}>
            <AtSign color="#FFB300" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="label-sm" style={{ color: '#FFB300', marginBottom: '0.2rem' }}>Username</p>
            <input 
              type="text" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Your handle"
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, fontSize: '1rem', color: 'inherit' }}
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="card" style={{ background: 'var(--surface-container-lowest)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ padding: '0.8rem', borderRadius: '1rem', background: 'rgba(19, 136, 8, 0.1)' }}>
            <Phone color="#138808" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="label-sm" style={{ color: '#138808', marginBottom: '0.2rem' }}>Phone Number</p>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 00000 00000"
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, fontSize: '1rem', color: 'inherit' }}
            />
          </div>
        </div>

        {/* Bio Field */}
        <div className="card" style={{ background: 'var(--surface-container-lowest)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ padding: '0.8rem', borderRadius: '1rem', background: 'rgba(172, 45, 94, 0.1)' }}>
            <Heart color="var(--primary)" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.2rem' }}>Mood Bio</p>
            <input 
              type="text" 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell the besties how you feel..."
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, fontSize: '1rem', color: 'inherit' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.6 }}>
           <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Spread Vibes, Stay Desi</p>
        </div>
      </div>

      <footer style={{ marginTop: '2.5rem' }}>
        <button 
          onClick={handleSave} 
          style={{ 
            width: '100%', 
            padding: '1.2rem', 
            borderRadius: '1.2rem', 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            fontWeight: 800, 
            fontSize: '1rem', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            boxShadow: '0 10px 25px rgba(172, 45, 94, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <Check size={20} strokeWidth={3} /> Save Profile Details
        </button>
      </footer>
    </div>
  );
}
