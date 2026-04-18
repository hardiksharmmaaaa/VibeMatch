import React from 'react';

export default function Calendar({ currentUser }) {
  const checkIns = currentUser?.checkIns || [];
  const checkInMap = {};
  checkIns.forEach(c => {
    const dString = new Date(c.date).toDateString();
    checkInMap[dString] = c.score;
  });

  const startDate = new Date(2026, 2, 1);
  const today = new Date();
  
  // Create an array of days from March 1st to today
  const days = [];
  let current = new Date(startDate);
  while (current <= today) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getVibeColor = (score) => {
    if (score === undefined) return 'var(--surface-container-highest)';
    if (score < 5) return 'var(--primary-container)';
    if (score < 8) return 'var(--secondary-container)';
    return 'var(--primary)';
  };

  return (
    <div className="calendar-wrapper" style={{ marginTop: '0.5rem' }}>
      <div className="calendar-header flex-between" style={{ marginBottom: '1.5rem' }}>
        <h3 className="label-sm" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Vibe Trail • Since March</h3>
        <div className="flex-center gap-4" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
          <div className="flex-center gap-1">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-container)' }} />
            <span>Low</span>
          </div>
          <div className="flex-center gap-1">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div 
        className="vibe-trail-container" 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          overflowX: 'auto', 
          padding: '1rem 0.5rem 1.5rem',
          scrollSnapType: 'x mandatory',
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        {days.map((d, i) => {
          const dString = d.toDateString();
          const score = checkInMap[dString];
          const color = getVibeColor(score);
          const isToday = dString === today.toDateString();
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = d.getDate();

          return (
            <div 
              key={i}
              style={{ 
                flex: '0 0 auto', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.8rem',
                scrollSnapAlign: 'start'
              }}
            >
              <div 
                title={`${dString}: ${score ? score.toFixed(1) : 'No data'}`}
                style={{ 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: color,
                  position: 'relative',
                  boxShadow: score ? `0 0 15px ${color}66` : 'none',
                  border: isToday ? '2px solid white' : '2px solid transparent',
                  transition: 'var(--transition-smooth)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isToday && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'white' }}>{dayName}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'white' }}>{dayNum}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
