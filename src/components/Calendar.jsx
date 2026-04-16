import React from 'react';

// Generates fake data for the calendar heatmap
const generateMockData = () => {
  const data = [];
  // 12 months, 31 days max
  for (let month = 0; month < 12; month++) {
    for (let day = 0; day < 31; day++) {
      // randomly skip some to look organic
      if (Math.random() > 0.85) continue;
      
      const vibe = Math.random() * 10;
      let colorClass = 'day-mid';
      if (vibe < 5) colorClass = 'day-low';
      if (vibe >= 8) colorClass = 'day-high';

      data.push({ month, day, colorClass });
    }
  }
  return data;
};

export default function Calendar() {
  const data = generateMockData();

  // Create a 31-column grid representing days, and each cell inside is placed based on its mock data 
  // (Simplified interpretation of the grid for aesthetic purposes)

  return (
    <div className="calendar-wrapper glass mt-4">
      <div className="calendar-header flex-between">
        <h3>Friendship Heatmap</h3>
        <span style={{color: 'var(--text-muted)'}}>Last 12 Months</span>
      </div>
      <div className="calendar-grid">
        {Array.from({ length: 31 * 12 }).map((_, i) => {
          // Add some mock colors randomly but mostly empty/mid to simulate a github grid
          const isFilled = Math.random() > 0.4;
          let colorClass = '';
          if (isFilled) {
             const rand = Math.random();
             if (rand < 0.1) colorClass = 'day-low';
             else if (rand < 0.3) colorClass = 'day-mid';
             else colorClass = 'day-high';
          }
          
          return (
            <div 
              key={i} 
              className={`calendar-day ${colorClass}`} 
              title="Daily Vibe Check"
            />
          );
        })}
      </div>
      <div className="flex-center gap-2" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Less Vibe</span>
        <div className="calendar-day day-low"></div>
        <div className="calendar-day day-mid"></div>
        <div className="calendar-day day-high"></div>
        <span>High Vibe</span>
      </div>
    </div>
  );
}
