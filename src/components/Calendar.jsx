import React from 'react';

export default function Calendar({ currentUser }) {
  const checkIns = currentUser?.checkIns || [];
  const checkInMap = {};
  checkIns.forEach(c => {
    const dString = new Date(c.date).toDateString();
    checkInMap[dString] = c.score;
  });

  const totalCells = 7 * 20; // Show roughly last 5 months for better responsiveness on mobile

  return (
    <div className="calendar-wrapper" style={{ marginTop: '1rem' }}>
      <div className="calendar-header flex-between" style={{ marginBottom: '1.5rem' }}>
        <h3 className="headline-sm">Friendship Heatmap</h3>
        <span className="label-sm" style={{ opacity: 0.6 }}>Yearly Sync</span>
      </div>
      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(14px, 1fr))', gap: '4px' }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const daysAgo = (totalCells - 1) - i;
          const d = new Date();
          d.setDate(d.getDate() - daysAgo);
          const dString = d.toDateString();
          
          let bgColor = 'var(--surface-high)';
          const score = checkInMap[dString];
          if (score !== undefined) {
             if (score < 5) bgColor = 'var(--primary-container)';
             else if (score < 8) bgColor = 'var(--secondary-container)';
             else bgColor = 'var(--primary)';
          }
          
          return (
            <div 
              key={i} 
              className="calendar-day" 
              title={score !== undefined ? `Score: ${score.toFixed(1)} on ${dString}` : dString}
              style={{ 
                aspectRatio: '1', 
                borderRadius: '4px', 
                background: bgColor,
                transition: 'var(--transition-smooth)',
                cursor: 'pointer'
              }}
            >
            </div>
          );
        })}
      </div>
      <div className="flex-center gap-2" style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
        <span>Needs Love</span>
        <div style={{width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary-container)'}}></div>
        <div style={{width: '10px', height: '10px', borderRadius: '2px', background: 'var(--secondary-container)'}}></div>
        <div style={{width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)'}}></div>
        <span>High Vibe</span>
      </div>
    </div>
  );
}
