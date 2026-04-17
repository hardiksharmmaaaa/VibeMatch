'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data?.user?.id || null));

    // Load messages
    supabase.from('messages').select('*').eq('room_id', roomId).order('created_at').then(({ data }) => setMessages(data || []));

    // Real-time subscription
    const channel = supabase.channel(`room:${roomId}:chat`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;
    const text = newMessage;
    setNewMessage('');
    
    await supabase.from('messages').insert({
      room_id: roomId,
      user_id: userId,
      text: text,
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.user_id === userId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                  isMe 
                    ? 'bg-purple-600 text-white rounded-br-sm' 
                    : 'bg-zinc-800 text-white rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-zinc-950/80 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-black/50 border border-white/10 focus:border-purple-500 rounded-full px-6 py-4 text-white outline-none transition-colors"
            placeholder="Type a message..."
          />
          <button 
            onClick={sendMessage} 
            className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full aspect-square flex items-center justify-center transition-colors shadow-lg shadow-purple-600/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
