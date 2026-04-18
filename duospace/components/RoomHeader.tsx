'use client';

export default function RoomHeader({ roomId }: { roomId: string }) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          DuoSpace Room
        </h1>
        <p className="text-zinc-400 mt-1 flex items-center gap-2">
          ID: <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-white">{roomId}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied!');
            }}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-full transition-colors"
          >
            Copy Invite Link
          </button>
        </p>
      </div>
      
      <div className="mt-4 sm:mt-0 flex items-center gap-4">
        <button 
          onClick={() => window.location.href = 'http://localhost:5173'}
          className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to VibeCheck
        </button>
        <div className="flex">
          {/* Avatars placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border-2 border-zinc-900 shadow-md"></div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-zinc-900 -ml-3 shadow-md"></div>
        </div>
      </div>
    </div>
  );
}
