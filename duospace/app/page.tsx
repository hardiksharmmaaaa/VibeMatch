'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email) return alert('Enter email');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Check your email for magic link!');
    }
  };

  const createRoom = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Login first using Magic Link above!');

    const roomId = uuidv4().slice(0, 8);
    const { error } = await supabase.from('rooms').insert({
      room_id: roomId,
      participant1_id: user.id,
    });
    
    if (error && error.code !== '23505') {
       // Ignore duplicate key if very unlikely
       console.error(error);
       alert('Error creating room: ' + error.message);
       return;
    }

    router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl text-center max-w-md w-full mx-auto p-10 shadow-2xl">
        <div className="text-6xl mb-6">🌌</div>
        <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">DuoSpace</h1>
        <p className="text-lg text-purple-300/80 mb-10 font-medium">Your private world with one person</p>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-semibold transition-all shadow-md active:scale-[0.98]"
          >
            Login with Magic Link
          </button>
          
          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm">or if logged in</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            onClick={createRoom}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98]"
          >
            ✨ Create Duo Space
          </button>
        </div>
      </div>
    </div>
  );
}
