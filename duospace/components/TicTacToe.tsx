'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TicTacToe({ roomId }: { roomId: string }) {
  const [board, setBoard] = useState<string[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<string>('X');
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    // Load initial game state
    supabase.from('game_sessions').select('*').eq('room_id', roomId).single().then(({ data, error }) => {
      if (data) {
        setBoard(data.board || Array(9).fill(null));
        setCurrentPlayer(data.current_player || 'X');
        setWinner(data.winner || null);
      } else if (error?.code === 'PGRST116') {
        // No row found, let's create it
        supabase.from('game_sessions').insert({
          room_id: roomId,
          game_type: 'tic-tac-toe',
          board: Array(9).fill(null),
          current_player: 'X',
          winner: null
        }).then();
      }
    });

    const channel = supabase.channel(`room:${roomId}:game`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `room_id=eq.${roomId}` }, (payload) => {
        setBoard(payload.new.board || Array(9).fill(null));
        setCurrentPlayer(payload.new.current_player || 'X');
        setWinner(payload.new.winner);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  const handleCellClick = async (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    const winningLines = [
      [0,1,2], [3,4,5], [6,7,8], 
      [0,3,6], [1,4,7], [2,5,8], 
      [0,4,8], [2,4,6] 
    ];
    let newWinner = null;
    for (const [a, b, c] of winningLines) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        newWinner = newBoard[a];
        break;
      }
    }
    if (!newWinner && !newBoard.includes(null)) {
      newWinner = 'Draw';
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    setBoard(newBoard);
    setCurrentPlayer(nextPlayer);
    setWinner(newWinner);

    // If row doesn't exist yet, we use upsert, but we rely on the initial creation. Use update.
    await supabase.from('game_sessions').update({
      board: newBoard,
      current_player: nextPlayer,
      winner: newWinner
    }).eq('room_id', roomId);
  };

  const resetGame = async () => {
    const newBoard = Array(9).fill(null);
    setBoard(newBoard);
    setCurrentPlayer('X');
    setWinner(null);
    await supabase.from('game_sessions').update({
      board: newBoard,
      current_player: 'X',
      winner: null
    }).eq('room_id', roomId);
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-col items-center">
      <div className="flex justify-between w-full mb-6 items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>🎮</span> Tic-Tac-Toe
        </h3>
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
        >
          Reset Game
        </button>
      </div>

      <div className="mb-6 h-8 text-center">
        {winner ? (
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
            {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins! 🏆`}
          </div>
        ) : (
          <div className="text-white/70">
             Current turn: <span className={`font-bold ${currentPlayer === 'X' ? 'text-blue-400' : 'text-rose-400'}`}>{currentPlayer}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 w-64 mx-auto">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={!!cell || !!winner}
            className={`w-full aspect-square rounded-2xl text-4xl font-black flex items-center justify-center transition-all
              ${!cell && !winner ? 'bg-zinc-800 hover:bg-zinc-700 cursor-pointer' : 'bg-zinc-800/50 cursor-default'}
              ${cell === 'X' ? 'text-blue-400' : 'text-rose-400'}
            `}
          >
            <span className={cell ? 'animate-in zoom-in duration-300' : ''}>{cell}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
