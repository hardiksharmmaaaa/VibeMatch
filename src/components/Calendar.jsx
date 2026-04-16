import React from 'react';

export default function Calendar({ currentUser }) {
  // Real data parsing for the heatmap
  const checkIns = currentUser?.checkIns || [];
  
  // Create a map of date string to score
  const checkInMap = {};
  checkIns.forEach(c => {
    const dString = new Date(c.date).toDateString();
    checkInMap[dString] = c.score; // Stores the latest score of that day if multiple exist
  });

  const totalCells = 31 * 12;

  return (
    <div className="calendar-wrapper glass-panel" style={{ marginTop: '2rem' }}>
      <div className="calendar-header flex-between">
        <h3 className="title-glow" style={{ fontSize: '1.4rem' }}>Friendship Heatmap 🔥</h3>
        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Last year</span>
      </div>
      <div className="calendar-grid">
        {Array.from({ length: totalCells }).map((_, i) => {
          // Calculate logic for days ago (going backwards from today being the last cell)
          const daysAgo = (totalCells - 1) - i;
          const d = new Date();
          d.setDate(d.getDate() - daysAgo);
          const dString = d.toDateString();
          
          let colorClass = '';
          const score = checkInMap[dString];
          if (score !== undefined) {
             if (score < 5) colorClass = 'day-low';
             else if (score < 8) colorClass = 'day-mid';
             else colorClass = 'day-high';
          }
          
          return (
            <div 
              key={i} 
              className={`calendar-day flex-center ${colorClass}`} 
              title={score !== undefined ? `Score: ${score.toFixed(1)} on ${dString}` : `No check-in on ${dString}`}
              style={{ position: 'relative' }}
            >
              {colorClass === 'day-high' && <span style={{fontSize: '9px'}}>✨</span>}
            </div>
          );
        })}
      </div>
      <div className="flex-center gap-2" style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Needs Love</span>
        <div className="calendar-day day-low" style={{width: '12px', height: '12px'}}></div>
        <div className="calendar-day day-mid" style={{width: '12px', height: '12px'}}></div>
        <div className="calendar-day day-high flex-center" style={{width: '12px', height: '12px'}}>✨</div>
        <span>High Vibe</span>
      </div>
    </div>
  );
}
