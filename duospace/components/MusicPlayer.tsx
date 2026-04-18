'use client';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export default function MusicPlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const connectSpotify = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!clientId) {
      alert("Spotify Client ID missing in .env.local");
      return;
    }
    const redirectUri = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    const scopes = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state';
    
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const tokenFromUrl = hash.split('access_token=')[1].split('&')[0];
      setToken(tokenFromUrl);
      window.location.hash = ''; // clean URL
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'DuoSpace Player',
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.8,
      });

      spotifyPlayer.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setIsPlaying(!state.paused);
        setCurrentTrack(state.track_window.current_track);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
       if (player) player.disconnect();
    }
  }, [token]);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-[#1DB954]">🎵</span> Spotify Sync
        </h3>
        {!token ? (
          <button onClick={connectSpotify} className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#1DB954]/20 active:scale-[0.98]">
            Connect Premium
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            {currentTrack ? (
              <div className="text-center w-full">
                <img src={currentTrack.album.images[0].url} alt="Album Art" className="w-48 h-48 rounded-2xl mx-auto mb-6 shadow-2xl object-cover" />
                <h4 className="text-xl font-bold truncate px-4">{currentTrack.name}</h4>
                <p className="text-zinc-400 truncate mt-1 px-4">{currentTrack.artists[0].name}</p>
                
                <div className="flex items-center justify-center gap-6 mt-8">
                  <button onClick={() => player?.previousTrack()} className="text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                  </button>
                  <button onClick={() => player?.togglePlay()} className="w-16 h-16 bg-white hover:bg-zinc-200 text-black rounded-full flex items-center justify-center transition-colors shadow-lg">
                    {isPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>
                  <button onClick={() => player?.nextTrack()} className="text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                  </button>
                </div>
              </div>
            ) : (
             <div className="text-center text-zinc-400 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-2 animate-pulse">🎵</div>
                <p>Open Spotify app and transfer playback to "DuoSpace Player"</p>
             </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
